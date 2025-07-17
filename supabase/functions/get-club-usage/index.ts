// Follow this setup guide to integrate the Supabase client side SDK in your project:
// https://supabase.com/docs/guides/getting-started/tutorials/with-typescript

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // This is needed to enable CORS for browser clients
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
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

    // Get the club ID from query parameters
    const url = new URL(req.url)
    const clubId = url.searchParams.get('clubId')
    
    if (!clubId) {
      return new Response(
        JSON.stringify({ error: 'Club ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify user has permission to view this club's usage
    const { data: memberCheck, error: memberError } = await supabase
      .from('club_members')
      .select('role')
      .eq('club_id', clubId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()
    
    if (memberError || !memberCheck) {
      return new Response(
        JSON.stringify({ error: 'You do not have permission to view this club\'s usage' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call the database function to get club usage
    const { data, error } = await supabase.rpc('http_get_club_usage', {
      club_id: clubId
    })

    if (error) {
      console.error('Error getting club usage:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to get club usage', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        usage: data,
        club_id: clubId
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