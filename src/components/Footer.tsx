import React from 'react';
import { BrandLogo } from './BrandLogo';
import { PageView } from '../types';
import { ShieldCheck, Heart, PhoneCall, ExternalLink, Sparkles, Lock, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenCrisis: () => void;
  onOpenPolicy: (tab: 'disclaimer' | 'teen-safety' | 'rescheduling' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenCrisis,
  onOpenPolicy,
}) => {
  return (
    <footer id="main-footer" className="bg-[#1b1a18] text-[#d6cec3] pt-16 pb-12 border-t border-[#33302b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-stone-800/80 inline-block">
                <BrandLogo size="md" showText={false} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">Support</span>
                <span className="text-xl font-bold text-[#f55938]">System</span>
                <p className="text-xs text-stone-400 font-medium tracking-wide">Find your way back to yourself.</p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed font-hindi-quote italic border-l-2 border-[#dc3c1c] pl-3 py-0.5">
              “जो खुद कभी भटका हो, वही किसी दूसरे भटके हुए इंसान को रास्ता दिखाने का दर्द समझ सकता है।”
            </p>

            <p className="text-xs text-stone-400 leading-relaxed">
              A private, non-judgmental space to talk, reflect, explore your inner thoughts, and find a clearer way forward with dedicated 1-to-1 mentorship.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#f55938]" /> 100% Private & Confidential
              </span>
              <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                Hindi • Gujarati • English
              </span>
              <a
                href="mailto:supportsystem22@gmail.com"
                className="px-2.5 py-1 rounded-full bg-stone-800/90 text-stone-200 border border-stone-700 hover:border-[#f55938] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3 h-3 text-[#f55938]" /> supportsystem22@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f55938]" /> Explore Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-mentor"
                  onClick={() => onNavigate('mentor')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Meet Mentor Siddhi Patel
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-how-it-works"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How Sessions Work (6 Steps)
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-pricing"
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Session Pricing & Packages
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-my-sessions"
                  onClick={() => onNavigate('my-sessions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Booked Sessions
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-book"
                  onClick={() => onNavigate('book')}
                  className="text-[#f55938] hover:text-[#ff785a] font-semibold cursor-pointer"
                >
                  Book 1-to-1 Session →
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Spaces */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-4">
              Community & Sessions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-chat"
                  onClick={() => onNavigate('chat')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  1-to-1 Private Chat
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-schedule"
                  onClick={() => onNavigate('book')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Schedule Zoom Session
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-forum"
                  onClick={() => onNavigate('forum')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Anonymous Safe Haven Forum
                </button>
              </li>
              <li>
                <button
                  id="footer-crisis-link"
                  onClick={onOpenCrisis}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <PhoneCall className="w-3 h-3" /> Emergency Crisis Lines (24x7)
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Safety Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Trust & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-policy-disclaimer"
                  onClick={() => onOpenPolicy('disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Non-Medical Disclaimer
                </button>
              </li>
              <li>
                <button
                  id="footer-policy-teen"
                  onClick={() => onOpenPolicy('teen-safety')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Teen & Minor Safety (12+)
                </button>
              </li>
              <li>
                <button
                  id="footer-policy-rescheduling"
                  onClick={() => onOpenPolicy('rescheduling')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Rescheduling & Policies
                </button>
              </li>
              <li>
                <button
                  id="footer-policy-privacy"
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy & Confidentiality
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-400 leading-relaxed">
          <p>
            <strong className="text-stone-300">Important Safety Notice:</strong> SupportSystem provides 1-to-1 life mentorship and emotional clarity conversations. Our sessions are not a substitute for professional medical, psychiatric, psychological diagnosis, or crisis intervention services. If you are experiencing an acute mental health emergency or considering self-harm, please immediately contact your local emergency helpline or call the national Tele-MANAS helpline at <strong className="text-stone-200">14416</strong>.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} SupportSystem. All rights reserved. Made with compassion & care.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Talk • Reflect • Understand • Move Forward</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
