import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createOrder, verifySignature, fetchPaymentDetails } from './razorpay';
import { sendBookingNotificationEmails } from './email';

dotenv.config();

export const app = express();

app.use(express.json());

// Enable CORS for API routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    razorpayKeyConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
    razorpaySecretConfigured: Boolean(process.env.RAZORPAY_KEY_SECRET),
  });
});

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request body: { amount (paise), currency, receipt, notes }
 * Return: { order_id, amount, currency }
 * Minimum amount: 100 paise
 */
app.post('/api/create-order', async (req: Request, res: Response) => {
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
});

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment
 * Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
app.post('/api/verify-payment', (req: Request, res: Response) => {
  try {
    const razorpay_order_id = req.body?.razorpay_order_id || req.body?.order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id || req.body?.payment_id;
    const razorpay_signature = req.body?.razorpay_signature || req.body?.signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields: razorpay_order_id, razorpay_payment_id, razorpay_signature',
      });
    }

    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment signature verified successfully.',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Error occurred during payment verification',
    });
  }
});

/**
 * RECOVERY ENDPOINT: Fetch / verify a payment ID directly with Razorpay
 * Allows user to recover their session if page was refreshed or closed.
 * Endpoint: POST /api/check-payment
 * Request body: { payment_id }
 */
app.post('/api/check-payment', async (req: Request, res: Response) => {
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
});

/**
 * EMAIL NOTIFICATION ENDPOINT: Send Mentee confirmation and Mentor notification
 * Endpoint: POST /api/send-booking-email
 */
app.post('/api/send-booking-email', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload || !payload.customerEmail || !payload.sessionDate || !payload.sessionTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields for email notification (customerEmail, sessionDate, sessionTime)',
      });
    }

    const result = await sendBookingNotificationEmails(payload);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/send-booking-email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send booking notification email',
    });
  }
});

const PORT = process.env.PORT || 5001;

// If started directly, listen on port
if (process.env.NODE_ENV !== 'test' && !process.env.VITE_EMBEDDED) {
  // Only start listening if run directly as script
  const isDirectRun = process.argv[1] && (process.argv[1].endsWith('index.ts') || process.argv[1].endsWith('server/index.js'));
  if (isDirectRun) {
    app.listen(PORT, () => {
      console.log(`Razorpay backend server running on http://localhost:${PORT}`);
    });
  }
}

export default app;
