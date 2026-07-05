import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isFavorite = searchParams.get('is_favorite') === 'true';
    
    // In a real app, get user ID from auth token
    const userId = '11111111-1111-1111-1111-111111111111';

    let query = supabaseAdmin
      .from('user_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (isFavorite) {
      query = query.eq('is_favorite', true);
    }

    const { data: files, error } = await query;

    if (error) {
      throw error;
    }

    // Add public URLs to the response
    const filesWithUrls = files.map(file => {
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('user_files')
        .getPublicUrl(file.storage_path);
      return { ...file, url: publicUrl };
    });

    return NextResponse.json(filesWithUrls);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const toolUsed = formData.get('tool_used') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // In a real app, get user ID from auth token
    const userId = '11111111-1111-1111-1111-111111111111';
    
    // Generate unique storage path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storagePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const buffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from('user_files')
      .upload(storagePath, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Insert record into user_files table
    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from('user_files')
      .insert({
        user_id: userId,
        filename: file.name,
        storage_path: storagePath,
        file_type: fileExt || 'unknown',
        tool_used: toolUsed || 'unknown',
        size_bytes: file.size,
        is_favorite: false
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('user_files')
      .getPublicUrl(storagePath);

    return NextResponse.json({ 
      ...fileRecord, 
      url: publicUrl 
    });

  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
