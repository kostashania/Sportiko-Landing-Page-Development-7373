// Follow this setup guide to integrate the Supabase client side SDK in your project:
// https://supabase.com/docs/guides/getting-started/tutorials/with-typescript

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ProvisionClubRequest {
  clubName: string
  ownerEmail: string
  subscriptionStatus?: 'trialing' | 'active' | 'past_due' | 'canceled'
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
        JSON.stringify({ error: 'Only super admins can provision clubs' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { clubName, ownerEmail, subscriptionStatus = 'trialing' } = await req.json() as ProvisionClubRequest
    
    if (!clubName || !ownerEmail) {
      return new Response(
        JSON.stringify({ error: 'Club name and owner email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call the database function to provision the club
    const { data, error } = await supabase.rpc('http_provision_club', {
      club_name: clubName,
      owner_email: ownerEmail,
      subscription_status: subscriptionStatus,
    })

    if (error) {
      console.error('Error provisioning club:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to provision club', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create storage bucket for the club
    // This would typically be handled by the database function, but can also be done here
    const { data: clubData } = await supabase
      .from('clubs')
      .select('storage_bucket')
      .eq('id', data.club_id)
      .single()
    
    if (clubData?.storage_bucket) {
      // Create the bucket
      const { error: storageError } = await supabase
        .storage
        .createBucket(clubData.storage_bucket, {
          public: false,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/*', 'application/pdf', 'video/*']
        })
      
      if (storageError) {
        console.error('Error creating storage bucket:', storageError)
        // Continue anyway, don't fail the whole process
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        club_id: data.club_id,
        owner_id: data.owner_id,
        message: 'Club provisioned successfully'
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