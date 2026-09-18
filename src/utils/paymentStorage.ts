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

const ALL_BOOKINGS_STORAGE_KEY = 'supportsystem_all_bookings';

/**
 * Retrieve all confirmed bookings from localStorage.
 * Automatically migrates any legacy single booking into the array.
 */
export function getAllBookings(): BookingDetails[] {
  try {
    const raw = localStorage.getItem(ALL_BOOKINGS_STORAGE_KEY);
    let bookings: BookingDetails[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        bookings = parsed;
      }
    }

    // Auto-migration: check if there's a legacy active booking not yet in allBookings
    const legacyRaw = localStorage.getItem(ACTIVE_BOOKING_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const legacy = JSON.parse(legacyRaw) as BookingDetails;
        if (legacy && legacy.id && !bookings.some((b) => b.id === legacy.id)) {
          bookings.unshift(legacy);
          localStorage.setItem(ALL_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
        }
      } catch {
        // ignore legacy parse errors
      }
    }

    return bookings;
  } catch (err) {
    console.warn('Failed to read all bookings from localStorage:', err);
    return [];
  }
}

/**
 * Save a confirmed booking to localStorage.
 * Appends to the all-bookings list and updates the active booking reference.
 */
export function saveBooking(booking: BookingDetails) {
  try {
    const bookings = getAllBookings();
    const index = bookings.findIndex((b) => b.id === booking.id);
    if (index >= 0) {
      bookings[index] = booking;
    } else {
      bookings.unshift(booking);
    }
    localStorage.setItem(ALL_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    // Also save as active booking for backwards compatibility
    localStorage.setItem(ACTIVE_BOOKING_STORAGE_KEY, JSON.stringify(booking));
  } catch (err) {
    console.warn('Failed to save booking to localStorage:', err);
  }
}

/**
 * Save active confirmed booking to localStorage (backwards compatible alias)
 */
export function saveActiveBooking(booking: BookingDetails) {
  saveBooking(booking);
}

/**
 * Retrieve active confirmed booking (most recent from all bookings)
 */
export function getActiveBooking(): BookingDetails | null {
  const all = getAllBookings();
  if (all.length > 0) return all[0];

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
 * Remove or cancel a specific booking by ID
 */
export function deleteBooking(bookingId: string): void {
  try {
    const bookings = getAllBookings().filter((b) => b.id !== bookingId);
    localStorage.setItem(ALL_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    if (bookings.length > 0) {
      localStorage.setItem(ACTIVE_BOOKING_STORAGE_KEY, JSON.stringify(bookings[0]));
    } else {
      localStorage.removeItem(ACTIVE_BOOKING_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Failed to delete booking from localStorage:', err);
  }
}

/**
 * Clear active booking pointer from localStorage
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
