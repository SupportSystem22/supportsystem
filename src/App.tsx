import React, { useState, useEffect } from 'react';
import { PageView, LanguageMode, BookingDetails } from './types';
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

  const [activeBooking, setActiveBooking] = useState<BookingDetails | null>(null);

  // Scroll to top upon page navigation
  const handleNavigate = (page: PageView) => {
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
