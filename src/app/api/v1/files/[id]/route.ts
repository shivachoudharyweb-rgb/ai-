import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: fileId } = await params;

    // In a real app, get user ID from auth token
    const userId = '11111111-1111-1111-1111-111111111111';

    // Verify the file belongs to the user and get storage path
    const { data: existingFile, error: fetchError } = await supabaseAdmin
      .from('user_files')
      .select('id, storage_path')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingFile) {
      return NextResponse.json({ error: 'File not found or unauthorized' }, { status: 404 });
    }

    // Delete from Database (The Postgres trigger handles deleting the physical file from storage automatically)
    const { error: dbError } = await supabaseAdmin
      .from('user_files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
