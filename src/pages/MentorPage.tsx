import React from 'react';
import { PageView, LanguageMode } from '../types';
import { mentorData } from '../data/mentorData';
import { BrandLogo } from '../components/BrandLogo';
import {
  Heart,
  Brain,
  Compass,
  Sparkles,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  Languages,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface MentorPageProps {
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
}

export const MentorPage: React.FC<MentorPageProps> = ({ onNavigate, lang }) => {
  return (
    <div id="mentor-page-container" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header Profile Banner */}
      <div className="rounded-3xl bg-white border border-[#e5dcce] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#ebdccb] shadow-xl ring-4 ring-[#dc3c1c]/10 relative bg-[#fbf6ef]">
              <img
                src={mentorData.avatarUrl}
                alt={mentorData.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 bg-[#22201e] text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Primary Mentor</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">{mentorData.name}</h1>
            <p className="text-xs font-semibold text-[#dc3c1c] uppercase tracking-wider">
              {mentorData.role}
            </p>
            <p className="text-xs text-[#71675c]">{mentorData.experience} • {mentorData.education}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs">
            {mentorData.languages.map((l, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-[#f4ede3] text-[#4d453d] font-medium">
                {l}
              </span>
            ))}
          </div>

          <button
            id="mentor-book-direct-btn"
            onClick={() => onNavigate('book')}
            className="w-full py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book 1-to-1 Session With Siddhi</span>
          </button>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#dc3c1c]">
              Mentor Philosophy & Vision
            </span>
            <blockquote className="font-hindi-quote text-xl sm:text-2xl font-semibold text-[#1c1a18] leading-relaxed border-l-4 border-[#dc3c1c] pl-4 py-2 bg-[#fff8f6] rounded-r-xl">
              {mentorData.philosophy}
            </blockquote>
            <p className="text-base sm:text-lg md:text-xl font-bold font-serif-display text-[#1c1a18] leading-relaxed tracking-tight pl-1">
              “Someone who has been lost themselves understands the pain of helping another lost person find their way.”
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#463f38] leading-relaxed">
            <p>
              Hi, I’m <strong>Siddhi Patel</strong>. Through 5+ years of holding space for teenagers, young professionals, and adults navigating difficult life crossroads, I have realized that people rarely need generic advice or hurried lectures.
            </p>
            <p>
              With a background in <strong>B.Sc. Chemistry</strong>, I blend analytical clarity with deep, empathetic presence. Life challenges are rarely black-and-white. My role is to help you gently inspect your feelings, deconstruct overthinking loops, and discover the path that genuinely fits your values.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f9f5ee] border border-[#e8dfd2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-[#dc3c1c]" />
              <div className="text-xs">
                <span className="font-bold text-[#1c1a18]">Multilingual Comfort: </span>
                <span className="text-[#5b534a]">Conversations conducted fluently in Hindi, Gujarati, or English.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The 5-Step Mentorship Framework */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#dc3c1c]">
            Structured Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
            The 5-Step Mentorship Approach
          </h2>
          <p className="text-xs sm:text-sm text-[#635a50]">
            Listen → Understand → Reflect → Guide → Take the Next Step
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mentorData.philosophySteps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-[#e8ded1] hover:border-[#dc3c1c]/40 transition-all space-y-3 relative shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="font-mono text-xl font-bold text-[#dc3c1c]">
                  {step.step}
                </span>
                <h3 className="font-bold text-base text-[#1c1a18]">{step.title}</h3>
                <p className="text-xs text-[#595047] leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-semibold uppercase text-stone-400">Step {idx + 1} of 5</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Areas of Dedicated Guidance */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
            Areas of Focused Mentorship
          </h2>
          <p className="text-xs sm:text-sm text-[#635a50]">
            Whether you are 14 or 45, every stage of life presents unique emotional hurdles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentorData.areasOfExpertise.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#ebdccb] space-y-3 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-[#dc3c1c]/10 text-[#dc3c1c] flex items-center justify-center font-bold text-sm">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-[#1c1a18]">{item.title}</h3>
              <p className="text-xs text-[#595047] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom CTA */}
      <div className="rounded-3xl bg-[#22201e] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Ready to have a private conversation?</h3>
          <p className="text-xs text-stone-300">
            Book a 30, 45, or 60-minute private video/audio session with Siddhi Patel.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            id="mentor-bottom-book-btn"
            onClick={() => onNavigate('book')}
            className="px-6 py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-xs shadow transition-all cursor-pointer"
          >
            Start Your Journey
          </button>
          <button
            id="mentor-bottom-chat-btn"
            onClick={() => onNavigate('chat')}
            className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Message Siddhi
          </button>
        </div>
      </div>
    </div>
  );
};
