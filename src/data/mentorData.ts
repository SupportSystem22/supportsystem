import { MentorProfile } from '../types';
import siddhiAvatar from '../assets/images/siddhi.png';

export const mentorData: MentorProfile = {
  name: 'Siddhi Patel',
  role: 'Life Mentor & Emotional Support Mentor',
  experience: '5+ Years of Dedicated Mentorship',
  education: 'B.Sc. Chemistry (Analytical & Empathetic Thinker)',
  languages: ['Hindi', 'Gujarati', 'English'],
  tagline: 'Find your way back to yourself.',
  bio: 'A safe space to share your feelings, ease emotional pain, and find guidance through meaningful mentorship. You are heard, supported, and never alone.',
  avatarUrl: siddhiAvatar,
  contactEmail: 'supportsystem22@gmail.com',
  philosophy: '“जो खुद कभी भटका हो, वही किसी दूसरे भटके हुए इंसान को रास्ता दिखाने का दर्द समझ सकता है।”',
  philosophySteps: [
    {
      step: '01',
      title: 'Listen',
      description: 'Creating a compassionate, non-judgmental space where your raw thoughts and feelings are held with complete warmth and confidentiality.',
    },
    {
      step: '02',
      title: 'Understand',
      description: 'Deconstructing tangled thoughts, emotional weight, and root concerns to see your life situation clearly without bias.',
    },
    {
      step: '03',
      title: 'Reflect',
      description: 'Examining different perspectives together, identifying underlying patterns, and reconnecting with what truly matters to you.',
    },
    {
      step: '04',
      title: 'Guide',
      description: 'Offering thoughtful, grounded insights and objective viewpoints without imposing ready-made prescriptions.',
    },
    {
      step: '05',
      title: 'Take the Next Step',
      description: 'Empowering you to leave with emotional relief, inner clarity, and a realistic, constructive step forward.',
    },
  ],
  areasOfExpertise: [
    {
      title: 'Emotional Support & Well-being',
      description: 'A comforting harbor when overwhelmed by feelings, grief, loneliness, or emotional turbulence.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Stress Management & Overthinking',
      description: 'Quiet the mental noise, break repetitive thought loops, and reclaim peace of mind.',
      icon: 'Brain',
    },
    {
      title: 'Life Direction & Purpose',
      description: 'Navigate feeling stuck, lost in transitions, or unsure which path aligns with your true self.',
      icon: 'Compass',
    },
    {
      title: 'Decision-Making Clarity',
      description: 'Weighing heavy dilemmas with a calm, objective mirror to make decisions you can trust.',
      icon: 'Sparkles',
    },
    {
      title: 'Personal Challenges & Self-Confidence',
      description: 'Overcoming self-doubt, relationship strain, identity questions, and societal pressures.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Teen & Young Adult Support (12+)',
      description: 'Academic pressure, future anxiety, friendship conflicts, and growing-up challenges.',
      icon: 'Users',
    },
  ],
};

export interface PricingPackage {
  id: string;
  durationMinutes: number | string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
  recommendedFor: string;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: 'session-30',
    durationMinutes: 30,
    title: '30-Minute Single Session',
    subtitle: 'Focused Clarity & Immediate Venting',
    price: 1,
    features: [
      '1-to-1 Private Session (Video or Audio)',
      'Direct focus on one urgent dilemma or emotional burden',
      'Follow-up summary notes with key takeaways',
      'Safe, 100% confidential space',
      'Flexible rescheduling with 4h notice',
    ],
    recommendedFor: 'First-time users looking for immediate clarity on a specific challenge.',
  },
  {
    id: 'session-45',
    durationMinutes: 45,
    title: '45-Minute Deep Reflection',
    subtitle: 'Most Balanced Session Length',
    price: 1,
    popular: true,
    features: [
      '1-to-1 Private Session (Video or Audio)',
      'Sufficient time to unpack layered feelings without rushing',
      'Actionable perspective map & reflection prompts',
      'Post-session reflection worksheet PDF',
      '48-hour follow-up message check-in via chat',
    ],
    recommendedFor: 'Navigating life crossroads, relationship stress, or chronic overthinking.',
  },
  {
    id: 'session-60',
    durationMinutes: 60,
    title: '60-Minute Comprehensive Mentorship',
    subtitle: 'Thorough Life Guidance & Direction',
    price: 1,
    features: [
      'Extended 60-Minute 1-to-1 Session',
      'In-depth exploration of core patterns & life transitions',
      'Personalized clarity roadmap & step-by-step framework',
      'Voice note reflection exchange prior to session',
      'Priority scheduling access',
    ],
    recommendedFor: 'Major career transitions, deep personal growth, or complex life changes.',
  },
  {
    id: 'package-4',
    durationMinutes: '4 x 45m',
    title: '4-Session Mentorship Journey',
    subtitle: 'Sustained Emotional Support & Transformation',
    price: 1,
    originalPrice: 2796,
    features: [
      'Four 45-Minute private sessions (spread across 4–6 weeks)',
      'Continuous progress tracking & accountability',
      'Priority chat access between sessions',
      'Customized personal reflection journal exercises',
      'Save ₹297 compared to individual sessions',
    ],
    recommendedFor: 'Those dedicated to progressive self-understanding and lasting inner change.',
  },
];

