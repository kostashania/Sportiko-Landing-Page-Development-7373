-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";
CREATE EXTENSION IF NOT EXISTS "pgjwt";

-- Create enum types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'member');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');
CREATE TYPE app_module AS ENUM ('academy', 'members', 'profiles', 'fin', 'saas');

-- Create the clubs table (top level tenants)
CREATE TABLE public.clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    schema_name TEXT UNIQUE NOT NULL,
    storage_bucket TEXT UNIQUE NOT NULL,
    subscription_status subscription_status DEFAULT 'trialing',
    subscription_end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create club members table (maps users to clubs)
CREATE TABLE public.club_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(club_id, user_id)
);

-- Create club apps table (tracks enabled modules per club)
CREATE TABLE public.club_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    app_type app_module NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(club_id, app_type)
);

-- Create storage usage tracking
CREATE TABLE public.storage_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    total_files BIGINT DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(club_id, month)
);

-- Create function to generate schema name
CREATE OR REPLACE FUNCTION generate_schema_name(club_name text)
RETURNS text AS $$
BEGIN
    RETURN 'sportiko_club' || 
           LOWER(
               REGEXP_REPLACE(
                   REGEXP_REPLACE(club_name, '[^a-zA-Z0-9]', ''),
                   '(.{10}).*',
                   '\1'
               )
           ) || 
           SUBSTRING(MD5(RANDOM()::text), 1, 4);
END;
$$ LANGUAGE plpgsql;

-- Create function to initialize club schema
CREATE OR REPLACE FUNCTION initialize_club_schema(schema_name text)
RETURNS void AS $$
BEGIN
    -- Create the schema
    EXECUTE 'CREATE SCHEMA IF NOT EXISTS ' || quote_ident(schema_name);
    
    -- Create club-specific tables in the new schema
    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name) || '.players (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id),
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        date_of_birth DATE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )';
    
    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name) || '.subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        player_id UUID REFERENCES ' || quote_ident(schema_name) || '.players(id),
        plan_name TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status subscription_status DEFAULT ''active'',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )';
    
    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name) || '.invoices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        subscription_id UUID REFERENCES ' || quote_ident(schema_name) || '.subscriptions(id),
        amount DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL,
        due_date DATE NOT NULL,
        paid_date DATE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )';
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers
CREATE TRIGGER update_clubs_timestamp
    BEFORE UPDATE ON public.clubs
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_club_members_timestamp
    BEFORE UPDATE ON public.club_members
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_club_apps_timestamp
    BEFORE UPDATE ON public.club_apps
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_storage_usage_timestamp
    BEFORE UPDATE ON public.storage_usage
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Enable Row Level Security
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Clubs table policies
CREATE POLICY "Users can view their clubs"
    ON public.clubs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.club_members
            WHERE club_members.club_id = clubs.id
            AND club_members.user_id = auth.uid()
            AND club_members.is_active = true
        )
    );

CREATE POLICY "Only super admins can insert clubs"
    ON public.clubs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.is_super_admin = true
        )
    );

CREATE POLICY "Only club owners can update their club"
    ON public.clubs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.club_members
            WHERE club_members.club_id = clubs.id
            AND club_members.user_id = auth.uid()
            AND club_members.role = 'owner'
            AND club_members.is_active = true
        )
    );

-- Club members policies
CREATE POLICY "Users can view members of their clubs"
    ON public.club_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.club_members AS my_membership
            WHERE my_membership.club_id = club_members.club_id
            AND my_membership.user_id = auth.uid()
            AND my_membership.is_active = true
        )
    );

CREATE POLICY "Club owners and admins can manage members"
    ON public.club_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.club_members AS my_role
            WHERE my_role.club_id = club_members.club_id
            AND my_role.user_id = auth.uid()
            AND my_role.role IN ('owner', 'admin')
            AND my_role.is_active = true
        )
    );

-- Club apps policies
CREATE POLICY "Users can view apps of their clubs"
    ON public.club_apps
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.club_members
            WHERE club_members.club_id = club_apps.club_id
            AND club_members.user_id = auth.uid()
            AND club_members.is_active = true
        )
    );

CREATE POLICY "Only club owners can manage apps"
    ON public.club_apps
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.club_members
            WHERE club_members.club_id = club_apps.club_id
            AND club_members.user_id = auth.uid()
            AND club_members.role = 'owner'
            AND club_members.is_active = true
        )
    );

-- Storage usage policies
CREATE POLICY "Users can view storage usage of their clubs"
    ON public.storage_usage
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.club_members
            WHERE club_members.club_id = storage_usage.club_id
            AND club_members.user_id = auth.uid()
            AND club_members.is_active = true
        )
    );

-- Function to create a new club with all necessary setup
CREATE OR REPLACE FUNCTION create_club(
    club_name text,
    owner_id uuid,
    subscription_status subscription_status DEFAULT 'trialing'::subscription_status
)
RETURNS uuid AS $$
DECLARE
    new_club_id uuid;
    schema_name text;
    bucket_name text;
BEGIN
    -- Generate schema and bucket names
    schema_name := generate_schema_name(club_name);
    bucket_name := 'bucket_' || schema_name;
    
    -- Create club record
    INSERT INTO public.clubs (name, slug, schema_name, storage_bucket, subscription_status)
    VALUES (
        club_name,
        LOWER(REGEXP_REPLACE(club_name, '[^a-zA-Z0-9]', '-')),
        schema_name,
        bucket_name,
        subscription_status
    )
    RETURNING id INTO new_club_id;
    
    -- Add owner to club_members
    INSERT INTO public.club_members (club_id, user_id, role)
    VALUES (new_club_id, owner_id, 'owner');
    
    -- Initialize club schema
    PERFORM initialize_club_schema(schema_name);
    
    -- Create storage bucket (this would typically be handled by the application)
    -- Initialize default apps (disabled by default)
    INSERT INTO public.club_apps (club_id, app_type, is_enabled)
    SELECT new_club_id, app_type, false
    FROM unnest(enum_range(NULL::app_module)) app_type;
    
    RETURN new_club_id;
END;
$$ LANGUAGE plpgsql;