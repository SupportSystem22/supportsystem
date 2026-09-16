import React, { useState } from 'react';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { initiateRazorpayCheckout } from '../utils/razorpay';
import { RazorpayPaymentSuccessResponse } from '../vite-env';

export interface RazorpayCheckoutButtonProps {
  amountInPaise: number;
  currency?: string;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  description?: string;
  receipt?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: RazorpayPaymentSuccessResponse, verification: any) => void;
  onError?: (error: { message: string; details?: any }) => void;
  onDismiss?: () => void;
}

export const RazorpayCheckoutButton: React.FC<RazorpayCheckoutButtonProps> = ({
  amountInPaise,
  currency = 'INR',
  buttonText,
  className = '',
  disabled = false,
  name = 'SupportSystem',
  description = 'Mentorship & Clarity Session',
  receipt,
  prefill,
  notes,
  onSuccess,
  onError,
  onDismiss,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await initiateRazorpayCheckout({
        amountInPaise,
        currency,
        name,
        description,
        receipt,
        prefill,
        notes,
        onSuccess: (response, verification) => {
          setIsLoading(false);
          onSuccess(response, verification);
        },
        onError: (err) => {
          setIsLoading(false);
          setErrorMessage(err.message);
          if (onError) {
            onError(err);
          }
        },
        onDismiss: () => {
          setIsLoading(false);
          if (onDismiss) {
            onDismiss();
          }
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Payment initiation failed.');
      if (onError) {
        onError({ message: err.message });
      }
    }
  };

  const formattedAmount = (amountInPaise / 100).toLocaleString('en-IN');

  return (
    <div className="flex flex-col gap-2">
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl animate-fadeIn">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
          <div className="flex-1">
            <span className="font-semibold">Payment Notice: </span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm leading-none"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        id="razorpay-checkout-button"
        onClick={handlePay}
        disabled={disabled || isLoading}
        className={
          className ||
          'px-8 py-3.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
        }
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting Secure Razorpay Gateway...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>
              {buttonText || `Pay ₹${formattedAmount} via Razorpay`}
            </span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Secured by Razorpay Standard 256-bit SSL Checkout</span>
      </div>
    </div>
  );
};

export default RazorpayCheckoutButton;
