import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createOrder } from './_razorpay.js';

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
    const { amount, currency = 'INR', receipt, notes } = req.body || {};

    if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({
        error: 'Amount (in paise) is required and must be a number.',
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        error: 'Validation error: Minimum amount must be at least 100 paise (₹1.00).',
      });
    }

    const order = await createOrder({
      amount,
      currency,
      receipt,
      notes,
    });

    return res.status(200).json(order);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || 'Failed to create Razorpay order',
    });
  }
}
