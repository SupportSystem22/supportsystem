import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error: any = new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables');
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
  };
}

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured');
  }

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
