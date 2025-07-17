-- Edge function to provision a new club (pseudo-code, actual implementation would be in TypeScript)
CREATE OR REPLACE FUNCTION http_provision_club(club_name text, owner_email text)
RETURNS json AS $$
DECLARE
    owner_id uuid;
    new_club_id uuid;
BEGIN
    -- Create user if doesn't exist
    INSERT INTO auth.users (email)
    VALUES (owner_email)
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO owner_id;
    
    -- Create club and associated resources
    SELECT create_club(club_name, owner_id) INTO new_club_id;
    
    -- Return club details
    RETURN json_build_object(
        'club_id', new_club_id,
        'owner_id', owner_id,
        'status', 'success'
    );
END;
$$ LANGUAGE plpgsql;

-- Edge function to enable/disable club apps
CREATE OR REPLACE FUNCTION http_toggle_club_app(
    club_id uuid,
    app_type app_module,
    enabled boolean,
    settings jsonb DEFAULT '{}'
)
RETURNS json AS $$
DECLARE
    result record;
BEGIN
    UPDATE public.club_apps
    SET is_enabled = enabled,
        settings = COALESCE(settings, '{}')
    WHERE club_id = club_id AND app_type = app_type
    RETURNING * INTO result;
    
    RETURN json_build_object(
        'success', true,
        'app', result
    );
END;
$$ LANGUAGE plpgsql;

-- Edge function to check club usage/limits
CREATE OR REPLACE FUNCTION http_get_club_usage(club_id uuid)
RETURNS json AS $$
DECLARE
    storage_stats record;
    app_stats record;
BEGIN
    SELECT 
        SUM(total_files) as files,
        SUM(total_size_bytes) as size
    INTO storage_stats
    FROM public.storage_usage
    WHERE club_id = club_id
    AND month = date_trunc('month', CURRENT_DATE)::date;
    
    SELECT 
        COUNT(*) as total_apps,
        COUNT(*) FILTER (WHERE is_enabled) as enabled_apps
    INTO app_stats
    FROM public.club_apps
    WHERE club_id = club_id;
    
    RETURN json_build_object(
        'storage', json_build_object(
            'files', COALESCE(storage_stats.files, 0),
            'size_bytes', COALESCE(storage_stats.size, 0)
        ),
        'apps', json_build_object(
            'total', app_stats.total_apps,
            'enabled', app_stats.enabled_apps
        )
    );
END;
$$ LANGUAGE plpgsql;