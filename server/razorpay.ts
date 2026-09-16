import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Returns a configured Razorpay client instance.
 * Throws an error if API credentials are not provided in environment variables.
 */
export function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error: any = new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    error.statusCode = 401;
    throw error;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export interface CreateOrderParams {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  order_id: string;
  amount: number;
  currency: string;
}

/**
 * Creates a new Razorpay order.
 * Validates minimum amount >= 100 paise.
 */
export async function createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  const { amount, currency = 'INR', receipt, notes } = params;

  if (typeof amount !== 'number' || isNaN(amount)) {
    const error: any = new Error('Amount must be a valid number in paise');
    error.statusCode = 400;
    throw error;
  }

  if (amount < 100) {
    const error: any = new Error('Minimum amount must be at least 100 paise (₹1.00)');
    error.statusCode = 400;
    throw error;
  }

  const razorpay = getRazorpayClient();
  const orderOptions = {
    amount: Math.round(amount),
    currency: currency.toUpperCase(),
    receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    notes: notes || {},
  };

  try {
    const order = await razorpay.orders.create(orderOptions);
    return {
      order_id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
    };
  } catch (err: any) {
    if (err.statusCode === 401 || (err.error && err.error.code === 'BAD_REQUEST_ERROR' && err.statusCode === 401)) {
      const authErr: any = new Error('Razorpay authentication failed. Invalid API credentials.');
      authErr.statusCode = 401;
      throw authErr;
    }
    const apiErr: any = new Error(err.error?.description || err.message || 'Failed to create Razorpay order');
    apiErr.statusCode = err.statusCode || 500;
    throw apiErr;
  }
}

/**
 * Verifies Razorpay payment signature using HMAC-SHA256.
 * Compares computed HMAC of `${order_id}|${payment_id}` with provided signature.
 */
export function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    const error: any = new Error('RAZORPAY_KEY_SECRET is not configured');
    error.statusCode = 500;
    throw error;
  }

  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

/**
 * Fetches payment details from Razorpay API to verify status and retrieve payment information.
 */
export async function fetchPaymentDetails(paymentId: string) {
  const razorpay = getRazorpayClient();
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (err: any) {
    if (err.statusCode === 404 || (err.error && err.error.code === 'BAD_REQUEST_ERROR')) {
      const notFoundErr: any = new Error(`Payment ID "${paymentId}" not found in Razorpay records.`);
      notFoundErr.statusCode = 404;
      throw notFoundErr;
    }
    const apiErr: any = new Error(err.error?.description || err.message || 'Failed to fetch payment from Razorpay');
    apiErr.statusCode = err.statusCode || 500;
    throw apiErr;
  }
}
