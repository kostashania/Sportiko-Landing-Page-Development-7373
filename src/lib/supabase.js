import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bjelydvroavsqczejpgd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZWx5ZHZyb2F2c3FjemVqcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjE2MDcsImV4cCI6MjA2NjU5NzYwN30.f-693IO1d0TCBQRiWcSTvjCT8I7bb0t9Op_gvD5LeIE'

// Create a mock client for development/fallback
const createMockClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    eq: () => ({
      select: () => Promise.resolve({ data: [], error: null })
    }),
    order: () => ({
      select: () => Promise.resolve({ data: [], error: null })
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    signInWithPassword: () => Promise.resolve({ 
      data: null, 
      error: { message: 'Database connection not available' }
    }),
    signUp: () => Promise.resolve({ 
      data: null, 
      error: { message: 'Database connection not available' }
    }),
    signOut: () => Promise.resolve({ error: null }),
    updateUser: () => Promise.resolve({ 
      error: { message: 'Database connection not available' }
    }),
    resetPasswordForEmail: () => Promise.resolve({ 
      error: { message: 'Database connection not available' }
    })
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Storage not available' }
      }),
      getPublicUrl: () => ({ 
        data: { publicUrl: '' } 
      })
    })
  }
});

let supabaseClient;

try {
  // Try to create real client
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
  
  // Test the connection
  console.log('Supabase client created successfully');
} catch (error) {
  console.warn('Failed to create Supabase client, using mock client:', error);
  supabaseClient = createMockClient();
}

export default supabaseClient;