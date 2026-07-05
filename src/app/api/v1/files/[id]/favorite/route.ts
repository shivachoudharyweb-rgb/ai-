import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { is_favorite } = await req.json();
    const { id: fileId } = await params;

    // In a real app, get user ID from auth token
    const userId = '11111111-1111-1111-1111-111111111111';

    // Verify the file belongs to the user
    const { data: existingFile, error: fetchError } = await supabaseAdmin
      .from('user_files')
      .select('id')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingFile) {
      return NextResponse.json({ error: 'File not found or unauthorized' }, { status: 404 });
    }

    // Update the favorite status
    const { data, error } = await supabaseAdmin
      .from('user_files')
      .update({ is_favorite })
      .eq('id', fileId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
