-- Create admin_users table to track super admins
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Super admins can view admin_users"
    ON public.admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users AS my_admin
            WHERE my_admin.user_id = auth.uid()
            AND my_admin.is_super_admin = true
        )
    );

-- Create trigger for updating timestamps
CREATE TRIGGER update_admin_users_timestamp
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();