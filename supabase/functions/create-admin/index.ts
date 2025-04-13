
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceRole) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // First check if the admin user already exists
    const { data: existingUser, error: existingUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (existingUserError) {
      throw existingUserError;
    }

    // Check if admin@example.com exists in the user list
    const adminExists = existingUser.users.some(user => user.email === "admin@example.com");

    if (adminExists) {
      return new Response(
        JSON.stringify({ message: "Admin user already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the admin user
    const { data: adminUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: "admin@example.com",
      password: "pass123",
      email_confirm: true,
      user_metadata: {
        username: "admin",
        first_name: "مدير",
        last_name: "النظام",
      },
    });

    if (createUserError) {
      throw createUserError;
    }

    // Set the user as admin in the profiles table
    if (adminUser.user) {
      const { error: updateProfileError } = await supabaseAdmin
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", adminUser.user.id);

      if (updateProfileError) {
        throw updateProfileError;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Admin user created successfully", 
        user: adminUser.user 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
