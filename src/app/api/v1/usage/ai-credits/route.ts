import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const userId = '11111111-1111-1111-1111-111111111111'; // mock auth
    const today = new Date().toISOString().split('T')[0];

    // Get user tier
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('tier_id')
      .eq('user_id', userId)
      .maybeSingle();

    const tierId = subscription?.tier_id || 'free';

    // Get tier limits
    const { data: limits } = await supabaseAdmin
      .from('tier_limits')
      .select('ai_requests_per_day')
      .eq('tier_id', tierId)
      .single();

    const limit = limits?.ai_requests_per_day || 1;

    // Get today's usage
    const { data: usage } = await supabaseAdmin
      .from('daily_usage')
      .select('ai_requests_used')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    const used = usage?.ai_requests_used || 0;
    const remaining = limit === -1 ? -1 : Math.max(0, limit - used);

    return NextResponse.json({
      used,
      limit: limit === -1 ? null : limit,
      remaining: remaining === -1 ? null : remaining
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
