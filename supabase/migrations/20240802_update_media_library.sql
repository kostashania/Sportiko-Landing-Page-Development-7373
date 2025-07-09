-- Update media_library table to include bucket_name for multi-app support
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS bucket_name TEXT;

-- Update existing records to use the default bucket name
UPDATE media_library 
SET bucket_name = 'media-sportiko' 
WHERE bucket_name IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_media_library_bucket_name 
ON media_library (bucket_name);

-- Create index for bucket_name + category queries
CREATE INDEX IF NOT EXISTS idx_media_library_bucket_category 
ON media_library (bucket_name, category);