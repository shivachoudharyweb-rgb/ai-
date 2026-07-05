-- Enable the pg_cron extension (requires superuser privileges, available by default in Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Create a function that deletes the physical file from Supabase storage when the DB record is deleted
CREATE OR REPLACE FUNCTION public.handle_deleted_user_file()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the physical file from the storage bucket
  -- This ensures that whether a file is deleted manually or via cron, the storage is cleaned up
  DELETE FROM storage.objects 
  WHERE bucket_id = 'user_files' AND name = OLD.storage_path;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on the user_files table
DROP TRIGGER IF EXISTS tr_delete_storage_object ON public.user_files;
CREATE TRIGGER tr_delete_storage_object
AFTER DELETE ON public.user_files
FOR EACH ROW
EXECUTE FUNCTION public.handle_deleted_user_file();

-- 3. Schedule the automatic deletion job
-- This will run every hour (on the hour) and delete any records older than 24 hours.
-- The trigger created above will ensure the physical files are also removed from storage.
SELECT cron.schedule(
  'delete-old-files-every-hour', -- name of the cron job
  '0 * * * *',                   -- cron schedule (every hour at minute 0)
  $$
    DELETE FROM public.user_files 
    WHERE created_at < NOW() - INTERVAL '24 hours';
  $$
);
