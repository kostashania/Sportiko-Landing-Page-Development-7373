// Follow this setup guide to integrate the Supabase client side SDK in your project:
// https://supabase.com/docs/guides/getting-started/tutorials/with-typescript

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ToggleClubAppRequest {
  clubId: string
  appType: 'academy' | 'members' | 'profiles' | 'fin' | 'saas'
  enabled: boolean
  settings?: Record<string, unknown>
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

    // Parse request body
    const { clubId, appType, enabled, settings = {} } = await req.json() as ToggleClubAppRequest
    
    if (!clubId || !appType) {
      return new Response(
        JSON.stringify({ error: 'Club ID and app type are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify user has permission to modify this club
    const { data: memberCheck, error: memberError } = await supabase
      .from('club_members')
      .select('role')
      .eq('club_id', clubId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()
    
    if (memberError || !memberCheck || memberCheck.role !== 'owner') {
      return new Response(
        JSON.stringify({ error: 'Only club owners can manage apps' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call the database function to toggle the app
    const { data, error } = await supabase.rpc('http_toggle_club_app', {
      club_id: clubId,
      app_type: appType,
      enabled: enabled,
      settings: settings
    })

    if (error) {
      console.error('Error toggling club app:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to toggle club app', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        app: data.app,
        message: `App ${appType} ${enabled ? 'enabled' : 'disabled'} successfully`
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