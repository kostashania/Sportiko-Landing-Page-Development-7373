-- Create function to track storage usage
CREATE OR REPLACE FUNCTION track_storage_usage()
RETURNS trigger AS $$
DECLARE
    club_id uuid;
    current_month date;
BEGIN
    -- Extract club_id from bucket name (assuming format bucket_sportiko_club*)
    SELECT id INTO club_id
    FROM public.clubs
    WHERE storage_bucket = TG_ARGV[0];
    
    IF club_id IS NULL THEN
        RETURN NULL;
    END IF;
    
    current_month := date_trunc('month', CURRENT_DATE)::date;
    
    -- Update storage usage
    INSERT INTO public.storage_usage (club_id, month, total_files, total_size_bytes)
    VALUES (club_id, current_month, 1, NEW.size)
    ON CONFLICT (club_id, month)
    DO UPDATE SET
        total_files = storage_usage.total_files + 1,
        total_size_bytes = storage_usage.total_size_bytes + NEW.size;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to track storage deletion
CREATE OR REPLACE FUNCTION track_storage_deletion()
RETURNS trigger AS $$
DECLARE
    club_id uuid;
    current_month date;
BEGIN
    -- Extract club_id from bucket name
    SELECT id INTO club_id
    FROM public.clubs
    WHERE storage_bucket = TG_ARGV[0];
    
    IF club_id IS NULL THEN
        RETURN OLD;
    END IF;
    
    current_month := date_trunc('month', CURRENT_DATE)::date;
    
    -- Update storage usage
    UPDATE public.storage_usage
    SET total_files = total_files - 1,
        total_size_bytes = total_size_bytes - OLD.size
    WHERE club_id = club_id AND month = current_month;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Note: Triggers for storage would be created dynamically per bucket
-- Example of how to create triggers for a specific club's bucket:
/*
CREATE TRIGGER track_storage_insert
    AFTER INSERT ON storage.objects
    FOR EACH ROW
    WHEN (NEW.bucket_id = 'bucket_sportiko_club123')
    EXECUTE FUNCTION track_storage_usage('bucket_sportiko_club123');

CREATE TRIGGER track_storage_delete
    AFTER DELETE ON storage.objects
    FOR EACH ROW
    WHEN (OLD.bucket_id = 'bucket_sportiko_club123')
    EXECUTE FUNCTION track_storage_deletion('bucket_sportiko_club123');
*/