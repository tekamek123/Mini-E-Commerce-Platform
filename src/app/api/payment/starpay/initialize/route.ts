import { NextResponse } from 'next/server';
import crypto from 'crypto';

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
};

type InitializeRequestBody = {
  orderId: string;
  amount: number;
  currency?: string;
  customer: CustomerInfo;
};

export async function POST(request: Request) {
  try {
    const body: InitializeRequestBody = await request.json();
    const { orderId, amount, currency = 'USD', customer } = body;

    // 1. Strict Validation
    if (!orderId || !amount || !customer || !customer.name || !customer.phone) {
      return NextResponse.json(
        {
          error:
            'Missing required parameters: orderId, amount, customer name, and phone are required.',
        },
        { status: 400 },
      );
    }

    // 2. Fetch Merchant Keys from environment (with professional mock fallbacks for local sandbox development)
    const merchantId = process.env.STARPAY_MERCHANT_ID || 'STARPAY_MOCK_MERCHANT_12345';
    const apiKey = process.env.STARPAY_API_KEY || 'starpay_sandbox_key_67890';
    const secretKey = process.env.STARPAY_SECRET_KEY || 'starpay_sandbox_secret_99999';

    // 3. Generate Cryptographic Signature to ensure transaction integrity (Standard Payment Gateway Practice)
    // Formula: SHA256(merchantId + orderId + amount + secretKey)
    const signaturePayload = `${merchantId}${orderId}${amount}${secretKey}`;
    const signature = crypto.createHash('sha256').update(signaturePayload).digest('hex');

    // 4. Construct Callback URLs (Vercel deployment dynamic URLs or local fallback)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const callbackUrl = `${baseUrl}/api/payment/starpay/callback`;
    const returnUrl = `${baseUrl}/checkout?success=true&order_id=${orderId}`;

    // 5. Structure StarPay Gateway payload
    const starPayPayload = {
      merchant_id: merchantId,
      api_key: apiKey,
      order_reference: orderId,
      amount: amount,
      currency: currency,
      signature: signature,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customer: {
        name: customer.name,
        email: customer.email || 'guest@example.com',
        phone: customer.phone,
      },
    };

    console.log('[StarPay] Initializing payment with payload:', {
      merchant_id: starPayPayload.merchant_id,
      order_reference: starPayPayload.order_reference,
      amount: starPayPayload.amount,
      signature: 'HIDDEN',
    });

    // 6. Mock Response: In production, you would fetch StarPay's real API endpoint:
    // const response = await fetch('https://api.starpay.com/v1/checkout/initialize', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    //   body: JSON.stringify(starPayPayload)
    // });
    // const data = await response.json();

    // For Sandbox/Local development: We construct a beautiful interactive mock checkout screen link
    // We append our payload as a base64 encoded URL query param to simulate a real payment window
    const base64Payload = Buffer.from(JSON.stringify(starPayPayload)).toString('base64');
    const mockCheckoutUrl = `/api/payment/starpay/sandbox?payment_token=${base64Payload}`;

    return NextResponse.json({
      success: true,
      message: 'StarPay payment initialized successfully.',
      checkout_url: mockCheckoutUrl,
      payment_reference: `REF_${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
      signature: signature,
    });
  } catch (error: unknown) {
    console.error('[StarPay] Initialization error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Failed to initialize StarPay session.', details: errorMessage },
      { status: 500 },
    );
  }
}
