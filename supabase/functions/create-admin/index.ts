
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Check if admin user already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', true)
      .maybeSingle()
    
    if (lookupError) {
      throw lookupError
    }
    
    // If admin exists, return info
    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin user already exists',
          user: { email: 'admin@example.com' }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create the admin user
    const { error: signUpError, data: signUpData } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'pass123',
      email_confirm: true,
      user_metadata: {
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User'
      }
    })
    
    if (signUpError) {
      throw signUpError
    }
    
    // Ensure the user has admin privileges in profiles table
    if (signUpData.user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', signUpData.user.id)
      
      if (updateError) {
        throw updateError
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        user: { email: 'admin@example.com' }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
