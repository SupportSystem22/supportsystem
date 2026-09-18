import { BookingDetails } from '../types';

export async function sendBookingEmailNotification(
  booking: BookingDetails,
  paymentId: string,
  orderId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      bookingId: booking.id,
      customerName: booking.fullName,
      customerEmail: booking.email,
      customerPhone: booking.phone,
      customerAge: booking.age,
      customerGender: booking.gender,
      preferredLanguage: booking.preferredLanguage,
      sessionMode: booking.sessionMode,
      packageTitle: booking.packageType.title,
      packageDuration: booking.packageType.duration,
      packagePrice: booking.packageType.price,
      sessionDate: booking.preferredDate,
      sessionTime: booking.preferredTime,
      meetingLink: booking.zoomJoinUrl || booking.meetingLink,
      zoomMeetingId: booking.zoomMeetingId,
      zoomPasscode: booking.zoomPasscode,
      reasons: booking.reasons,
      notes: booking.notes,
      paymentId,
      orderId,
    };

    const response = await fetch('/api/send-booking-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn('Booking email dispatch warning:', data.error || response.statusText);
      return { success: false, error: data.error };
    }

    const data = await response.json();
    return { success: true };
  } catch (err: any) {
    console.warn('Unable to send booking email notification:', err);
    return { success: false, error: err.message };
  }
}
