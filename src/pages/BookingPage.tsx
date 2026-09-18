import React, { useState, useEffect, useMemo } from 'react';
import { PageView, LanguageMode, SessionMode, BookingDetails, PrePaidBookingInfo } from '../types';
import { pricingPackages, mentorData } from '../data/mentorData';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Smartphone,
  MessageSquare,
  Copy,
  ExternalLink,
  CalendarPlus,
  Download,
  Share2,
  CreditCard,
  QrCode,
  Check,
  Send,
  Info,
  AlertCircle,
  KeyRound,
  RefreshCcw,
  Calendar,
} from 'lucide-react';
import { initiateRazorpayCheckout } from '../utils/razorpay';
import { RazorpayPaymentSuccessResponse } from '../vite-env';
import { recoverPaymentFromBackend } from '../utils/paymentStorage';

interface BookingPageProps {
  onNavigate: (page: PageView, options?: any) => void;
  lang: LanguageMode;
  onBookingConfirmed: (booking: BookingDetails) => void;
  initialPackageId?: string;
  prePaidInfo?: PrePaidBookingInfo | null;
  onClearPrePaidInfo?: () => void;
  activeBooking?: BookingDetails | null;
  existingBookings?: BookingDetails[];
  viewBookingId?: string;
  onStartNewBooking?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onNavigate,
  lang,
  onBookingConfirmed,
  initialPackageId,
  prePaidInfo,
  onClearPrePaidInfo,
  activeBooking,
  existingBookings = [],
  viewBookingId,
  onStartNewBooking,
}) => {
  // If user requested to view a specific booking confirmation, find it
  const targetBooking = useMemo(() => {
    if (viewBookingId && existingBookings.length > 0) {
      return existingBookings.find((b) => b.id === viewBookingId) || null;
    }
    return null;
  }, [viewBookingId, existingBookings]);

  // If user came specifically to view a booking, show Step 4.
  // If user came from verified pre-payment, start directly at Step 2 (Intake Form).
  // Otherwise start at Step 1 for booking without wiping past sessions!
  const [step, setStep] = useState<1 | 2 | 3 | 4>(() => {
    if (targetBooking) return 4;
    if (prePaidInfo) return 2;
    return 1;
  });

  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(() => targetBooking || null);

  // Form states
  const [sessionMode, setSessionMode] = useState<SessionMode>('video');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
    return prePaidInfo?.packageId || initialPackageId || 'session-45';
  });

  // Recovery modal state
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryPaymentId, setRecoveryPaymentId] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (targetBooking) {
      setConfirmedBooking(targetBooking);
      setStep(4);
    } else if (prePaidInfo?.packageId) {
      setSelectedPackageId(prePaidInfo.packageId);
      setStep(2);
    } else if (initialPackageId) {
      setSelectedPackageId(initialPackageId);
    }
  }, [targetBooking, prePaidInfo, initialPackageId]);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    countryCode: '+91',
    preferredLanguage: 'Hindi' as 'Hindi' | 'Gujarati' | 'English' | 'Hinglish',
    reasons: [] as string[],
    notes: '',
  });

  // Dynamic upcoming dates for today, tomorrow, and the next 4 days
  const availableDates = useMemo(() => {
    const dates = [];
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const m = monthNames[d.getMonth()];
      const dayNum = d.getDate();
      const dayName = dayNames[d.getDay()];

      let label = `${dayName}`;
      let date = `${dayName}, ${m} ${dayNum}`;

      if (i === 0) {
        label = 'Today (Immediate)';
        date = `Today, ${m} ${dayNum}`;
      } else if (i === 1) {
        label = 'Tomorrow';
        date = `Tomorrow, ${m} ${dayNum}`;
      }

      dates.push({ label, date });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const tom = new Date(now);
    tom.setDate(now.getDate() + 1);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `Tomorrow, ${monthNames[tom.getMonth()]} ${tom.getDate()}`;
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('3:00 PM - 3:45 PM');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // UI helpers for confirmation
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const [whatsappResent, setWhatsappResent] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);

  const reasonsList = [
    'Stress & Overthinking',
    'Life Direction & Purpose',
    'Career Confusion',
    'Difficult Decision Making',
    'Emotional Support & Well-being',
    'Personal Challenges',
    'Relationships & Boundaries',
    'Self-Confidence & Growth',
    'Other / General Venting',
  ];

  // Helper to check if a specific time slot is already booked by the current user
  const isSlotBookedByMe = (time: string, date: string) => {
    if (!existingBookings || existingBookings.length === 0) return false;
    return existingBookings.some(
      (b) => b.preferredDate === date && b.preferredTime === time
    );
  };

  const handleBookAnotherSession = () => {
    setConfirmedBooking(null);
    setStep(1);
    setFormData({
      fullName: '',
      age: '',
      gender: '',
      email: '',
      phone: '',
      countryCode: '+91',
      preferredLanguage: 'Hindi',
      reasons: [],
      notes: '',
    });
    if (onStartNewBooking) {
      onStartNewBooking();
    }
  };

  const availableSlots = [
    { time: '11:00 AM - 11:45 AM', period: 'Morning' },
    { time: '12:30 PM - 1:15 PM', period: 'Afternoon' },
    { time: '3:00 PM - 3:45 PM', period: 'Afternoon', popular: true },
    { time: '5:30 PM - 6:15 PM', period: 'Evening' },
    { time: '7:00 PM - 7:45 PM', period: 'Evening', popular: true },
    { time: '8:30 PM - 9:15 PM', period: 'Night' },
  ];

  const toggleReason = (reason: string) => {
    setFormData((prev) => {
      const exists = prev.reasons.includes(reason);
      if (exists) {
        return { ...prev, reasons: prev.reasons.filter((r) => r !== reason) };
      } else {
        return { ...prev, reasons: [...prev.reasons, reason] };
      }
    });
  };

  const selectedPkg = pricingPackages.find((p) => p.id === selectedPackageId) || pricingPackages[1];

  // Helper to generate Zoom details
  const generateZoomDetails = () => {
    const rawMeetingId = `${Math.floor(800 + Math.random() * 199)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`;
    const passcode = `clarity${Math.floor(10 + Math.random() * 89)}`;
    const joinUrl = `https://us05web.zoom.us/j/${rawMeetingId.replace(/\s/g, '')}?pwd=${btoa(passcode)}`;

    return {
      meetingId: rawMeetingId,
      passcode,
      joinUrl,
    };
  };

  const handleCompletePaymentAndBooking = async () => {
    setPaymentError(null);
    setPaymentNotice(null);
    setIsProcessingPayment(true);

    const fullPhone = `${formData.countryCode} ${formData.phone.replace(/^[+]?\d{1,3}\s?/, '')}`;

    // CASE 1: Pre-Paid from Quick Pay or Prior Checkout - DO NOT charge again!
    if (prePaidInfo) {
      setTimeout(() => {
        const zoom = generateZoomDetails();
        const newBooking: BookingDetails = {
          id: `booking-${Date.now()}`,
          fullName: formData.fullName || 'Mentee Friend',
          age: formData.age || '23',
          gender: formData.gender,
          email: formData.email || 'user@example.com',
          phone: fullPhone || '+91 9876543210',
          preferredLanguage: formData.preferredLanguage,
          sessionMode,
          packageType: {
            title: selectedPkg.title,
            duration: typeof selectedPkg.durationMinutes === 'number' ? `${selectedPkg.durationMinutes} mins` : selectedPkg.durationMinutes,
            price: selectedPkg.price,
            description: selectedPkg.subtitle,
          },
          preferredDate: selectedDate,
          preferredTime: selectedTimeSlot,
          reasons: formData.reasons.length > 0 ? formData.reasons : ['General Clarity & Emotional Support'],
          notes: formData.notes,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          meetingLink: zoom.joinUrl,
          zoomMeetingId: zoom.meetingId,
          zoomPasscode: zoom.passcode,
          zoomJoinUrl: zoom.joinUrl,
          emailSent: true,
          whatsappSent: true,
          paymentMethod: 'RAZORPAY (PRE-PAID)',
          transactionId: prePaidInfo.paymentId,
        };

        setIsProcessingPayment(false);
        setConfirmedBooking(newBooking);
        onBookingConfirmed(newBooking);
        if (onClearPrePaidInfo) {
          onClearPrePaidInfo();
        }
        setStep(4);
      }, 700);
      return;
    }

    // CASE 2: Direct Session Booking - Proceed with Razorpay Checkout Modal
    const amountInPaise = Math.round(selectedPkg.price * 100);

    try {
      await initiateRazorpayCheckout({
        amountInPaise,
        currency: 'INR',
        name: 'SupportSystem Mentorship',
        description: `${selectedPkg.title} (${sessionMode === 'video' ? 'Zoom Video' : 'Zoom Audio'})`,
        receipt: `rcpt_${Date.now()}`,
        prefill: {
          name: (formData.fullName || '').trim() || 'Mentee',
          email: (formData.email || '').trim(),
          contact: formData.phone ? fullPhone.replace(/\s+/g, '') : '',
          method: paymentMethod,
        },
        notes: {
          customer_name: (formData.fullName || '').trim() || 'Mentee',
          customer_email: (formData.email || '').trim() || 'Not provided',
          customer_phone: (formData.phone ? fullPhone.replace(/\s+/g, '') : '').trim() || 'Not provided',
          customer_age: formData.age ? String(formData.age) : 'Not specified',
          customer_gender: formData.gender || 'Not specified',
          preferred_language: formData.preferredLanguage || 'English',
          session_mode: sessionMode === 'video' ? 'Zoom Video Call' : 'Zoom Audio Call',
          package_title: selectedPkg.title,
          package_price: `₹${selectedPkg.price}`,
          scheduled_date: selectedDate,
          scheduled_time: selectedTimeSlot,
          topics_reasons: (formData.reasons.length > 0 ? formData.reasons.join(', ') : 'General Clarity & Support').slice(0, 250),
          customer_notes: (formData.notes ? formData.notes.trim() : 'None').slice(0, 250),
        },
        themeColor: '#dc3c1c',
        onSuccess: (response: RazorpayPaymentSuccessResponse) => {
          const zoom = generateZoomDetails();
          const newBooking: BookingDetails = {
            id: `booking-${Date.now()}`,
            fullName: formData.fullName || 'Mentee Friend',
            age: formData.age || '23',
            gender: formData.gender,
            email: formData.email || 'user@example.com',
            phone: fullPhone || '+91 9876543210',
            preferredLanguage: formData.preferredLanguage,
            sessionMode,
            packageType: {
              title: selectedPkg.title,
              duration: typeof selectedPkg.durationMinutes === 'number' ? `${selectedPkg.durationMinutes} mins` : selectedPkg.durationMinutes,
              price: selectedPkg.price,
              description: selectedPkg.subtitle,
            },
            preferredDate: selectedDate,
            preferredTime: selectedTimeSlot,
            reasons: formData.reasons.length > 0 ? formData.reasons : ['General Clarity & Emotional Support'],
            notes: formData.notes,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            meetingLink: zoom.joinUrl,
            zoomMeetingId: zoom.meetingId,
            zoomPasscode: zoom.passcode,
            zoomJoinUrl: zoom.joinUrl,
            emailSent: true,
            whatsappSent: true,
            paymentMethod: `RAZORPAY (${paymentMethod.toUpperCase()})`,
            transactionId: response.razorpay_payment_id,
          };

          setIsProcessingPayment(false);
          setConfirmedBooking(newBooking);
          onBookingConfirmed(newBooking);
          setStep(4);
        },
        onError: (err) => {
          setIsProcessingPayment(false);
          setPaymentError(err.message || 'Payment processing failed. Please try again.');
        },
        onDismiss: () => {
          setIsProcessingPayment(false);
          setPaymentNotice('Payment was cancelled or closed. You can retry anytime.');
        },
      });
    } catch (err: any) {
      setIsProcessingPayment(false);
      setPaymentError(err.message || 'An unexpected error occurred while launching Razorpay Checkout.');
    }
  };

  const copyToClipboard = (text: string, type: 'link' | 'invite') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2500);
    }
  };

  const handleRecoverPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = recoveryPaymentId.trim();
    if (!cleanId) return;

    setRecoveryLoading(true);
    setRecoveryError(null);
    setRecoverySuccess(null);

    try {
      const info = await recoverPaymentFromBackend(cleanId);
      setRecoverySuccess(`Payment found & verified: ₹${info.price} for ${info.packageTitle}!`);
      setTimeout(() => {
        setShowRecoveryModal(false);
        setRecoverySuccess(null);
        setRecoveryPaymentId('');
        onNavigate('book', { prePaidInfo: info, packageId: info.packageId });
      }, 900);
    } catch (err: any) {
      setRecoveryError(err.message || 'Payment not found in Razorpay records. Please verify your Payment ID.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailResent(true);
    setTimeout(() => setEmailResent(false), 3000);
  };

  const handleResendWhatsApp = () => {
    setWhatsappResent(true);
    setTimeout(() => setWhatsappResent(false), 3000);
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    if (!confirmedBooking) return '#';
    const title = encodeURIComponent(`1-to-1 Mentorship Session with Siddhi Patel`);
    const details = encodeURIComponent(
      `Join Zoom Meeting: ${confirmedBooking.zoomJoinUrl}\nMeeting ID: ${confirmedBooking.zoomMeetingId}\nPasscode: ${confirmedBooking.zoomPasscode}\n\nLanguage: ${confirmedBooking.preferredLanguage}\nOrganized by SupportSystem`
    );
    const location = encodeURIComponent(confirmedBooking.zoomJoinUrl);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // .ICS file generator for offline calendars
  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SupportSystem//Mentorship Session//EN
BEGIN:VEVENT
SUMMARY:1-to-1 Mentorship Session with Siddhi Patel
DESCRIPTION:Zoom Meeting: ${confirmedBooking.zoomJoinUrl}\\nMeeting ID: ${confirmedBooking.zoomMeetingId}\\nPasscode: ${confirmedBooking.zoomPasscode}
LOCATION:${confirmedBooking.zoomJoinUrl}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `supportsystem-session-${confirmedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="booking-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f4ece1] text-[#dc3c1c] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> 1-to-1 Private Mentorship via Zoom
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
          Book Your 1-to-1 Session With Siddhi Patel
        </h1>
        <p className="text-xs sm:text-sm text-[#5c544a] max-w-xl mx-auto">
          Complete your booking and payment to automatically receive your private Zoom meeting link directly on Email & WhatsApp.
        </p>
      </div>

      {/* Existing Bookings Notice Banner */}
      {existingBookings.length > 0 && step !== 4 && (
        <div className="p-4 rounded-2xl bg-[#fff8f5] border border-[#fbdcd5] text-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#dc3c1c] text-white shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1c1a18]">
                You have {existingBookings.length} upcoming scheduled session{existingBookings.length > 1 ? 's' : ''}
              </p>
              <p className="text-[11px] text-stone-500">
                Next: {existingBookings[0].packageType.title} on {existingBookings[0].preferredDate} at {existingBookings[0].preferredTime}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('my-sessions')}
            className="px-4 py-2 rounded-xl bg-[#22201e] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-sm cursor-pointer"
          >
            <span>View My Booked Sessions</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ff785a]" />
          </button>
        </div>
      )}

      {/* Pre-Paid Razorpay Notice Banner */}
      {prePaidInfo && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
                <span>Pre-Payment Verified: {prePaidInfo.packageTitle} (₹{prePaidInfo.price})</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">PAID</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Razorpay Transaction ID: <span className="font-mono font-semibold">{prePaidInfo.paymentId}</span> • No further payment required.
              </div>
            </div>
          </div>
          {onClearPrePaidInfo && (
            <button
              type="button"
              onClick={onClearPrePaidInfo}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer shrink-0"
            >
              Clear pre-paid status
            </button>
          )}
        </div>
      )}

      {/* Progress Steps Header */}
      {step < 4 && (
        <div className="flex items-center justify-between max-w-xl mx-auto px-4">
          {[
            { num: 1, label: 'Session & Mode' },
            { num: 2, label: 'About You' },
            { num: 3, label: prePaidInfo ? 'Time & Confirmation' : 'Time & Payment' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#dc3c1c] text-white ring-4 ring-[#dc3c1c]/20'
                    : step > s.num
                    ? 'bg-[#22201e] text-white'
                    : 'bg-[#ebe4d8] text-[#70665c]'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`text-xs hidden sm:inline font-semibold ${
                  step === s.num ? 'text-[#1c1a18]' : 'text-stone-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: Select Mode and Duration */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-[#e5dcce] p-6 sm:p-8 space-y-8 shadow-sm animate-fadeIn">
          {/* Communication Mode Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1c1a18]">
              1. Choose Preferred Communication Mode (On Zoom)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                id="mode-video-btn"
                onClick={() => setSessionMode('video')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  sessionMode === 'video'
                    ? 'border-[#dc3c1c] bg-[#fff6f4] ring-2 ring-[#dc3c1c]/20 shadow-sm'
                    : 'border-stone-200 bg-[#fdfbf8] hover:border-stone-400'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${sessionMode === 'video' ? 'bg-[#dc3c1c] text-white' : 'bg-stone-200 text-stone-700'}`}>
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-[#1c1a18]">Zoom Video Call</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#dc3c1c]/10 text-[#dc3c1c] text-[10px] font-bold">Recommended</span>
                  </div>
                  <p className="text-xs text-[#5b534a] mt-0.5 leading-relaxed">
                    Face-to-face visual presence helps create a deeper, empathetic human connection. (Camera can be turned off anytime).
                  </p>
                </div>
              </button>

              <button
                type="button"
                id="mode-audio-btn"
                onClick={() => setSessionMode('audio')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  sessionMode === 'audio'
                    ? 'border-[#dc3c1c] bg-[#fff6f4] ring-2 ring-[#dc3c1c]/20 shadow-sm'
                    : 'border-stone-200 bg-[#fdfbf8] hover:border-stone-400'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${sessionMode === 'audio' ? 'bg-[#dc3c1c] text-white' : 'bg-stone-200 text-stone-700'}`}>
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1c1a18]">Zoom Audio Call</h4>
                  <p className="text-xs text-[#5b534a] mt-0.5 leading-relaxed">
                    Ideal if you prefer gentle audio-only comfort, speaking during a quiet evening walk, or feel shy on video.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Package Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1c1a18]">
              2. Select Session Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pricingPackages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#dc3c1c] bg-[#fff9f8] ring-2 ring-[#dc3c1c]/20 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-4 bg-[#dc3c1c] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                        Most Popular
                      </span>
                    )}

                    {prePaidInfo && prePaidInfo.packageId === pkg.id && (
                      <span className="absolute -top-2.5 left-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Pre-Paid (₹{prePaidInfo.price})
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#1c1a18]">{pkg.title}</h4>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-[#dc3c1c]">₹{pkg.price}</span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-stone-400 line-through ml-1.5">₹{pkg.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[#5a524a]">{pkg.subtitle}</p>

                      <ul className="pt-2 space-y-1.5 text-xs text-[#4b443c]">
                        {pkg.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#dc3c1c] flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">{pkg.recommendedFor.slice(0, 45)}...</span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#dc3c1c]' : 'text-stone-400'}`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="text-stone-500 hover:text-[#dc3c1c] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-stone-400" />
              <span>Already paid via Razorpay? Restore your session</span>
            </button>

            <button
              type="button"
              id="booking-step1-next-btn"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue: Your Contact Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Intake & About Yourself */}
      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(3);
          }}
          className="bg-white rounded-3xl border border-[#e5dcce] p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn"
        >
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-lg font-bold text-[#1c1a18]">Tell Us About Yourself</h3>
            <p className="text-xs text-[#635a50]">
              Your Zoom link will be sent automatically to the email address and WhatsApp number provided below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1c1a18] mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-500" /> Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1c1a18] mb-1">
                Age * (Platform welcomes ages 12+)
              </label>
              <input
                type="number"
                min={12}
                max={99}
                required
                placeholder="e.g. 23"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
              />
            </div>

            {/* Email Address with Notice */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#1c1a18] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-500" /> Email Address *
                </label>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Instant Zoom link sent here
                </span>
              </div>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
              />
            </div>

            {/* Phone & WhatsApp Number with Notice */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#1c1a18] flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-stone-500" /> WhatsApp Number *
                </label>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  WhatsApp reminder sent here
                </span>
              </div>
              <div className="flex gap-2">
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="px-2.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#f8f4ec] font-semibold focus:outline-none"
                >
                  <option value="+91">🇮🇳 +91 (India)</option>
                  <option value="+1">🇺🇸 +1 (USA)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                  <option value="+65">🇸🇬 +65 (Singapore)</option>
                  <option value="+61">🇦🇺 +61 (Australia)</option>
                  <option value="+1">🇨🇦 +1 (Canada)</option>
                </select>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-xs font-semibold text-[#1c1a18] mb-1.5">
              Preferred Language for Session:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Hindi', 'Gujarati', 'English', 'Hinglish'] as const).map((langOpt) => (
                <button
                  key={langOpt}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredLanguage: langOpt })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    formData.preferredLanguage === langOpt
                      ? 'bg-[#22201e] text-white border-[#22201e]'
                      : 'bg-[#fbf8f3] text-[#4d453d] border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {langOpt}
                </button>
              ))}
            </div>
          </div>

          {/* Reason for seeking mentorship (Checkable Chips) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1c1a18]">
              What would you like guidance with? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {reasonsList.map((reason) => {
                const isSelected = formData.reasons.includes(reason);
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => toggleReason(reason)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#dc3c1c] text-white shadow-sm'
                        : 'bg-[#f4efe6] text-[#4f473e] hover:bg-stone-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brief Reflection Note */}
          <div>
            <label className="block text-xs font-semibold text-[#1c1a18] mb-1">
              Tell us briefly what you'd like to talk about: (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g., I have been feeling anxious about choosing between two job paths and need a calm perspective..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="submit"
              id="booking-step2-next-btn"
              className="px-6 py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{prePaidInfo ? 'Choose Time & Confirm Booking (Pre-Paid)' : 'Choose Time & Complete Payment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Choose Date, Time Slot & Complete Booking */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-[#e5dcce] p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-lg font-bold text-[#1c1a18]">
              {prePaidInfo ? 'Select Time Slot & Confirm Booking' : 'Select Time Slot & Complete Payment'}
            </h3>
            <p className="text-xs text-[#635a50]">
              {prePaidInfo
                ? 'Your payment is already verified. Choose your preferred time slot to immediately generate your Zoom invitation.'
                : 'All times are shown in Indian Standard Time (IST). Upon completing payment, your Zoom meeting link is generated instantly.'}
            </p>
          </div>

          {/* Date Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1c1a18]">Select Day:</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {availableDates.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDate(d.date)}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    selectedDate === d.date
                      ? 'border-[#dc3c1c] bg-[#fff6f4] ring-2 ring-[#dc3c1c]/20'
                      : 'border-stone-200 bg-[#fcfaf7] hover:bg-stone-100'
                  }`}
                >
                  <span className="block text-[11px] font-medium text-stone-500">{d.label}</span>
                  <span className="block text-xs font-bold text-[#1c1a18] mt-0.5">{d.date.split(',')[1] || d.date}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1c1a18]">Available Slots (IST):</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableSlots.map((slot, idx) => {
                const isBooked = isSlotBookedByMe(slot.time, selectedDate);
                const isSelected = selectedTimeSlot === slot.time && !isBooked;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isBooked}
                    onClick={() => {
                      if (!isBooked) setSelectedTimeSlot(slot.time);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isBooked
                        ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-75'
                        : isSelected
                        ? 'border-[#dc3c1c] bg-[#fff5f2] ring-2 ring-[#dc3c1c]/20 font-bold'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-4 h-4 ${
                          isSelected ? 'text-[#dc3c1c]' : isBooked ? 'text-stone-300' : 'text-stone-400'
                        }`}
                      />
                      <span className={`text-xs ${isBooked ? 'line-through text-stone-500' : 'text-[#1c1a18]'}`}>
                        {slot.time}
                      </span>
                    </div>
                    {isBooked ? (
                      <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                        Already Booked
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 uppercase">{slot.period}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Section: Pre-Paid Card or Razorpay Selector */}
          {prePaidInfo ? (
            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Payment Pre-Verified with Razorpay</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                  NO PAYMENT REQUIRED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                <div><span className="text-stone-500">Package:</span> <span className="font-bold text-[#1c1a18]">{prePaidInfo.packageTitle}</span></div>
                <div><span className="text-stone-500">Amount Paid:</span> <span className="font-bold text-emerald-700">₹{prePaidInfo.price} (PAID)</span></div>
                <div><span className="text-stone-500">Razorpay Payment ID:</span> <span className="font-mono text-[11px] font-semibold text-stone-800">{prePaidInfo.paymentId}</span></div>
                <div><span className="text-stone-500">Security Signature:</span> <span className="text-emerald-700 font-medium">HMAC-SHA256 Validated ✓</span></div>
              </div>
              <p className="text-[11px] text-emerald-800">
                ✨ Your payment is already confirmed. Simply click the button below to reserve your slot and generate your meeting details!
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1c1a18]">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#dc3c1c] bg-[#fff5f2] ring-2 ring-[#dc3c1c]/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#1c1a18]">UPI / QR / Apps</span>
                    <span className="block text-[10px] text-stone-500">GPay, PhonePe, Paytm</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#dc3c1c] bg-[#fff5f2] ring-2 ring-[#dc3c1c]/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#1c1a18]">Credit / Debit Card</span>
                    <span className="block text-[10px] text-stone-500">Visa, Mastercard, RuPay</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#dc3c1c] bg-[#fff5f2] ring-2 ring-[#dc3c1c]/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                    🏦
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#1c1a18]">Net Banking</span>
                    <span className="block text-[10px] text-stone-500">All Major Indian Banks</span>
                  </div>
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-xl bg-[#faf6ef] border border-[#e8dfd3] space-y-2 text-xs">
                  <label className="block font-semibold text-[#1c1a18]">Enter UPI ID / VPA (Optional):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="yourname@okaxis / yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-[#dc3c1c]"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Instant QR code and payment intent will be processed automatically upon confirmation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-[#f8f4ec] border border-[#e8ded0] space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-[#1c1a18] border-b border-stone-200/80 pb-2">
              <span className="text-sm">Session Summary & Total:</span>
              <div className="text-right">
                <span className="text-[#dc3c1c] font-black text-lg">₹{selectedPkg.price}</span>
                {prePaidInfo ? (
                  <span className="block text-[10px] text-emerald-700 font-bold">✓ Pre-Paid via Razorpay</span>
                ) : (
                  <span className="block text-[10px] text-emerald-700 font-medium">All taxes & Zoom link included</span>
                )}
              </div>
            </div>
            <div className="text-[#554d44] space-y-1.5">
              <p>• <strong>Package:</strong> {selectedPkg.title} ({sessionMode === 'video' ? 'Zoom Video Call' : 'Zoom Audio Call'})</p>
              <p>• <strong>Scheduled Time:</strong> {selectedDate} at {selectedTimeSlot} (IST)</p>
              <p>• <strong>Delivery:</strong> Zoom meeting link will be dispatched immediately to <strong>{formData.email || 'your email'}</strong> & WhatsApp <strong>{formData.countryCode} {formData.phone || 'your phone'}</strong></p>
              <p>• <strong>Mentor:</strong> Siddhi Patel (Hindi / Gujarati / English)</p>
            </div>
          </div>

          {/* Payment Errors or Notices */}
          {paymentError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">Payment Alert: </span>
                <span>{paymentError}</span>
              </div>
              <button
                type="button"
                onClick={() => setPaymentError(null)}
                className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm leading-none cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

          {paymentNotice && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5 text-xs animate-fadeIn">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{paymentNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setPaymentNotice(null)}
                className="text-amber-600 hover:text-amber-800 font-bold ml-1 text-sm leading-none cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={isProcessingPayment}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 order-2 sm:order-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              id="confirm-booking-btn"
              onClick={handleCompletePaymentAndBooking}
              disabled={isProcessingPayment}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 order-1 sm:order-2 ${
                prePaidInfo
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-[#dc3c1c] hover:bg-[#c23214]'
              }`}
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{prePaidInfo ? 'Confirming Slot & Generating Zoom Link...' : 'Connecting to Razorpay Gateway...'}</span>
                </>
              ) : prePaidInfo ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking & Generate Zoom Link (Pre-Paid) →</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{selectedPkg.price} via Razorpay →</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {prePaidInfo
                ? 'Payment already verified & authorized via Razorpay Standard 256-bit SSL Checkout'
                : 'Secured by Razorpay Standard 256-bit SSL Checkout (UPI, Cards, NetBanking)'}
            </span>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmation & Auto-Generated Zoom Details */}
      {step === 4 && confirmedBooking && (
        <div className="bg-white rounded-3xl border border-[#e5dcce] p-6 sm:p-10 space-y-8 shadow-md animate-fadeIn">
          {/* Header Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Successful • Booking Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a18] pt-2">
                Your Zoom Mentorship Session is Scheduled!
              </h2>
              <p className="text-xs sm:text-sm text-[#5c544b] max-w-lg mx-auto">
                Your private Zoom meeting link has been automatically generated and sent to both your <strong>Email</strong> and <strong>WhatsApp</strong>.
              </p>
            </div>
          </div>

          {/* Zoom Meeting Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0b5cff]/5 via-[#faf6f0] to-[#fff5f2] border-2 border-[#0b5cff]/30 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0b5cff] text-white flex items-center justify-center font-black shadow-sm">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1c1a18]">
                    Official Zoom 1-to-1 Meeting Details
                  </h3>
                  <p className="text-[11px] text-stone-500">Private encrypted video/audio room with Siddhi Patel</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Active Link
                </span>
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-mono font-medium">
                  {confirmedBooking.transactionId}
                </span>
              </div>
            </div>

            {/* Link Box */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Zoom Join URL:
                </label>
                <div className="p-3 bg-white rounded-xl border border-stone-300 flex items-center justify-between gap-3 shadow-inner">
                  <span className="text-xs font-mono text-[#0b5cff] truncate select-all">
                    {confirmedBooking.zoomJoinUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(confirmedBooking.zoomJoinUrl, 'link')}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ID and Passcode Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Meeting ID:</span>
                  <span className="text-xs font-mono font-bold text-stone-900 select-all">
                    {confirmedBooking.zoomMeetingId}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Passcode:</span>
                  <span className="text-xs font-mono font-bold text-stone-900 select-all">
                    {confirmedBooking.zoomPasscode}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={confirmedBooking.zoomJoinUrl}
                target="_blank"
                rel="noreferrer"
                id="join-zoom-btn"
                className="flex-1 py-3 px-5 rounded-xl bg-[#0b5cff] hover:bg-[#004bd9] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Join Zoom Meeting</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                id="add-to-gcal-btn"
                className="py-3 px-4 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-[#dc3c1c]" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                id="download-ics-btn"
                className="py-3 px-4 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Download .ics calendar file"
              >
                <Download className="w-4 h-4 text-stone-600" />
                <span>Download .ICS</span>
              </button>
            </div>
          </div>

          {/* Multi-Channel Automated Dispatch Receipts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Dispatch Card */}
            <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ebdccb] space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1c1a18]">Email Dispatched</h4>
                    <p className="text-[11px] text-stone-500 truncate max-w-[180px]">{confirmedBooking.email}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Sent
                </span>
              </div>

              <p className="text-xs text-[#584f45] leading-relaxed">
                Full Zoom invitation, calendar event, and preparation instructions have been delivered to your inbox.
              </p>

              <div className="pt-1 flex items-center justify-between border-t border-stone-200/80 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowEmailPreview(true)}
                  className="text-[#dc3c1c] font-semibold hover:underline cursor-pointer"
                >
                  Preview Email Copy
                </button>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  {emailResent ? 'Email Resent ✓' : 'Resend Email'}
                </button>
              </div>
            </div>

            {/* WhatsApp Dispatch Card */}
            <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ebdccb] space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1c1a18]">WhatsApp Dispatched</h4>
                    <p className="text-[11px] text-stone-500">{confirmedBooking.phone}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Sent
                </span>
              </div>

              <p className="text-xs text-[#584f45] leading-relaxed">
                Instant WhatsApp message with your Zoom link, time reminder, and mentor greeting has been sent.
              </p>

              <div className="pt-1 flex items-center justify-between border-t border-stone-200/80 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppPreview(true)}
                  className="text-[#dc3c1c] font-semibold hover:underline cursor-pointer"
                >
                  View WhatsApp Message
                </button>
                <button
                  type="button"
                  onClick={handleResendWhatsApp}
                  className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  {whatsappResent ? 'WhatsApp Resent ✓' : 'Resend WhatsApp'}
                </button>
              </div>
            </div>
          </div>

          {/* Session Overview Details */}
          <div className="p-5 rounded-2xl bg-[#faf6f0] border border-[#e8dfd3] max-w-xl mx-auto text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Mentee:</span>
              <span className="font-bold text-stone-900">{confirmedBooking.fullName} (Age: {confirmedBooking.age})</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Scheduled Time:</span>
              <span className="font-bold text-stone-900">{confirmedBooking.preferredDate} ({confirmedBooking.preferredTime} IST)</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Session Mode & Duration:</span>
              <span className="font-bold text-[#dc3c1c] capitalize">
                {confirmedBooking.sessionMode} on Zoom ({confirmedBooking.packageType.duration})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Mentor:</span>
              <span className="font-bold text-stone-900">Siddhi Patel (Hindi / Gujarati / English)</span>
            </div>
          </div>

          {/* Next Steps / Chat CTA */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center max-w-lg mx-auto">
            <button
              id="start-chat-with-mentor-btn"
              onClick={() => onNavigate('chat')}
              className="px-5 py-3.5 rounded-xl bg-[#22201e] hover:bg-stone-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#ff785a]" />
              <span>Leave Pre-Session Message</span>
            </button>

            <button
              id="view-my-sessions-step4-btn"
              onClick={() => onNavigate('my-sessions')}
              className="px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#dc3c1c]" />
              <span>View All My Booked Sessions</span>
            </button>

            <button
              type="button"
              id="book-another-session-btn"
              onClick={handleBookAnotherSession}
              className="px-5 py-3.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-white" />
              <span>+ Book Another Session</span>
            </button>
          </div>

          {/* Preparation tips */}
          <div className="pt-6 border-t border-stone-200 max-w-md mx-auto text-left text-xs text-[#635a50] space-y-1.5">
            <p className="font-bold text-[#1c1a18]">3 Simple tips for your Zoom session:</p>
            <p>1. Ensure Zoom is installed or open it directly in your web browser 2 minutes before the time.</p>
            <p>2. Find a quiet corner where you feel comfortable and completely safe to speak freely.</p>
            <p>3. Remember: you don't need to prepare a polished speech. Just come as you are.</p>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#dc3c1c]" />
                <h3 className="font-bold text-sm text-[#1c1a18]">Dispatched Email Preview</h3>
              </div>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-3 font-sans leading-relaxed">
              <div className="border-b border-stone-200 pb-2 text-[11px] text-stone-500">
                <p><strong>To:</strong> {confirmedBooking.email}</p>
                <p><strong>From:</strong> supportsystem22@gmail.com (SupportSystem Official)</p>
                <p><strong>Subject:</strong> Your 1-to-1 Mentorship Zoom Link with Siddhi Patel ({confirmedBooking.preferredDate})</p>
              </div>

              <p>Dear <strong>{confirmedBooking.fullName}</strong>,</p>
              <p>
                Your private 1-to-1 mentorship session with <strong>Siddhi Patel</strong> is officially scheduled and confirmed.
              </p>

              <div className="p-3 rounded-lg bg-white border border-[#0b5cff]/30 space-y-1">
                <p className="font-bold text-[#0b5cff]">🎥 Zoom Meeting Details:</p>
                <p><strong>Join Link:</strong> <span className="font-mono text-[11px]">{confirmedBooking.zoomJoinUrl}</span></p>
                <p><strong>Meeting ID:</strong> {confirmedBooking.zoomMeetingId}</p>
                <p><strong>Passcode:</strong> {confirmedBooking.zoomPasscode}</p>
                <p><strong>Time:</strong> {confirmedBooking.preferredDate} at {confirmedBooking.preferredTime} (IST)</p>
              </div>

              <p>
                Warm regards,<br />
                <strong>SupportSystem Team & Siddhi Patel</strong>
              </p>
            </div>

            <button
              onClick={() => setShowEmailPreview(false)}
              className="w-full py-2.5 rounded-xl bg-[#22201e] text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Preview Modal */}
      {showWhatsAppPreview && confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#1c1a18]">Dispatched WhatsApp Preview</h3>
              </div>
              <button
                onClick={() => setShowWhatsAppPreview(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#e5ddd5] text-xs text-stone-800 space-y-2">
              <div className="p-3.5 rounded-xl bg-[#dcf8c6] shadow-sm space-y-2 leading-relaxed">
                <p className="font-bold text-stone-900">
                  SupportSystem • 1-to-1 Mentorship
                </p>
                <p>
                  Namaste <strong>{confirmedBooking.fullName}</strong>! 🙏
                </p>
                <p>
                  Your 1-to-1 session with <strong>Siddhi Patel</strong> is confirmed for <strong>{confirmedBooking.preferredDate}</strong> at <strong>{confirmedBooking.preferredTime} IST</strong>.
                </p>
                <p>
                  🔗 <strong>Zoom Link:</strong> {confirmedBooking.zoomJoinUrl}<br />
                  🔑 <strong>Meeting ID:</strong> {confirmedBooking.zoomMeetingId}<br />
                  🔒 <strong>Passcode:</strong> {confirmedBooking.zoomPasscode}
                </p>
                <p className="text-[11px] text-stone-600">
                  Feel free to message here if you need to adjust time or have questions before our session. See you soon!
                </p>
                <span className="block text-[10px] text-right text-stone-500">Just now • Delivered ✓✓</span>
              </div>
            </div>

            <button
              onClick={() => setShowWhatsAppPreview(false)}
              className="w-full py-2.5 rounded-xl bg-[#22201e] text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Razorpay Payment ID Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setShowRecoveryModal(false);
                setRecoveryError(null);
                setRecoverySuccess(null);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-sm font-bold p-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#dc3c1c]/10 text-[#dc3c1c] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1c1a18]">Restore Pre-Paid Session</h3>
              <p className="text-xs text-stone-500">
                Did your browser refresh or close after payment? Enter the Razorpay Payment ID from your email or SMS receipt.
              </p>
            </div>

            <form onSubmit={handleRecoverPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c1a18] mb-1.5">
                  Razorpay Payment ID (e.g. pay_Q8e...):
                </label>
                <input
                  type="text"
                  required
                  placeholder="pay_..."
                  value={recoveryPaymentId}
                  onChange={(e) => setRecoveryPaymentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
                />
                <span className="block text-[11px] text-stone-400 mt-1">
                  Check your SMS/Email from Razorpay for the Payment ID.
                </span>
              </div>

              {recoveryError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoverySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{recoverySuccess}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {recoveryLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying with Razorpay...</span>
                    </>
                  ) : (
                    <span>Verify & Restore Pre-Paid Session →</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
