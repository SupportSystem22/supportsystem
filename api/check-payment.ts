import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchPaymentDetails } from '../server/razorpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
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
    const payment_id = req.body?.payment_id?.trim();
    if (!payment_id) {
      return res.status(400).json({ success: false, error: 'payment_id is required' });
    }

    const payment: any = await fetchPaymentDetails(payment_id);

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return res.status(400).json({
        success: false,
        error: `Payment ${payment_id} status is "${payment.status}", not captured.`,
      });
    }

    return res.status(200).json({
      success: true,
      payment_id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      email: payment.email,
      contact: payment.contact,
      notes: payment.notes,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to check payment status',
    });
  }
}
