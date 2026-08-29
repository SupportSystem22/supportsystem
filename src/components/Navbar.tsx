import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { PageView, LanguageMode } from '../types';
import {
  Video,
  MessageSquareText,
  Users,
  Calendar,
  Sparkles,
  ShieldAlert,
  Menu,
  X,
  Languages,
  HelpCircle,
  CreditCard,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
  onToggleLang: () => void;
  onOpenCrisis: () => void;
  hasActiveBooking?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  lang,
  onToggleLang,
  onOpenCrisis,
  hasActiveBooking = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; labelEn: string; labelHi: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelEn: 'Home', labelHi: 'होम', icon: Sparkles },
    { id: 'mentor', labelEn: 'Meet Siddhi', labelHi: 'मेंटर सिद्धि', icon: Sparkles },
    { id: 'how-it-works', labelEn: 'How It Works', labelHi: 'यह कैसे काम करता है', icon: HelpCircle },
    { id: 'pricing', labelEn: 'Pricing', labelHi: 'शुल्क', icon: CreditCard },
    { id: 'chat', labelEn: '1-to-1 Chat', labelHi: 'प्राइवेट चैट', icon: MessageSquareText },
    { id: 'forum', labelEn: 'Anonymous Forum', labelHi: 'सुरक्षित मंच', icon: Users },
  ];

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#ece6dc] transition-colors"
    >
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="-ml-1 sm:-ml-2 lg:-ml-3 flex-shrink-0">
            <BrandLogo
              size="md"
              withTagline={true}
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[#22201e] text-white shadow-sm'
                      : 'text-[#504a43] hover:text-[#1a1918] hover:bg-[#eee8dd]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff785a]' : 'text-stone-500'}`} />
                  <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#ded6c9] bg-white/70 hover:bg-white text-xs font-medium text-[#463f38] transition-colors"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-[#dc3c1c]" />
              <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Book Session CTA */}
            <button
              id="nav-book-btn"
              onClick={() => onNavigate('book')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 ${
                currentPage === 'book'
                  ? 'bg-[#dc3c1c] text-white ring-2 ring-[#dc3c1c]/30'
                  : 'bg-[#dc3c1c] hover:bg-[#c23214] text-white hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सेशन बुक करें' : 'Start Your Journey'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-lang-toggle-btn"
              onClick={onToggleLang}
              className="p-2 rounded-lg border border-[#ded6c9] bg-white text-xs font-semibold text-[#463f38]"
            >
              {lang === 'hi' ? 'EN' : 'हिं'}
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#efe8dd] text-[#2c2824] hover:bg-stone-300/60 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          className="lg:hidden bg-[#faf8f5] border-b border-stone-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn shadow-xl"
        >
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center justify-between ${
                    isActive
                      ? 'bg-[#22201e] text-white'
                      : 'text-[#443d36] hover:bg-[#ede6da]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#dc3c1c]" />
                    <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <button
              id="mobile-book-cta-btn"
              onClick={() => {
                onNavigate('book');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[#dc3c1c] text-white text-sm font-bold shadow flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'hi' ? '1-to-1 सेशन बुक करें' : 'Book a 1-to-1 Session'}</span>
            </button>

            <button
              id="mobile-crisis-btn"
              onClick={() => {
                onOpenCrisis();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-[#ffcdbe] bg-[#fff5f2] text-[#dc3c1c] text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Need Immediate Crisis Support (24x7)?</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
