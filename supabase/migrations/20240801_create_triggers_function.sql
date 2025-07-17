-- Create a function to dynamically create storage triggers for a club
CREATE OR REPLACE FUNCTION create_storage_triggers(bucket_name text, club_id uuid)
RETURNS void AS $$
DECLARE
BEGIN
    -- Create insert trigger
    EXECUTE format('
        CREATE TRIGGER track_storage_insert_%s
        AFTER INSERT ON storage.objects
        FOR EACH ROW
        WHEN (NEW.bucket_id = %L)
        EXECUTE FUNCTION track_storage_usage(%L);
    ', bucket_name, bucket_name, bucket_name);
    
    -- Create delete trigger
    EXECUTE format('
        CREATE TRIGGER track_storage_delete_%s
        AFTER DELETE ON storage.objects
        FOR EACH ROW
        WHEN (OLD.bucket_id = %L)
        EXECUTE FUNCTION track_storage_deletion(%L);
    ', bucket_name, bucket_name, bucket_name);
    
    -- Create RLS policies for the bucket
    EXECUTE format('
        CREATE POLICY "Allow authenticated access to %s" ON storage.objects
        FOR ALL USING (
            bucket_id = %L AND EXISTS (
                SELECT 1 FROM public.club_members
                WHERE club_members.club_id = %L
                AND club_members.user_id = auth.uid()
                AND club_members.is_active = true
            )
        );
    ', bucket_name, bucket_name, club_id);
    
    -- Create a default storage usage entry for the current month
    INSERT INTO public.storage_usage (club_id, month, total_files, total_size_bytes)
    VALUES (
        club_id, 
        date_trunc('month', CURRENT_DATE)::date,
        0,
        0
    )
    ON CONFLICT (club_id, month) DO NOTHING;
    
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT create_storage_triggers('bucket_sportiko_club123', 'club-uuid-here');