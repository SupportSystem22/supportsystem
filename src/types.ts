export type PageView =
  | 'home'
  | 'mentor'
  | 'book'
  | 'chat'
  | 'forum'
  | 'how-it-works'
  | 'pricing'
  | 'safety'
  | 'my-sessions';

export type LanguageMode = 'en' | 'hi';

export type SessionMode = 'video' | 'audio';

export type SessionDuration = 30 | 45 | 60 | 'package-4';

export interface PrePaidBookingInfo {
  packageId: string;
  packageTitle: string;
  price: number;
  paymentId: string;
  orderId: string;
  timestamp?: number | string;
}

export interface NavigateOptions {
  packageId?: string;
  prePaidInfo?: PrePaidBookingInfo;
  viewBookingId?: string;
}

export interface BookingDetails {
  id: string;
  fullName: string;
  age: number | string;
  gender?: string;
  email: string;
  phone: string;
  preferredLanguage: 'Hindi' | 'Gujarati' | 'English' | 'Hinglish';
  sessionMode: SessionMode;
  packageType: {
    title: string;
    duration: string;
    price: number;
    description: string;
  };
  preferredDate: string;
  preferredTime: string;
  reasons: string[];
  notes: string;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
  meetingLink: string;
  zoomMeetingId: string;
  zoomPasscode: string;
  zoomJoinUrl: string;
  emailSent: boolean;
  whatsappSent: boolean;
  paymentMethod?: string;
  transactionId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isAudioNote?: boolean;
  audioDuration?: string;
  tags?: string[];
}

export interface ForumPost {
  id: string;
  authorAlias: string;
  authorAvatarId: string;
  ageGroup: 'Teen (12-17)' | 'Young Adult (18-25)' | 'Adult (26+)' | 'Anonymous';
  title: string;
  content: string;
  category: 'Stress & Overthinking' | 'Life Direction' | 'Career Confusion' | 'Relationships' | 'Finding Clarity' | 'Personal Growth' | 'Daily Reflections';
  likesCount: number;
  hasLiked?: boolean;
  repliesCount: number;
  replies: ForumReply[];
  createdAt: string;
  isTriggerWarning?: boolean;
  triggerNote?: string;
}

export interface ForumReply {
  id: string;
  authorAlias: string;
  isMentor?: boolean;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface MentorProfile {
  name: string;
  role: string;
  experience: string;
  education: string;
  languages: string[];
  tagline: string;
  bio: string;
  avatarUrl?: string;
  contactEmail?: string;
  philosophy: string;
  philosophySteps: {
    step: string;
    title: string;
    description: string;
  }[];
  areasOfExpertise: {
    title: string;
    description: string;
    icon: string;
  }[];
}