export const clientStories = [
  {
    quote:
      'For the first time in years, I felt like I was speaking without holding my breath. Siddhi did not try to give generic motivational advice—she simply listened with so much patience that my own confusion started unraveling.',
    author: 'Aarav M., 24',
    location: 'Ahmedabad / Bengaluru',
    topic: 'Career Transition & Anxiety',
    mode: 'Video Session',
  },
  {
    quote:
      'I was carrying so much guilt and pressure from college expectations. In just 45 minutes, Siddhi helped me see that being confused at 19 is not a failure, it’s just a beginning. I feel lighter.',
    author: 'Pooja S., 19',
    location: 'Mumbai',
    topic: 'Academic & Family Pressure',
    mode: 'Audio Session',
  },
  {
    quote:
      'The Hindi philosophy quote on the website drew me in. When I talked to Siddhi, it was evident she truly understands the pain of feeling lost. The guidance was practical, compassionate, and deeply respectful.',
    author: 'Rajesh K., 38',
    location: 'Delhi NCR',
    topic: 'Life Direction & Stress',
    mode: 'Video Session',
  },
];

export const faqs = [
  {
    question: 'How is SupportSystem different from clinical therapy or psychiatry?',
    answer:
      'SupportSystem is a dedicated 1-to-1 life mentorship and emotional support platform. We provide a warm, non-judgmental human space to talk through life challenges, overthinking, transitions, and decision-making. We do NOT diagnose mental illnesses, prescribe medication, or offer psychiatric treatment. If you are experiencing clinical psychological disorders or an emergency, we connect you directly with specialized licensed medical professionals.',
  },
  {
    question: 'Can teenagers (12–17 years old) book sessions?',
    answer:
      'Yes! We welcome teenagers facing school pressure, future dilemmas, friendship problems, and identity challenges. For minors under 18, we maintain age-appropriate ethical mentorship practices, encouraging guardian awareness while preserving safe personal expression.',
  },
  {
    question: 'What happens during a 1-to-1 session with Siddhi?',
    answer:
      'The session is completely collaborative and centered around you. You set the pace. Whether you want to talk about a specific dilemma, vent about a stressful week, or explore why you feel stuck in life, Siddhi provides a reflective mirror, empathetic questions, and structured next steps.',
  },
  {
    question: 'Can I choose between Video Call and Audio Call?',
    answer:
      'Absolutely. You are in full control of your comfort. If you prefer keeping your camera off or connecting purely through high-quality audio, you can select Audio Call during booking or switch modes at any time.',
  },
  {
    question: 'What is the rescheduling policy?',
    answer:
      'We understand that unexpected life events happen. You can reschedule your session for free by giving at least 4 hours advance notice. Each booking includes one free reschedule.',
  },
  {
    question: 'In which languages are sessions conducted?',
    answer:
      'Siddhi is fluent in Hindi, Gujarati, English, and conversational Hinglish. You can communicate in whichever language or mix of languages feels most natural to you.',
  },
];

export const emergencyContacts = [
  {
    name: 'Tele-MANAS (Govt of India Mental Health Helpline)',
    number: '14416 / 1800-891-4416',
    available: '24x7 Free & Confidential (Multi-lingual)',
  },
  {
    name: 'Vandrevala Foundation Helpline',
    number: '+91 9999 666 555',
    available: '24x7 Free Counseling & Crisis Support',
  },
  {
    name: 'KIRAN National Helpline (Ministry of Social Justice)',
    number: '1800-599-0019',
    available: '24x7 Multi-lingual toll-free support',
  },
  {
    name: 'AASRA Crisis Helpline',
    number: '+91 9820 466 726',
    available: '24x7 Suicide Prevention & Distress Care',
  },
  {
    name: 'International Suicide & Crisis Lifeline',
    number: '988 (USA/Canada) / 111 (UK)',
    available: '24x7 Global Assistance',
  },
];
