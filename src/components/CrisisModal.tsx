import React from 'react';
import { PhoneCall, ShieldAlert, X, HeartHandshake, Globe } from 'lucide-react';
import { emergencyContacts } from '../data/mentorData';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="crisis-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="crisis-modal-card"
        className="relative w-full max-w-2xl bg-[#faf8f5] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gentle warning banner */}
        <div className="bg-[#fff1ed] border-b border-[#ffd7cd] p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dc3c1c]/15 text-[#dc3c1c] flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1f1d1a]">Immediate Crisis & Support Resources</h3>
              <p className="text-sm text-[#796f66] mt-0.5">
                You are valuable and never alone. Free, confidential help is available 24/7.
              </p>
            </div>
          </div>
          <button
            id="close-crisis-modal-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="p-4 rounded-xl bg-white border border-stone-200/80 text-sm text-[#443e39] leading-relaxed">
            <p className="font-medium text-[#1f1d1a] mb-1">
              Important Safety Note from SupportSystem:
            </p>
            Our 1-to-1 mentorship sessions are designed for life guidance, stress, decision-making, and emotional clarity. If you or someone you know is in severe distress, experiencing overwhelming hopelessness, or considering self-harm, please reach out directly to these dedicated 24/7 crisis hotlines.
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#dc3c1c]" /> 24x7 Toll-Free Emergency Helplines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl border border-stone-200 hover:border-[#dc3c1c]/40 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h5 className="font-semibold text-[#1e1d1b] text-sm leading-snug">{contact.name}</h5>
                    <p className="text-xs text-[#786f66] mt-1">{contact.available}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#dc3c1c]">{contact.number}</span>
                    <a
                      href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
                      className="text-xs font-semibold text-[#1e1d1b] bg-stone-100 hover:bg-[#dc3c1c] hover:text-white px-2.5 py-1 rounded-md transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f0ece3] p-4 rounded-xl flex items-center gap-3">
            <Globe className="w-5 h-5 text-stone-600 flex-shrink-0" />
            <p className="text-xs text-stone-700 leading-relaxed">
              If outside India, please contact your local emergency services or visit{' '}
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#dc3c1c] underline"
              >
                findahelpline.com
              </a>{' '}
              for confidential support in 130+ countries.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            id="dismiss-crisis-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#22201e] text-white text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            I Understand & Return
          </button>
        </div>
      </div>
    </div>
  );
};
