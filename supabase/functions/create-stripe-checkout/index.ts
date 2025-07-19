import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@14.21.0')).default(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-12-18.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body
    const requestBody = await req.json()
    const { companyData, planId } = requestBody

    if (!companyData || !planId) {
      return new Response(
        JSON.stringify({ error: 'Missing required data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get plan information from database
    const { data: planInfo, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !planInfo) {
      return new Response(
        JSON.stringify({ error: 'Plan not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripeProductId = planInfo.stripe_product_id
    const maxCollaborators = planInfo.max_collaborators
    const subscriptionPeriod = planInfo.subscription_period_days || 30

    // Get Stripe prices for the product
    const prices = await stripe.prices.list({
      product: stripeProductId,
      active: true,
    })

    if (prices.data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No prices found for product' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use the first price (usually the default)
    const price = prices.data[0]

    // Check if customer already exists
    let customer
    try {
      const existingCustomers = await stripe.customers.list({
        email: companyData.contact_email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: companyData.contact_email,
          name: companyData.name,
          phone: companyData.contact_phone,
          metadata: {
            company_name: companyData.name,
            contact_name: companyData.contact_name,
          },
        })
      }
    } catch (customerError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create or find customer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('FRONTEND_URL')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('FRONTEND_URL')}/planos`,
      metadata: {
        company_name: companyData.name,
        contact_name: companyData.contact_name,
        contact_email: companyData.contact_email,
        contact_phone: companyData.contact_phone,
        cnpj: companyData.cnpj,
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        zip_code: companyData.zip_code,
        plan_id: planId,
        max_collaborators: maxCollaborators.toString(),
        subscription_period: subscriptionPeriod.toString(),
      },
      subscription_data: {
        metadata: {
          company_name: companyData.name,
          plan_id: planId,
        },
      },
    })

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Checkout creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 