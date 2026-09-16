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

import {
  savePrePaidInfo,
  getPrePaidInfo,
  clearPrePaidInfo,
  saveActiveBooking,
  getActiveBooking,
  clearActiveBooking,
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

  // Persistent booking and pre-paid state across page reloads
  const [activeBooking, setActiveBooking] = useState<BookingDetails | null>(() => getActiveBooking());
  const [prePaidInfo, setPrePaidInfo] = useState<PrePaidBookingInfo | null>(() => getPrePaidInfo());
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);

  // Scroll to top upon page navigation
  const handleNavigate = (page: PageView, options?: NavigateOptions) => {
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
    setActiveBooking(booking);
    saveActiveBooking(booking);
    clearPrePaidInfo();
    setPrePaidInfo(null);
  };

  const handleClearPrePaid = () => {
    setPrePaidInfo(null);
    clearPrePaidInfo();
  };

  const handleStartNewBooking = () => {
    setActiveBooking(null);
    clearActiveBooking();
    setPrePaidInfo(null);
    clearPrePaidInfo();
    setSelectedPackageId(undefined);
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
        hasActiveBooking={!!activeBooking}
      />

      {/* Active Booking Banner (if user navigated away from booking or refreshed) */}
      {activeBooking && currentPage !== 'book' && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong>Upcoming Confirmed Session:</strong> {activeBooking.packageType.title} with Siddhi Patel on {activeBooking.preferredDate} at {activeBooking.preferredTime} (IST).
              </span>
            </div>
            <button
              onClick={() => handleNavigate('book')}
              className="px-3 py-1 bg-white text-emerald-950 font-bold rounded-lg text-[11px] hover:bg-emerald-50 shrink-0 cursor-pointer shadow-sm"
            >
              View Zoom Link & Details →
            </button>
          </div>
        </div>
      )}

      {/* Pre-Paid Notice Banner (if user paid via Quick Pay and navigated away or refreshed) */}
      {!activeBooking && prePaidInfo && currentPage !== 'book' && (
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
