import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

type CallbackRequestBody = {
  order_reference: string;
  status: 'success' | 'failed';
  payment_ref: string;
};

export async function POST(request: Request) {
  try {
    const body: CallbackRequestBody = await request.json();
    const { order_reference: orderId, status, payment_ref: paymentRef } = body;

    console.log(
      `[StarPay Callback] Webhook received for order: ${orderId}, status: ${status}, reference: ${paymentRef}`,
    );

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required webhook arguments' }, { status: 400 });
    }

    // 1. Initialize Supabase client
    const supabase = createClient();

    // 2. Fetch current order status
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('id, status, total_amount')
      .eq('id', orderId)
      .single();

    if (orderFetchError || !order) {
      console.error(`[StarPay Callback] Order not found: ${orderId}`, orderFetchError);
      return NextResponse.json({ error: 'Order not found in records' }, { status: 404 });
    }

    // 3. Process according to payment status
    if (status === 'success') {
      // Transition order status to 'processing' (represents paid successfully & preparing for shipment)
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId);

      if (updateError) {
        console.error(
          `[StarPay Callback] Failed to update order status for: ${orderId}`,
          updateError,
        );
        return NextResponse.json({ error: 'Failed to update order in records' }, { status: 500 });
      }

      console.log(
        `[StarPay Callback] Successfully transitioned order ${orderId} status to 'processing'`,
      );
      return NextResponse.json({
        success: true,
        message: 'Order successfully flagged as processing.',
        order_id: orderId,
        payment_reference: paymentRef,
      });
    } else {
      // Transition order status to 'cancelled' or log it
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (updateError) {
        console.error(
          `[StarPay Callback] Failed to cancel order status for: ${orderId}`,
          updateError,
        );
      }

      console.log(`[StarPay Callback] Order ${orderId} was cancelled/declined.`);
      return NextResponse.json({
        success: false,
        message: 'Order has been flagged as cancelled.',
        order_id: orderId,
      });
    }
  } catch (error: unknown) {
    console.error('[StarPay Callback] Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Webhook Server Error';
    return NextResponse.json(
      { error: 'Webhook processing error', details: errorMessage },
      { status: 500 },
    );
  }
}
