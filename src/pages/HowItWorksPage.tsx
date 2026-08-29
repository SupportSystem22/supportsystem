import React from 'react';
import { PageView, LanguageMode } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import {
  UserPlus,
  FileQuestion,
  Calendar,
  Video,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Headphones,
  Compass,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate, lang }) => {
  const steps = [
    {
      step: '01',
      title: 'Register Your Account',
      titleHi: '01 — रजिस्टर करें',
      icon: UserPlus,
      desc: 'Create an account in less than 30 seconds by providing your name, age, and basic contact details. We keep everything lightweight and private.',
    },
    {
      step: '02',
      title: 'Tell Us What’s On Your Mind',
      titleHi: '02 — अपने विचारों को साझा करें',
      icon: FileQuestion,
      desc: 'Briefly select what you are seeking guidance on: overthinking, career decisions, personal stress, or family pressure. No lengthy questionnaires required.',
    },
    {
      step: '03',
      title: 'Choose Mode & Convenient Time',
      titleHi: '03 — समय और माध्यम का चयन',
      icon: Calendar,
      desc: 'Pick your preferred date and time slot in Indian Standard Time (IST). Choose between a face-to-face Video Call or a quiet Audio Call based on your comfort.',
    },
    {
      step: '04',
      title: 'Auto Zoom Link & WhatsApp / Email',
      titleHi: '04 — जूम लिंक, व्हाट्सएप एवं ईमेल',
      icon: Headphones,
      desc: 'As soon as you complete payment and select your slot, the system automatically generates your unique Zoom meeting link and delivers it immediately to your Email and WhatsApp number.',
    },
    {
      step: '05',
      title: '1-to-1 Private Zoom Session',
      titleHi: '05 — 1-to-1 जूम सेशन',
      icon: Video,
      desc: 'Join via Zoom with Siddhi Patel in a quiet, 100% confidential space. The conversation follows our 5-step approach: Listen → Understand → Reflect → Guide → Take the next step.',
    },
    {
      step: '06',
      title: 'Take Your Practical Next Step',
      titleHi: '06 — स्पष्ट कदम उठाएं',
      icon: Compass,
      desc: 'Conclude with organized reflection notes, emotional relief, and a grounded next step that brings clarity to your daily life.',
    },
  ];

  return (
    <div id="how-it-works-container" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#dc3c1c] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Calm & Transparent Journey
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1a18]">
          How SupportSystem Works
        </h1>
        <p className="text-xs sm:text-sm text-[#5d554c] leading-relaxed">
          From your first message to leaving with peace of mind—here is exactly what happens when you embark on a mentorship journey with Siddhi Patel.
        </p>
      </div>

      {/* 6 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#ebdccb] hover:border-[#dc3c1c]/40 transition-all space-y-4 shadow-sm relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#f8efe3] text-[#dc3c1c] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xl font-bold text-[#dc3c1c]/30">
                    {st.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1c1a18]">{st.title}</h3>
                <p className="text-xs text-[#524a41] leading-relaxed">{st.desc}</p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] text-stone-400 font-semibold uppercase">
                <span>Phase {idx + 1} of 6</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* What to Expect During the Call */}
      <div className="rounded-3xl bg-[#f8f3eb] border border-[#e5dcce] p-8 sm:p-12 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1c1a18]">
            What to Expect During Your 1-to-1 Session
          </h2>
          <p className="text-xs sm:text-sm text-[#61594f]">
            There is zero pressure to sound eloquent, smart, or composed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#4c443b]">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">1. You Set The Pace</h4>
            <p className="leading-relaxed">
              If you want to spend the first 10 minutes in quiet reflection or venting about a stressful week, the floor is yours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">2. Real Human Dialogue</h4>
            <p className="leading-relaxed">
              No generic questionnaires or automated scripts. Siddhi listens deeply and converses in Hindi, Gujarati, or English.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">3. Practical Takeaways</h4>
            <p className="leading-relaxed">
              You will not leave with abstract theories. You leave with an organized thought map and an actionable next step.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ded4c5]">
          <div className="flex items-center gap-2 text-xs text-[#524a41]">
            <Lock className="w-4 h-4 text-[#dc3c1c]" />
            <span>All calls are private, confidential, and unrecorded.</span>
          </div>

          <button
            onClick={() => onNavigate('book')}
            className="px-6 py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold shadow transition-all cursor-pointer"
          >
            Book Your Session Now
          </button>
        </div>
      </div>
    </div>
  );
};
