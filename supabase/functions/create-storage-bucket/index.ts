// Follow this setup guide to integrate the Supabase client side SDK in your project:
// https://supabase.com/docs/guides/getting-started/tutorials/with-typescript

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface CreateBucketRequest {
  bucketName: string
}

serve(async (req) => {
  // This is needed to enable CORS for browser clients
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify JWT to ensure the user is authorized
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is a super admin (you'd need to implement this check)
    const { data: adminCheck, error: adminError } = await supabase
      .from('admin_users')
      .select('is_super_admin')
      .eq('user_id', user.id)
      .single()
    
    if (adminError || !adminCheck?.is_super_admin) {
      return new Response(
        JSON.stringify({ error: 'Only super admins can create storage buckets' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { bucketName } = await req.json() as CreateBucketRequest
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/*', 'application/pdf', 'video/*']
    })

    if (error) {
      console.error('Error creating bucket:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create bucket', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create RLS policies for the bucket
    // Note: This would typically be handled via migrations, but we include it here for completeness
    try {
      // Get club ID from bucket name (assuming format bucket_sportiko_club*)
      const { data: clubData } = await supabase
        .from('clubs')
        .select('id')
        .eq('storage_bucket', bucketName)
        .single()
      
      if (clubData?.id) {
        // Create trigger for storage usage tracking
        await supabase.rpc('create_storage_triggers', {
          bucket_name: bucketName,
          club_id: clubData.id
        })
      }
    } catch (policyError) {
      console.error('Error setting up bucket policies:', policyError)
      // Continue anyway, don't fail the whole process
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        bucket: bucketName,
        message: 'Storage bucket created successfully'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})