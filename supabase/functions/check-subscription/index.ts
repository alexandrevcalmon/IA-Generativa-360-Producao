import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    // Get company data
    const { data: company, error: companyError } = await supabaseClient
      .from('companies')
      .select('*, subscription_plan:subscription_plans(*)')
      .eq('auth_user_id', user.id)
      .single();

    if (companyError || !company) {
      logStep("Company not found", { error: companyError?.message });
      return new Response(JSON.stringify({ 
        hasActiveSubscription: false, 
        subscriptionStatus: 'not_found' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Company found", { companyId: company.id, stripeCustomerId: company.stripe_customer_id });

    if (!company.stripe_customer_id || !company.subscription_id) {
      logStep("No Stripe data found");
      return new Response(JSON.stringify({ 
        hasActiveSubscription: false, 
        subscriptionStatus: 'no_stripe_data',
        company: {
          id: company.id,
          name: company.name,
          subscription_plan: company.subscription_plan
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check subscription status in Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(company.subscription_id);
      logStep("Stripe subscription retrieved", { 
        subscriptionId: subscription.id, 
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      });

      const isActive = ['active', 'trialing'].includes(subscription.status);
      
      // Update company subscription status
      if (company.subscription_status !== subscription.status) {
        const { error: updateError } = await supabaseClient
          .from('companies')
          .update({
            subscription_status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('id', company.id);

        if (updateError) {
          logStep("Failed to update company subscription status", { error: updateError.message });
        } else {
          logStep("Company subscription status updated");
        }
      }

      return new Response(JSON.stringify({
        hasActiveSubscription: isActive,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        company: {
          id: company.id,
          name: company.name,
          subscription_plan: company.subscription_plan,
          max_students: company.max_students,
          current_students: company.current_students
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } catch (stripeError) {
      logStep("Stripe error", { error: stripeError.message });
      
      // Update status to indicate Stripe error
      const { error: updateError } = await supabaseClient
        .from('companies')
        .update({ subscription_status: 'canceled' })
        .eq('id', company.id);

      return new Response(JSON.stringify({
        hasActiveSubscription: false,
        subscriptionStatus: 'error',
        error: 'Failed to verify subscription with Stripe',
        company: {
          id: company.id,
          name: company.name,
          subscription_plan: company.subscription_plan
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});