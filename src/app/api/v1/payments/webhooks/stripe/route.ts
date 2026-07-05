import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        bodyText,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const { tierId, billingCycle, userId } = session.metadata || {};
      
      if (userId && tierId) {
        // Upsert user subscription
        const { error: subError } = await supabaseAdmin
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            tier_id: tierId,
            status: 'active',
            billing_cycle: billingCycle,
            gateway: 'stripe',
            gateway_subscription_id: session.subscription as string || session.id,
            gateway_customer_id: session.customer as string || null,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
          
        if (subError) console.error('Error updating subscription:', subError);

        // Insert payment history
        const { error: payError } = await supabaseAdmin
          .from('payment_history')
          .insert({
            user_id: userId,
            amount_paid: (session.amount_total || 0) / 100, // cents to USD
            currency: (session.currency || 'USD').toUpperCase(),
            status: 'success',
            gateway: 'stripe',
            gateway_payment_id: session.payment_intent as string || session.id,
            gateway_order_id: session.id,
          });
          
        if (payError) console.error('Error inserting payment history:', payError);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Stripe Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
