import React, { useState } from 'react';
import { PageView, LanguageMode } from '../types';
import {
  ArrowRight,
  Sparkles,
  MessageSquareText,
  Calendar,
  Users,
  RotateCcw,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

interface FeelingItem {
  id: string;
  emoji: string;
  label: string;
  labelHi: string;
  responseHeading: string;
  responseHeadingHi: string;
  responseBody: string;
  responseBodyHi: string;
  taglineEn: string;
  taglineHi: string;
  glowColor: string;
}

const FEELINGS_DATA: FeelingItem[] = [
  {
    id: 'lost',
    emoji: '🧭',
    label: 'Lost',
    labelHi: 'भटका हुआ / दिशाहीन',
    responseHeading: "It's okay to feel lost.",
    responseHeadingHi: 'भटक जाना कोई गलती नहीं है।',
    responseBody:
      "Sometimes clarity doesn't come from thinking harder. It comes from having a safe space to talk.",
    responseBodyHi:
      'अक्सर स्पष्टता और ज्यादा सोचने से नहीं, बल्कि किसी सुरक्षित जगह पर खुलकर बात करने से मिलती है।',
    taglineEn: 'Searching for direction & purpose',
    taglineHi: 'दिशा और सही राह की तलाश',
    glowColor: 'from-amber-500/15 via-orange-500/10 to-transparent',
  },
  {
    id: 'overwhelmed',
    emoji: '💭',
    label: 'Overwhelmed',
    labelHi: 'अति-विचार / बोझिल',
    responseHeading: "It's okay when everything feels like too much.",
    responseHeadingHi: 'जब सब कुछ बहुत ज्यादा लगे, तो ठहरना ठीक है।',
    responseBody:
      "When your mind is juggling a hundred thoughts, you don't need to fix everything at once. You just need to pause and put one thought down at a time.",
    responseBodyHi:
      'दिमाग में चल रहे सौ विचारों को एक साथ सुलझाने की जरूरत नहीं है। बस एक बार में एक विचार को बाहर आने दें।',
    taglineEn: 'Juggling endless racing thoughts',
    taglineHi: 'लगातार विचारों का भारीपन',
    glowColor: 'from-blue-500/15 via-indigo-500/10 to-transparent',
  },
  {
    id: 'unable-to-express',
    emoji: '😶',
    label: 'Unable to express myself',
    labelHi: 'शब्द नहीं मिल रहे',
    responseHeading: "Finding words can be hard. You don't need to speak perfectly.",
    responseHeadingHi: 'शब्द न मिलें तो भी कोई बात नहीं।',
    responseBody:
      "You don't need a neat summary or polished explanation. You can start with silence, fragments, or a single sigh. We listen to what lies between the words.",
    responseBodyHi:
      'आपको कोई तैयार कहानी सुनाने की जरूरत नहीं है। आप मौन या टूटे-फूटे शब्दों से भी शुरुआत कर सकते हैं। हम शब्दों के पीछे की भावना सुनते हैं।',
    taglineEn: 'Carrying thoughts with no words',
    taglineHi: 'मन में बहुत कुछ, पर कह नहीं पा रहे',
    glowColor: 'from-purple-500/15 via-stone-500/10 to-transparent',
  },
  {
    id: 'confused-decision',
    emoji: '🔀',
    label: 'Confused about a decision',
    labelHi: 'निर्णय में असमंजस',
    responseHeading: 'Crossroads are heavy when you carry them alone.',
    responseHeadingHi: 'फैसलों के दोराहे पर अकेला महसूस करना स्वाभाविक है।',
    responseBody:
      "Confusion isn't a dead-end—it's your mind searching for what truly aligns with your core. Together, we can separate external noise from your genuine inner voice.",
    responseBodyHi:
      'उलझन कोई कमजोरी नहीं है। मिलकर हम बाहरी दबाव और अपनी असली आवाज के बीच के फर्क को समझ सकते हैं।',
    taglineEn: 'Weighing difficult life paths',
    taglineHi: 'कठिन विकल्पों के बीच दुविधा',
    glowColor: 'from-emerald-500/15 via-teal-500/10 to-transparent',
  },
  {
    id: 'emotionally-drained',
    emoji: '❤️',
    label: 'Emotionally drained',
    labelHi: 'भावनात्मक रूप से थका हुआ',
    responseHeading: 'Your heart is asking for rest, not more expectations.',
    responseHeadingHi: 'आपका मन विश्राम मांग रहा है, कोई नया दबाव नहीं।',
    responseBody:
      'Carrying everyone else’s emotions and expectations wears down your spirit. Here, there are no obligations or roles to perform. Just gentle space for you to breathe.',
    responseBodyHi:
      'दूसरों की उम्मीदें ढोते-ढोते मन थक जाता है। यहाँ आपको कोई मुखौटा पहनने की जरूरत नहीं है। बस शांति से सांस लें।',
    taglineEn: 'Tired of keeping up appearances',
    taglineHi: 'अंदर से खाली और थका हुआ महसूस होना',
    glowColor: 'from-rose-500/15 via-pink-500/10 to-transparent',
  },
  {
    id: 'ready-for-change',
    emoji: '🌱',
    label: 'Ready for change',
    labelHi: 'बदलाव के लिए तैयार',
    responseHeading: 'The quiet readiness for a new chapter.',
    responseHeadingHi: 'बदलाव के लिए एक नई शुरुआत की तत्परता।',
    responseBody:
      'Recognizing that something needs to shift is the bravest first step. Let’s explore what growth looks like for you—with steady support and zero rush.',
    responseBodyHi:
      'यह पहचानना कि कुछ बदलना चाहिए, सबसे साहसी पहला कदम है। आइए बिना किसी जल्दबाजी के आपके अगले कदम को समझें।',
    taglineEn: 'Stepping forward into growth',
    taglineHi: 'जीवन में एक नए अध्याय की शुरुआत',
    glowColor: 'from-lime-500/15 via-emerald-500/10 to-transparent',
  },
];

interface FeelingExperienceSectionProps {
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
}

export const FeelingExperienceSection: React.FC<FeelingExperienceSectionProps> = ({
  onNavigate,
  lang,
}) => {
  const [selectedFeelingId, setSelectedFeelingId] = useState<string | null>(null);

  const selectedFeeling = FEELINGS_DATA.find((f) => f.id === selectedFeelingId);

  return (
    <section
      id="interactive-feeling-section"
      className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-24"
    >
      <div className="relative rounded-3xl bg-[#faf6f0] border border-[#e8ded0] p-6 sm:p-10 md:p-14 shadow-sm overflow-hidden transition-all duration-300">
        {/* Background atmospheric ambient gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#dc3c1c]/10 via-[#f08569]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-500/10 via-stone-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#e3d8c9] text-xs font-semibold text-[#665c52] shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#dc3c1c]" />
            <span>
              {lang === 'hi' ? 'इंटरैक्टिव अनुभव' : 'Interactive Space'}
            </span>
          </div>

          {/* Explicit Heading Requested by User */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1c1a18] leading-tight">
            {lang === 'hi'
              ? 'शायद आप ठीक से नहीं जानते कि क्या गलत है। कोई बात नहीं।'
              : "Maybe you don't know exactly what's wrong. That's okay."}
          </h2>

          <p className="text-xs sm:text-sm text-[#665d53] leading-relaxed">
            {lang === 'hi'
              ? 'नीचे दिए गए कार्ड्स में से चुनें कि आपका मन अभी किस बात से सबसे ज्यादा जुड़ता है:'
              : "Choose what resonates closest to you right now. You don't need a prepared speech."}
          </p>
        </div>

        {/* "I'm feeling..." Prompt Label */}
        <div className="relative z-10 pt-8 pb-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8a7f72] inline-block px-3 py-1 bg-[#ede4d6] rounded-full">
            {lang === 'hi' ? 'मैं महसूस कर रहा/रही हूँ...' : "I'm feeling..."}
          </span>
        </div>

        {/* Floating Cards Grid */}
        <div
          id="feeling-cards-grid"
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 max-w-4xl mx-auto"
        >
          {FEELINGS_DATA.map((item) => {
            const isSelected = selectedFeelingId === item.id;
            return (
              <button
                key={item.id}
                id={`feeling-card-${item.id}`}
                onClick={() => setSelectedFeelingId(item.id)}
                className={`group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 transform cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#dc3c1c] shadow-lg -translate-y-1 scale-[1.02] ring-4 ring-[#dc3c1c]/10'
                    : 'bg-white/85 hover:bg-white border border-[#e5dacf] hover:border-[#dc3c1c]/40 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Visual pulse tag when selected */}
                {isSelected && (
                  <span className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[11px] font-bold text-[#dc3c1c] bg-[#fff2ee] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Selected</span>
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl select-none filter drop-shadow-xs transition-transform group-hover:scale-110">
                    {item.emoji}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1c1a18] group-hover:text-[#dc3c1c] transition-colors">
                      {lang === 'hi' ? item.labelHi : item.label}
                    </h3>
                    <p className="text-[11px] text-[#786e63] line-clamp-1 mt-0.5">
                      {lang === 'hi' ? item.taglineHi : item.taglineEn}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Responsive Empathetic Response View */}
        {selectedFeeling && (
          <div
            id="feeling-response-card"
            className="relative z-10 mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-white border border-[#e5dacb] shadow-xl animate-fadeIn transition-all"
          >
            {/* Top decorative accent */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedFeeling.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#dc3c1c]">
                  SupportSystem Safe Space Note
                </span>
              </div>
              <button
                id="reset-feeling-btn"
                onClick={() => setSelectedFeelingId(null)}
                className="text-xs text-[#8c8277] hover:text-[#2a2622] flex items-center gap-1 font-medium px-2.5 py-1 rounded-lg hover:bg-stone-100 transition-colors"
                title="Select another feeling"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'दूसरा चुनें' : 'Choose another'}</span>
              </button>
            </div>

            {/* Response Heading & Body */}
            <div className="space-y-3 max-w-2xl">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-display font-semibold text-[#1c1a18] leading-tight">
                {lang === 'hi'
                  ? selectedFeeling.responseHeadingHi
                  : selectedFeeling.responseHeading}
              </h3>

              <p className="text-sm sm:text-base text-[#4d453d] leading-relaxed">
                {lang === 'hi'
                  ? selectedFeeling.responseBodyHi
                  : selectedFeeling.responseBody}
              </p>
            </div>

            {/* CTAs Section: [Talk About It →] */}
            <div className="pt-6 mt-6 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Primary Requested Button: [Talk About It →] */}
                <button
                  id="feeling-talk-about-it-btn"
                  onClick={() => onNavigate('book')}
                  className="px-6 py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {lang === 'hi' ? 'इस बारे में बात करें →' : 'Talk About It →'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary 1-to-1 Chat */}
                <button
                  id="feeling-chat-btn"
                  onClick={() => onNavigate('chat')}
                  className="px-5 py-3 rounded-xl bg-[#f5ede2] hover:bg-[#ebdccb] text-[#332e29] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquareText className="w-4 h-4 text-[#dc3c1c]" />
                  <span>
                    {lang === 'hi' ? 'निजी चैट शुरू करें' : 'Start 1-to-1 Chat'}
                  </span>
                </button>
              </div>

              {/* Community safe haven option */}
              <button
                id="feeling-forum-btn"
                onClick={() => onNavigate('forum')}
                className="text-xs text-[#70665b] hover:text-[#dc3c1c] flex items-center justify-center sm:justify-start gap-1 font-medium transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>
                  {lang === 'hi'
                    ? 'या सुरक्षित मंच में गुमनाम साझा करें'
                    : 'Or share anonymously in safe forum'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
