
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if bucket exists
    const { data: buckets } = await supabaseClient.storage.listBuckets();
    
    if (!buckets.find((bucket) => bucket.name === "product-images")) {
      // Create bucket
      const { data, error } = await supabaseClient.storage.createBucket("product-images", {
        public: true,
      });

      if (error) throw error;
      
      // Set public bucket policy
      const { error: policyError } = await supabaseClient.storage.from('product-images')
        .createSignedUrl('test.txt', 10);

      if (policyError) {
        // Try to set bucket to public via RLS policy
        await supabaseClient
          .rpc('create_storage_policy', { bucket_name: 'product-images' });
      }
      
      return new Response(
        JSON.stringify({ message: "Bucket 'product-images' created successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Bucket 'product-images' already exists" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
