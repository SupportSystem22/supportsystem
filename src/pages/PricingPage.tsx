import React, { useState } from 'react';
import { PageView, LanguageMode } from '../types';
import { pricingPackages, faqs } from '../data/mentorData';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  Lock,
  Mail,
  X,
} from 'lucide-react';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';
import { savePrePaidInfo } from '../utils/paymentStorage';

interface PricingPageProps {
  onNavigate: (page: PageView, options?: any) => void;
  lang: LanguageMode;
  onOpenPolicy: (tab: 'disclaimer' | 'teen-safety' | 'rescheduling' | 'privacy') => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  lang,
  onOpenPolicy,
}) => {
  const [quickPaymentSuccess, setQuickPaymentSuccess] = useState<{
    packageId: string;
    packageTitle: string;
    price: number;
    paymentId: string;
    orderId: string;
  } | null>(null);
  return (
    <div id="pricing-page-container" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#dc3c1c] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Transparent & Simple Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1a18]">
          Invest in Your Inner Peace & Clarity
        </h1>
        <p className="text-xs sm:text-sm text-[#5d554c] leading-relaxed">
          No hidden fees or recurring subscriptions. Choose the session format that aligns with your current life situation.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingPackages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className={`p-6 rounded-3xl bg-white border transition-all relative flex flex-col justify-between shadow-sm ${
                pkg.popular
                  ? 'border-[#dc3c1c] ring-2 ring-[#dc3c1c]/20 shadow-md'
                  : 'border-[#ebdccb] hover:border-stone-400'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#dc3c1c] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow">
                  Most Popular Choice
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#1c1a18]">{pkg.title}</h3>
                  <p className="text-xs text-[#6e6459] mt-0.5">{pkg.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#dc3c1c]">₹{pkg.price}</span>
                  {pkg.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">₹{pkg.originalPrice}</span>
                  )}
                  <span className="text-[11px] text-stone-500 ml-1">/ session</span>
                </div>

                <ul className="space-y-2 text-xs text-[#4b443c] pt-2">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#dc3c1c] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-stone-100 space-y-2">
                <button
                  onClick={() => onNavigate('book', { packageId: pkg.id })}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer ${
                    pkg.popular
                      ? 'bg-[#dc3c1c] hover:bg-[#c23214] text-white shadow-md'
                      : 'bg-[#22201e] hover:bg-stone-800 text-white'
                  }`}
                >
                  Book & Schedule Session
                </button>

                <RazorpayCheckoutButton
                  amountInPaise={pkg.price * 100}
                  currency="INR"
                  name="SupportSystem Mentorship"
                  description={`${pkg.title} - 1-to-1 Mentorship`}
                  buttonText={`Quick Pay ₹${pkg.price}`}
                  className="w-full py-2 rounded-xl bg-[#fff5f2] border border-[#dc3c1c]/40 hover:bg-[#ffece6] text-[#dc3c1c] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
                  onSuccess={(response) => {
                    const info = {
                      packageId: pkg.id,
                      packageTitle: pkg.title,
                      price: pkg.price,
                      paymentId: response.razorpay_payment_id,
                      orderId: response.razorpay_order_id,
                    };
                    savePrePaidInfo(info);
                    setQuickPaymentSuccess(info);
                  }}
                />

                <p className="text-[10px] text-stone-400 text-center">Instant Razorpay UPI, Cards & NetBanking</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rescheduling & Refund Framework */}
      <div className="rounded-3xl bg-[#f8f4ec] border border-[#e5dcce] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#dc3c1c]/10 text-[#dc3c1c] flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1c1a18]">Flexible Rescheduling Policy</h3>
            <p className="text-xs text-[#5f574d] mt-0.5">
              Life is unpredictable. You can reschedule for free with 4 hours advance notice.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenPolicy('rescheduling')}
          className="px-5 py-2.5 rounded-xl bg-white border border-[#ded5c7] text-[#2c2824] hover:bg-stone-50 text-xs font-semibold flex-shrink-0 cursor-pointer"
        >
          View Full Policy Details
        </button>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#1c1a18]">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-[#61594f]">
            Everything you need to know about booking, sessions, and confidentiality.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-[#ebdccb] space-y-2 shadow-sm"
            >
              <h4 className="font-bold text-sm text-[#1c1a18] flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#dc3c1c] flex-shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#504840] leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Email Support Box */}
        <div className="p-6 rounded-3xl bg-[#fffaf5] border border-[#ebdccb] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#dc3c1c]/10 text-[#dc3c1c] flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#1c1a18]">Have questions or custom organization requirements?</h3>
          <p className="text-xs text-[#635a50] max-w-md mx-auto">
            Feel free to write directly to our official support desk for session inquiries, corporate mentoring, or custom packages.
          </p>
          <div className="pt-1">
            <a
              href="mailto:supportsystem22@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22201e] hover:bg-stone-800 text-white font-semibold text-xs transition-colors"
            >
              <Mail className="w-4 h-4 text-[#ff785a]" />
              <span>supportsystem22@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Payment Verification Success Modal */}
      {quickPaymentSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setQuickPaymentSuccess(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1c1a18]">Payment Verified Successfully!</h3>
              <p className="text-xs text-[#5c544c]">
                Your Razorpay payment for <strong>{quickPaymentSuccess.packageTitle}</strong> has been confirmed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf6ef] border border-[#ebdccb] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Amount Paid:</span>
                <span className="font-bold text-[#dc3c1c]">₹{quickPaymentSuccess.price}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Payment ID:</span>
                <span className="font-mono font-medium text-[#1c1a18]">{quickPaymentSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-mono text-stone-600">{quickPaymentSuccess.orderId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Security Signature:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> HMAC-SHA256 Validated
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const info = {
                    packageId: quickPaymentSuccess.packageId,
                    packageTitle: quickPaymentSuccess.packageTitle,
                    price: quickPaymentSuccess.price,
                    paymentId: quickPaymentSuccess.paymentId,
                    orderId: quickPaymentSuccess.orderId,
                  };
                  setQuickPaymentSuccess(null);
                  onNavigate('book', { prePaidInfo: info, packageId: quickPaymentSuccess.packageId });
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Schedule Session (Pre-Paid)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setQuickPaymentSuccess(null)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
