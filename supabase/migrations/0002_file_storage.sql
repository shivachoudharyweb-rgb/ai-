-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_files', 'user_files', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for user_files
CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'user_files' AND auth.uid() = owner);

CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'user_files' AND auth.uid() = owner);

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'user_files' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'user_files' AND auth.uid() = owner);

-- Create user_files table to track metadata and favorites
CREATE TABLE IF NOT EXISTS user_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  filename VARCHAR(255) NOT NULL,
  storage_path TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'pdf', 'image', 'docx', etc.
  tool_used VARCHAR(100), -- Which tool generated this file
  size_bytes BIGINT NOT NULL DEFAULT 0,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster queries on user's files and favorites
CREATE INDEX IF NOT EXISTS user_files_user_id_idx ON user_files(user_id);
CREATE INDEX IF NOT EXISTS user_files_is_favorite_idx ON user_files(is_favorite);

-- Set up RLS on user_files table
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own file records" ON user_files
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file records" ON user_files
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file records" ON user_files
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file records" ON user_files
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
