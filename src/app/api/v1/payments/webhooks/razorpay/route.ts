import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(bodyText)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload.payment.entity;
      const notes = paymentEntity.notes || {};
      const { tierId, billingCycle, userId } = notes;
      
      if (userId && tierId) {
        // Upsert user subscription
        const { error: subError } = await supabaseAdmin
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            tier_id: tierId,
            status: 'active',
            billing_cycle: billingCycle,
            gateway: 'razorpay',
            gateway_subscription_id: paymentEntity.order_id,
            gateway_customer_id: paymentEntity.customer_id || null,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
          
        if (subError) console.error('Error updating subscription:', subError);

        // Insert payment history
        const { error: payError } = await supabaseAdmin
          .from('payment_history')
          .insert({
            user_id: userId,
            amount_paid: paymentEntity.amount / 100, // paise to INR
            currency: paymentEntity.currency,
            status: 'success',
            gateway: 'razorpay',
            gateway_payment_id: paymentEntity.id,
            gateway_order_id: paymentEntity.order_id,
          });
          
        if (payError) console.error('Error inserting payment history:', payError);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
