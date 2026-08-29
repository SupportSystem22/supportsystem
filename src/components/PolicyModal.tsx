import React, { useState } from 'react';
import { X, ShieldCheck, HeartHandshake, RefreshCw, FileText, UserCheck } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  initialTab?: 'disclaimer' | 'teen-safety' | 'rescheduling' | 'privacy';
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  initialTab = 'disclaimer',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'teen-safety' | 'rescheduling' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      id="policy-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="policy-modal-card"
        className="relative w-full max-w-3xl bg-[#faf8f5] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-stone-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#dc3c1c]/10 text-[#dc3c1c] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1f1d1a]">Trust, Safety & Legal Policies</h3>
              <p className="text-xs text-[#796f66]">Clear, transparent guidelines for our community and sessions</p>
            </div>
          </div>
          <button
            id="close-policy-modal-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-stone-200 bg-[#f4efe6] px-4 gap-2 overflow-x-auto">
          <button
            id="tab-disclaimer"
            onClick={() => setActiveTab('disclaimer')}
            className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'disclaimer'
                ? 'border-[#dc3c1c] text-[#dc3c1c] bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Important Disclaimer
          </button>
          <button
            id="tab-teen-safety"
            onClick={() => setActiveTab('teen-safety')}
            className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'teen-safety'
                ? 'border-[#dc3c1c] text-[#dc3c1c] bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Teen Safety Policy (12+)
          </button>
          <button
            id="tab-rescheduling"
            onClick={() => setActiveTab('rescheduling')}
            className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'rescheduling'
                ? 'border-[#dc3c1c] text-[#dc3c1c] bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Rescheduling & Refunds
          </button>
          <button
            id="tab-privacy"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-[#dc3c1c] text-[#dc3c1c] bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" /> Privacy & Confidentiality
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#3e3935] leading-relaxed">
          {activeTab === 'disclaimer' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#fff4f1] border border-[#ffd5cc] p-4 rounded-xl text-[#3a201c]">
                <h4 className="font-bold text-base text-[#dc3c1c] mb-1">Non-Clinical Mentorship Statement</h4>
                <p>
                  SupportSystem provides life mentorship, personal clarity conversations, and emotional companionship.
                  Our sessions are <strong>NOT</strong> a substitute for professional medical, psychological, clinical psychiatric, or crisis healthcare services.
                </p>
              </div>
              <p>
                Mentors on SupportSystem do not diagnose mental health disorders, prescribe medications, or conduct clinical psychotherapy. Our primary objective is to offer a safe, thoughtful, reflective mirror for everyday life challenges, stress, decision-making, and personal direction.
              </p>
              <h5 className="font-semibold text-stone-900 mt-4">When to Seek Alternative Professional Care:</h5>
              <ul className="list-disc list-inside space-y-1.5 text-stone-700 pl-1">
                <li>If you are experiencing severe clinical depression, bipolar disorder, psychosis, or active hallucinations.</li>
                <li>If you have thoughts of self-harm, suicide, or harming others.</li>
                <li>If you require prescription psychotropic medication or psychiatric hospitalization.</li>
              </ul>
            </div>
          )}

          {activeTab === 'teen-safety' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-bold text-base text-stone-900">Child & Teen (Ages 12–17) Protection Guidelines</h4>
              <p>
                We believe young people deserve a respectful, non-judgmental space to express academic pressure, identity questions, and interpersonal dilemmas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <h5 className="font-semibold text-stone-800 text-sm mb-1">Guardian Awareness</h5>
                  <p className="text-xs text-stone-600">
                    For individuals under 18 booking paid sessions, guardian consent or notification is encouraged. Parents are welcome to participate in the introductory 5-minute greeting if desired.
                  </p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <h5 className="font-semibold text-stone-800 text-sm mb-1">Strict Mentor Code of Conduct</h5>
                  <p className="text-xs text-stone-600">
                    Sessions are conducted in a strictly professional, mentoring capacity with zero tolerance for inappropriate conduct. All interactions are protected.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-stone-100 rounded-xl text-xs text-stone-600">
                <strong>Mandatory Safety Escalation:</strong> If a minor discloses immediate danger or abuse, mentors are bound by ethics and legal protocols to facilitate appropriate safety escalation.
              </div>
            </div>
          )}

          {activeTab === 'rescheduling' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-bold text-base text-stone-900">Cancellation & Rescheduling Framework</h4>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <span className="font-semibold text-[#dc3c1c] text-sm">Rescheduling Window:</span>
                  <p className="text-xs text-stone-700 mt-1">
                    You can reschedule your session for free up to <strong>4 hours</strong> prior to the scheduled start time directly from your confirmation page or by messaging the mentor.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <span className="font-semibold text-stone-800 text-sm">Missed Sessions (No-Show):</span>
                  <p className="text-xs text-stone-700 mt-1">
                    If you miss a session without 4 hours advance notice, the mentor reserves 15 minutes of live waiting time in the session room before concluding. A 50% re-booking voucher is granted out of empathy.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <span className="font-semibold text-stone-800 text-sm">Mentor Rescheduling:</span>
                  <p className="text-xs text-stone-700 mt-1">
                    If the mentor must reschedule due to emergency circumstances, you will receive an immediate free reschedule plus an additional 15 minutes bonus reflection time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-bold text-base text-stone-900">Privacy & Confidentiality Standard</h4>
              <p>
                Everything you share in 1-to-1 audio and video sessions or private chat remains strictly between you and your mentor.
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-700 text-sm">
                <li><strong>No Session Recordings:</strong> We do not record or save your video or audio sessions without explicit prior permission.</li>
                <li><strong>Anonymous Community:</strong> Posts in the anonymous community forum never expose your email, phone number, or real identity.</li>
                <li><strong>Data Protection:</strong> Your contact information and intake reflections are kept safe and never sold to advertisers or third parties.</li>
                <li><strong>Privacy Queries & Data Deletion:</strong> You can contact our support desk anytime at <a href="mailto:supportsystem22@gmail.com" className="text-[#dc3c1c] underline font-semibold">supportsystem22@gmail.com</a> for any privacy inquiries or data removal requests.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex justify-between items-center">
          <p className="text-xs text-stone-500">SupportSystem • Effective August 2026</p>
          <button
            id="close-policy-btn-footer"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#22201e] text-white text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
