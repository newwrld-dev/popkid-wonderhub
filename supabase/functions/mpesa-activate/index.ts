// Supabase Edge Function: mpesa-activate
// Actions:
//  - "stk":     initiate STK push for KSh 200 to the user's phone
//  - "confirm": mark the user's profile as activated (after STK success)
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GIFTED_URL = "https://mpesa.gifted.co.ke/api/payments/process";
const ACTIVATION_AMOUNT = 200;

function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "254" + digits.slice(1);
  if (digits.startsWith("7") || digits.startsWith("1")) {
    if (digits.length === 9) return "254" + digits;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GIFTED_MPESA_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, message: "M-Pesa API key missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Authenticate caller
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ success: false, message: "Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const admin = createClient(supabaseUrl, serviceKey);
    const body = await req.json().catch(() => ({}));
    const action = body.action ?? "stk";

    if (action === "stk") {
      const phone = normalizePhone(String(body.phone ?? ""));
      if (!phone) {
        return new Response(JSON.stringify({ success: false, message: "Invalid phone number. Use format 0712345678 or 254712345678." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const resp = await fetch(GIFTED_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phone, amount: ACTIVATION_AMOUNT }),
      });
      const result = await resp.json().catch(() => ({ success: false, message: "Invalid gateway response" }));

      if (result?.success) {
        await admin.from("profiles").update({
          phone_number: phone,
          checkout_request_id: result.checkout_request_id ?? null,
        }).eq("id", userId);
      }

      return new Response(JSON.stringify(result), {
        status: resp.ok ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "confirm") {
      // Mark activated. (Trust-based confirmation after STK PIN entry.)
      const { error } = await admin.from("profiles").update({
        activated: true,
        activated_at: new Date().toISOString(),
      }).eq("id", userId);

      if (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: false, message: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err instanceof Error ? err.message : "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
