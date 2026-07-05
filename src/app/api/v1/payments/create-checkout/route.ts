import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { PRICING_TIERS } from '@/lib/pricing-data';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any, // fallback for types
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tierId, billingCycle, currency } = body;

    if (!tierId || !billingCycle || !currency) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Since we don't have real auth yet, we'll mock a user_id
    // In a real app, you'd verify the JWT and get the user ID from Supabase Auth
    const userId = '11111111-1111-1111-1111-111111111111';

    const tier = PRICING_TIERS.find((t) => t.id === tierId);
    if (!tier) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Determine amount
    let amount = 0;
    if (currency === 'INR') {
      amount = billingCycle === 'yearly' ? tier.yearlyPrice! : tier.monthlyPrice!;
    } else {
      // Rough conversion for USD if not natively supported in PRICING_TIERS
      amount = billingCycle === 'yearly' ? Math.round(tier.yearlyPrice! / 80) : Math.round(tier.monthlyPrice! / 80);
    }

    // If Free or Enterprise, shouldn't hit checkout typically
    if (amount === 0) {
      return NextResponse.json({ error: 'Cannot checkout free/custom tier' }, { status: 400 });
    }

    if (currency === 'INR') {
      // Create Razorpay Order
      // Razorpay amount is in paise (amount * 100)
      const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          tierId,
          billingCycle,
          userId,
        },
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        provider: 'razorpay'
      });
    } else {
      // Create Stripe Checkout Session
      // Stripe amount is in cents
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `AI Office Suite - ${tier.name} Plan (${billingCycle})`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment', // use 'subscription' if implementing Stripe Billing
        success_url: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'}/checkout/cancel`,
        client_reference_id: userId,
        metadata: {
          tierId,
          billingCycle,
          userId,
        },
      });

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
        provider: 'stripe'
      });
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
