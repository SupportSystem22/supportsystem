import { PrePaidBookingInfo, BookingDetails } from '../types';
import { pricingPackages } from '../data/mentorData';

const PREPAID_STORAGE_KEY = 'supportsystem_prepaid_payment';
const ACTIVE_BOOKING_STORAGE_KEY = 'supportsystem_active_booking';
const MAX_PREPAID_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours

/**
 * Save verified pre-payment to localStorage
 */
export function savePrePaidInfo(info: PrePaidBookingInfo) {
  try {
    const payload = {
      ...info,
      timestamp: Date.now(),
    };
    localStorage.setItem(PREPAID_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save prePaidInfo to localStorage:', err);
  }
}

/**
 * Retrieve verified pre-payment from localStorage
 */
export function getPrePaidInfo(): PrePaidBookingInfo | null {
  try {
    const raw = localStorage.getItem(PREPAID_STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data || !data.paymentId) return null;

    // Check age
    if (data.timestamp && Date.now() - data.timestamp > MAX_PREPAID_AGE_MS) {
      clearPrePaidInfo();
      return null;
    }

    return data as PrePaidBookingInfo;
  } catch (err) {
    console.warn('Failed to read prePaidInfo from localStorage:', err);
    return null;
  }
}

/**
 * Clear pre-payment from localStorage
 */
export function clearPrePaidInfo() {
  try {
    localStorage.removeItem(PREPAID_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear prePaidInfo from localStorage:', err);
  }
}

/**
 * Save active confirmed booking to localStorage
 */
export function saveActiveBooking(booking: BookingDetails) {
  try {
    localStorage.setItem(ACTIVE_BOOKING_STORAGE_KEY, JSON.stringify(booking));
  } catch (err) {
    console.warn('Failed to save active booking to localStorage:', err);
  }
}

/**
 * Retrieve active confirmed booking from localStorage
 */
export function getActiveBooking(): BookingDetails | null {
  try {
    const raw = localStorage.getItem(ACTIVE_BOOKING_STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data || !data.id || !data.meetingLink) return null;

    return data as BookingDetails;
  } catch (err) {
    console.warn('Failed to read active booking from localStorage:', err);
    return null;
  }
}

/**
 * Clear active booking from localStorage
 */
export function clearActiveBooking() {
  try {
    localStorage.removeItem(ACTIVE_BOOKING_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear active booking from localStorage:', err);
  }
}

/**
 * Recover a payment from Razorpay using payment ID
 */
export async function recoverPaymentFromBackend(paymentId: string): Promise<PrePaidBookingInfo> {
  const response = await fetch('/api/check-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_id: paymentId }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment could not be verified with Razorpay.');
  }

  // Determine package matching the amount (amount in paise)
  const amountInRupees = Math.round(data.amount / 100);
  const matchedPkg = pricingPackages.find((p) => p.price === amountInRupees) || pricingPackages[1];

  const info: PrePaidBookingInfo = {
    packageId: matchedPkg.id,
    packageTitle: matchedPkg.title,
    price: matchedPkg.price,
    paymentId: data.payment_id,
    orderId: data.order_id || 'RECOVERED_ORDER',
    timestamp: Date.now(),
  };

  savePrePaidInfo(info);
  return info;
}
