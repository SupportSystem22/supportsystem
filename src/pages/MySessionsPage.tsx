import React, { useState } from 'react';
import { PageView, LanguageMode, BookingDetails } from '../types';
import {
  Calendar,
  Clock,
  Video,
  Headphones,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  CalendarPlus,
  Download,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface MySessionsPageProps {
  bookings: BookingDetails[];
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
  onStartNewBooking: () => void;
}

export const MySessionsPage: React.FC<MySessionsPageProps> = ({
  bookings,
  onNavigate,
  lang,
  onStartNewBooking,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getGoogleCalendarUrl = (booking: BookingDetails) => {
    const title = encodeURIComponent(`1-to-1 Mentorship Session with Siddhi Patel (${booking.packageType.title})`);
    const details = encodeURIComponent(
      `Private 1-to-1 Session with Siddhi Patel on SupportSystem.\n\n` +
      `Zoom Join Link: ${booking.zoomJoinUrl || booking.meetingLink}\n` +
      `Meeting ID: ${booking.zoomMeetingId}\n` +
      `Passcode: ${booking.zoomPasscode}\n\n` +
      `Topics: ${booking.reasons.join(', ')}\n` +
      `Please join 2 minutes before the session.`
    );
    const location = encodeURIComponent(booking.zoomJoinUrl || booking.meetingLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleDownloadIcs = (booking: BookingDetails) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SupportSystem//Mentorship Session//EN',
      'BEGIN:VEVENT',
      `UID:${booking.id}@supportsystem.in`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:1-to-1 Mentorship with Siddhi Patel (${booking.packageType.title})`,
      `DESCRIPTION:SupportSystem Mentorship Session\\nZoom Link: ${booking.zoomJoinUrl}\\nMeeting ID: ${booking.zoomMeetingId}\\nPasscode: ${booking.zoomPasscode}`,
      `LOCATION:${booking.zoomJoinUrl}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `siddhi-mentorship-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdccb] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcedea] text-[#dc3c1c] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मेरे बुक किए गए सेशन' : 'My Booked Sessions'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1a18] tracking-tight">
              {lang === 'hi' ? 'आपके शेड्यूल किए गए सेशन्स' : 'Your Scheduled Sessions'}
            </h1>
            <p className="text-xs sm:text-sm text-[#635a50] max-w-2xl">
              {lang === 'hi'
                ? 'सिद्धि पटेल के साथ आपके सभी कन्फर्म्ड सेशन्स की लिस्ट, जूम लिंक और मीटिंग क्रेडेंशियल्स यहाँ सुरक्षित हैं।'
                : 'All your upcoming 1-to-1 mentorship clarity sessions with Siddhi Patel. Access your Zoom invitations, credentials, and schedule new sessions anytime.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Home</span>
            </button>

            <button
              onClick={onStartNewBooking}
              id="book-another-from-my-sessions"
              className="px-4 py-2.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? '+ नया सेशन बुक करें' : '+ Book Another Session'}</span>
            </button>
          </div>
        </div>

        {/* Bookings List or Empty State */}
        {bookings.length === 0 ? (
          <div className="p-10 sm:p-16 rounded-3xl bg-white border border-[#ebdccb] text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#fff5f2] border border-[#fbdcd5] text-[#dc3c1c] mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-lg font-bold text-[#1c1a18]">
                {lang === 'hi' ? 'अभी कोई सेशन बुक नहीं है' : 'No Booked Sessions Yet'}
              </h2>
              <p className="text-xs sm:text-sm text-[#635a50]">
                {lang === 'hi'
                  ? 'अपने जीवन की दुविधाओं और तनाव को सुलझाने के लिए सिद्धि पटेल के साथ 1-to-1 सेशन अभी बुक करें।'
                  : 'Ready to find clarity, unburden your mind, and make confident decisions? Book your first 1-to-1 confidential session with Siddhi Patel.'}
              </p>
            </div>
            <button
              onClick={onStartNewBooking}
              className="px-6 py-3 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सेशन बुक करें' : 'Start Your Journey'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>
                Showing <strong>{bookings.length}</strong> confirmed session{bookings.length > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All credentials verified & ready
              </span>
            </div>

            {bookings.map((booking, index) => (
              <div
                key={booking.id || index}
                className="bg-white rounded-3xl border border-[#ebdccb] p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Top Status & Mode Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{booking.status === 'confirmed' ? 'Booking Confirmed' : booking.status}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5">
                      {booking.sessionMode === 'video' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-[#dc3c1c]" />
                          <span>Zoom Video Call</span>
                        </>
                      ) : (
                        <>
                          <Headphones className="w-3.5 h-3.5 text-[#dc3c1c]" />
                          <span>Audio Call</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 block font-mono">
                      Ref #{booking.id.replace('booking-', '')}
                    </span>
                    {booking.transactionId && (
                      <span className="text-[11px] text-stone-400 font-mono">
                        Payment: {booking.transactionId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Session Details Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-[#1c1a18]">
                        {booking.packageType.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Duration: <strong>{booking.packageType.duration}</strong> • Mentorship by <strong>Siddhi Patel</strong>
                      </p>
                    </div>

                    {/* Scheduled Time Banner */}
                    <div className="p-4 rounded-2xl bg-[#fff8f5] border border-[#f8e2d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#dc3c1c] text-white shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-[#dc3c1c] uppercase tracking-wider">
                            Scheduled Date & Time
                          </span>
                          <span className="text-sm sm:text-base font-black text-[#1c1a18]">
                            {booking.preferredDate} at {booking.preferredTime} (IST)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getGoogleCalendarUrl(booking)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Add to Google Calendar"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-[#dc3c1c]" />
                          <span>Google Calendar</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDownloadIcs(booking)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-[11px] font-semibold text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Download .ics file"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-600" />
                          <span>.ICS</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing / Participant Overview */}
                  <div className="p-4 rounded-2xl bg-[#fcfaf7] border border-stone-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-stone-500 border-b border-stone-200 pb-2">
                      <span>Total Paid:</span>
                      <span className="font-bold text-stone-900 text-sm">₹{booking.packageType.price}</span>
                    </div>

                    <div className="space-y-1 text-stone-600 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{booking.fullName} ({booking.age}y, {booking.gender || 'Not specified'})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate max-w-[180px]">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{booking.phone}</span>
                      </div>
                      <div className="pt-1 text-[10px] text-stone-500">
                        Language: <strong>{booking.preferredLanguage}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zoom Meeting Join Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-stone-50 border border-blue-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#0b5cff] text-white">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1c1a18]">Direct Zoom Meeting Link</h4>
                        <p className="text-[11px] text-stone-500">Join 2 minutes prior from your phone or laptop browser</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(booking.zoomJoinUrl || booking.meetingLink, `link-${booking.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-[11px] font-semibold text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedKey === `link-${booking.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <a
                        href={booking.zoomJoinUrl || booking.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2 rounded-xl bg-[#0b5cff] hover:bg-[#004bd9] text-white text-xs font-bold shadow-sm hover:shadow flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Zoom</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    </div>
                  </div>

                  {/* Meeting ID and Passcode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] text-stone-400 font-bold uppercase">Meeting ID</span>
                        <span className="text-xs font-mono font-bold text-stone-900">{booking.zoomMeetingId}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(booking.zoomMeetingId, `id-${booking.id}`)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                        title="Copy Meeting ID"
                      >
                        {copiedKey === `id-${booking.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] text-stone-400 font-bold uppercase">Passcode</span>
                        <span className="text-xs font-mono font-bold text-stone-900">{booking.zoomPasscode}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(booking.zoomPasscode, `pass-${booking.id}`)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                        title="Copy Passcode"
                      >
                        {copiedKey === `pass-${booking.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Topics & Pre-Session Message */}
                {booking.reasons && booking.reasons.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                      Selected Discussion Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.reasons.map((r, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-medium"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 text-xs">
                  <button
                    onClick={() => onNavigate('chat')}
                    className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#dc3c1c]" />
                    <span>Leave a Pre-Session Note for Siddhi</span>
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Confidential & Secure Session</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
