-- Create the storage bucket for media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for authenticated users
INSERT INTO storage.policies (name, bucket_id, definition, owner) 
VALUES 
  ('Media Storage Policy - Auth Users', 'media', 
   '(bucket_id = ''media''::text AND auth.role() = ''authenticated''::text)', null)
ON CONFLICT (name, bucket_id, definition) DO NOTHING;