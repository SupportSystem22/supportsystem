import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Resolves Razorpay credentials conditionally based on RAZORPAY_MODE and available environment variables.
 * Prioritizes PROD keys when available unless RAZORPAY_MODE is set to 'test'.
 */
export function getRazorpayCredentials(): { keyId: string; keySecret: string; mode: 'live' | 'test' } {
  const explicitMode = (process.env.RAZORPAY_MODE || '').toLowerCase();

  // If explicitly requested test mode
  if (explicitMode === 'test') {
    const keyId = process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
    if (keyId && keySecret) {
      return { keyId, keySecret, mode: 'test' };
    }
  }

  // 1. Check for PROD/LIVE keys
  const prodKeyId = process.env.RAZORPAY_PROD_KEY_ID || process.env.RAZORPAY_LIVE_KEY_ID;
  const prodKeySecret = process.env.RAZORPAY_PROD_KEY_SECRET || process.env.RAZORPAY_LIVE_KEY_SECRET;

  if (prodKeyId && prodKeySecret) {
    return { keyId: prodKeyId, keySecret: prodKeySecret, mode: 'live' };
  }

  // 2. Check for standard RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
  const generalKeyId = process.env.RAZORPAY_KEY_ID;
  const generalKeySecret = process.env.RAZORPAY_KEY_SECRET;
  if (generalKeyId && generalKeySecret) {
    return {
      keyId: generalKeyId,
      keySecret: generalKeySecret,
      mode: generalKeyId.startsWith('rzp_live_') ? 'live' : 'test',
    };
  }

  // 3. Check for TEST keys
  const testKeyId = process.env.RAZORPAY_TEST_KEY_ID;
  const testKeySecret = process.env.RAZORPAY_TEST_KEY_SECRET;
  if (testKeyId && testKeySecret) {
    return { keyId: testKeyId, keySecret: testKeySecret, mode: 'test' };
  }

  const error: any = new Error(
    'Razorpay credentials not configured. Please set RAZORPAY_PROD_KEY_ID & RAZORPAY_PROD_KEY_SECRET or RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in environment variables'
  );
  error.statusCode = 401;
  throw error;
}

export function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayCredentials();

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
  key_id: string;
}

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

  const { keyId } = getRazorpayCredentials();
  const razorpay = getRazorpayClient();
  const orderOptions = {
    amount,
    currency,
    receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    notes: notes || {},
  };

  const order = await razorpay.orders.create(orderOptions);

  return {
    order_id: order.id,
    amount: typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount,
    currency: order.currency,
    key_id: keyId,
  };
}

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const { keySecret } = getRazorpayCredentials();

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
}

export async function fetchPaymentDetails(paymentId: string) {
  const razorpay = getRazorpayClient();
  return await razorpay.payments.fetch(paymentId);
}
