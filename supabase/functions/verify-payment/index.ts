import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    logStep("Session ID received", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { status: session.payment_status, customerId: session.customer });

    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    logStep("Subscription retrieved", { subscriptionId: subscription.id, status: subscription.status });

    // Parse company data from metadata
    const companyData = JSON.parse(session.metadata?.company_data || '{}');
    const planId = session.metadata?.plan_id;

    logStep("Company data parsed", { companyName: companyData.name, planId });

    // Create auth user for company
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: companyData.email,
      password: companyData.password,
      email_confirm: true,
      user_metadata: {
        name: companyData.name,
        role: 'company'
      }
    });

    if (authError) {
      logStep("Auth user creation failed", { error: authError.message });
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    logStep("Auth user created", { userId: authUser.user?.id });

    // Create company record
    const companyRecord = {
      auth_user_id: authUser.user?.id,
      name: companyData.name,
      official_name: companyData.official_name,
      cnpj: companyData.cnpj,
      email: companyData.email,
      phone: companyData.phone,
      subscription_plan_id: planId,
      stripe_customer_id: session.customer as string,
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      billing_period: 'monthly',
      is_active: true,
      needs_password_change: false,
      // Address fields
      address_street: companyData.address_street,
      address_number: companyData.address_number,
      address_complement: companyData.address_complement,
      address_district: companyData.address_district,
      address_city: companyData.address_city,
      address_state: companyData.address_state,
      address_zip_code: companyData.address_zip_code,
      // Contact fields
      contact_name: companyData.contact_name,
      contact_email: companyData.contact_email,
      contact_phone: companyData.contact_phone,
      notes: companyData.notes
    };

    const { data: company, error: companyError } = await supabaseClient
      .from('companies')
      .insert(companyRecord)
      .select()
      .single();

    if (companyError) {
      logStep("Company creation failed", { error: companyError.message });
      throw new Error(`Failed to create company: ${companyError.message}`);
    }

    logStep("Company created successfully", { companyId: company.id });

    // Create profile record
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: authUser.user?.id,
        role: 'company',
        name: companyData.name,
        email: companyData.email
      });

    if (profileError) {
      logStep("Profile creation warning", { error: profileError.message });
      // Don't throw error for profile creation as it might already exist
    }

    return new Response(JSON.stringify({ 
      success: true, 
      companyId: company.id,
      subscriptionStatus: subscription.status 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});