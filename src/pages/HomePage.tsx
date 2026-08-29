import React from 'react';
import { PageView, LanguageMode } from '../types';
import { mentorData } from '../data/mentorData';
import { BrandLogo } from '../components/BrandLogo';
import { FeelingExperienceSection } from '../components/FeelingExperienceSection';
import {
  Heart,
  Brain,
  Compass,
  Sparkles,
  ShieldCheck,
  Users,
  Video,
  Phone,
  ArrowRight,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  ChevronRight,
  Smile,
  ShieldAlert,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
  onOpenCrisis: () => void;
  onOpenPolicy: (tab: 'disclaimer' | 'teen-safety' | 'rescheduling' | 'privacy') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  lang,
  onOpenCrisis,
  onOpenPolicy,
}) => {
  const focusAreas = [
    {
      icon: Heart,
      title: 'Emotional Well-Being',
      titleHi: 'भावनात्मक संबल और शांति',
      desc: 'Ease loneliness, untangle accumulated sadness, and process overwhelming feelings in a warm sanctuary.',
    },
    {
      icon: Brain,
      title: 'Stress & Overthinking',
      titleHi: 'तनाव और लगातार विचार',
      desc: 'Quiet rapid mental loops, manage daily performance anxiety, and restore clarity to your inner headspace.',
    },
    {
      icon: Compass,
      title: 'Life Direction & Purpose',
      titleHi: 'जीवन की दिशा और लक्ष्य',
      desc: 'Navigate transitions, college/career uncertainty, and discover what genuinely resonates with who you are.',
    },
    {
      icon: Sparkles,
      title: 'Decision-Making Clarity',
      titleHi: 'कठिन निर्णयों में स्पष्टता',
      desc: 'Weigh complex crossroads with an empathetic, analytical thinking partner who has zero personal bias.',
    },
    {
      icon: Users,
      title: 'Relationships & Communication',
      titleHi: 'रिश्ते और संवाद',
      desc: 'Navigate family expectations, friendship conflicts, boundary setting, and healthy connection.',
    },
    {
      icon: ShieldCheck,
      title: 'Personal Growth & Confidence',
      titleHi: 'आत्मविश्वास और व्यक्तिगत विकास',
      desc: 'Quiet the harsh inner critic, overcome impostor syndrome, and cultivate authentic self-trust.',
    },
  ];

  return (
    <div id="home-page-container" className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle decorative backdrop glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 radial-halo -z-10 pointer-events-none opacity-60" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow / Brand Promise */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ece2] border border-[#e2d8c9] text-xs font-semibold text-[#5a5148]">
            <span className="w-2 h-2 rounded-full bg-[#dc3c1c] animate-pulse" />
            <span>SupportSystem • 1-to-1 Private Mentorship</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c1a18] leading-[1.15]">
            Sometimes, you don't need an answer. <br />
            <span className="font-serif-display italic font-normal text-[#dc3c1c]">
              You just need someone who listens.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#554e46] leading-relaxed max-w-2xl mx-auto font-normal">
            A safe, private space to talk, reflect, understand your mind, and find a clearer way forward without fear of judgment.
          </p>

          {/* Core CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-start-journey-btn"
              onClick={() => onNavigate('book')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'अपनी यात्रा शुरू करें' : 'Start Your Journey'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-how-it-works-btn"
              onClick={() => onNavigate('how-it-works')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#f7f3ec] border border-[#ded5c7] text-[#2c2824] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{lang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}</span>
            </button>

            <button
              id="hero-anonymous-forum-btn"
              onClick={() => onNavigate('forum')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#f0ebe0] hover:bg-[#e7dfd1] text-[#4b433b] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#dc3c1c]" />
              <span>{lang === 'hi' ? 'सुरक्षित मंच (Anonymous)' : 'Anonymous Community'}</span>
            </button>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#70665b]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Confidential
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Hindi + English + Gujarati
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Video or Audio Call
            </span>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE INTERACTIVE "HOW ARE YOU FEELING?" SECTION */}
      <FeelingExperienceSection onNavigate={onNavigate} lang={lang} />

      {/* 3. THE EMOTIONAL PHILOSOPHY SECTION (Hindi + English Core Quote) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-[#f5ede2] border border-[#e5dcce] p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-sm overflow-hidden">
          {/* Logo artwork watermark in background */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <BrandLogo size="xl" showText={false} />
          </div>

          <div className="inline-block p-2 rounded-full bg-[#dc3c1c]/10 text-[#dc3c1c] mb-2">
            <Heart className="w-6 h-6" />
          </div>

          {/* The Core Hindi Philosophy Quote */}
          <blockquote className="font-hindi-quote text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1c1a18] leading-snug">
            “जो खुद कभी भटका हो, वही किसी दूसरे भटके हुए इंसान को रास्ता दिखाने का दर्द समझ सकता है।”
          </blockquote>

          {/* English Interpretation with bold and larger typography */}
          <p className="text-lg sm:text-xl md:text-2xl font-bold font-serif-display text-[#1c1a18] max-w-2xl mx-auto leading-relaxed tracking-tight">
            “Someone who has been lost themselves understands the pain of helping another lost person find their way.”
          </p>

          <div className="pt-4 max-w-xl mx-auto border-t border-[#dfd4c5] text-xs sm:text-sm text-[#443d36] leading-relaxed">
            <p className="font-medium text-[#1c1a18] text-base mb-1">
              You don't have to figure everything out alone.
            </p>
            Mentorship here isn't about lecturing you from a pedestal. It is about sitting beside you in the mess of life, holding a calm light, and helping you uncover your own inner compass.
          </div>
        </div>
      </section>

      {/* 3. POSITIONING PROMISE: What we promise vs don't */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
            {lang === 'hi' ? 'हम आपकी किस तरह मदद करते हैं' : 'A Truly Human Approach to Mentorship'}
          </h2>
          <p className="text-sm text-[#61584f]">
            We believe in honest, non-judgmental companionship rather than empty motivational slogans.
          </p>
        </div>

        {/* Comparison card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">✕</span>
              <span>What We Don't Promise:</span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              “We will magically fix all your problems overnight or tell you exactly how to live your life.”
            </p>
            <p className="text-xs text-stone-500 italic">
              Quick fixes ignore the complexity of real human emotions and personal circumstances.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbf7f2] border border-[#dc3c1c]/30 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#dc3c1c] font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-[#dc3c1c]/15 flex items-center justify-center text-xs">✓</span>
              <span>What We Do Promise:</span>
            </div>
            <p className="text-sm text-[#252220] font-medium leading-relaxed">
              “We’ll help you understand your situation, explore your thoughts, ease emotional weight, and find a clearer, realistic way forward.”
            </p>
            <p className="text-xs text-[#6e645a]">
              A non-judgmental space where your voice is respected and your autonomy is honored.
            </p>
          </div>
        </div>

        {/* 6 Focus Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {focusAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#ece4d8] hover:border-[#dc3c1c]/40 hover:shadow-md transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f5ede2] group-hover:bg-[#dc3c1c]/10 text-[#dc3c1c] flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1c1a18]">
                  {lang === 'hi' ? area.titleHi : area.title}
                </h3>
                <p className="text-xs text-[#5f564d] leading-relaxed">
                  {area.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MEET YOUR MENTOR SPOTLIGHT (Siddhi Patel) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-white border border-[#e5dcce] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Avatar / Female Mentor Photo */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#ebdccb] shadow-lg ring-4 ring-[#dc3c1c]/10 relative bg-[#faf5ee]">
                <img
                  src={mentorData.avatarUrl}
                  alt={mentorData.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-[#22201e] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>5+ Yrs Exp</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#1c1a18]">{mentorData.name}</h3>
              <p className="text-xs font-semibold text-[#dc3c1c] tracking-wide uppercase mt-0.5">
                {mentorData.role}
              </p>
              <p className="text-xs text-[#796f65] mt-1">{mentorData.education}</p>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs">
              {mentorData.languages.map((l, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-[#f3ede3] text-[#4f473f] font-medium">
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Mentor Bio & Philosophy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#dc3c1c]">
                Meet Your Dedicated Mentor
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
                “You are heard, supported, and never alone.”
              </h2>
              <p className="text-sm text-[#504840] leading-relaxed">
                {mentorData.bio}
              </p>
            </div>

            {/* 5-Step Approach Preview */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#72675c]">
                Mentorship Method:
              </p>
              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                {['Listen', 'Understand', 'Reflect', 'Guide', 'Next Step'].map((st, i) => (
                  <div key={i} className="p-2 rounded-lg bg-[#f8f4ed] border border-[#e8dfd2]">
                    <span className="block text-[10px] font-mono text-[#dc3c1c] font-bold">0{i + 1}</span>
                    <span className="font-semibold text-[#252220] text-[11px] truncate block">{st}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                id="home-mentor-profile-btn"
                onClick={() => onNavigate('mentor')}
                className="px-5 py-2.5 rounded-xl bg-[#22201e] hover:bg-stone-800 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read Full Story & Method</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="home-mentor-book-btn"
                onClick={() => onNavigate('book')}
                className="px-5 py-2.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Session With Siddhi</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (6 Clear Steps) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#dc3c1c]">
            Simple & Transparent Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
            {lang === 'hi' ? 'यह कैसे काम करता है (6 सरल चरण)' : 'How the Service Works'}
          </h2>
          <p className="text-sm text-[#61584f]">
            From registering your thoughts to leaving with a clear next step—designed to be calm and effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Register & Details',
              titleHi: '01 — रजिस्टर करें',
              desc: 'Provide basic information and pick your preferred language (Hindi, Gujarati, English).',
            },
            {
              num: '02',
              title: 'Tell Us Briefly',
              titleHi: '02 — अपने बारे में बताएं',
              desc: 'Briefly select what you want guidance with: stress, overthinking, career, or life direction.',
            },
            {
              num: '03',
              title: 'Choose Time & Mode',
              titleHi: '03 — समय और माध्यम चुनें',
              desc: 'Select your preferred date/time slot and communication mode (Video Call or Audio Call).',
            },
            {
              num: '04',
              title: 'Auto Zoom Link & Alerts',
              titleHi: '04 — जूम लिंक एवं अलर्ट्स',
              desc: 'Upon completing payment, your unique Zoom meeting link is instantly generated and sent to your Email & WhatsApp.',
            },
            {
              num: '05',
              title: 'Private 1-to-1 Session',
              titleHi: '05 — 1-to-1 बातचीत',
              desc: 'Have a thoughtful, unhurried conversation in a 100% confidential and warm environment.',
            },
            {
              num: '06',
              title: 'Take Your Next Step',
              titleHi: '06 — अगला स्पष्ट कदम उठाएं',
              desc: 'Leave with grounded emotional relief, clear perspectives, and a practical next action.',
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#ebdccb] hover:border-[#dc3c1c]/40 transition-all space-y-3 relative shadow-sm"
            >
              <span className="font-mono text-2xl font-black text-[#dc3c1c]/20">
                {step.num}
              </span>
              <h3 className="text-base font-bold text-[#1c1a18]">
                {lang === 'hi' ? step.titleHi : step.title}
              </h3>
              <p className="text-xs text-[#554c43] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            id="how-it-works-book-btn"
            onClick={() => onNavigate('book')}
            className="px-7 py-3.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Book Your First Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. TRUST & CONFIDENTIALITY PILLARS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#22201e] text-white p-8 sm:p-12 md:p-16 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff785a]">
              Our Non-Negotiable Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              You Deserve a Space Where You Can Simply Be Yourself
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Sharing personal struggles takes courage. We honor your trust with uncompromising safety and privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#dc3c1c]/20 text-[#ff785a] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">100% Private</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Your conversations are never recorded, broadcasted, or shared with third parties.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#dc3c1c]/20 text-[#ff785a] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Zero Judgment</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Speak freely about mistakes, confusion, or unorthodox life choices without feeling criticized.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#dc3c1c]/20 text-[#ff785a] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">1-on-1 Dedicated Attention</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                No rushed queues or multi-tasking. 100% of the mentor’s focus is on you and your story.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#dc3c1c]/20 text-[#ff785a] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Real Human Connection</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Empathetic, authentic conversations crafted for your specific background, language, and pace.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <p>Need more details on how we safeguard minors and confidential discussions?</p>
            <button
              id="trust-view-policies-btn"
              onClick={() => onOpenPolicy('privacy')}
              className="text-[#ff785a] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Privacy & Teen Safety Policies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. REAL VOICES / TESTIMONIALS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#dc3c1c]">
            Experiences & Reflections
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
            Stories of Finding Relief & Direction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'For the first time in years, I felt like I was speaking without holding my breath. Siddhi did not try to give generic advice—she listened with so much patience that my confusion unraveled on its own.',
              author: 'Aarav M., 24',
              topic: 'Career Crossroads & Stress',
              mode: 'Video Session',
            },
            {
              quote:
                'I was carrying so much pressure from college expectations. In just 45 minutes, Siddhi helped me see that being confused at 19 is not a failure. I feel so much lighter.',
              author: 'Pooja S., 19',
              topic: 'Academic & Family Pressure',
              mode: 'Audio Session',
            },
            {
              quote:
                'The Hindi philosophy quote on the website drew me in. Siddhi truly understands the pain of feeling lost. The guidance was practical, compassionate, and deeply respectful.',
              author: 'Rajesh K., 38',
              topic: 'Life Transitions & Clarity',
              mode: 'Video Session',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#ebdccb] shadow-sm flex flex-col justify-between space-y-4"
            >
              <p className="text-xs sm:text-sm text-[#443c34] leading-relaxed italic">
                “{item.quote}”
              </p>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#1c1a18]">{item.author}</h4>
                  <p className="text-[11px] text-[#7a6f64]">{item.topic}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f4eee4] text-[#554e46] font-medium">
                  {item.mode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#f2ece2] border border-[#ded4c5] p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <BrandLogo size="md" showText={false} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1c1a18]">
            Take the first step toward meeting yourself.
          </h2>
          <p className="text-xs sm:text-sm text-[#5a5249] max-w-lg mx-auto leading-relaxed">
            You talk. We listen. Together, we find clarity. Schedule your private 1-to-1 session with Siddhi Patel today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="final-cta-book-btn"
              onClick={() => onNavigate('book')}
              className="px-8 py-3.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Book a 1-to-1 Session
            </button>
            <button
              id="final-cta-chat-btn"
              onClick={() => onNavigate('chat')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-[#d6cbbd] text-[#2c2824] font-semibold text-sm transition-all cursor-pointer"
            >
              Start 1-to-1 Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
