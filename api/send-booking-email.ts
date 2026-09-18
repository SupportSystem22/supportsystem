import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendBookingNotificationEmails, BookingEmailPayload } from './_email.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body as BookingEmailPayload;

    if (!payload || !payload.customerEmail || !payload.sessionDate || !payload.sessionTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields for email notification (customerEmail, sessionDate, sessionTime)',
      });
    }

    const result = await sendBookingNotificationEmails(payload);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in send-booking-email handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while processing email notification',
    });
  }
}
