import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    return NextResponse.json({
      id: 'mock-id-pro',
      tierId: 'pro',
      status: 'active',
      currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      cancelAtPeriodEnd: false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
