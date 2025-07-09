-- Remove the media_library table since we're using Supabase Storage API directly
-- This migration is optional - you can keep the table if you want to track additional metadata

-- First, remove any policies
DROP POLICY IF EXISTS "Allow full access for authenticated users on media_library" ON media_library;

-- Remove the table (commented out - uncomment if you want to remove it completely)
-- DROP TABLE IF EXISTS media_library;

-- Alternative: Keep the table but remove the bucket_name column and indexes
-- ALTER TABLE media_library DROP COLUMN IF EXISTS bucket_name;
-- DROP INDEX IF EXISTS idx_media_library_bucket_name;
-- DROP INDEX IF EXISTS idx_media_library_bucket_category;

-- If you want to keep using the table for additional metadata, 
-- you can modify it to just store references to storage files:
-- ALTER TABLE media_library ADD COLUMN IF NOT EXISTS storage_path TEXT;
-- CREATE INDEX IF NOT EXISTS idx_media_library_storage_path ON media_library (storage_path);