import { RazorpayPaymentSuccessResponse } from '../vite-env';

export interface CheckoutOptions {
  amountInPaise: number;
  currency?: string;
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
  themeColor?: string;
  onSuccess: (response: RazorpayPaymentSuccessResponse, verificationResult: any) => void;
  onError: (error: { message: string; details?: any }) => void;
  onDismiss?: () => void;
}

/**
 * Ensures Razorpay Checkout script is loaded on the page.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Step 1: Call backend endpoint to create Razorpay Order
 */
export async function createBackendOrder(amountInPaise: number, currency = 'INR', receipt?: string, notes?: Record<string, string>) {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt,
      notes,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Failed to create order (HTTP ${response.status})`);
  }

  return data as { order_id: string; amount: number; currency: string };
}

/**
 * Step 3: Call backend endpoint to verify Razorpay signature
 */
export async function verifyBackendPayment(orderId: string, paymentId: string, signature: string) {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed.');
  }

  return data;
}

/**
 * Step 2: Main Checkout Orchestrator
 * 1. Loads SDK
 * 2. Creates order on backend
 * 3. Opens Razorpay Modal
 * 4. Listens for payment.failed and modal dismiss
 * 5. On success, verifies signature on backend
 */
export async function initiateRazorpayCheckout(options: CheckoutOptions) {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!keyId) {
    options.onError({
      message: 'Razorpay Key ID not configured. Please set VITE_RAZORPAY_KEY_ID in .env.',
    });
    return;
  }

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded || !window.Razorpay) {
    options.onError({
      message: 'Failed to load Razorpay payment gateway SDK. Please check your internet connection.',
    });
    return;
  }

  let orderData;
  try {
    orderData = await createBackendOrder(
      options.amountInPaise,
      options.currency || 'INR',
      options.receipt,
      options.notes
    );
  } catch (err: any) {
    options.onError({
      message: err.message || 'Unable to initiate order with payment server.',
      details: err,
    });
    return;
  }

  const rzpOptions = {
    key: keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: options.name || 'SupportSystem',
    description: options.description || '1-to-1 Mentorship & Clarity Session',
    order_id: orderData.order_id,
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
      method: options.prefill?.method,
    },
    notes: options.notes,
    theme: {
      color: options.themeColor || '#dc3c1c',
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
    handler: async (response: RazorpayPaymentSuccessResponse) => {
      try {
        const verificationResult = await verifyBackendPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        );
        options.onSuccess(response, verificationResult);
      } catch (verifyErr: any) {
        options.onError({
          message: verifyErr.message || 'Payment signature verification failed. Please contact support.',
          details: verifyErr,
        });
      }
    },
  };

  const rzpInstance = new window.Razorpay(rzpOptions);

  rzpInstance.on('payment.failed', (failedResponse: any) => {
    const errorDetails = failedResponse?.error || {};
    options.onError({
      message: errorDetails.description || 'Payment was unsuccessful or declined by your bank/UPI.',
      details: errorDetails,
    });
  });

  rzpInstance.open();
}
