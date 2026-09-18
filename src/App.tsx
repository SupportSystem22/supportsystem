import React, { useState, useEffect } from 'react';
import { PageView, LanguageMode, BookingDetails, PrePaidBookingInfo, NavigateOptions } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CrisisModal } from './components/CrisisModal';
import { PolicyModal } from './components/PolicyModal';

import { HomePage } from './pages/HomePage';
import { MentorPage } from './pages/MentorPage';
import { BookingPage } from './pages/BookingPage';
import { ChatPage } from './pages/ChatPage';
import { ForumPage } from './pages/ForumPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PricingPage } from './pages/PricingPage';
import { MySessionsPage } from './pages/MySessionsPage';

import {
  savePrePaidInfo,
  getPrePaidInfo,
  clearPrePaidInfo,
  saveBooking,
  getAllBookings,
  getActiveBooking,
} from './utils/paymentStorage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [lang, setLang] = useState<LanguageMode>('en');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [policyModalConfig, setPolicyModalConfig] = useState<{
    isOpen: boolean;
    tab: 'disclaimer' | 'teen-safety' | 'rescheduling' | 'privacy';
  }>({
    isOpen: false,
    tab: 'disclaimer',
  });

  // Persistent bookings and pre-paid state across page reloads
  const [allBookings, setAllBookings] = useState<BookingDetails[]>(() => getAllBookings());
  const [activeBooking, setActiveBooking] = useState<BookingDetails | null>(() => getActiveBooking());
  const [prePaidInfo, setPrePaidInfo] = useState<PrePaidBookingInfo | null>(() => getPrePaidInfo());
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);
  const [viewBookingId, setViewBookingId] = useState<string | undefined>(undefined);

  // Scroll to top upon page navigation
  const handleNavigate = (page: PageView, options?: NavigateOptions) => {
    if (options?.viewBookingId !== undefined) {
      setViewBookingId(options.viewBookingId);
    } else {
      setViewBookingId(undefined);
    }
    if (options?.prePaidInfo !== undefined) {
      setPrePaidInfo(options.prePaidInfo);
      if (options.prePaidInfo) {
        savePrePaidInfo(options.prePaidInfo);
      } else {
        clearPrePaidInfo();
      }
    }
    if (options?.packageId !== undefined) {
      setSelectedPackageId(options.packageId);
    } else if (options?.prePaidInfo) {
      setSelectedPackageId(options.prePaidInfo.packageId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleOpenCrisis = () => {
    setIsCrisisModalOpen(true);
  };

  const handleOpenPolicy = (tab: 'disclaimer' | 'teen-safety' | 'rescheduling' | 'privacy') => {
    setPolicyModalConfig({
      isOpen: true,
      tab,
    });
  };

  const handleBookingConfirmed = (booking: BookingDetails) => {
    saveBooking(booking);
    const updated = getAllBookings();
    setAllBookings(updated);
    setActiveBooking(booking);
    clearPrePaidInfo();
    setPrePaidInfo(null);
  };

  const handleClearPrePaid = () => {
    setPrePaidInfo(null);
    clearPrePaidInfo();
  };

  const handleStartNewBooking = () => {
    // Reset package & pre-payment selection for fresh booking, WITHOUT wiping saved sessions!
    setPrePaidInfo(null);
    clearPrePaidInfo();
    setSelectedPackageId(undefined);
    setViewBookingId(undefined);
    handleNavigate('book');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1e1d1b] font-sans antialiased selection:bg-[#dc3c1c]/15 selection:text-[#dc3c1c]">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenCrisis={handleOpenCrisis}
        hasActiveBooking={allBookings.length > 0}
      />

      {/* Booked Sessions Banner (Below Navbar) */}
      {allBookings.length > 0 && currentPage !== 'my-sessions' && (
        <div className="bg-emerald-950 text-white px-4 py-2.5 text-xs shadow-sm animate-fadeIn border-b border-emerald-900">
          <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>
                <strong>Your Booked Session:</strong> {allBookings[0].packageType.title} with Siddhi Patel on {allBookings[0].preferredDate} at {allBookings[0].preferredTime} (IST).
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                id="banner-view-all-sessions-btn"
                onClick={() => handleNavigate('my-sessions')}
                className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold rounded-lg text-[11px] shrink-0 cursor-pointer shadow-sm transition-colors flex items-center gap-1"
              >
                <span>View All Booked Sessions ({allBookings.length})</span>
                <span>→</span>
              </button>
              <button
                id="banner-book-another-btn"
                onClick={handleStartNewBooking}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold rounded-lg text-[11px] shrink-0 cursor-pointer transition-colors"
              >
                + Book Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Paid Notice Banner (if user paid via Quick Pay and navigated away or refreshed) */}
      {allBookings.length === 0 && prePaidInfo && currentPage !== 'book' && (
        <div className="bg-[#fff3eb] border-b border-[#ffd6c4] text-[#a02c12] px-4 py-2 text-xs flex items-center justify-between animate-fadeIn">
          <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <strong>Pre-Payment Active:</strong> You have a verified pre-paid session ({prePaidInfo.packageTitle}, ₹{prePaidInfo.price}) ready to schedule.
            </div>
            <button
              onClick={() => handleNavigate('book', { prePaidInfo, packageId: prePaidInfo.packageId })}
              className="px-3 py-1 bg-[#dc3c1c] text-white font-bold rounded-lg text-[11px] hover:bg-[#c23214] shrink-0 cursor-pointer shadow-sm"
            >
              Select Your Time Slot →
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            lang={lang}
            onOpenCrisis={handleOpenCrisis}
            onOpenPolicy={handleOpenPolicy}
          />
        )}

        {currentPage === 'mentor' && (
          <MentorPage
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}

        {currentPage === 'book' && (
          <BookingPage
            onNavigate={handleNavigate}
            lang={lang}
            onBookingConfirmed={handleBookingConfirmed}
            initialPackageId={selectedPackageId}
            prePaidInfo={prePaidInfo}
            onClearPrePaidInfo={handleClearPrePaid}
            activeBooking={activeBooking}
            existingBookings={allBookings}
            viewBookingId={viewBookingId}
            onStartNewBooking={handleStartNewBooking}
          />
        )}

        {currentPage === 'my-sessions' && (
          <MySessionsPage
            bookings={allBookings}
            onNavigate={handleNavigate}
            lang={lang}
            onStartNewBooking={handleStartNewBooking}
          />
        )}

        {currentPage === 'chat' && (
          <ChatPage
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}

        {currentPage === 'forum' && (
          <ForumPage
            onNavigate={handleNavigate}
            lang={lang}
            onOpenCrisis={handleOpenCrisis}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}

        {currentPage === 'pricing' && (
          <PricingPage
            onNavigate={handleNavigate}
            lang={lang}
            onOpenPolicy={handleOpenPolicy}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCrisis={handleOpenCrisis}
        onOpenPolicy={handleOpenPolicy}
      />

      {/* 24/7 Crisis Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      {/* Trust, Legal & Policy Modal */}
      <PolicyModal
        isOpen={policyModalConfig.isOpen}
        initialTab={policyModalConfig.tab}
        onClose={() => setPolicyModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
