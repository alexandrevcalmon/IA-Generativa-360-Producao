
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, companyId } = await req.json()

    console.log('Creating auth user for company:', { email, companyId })

    // Check if company exists
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .eq('contact_email', email)
      .single()

    if (companyError || !company) {
      console.error('Company not found:', companyError)
      return new Response(
        JSON.stringify({ error: 'Company not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if auth user already exists for this company
    if (company.auth_user_id) {
      console.log('Auth user already exists for company')
      return new Response(
        JSON.stringify({ success: true, authUserId: company.auth_user_id }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if auth user already exists with this email
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers.users?.find(user => user.email === email)

    let authUserId: string

    if (existingUser) {
      console.log('Auth user already exists, linking to company:', existingUser.id)
      authUserId = existingUser.id

      // Update existing user metadata to include company role
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: {
            ...existingUser.user_metadata,
            role: 'company',
            company_id: companyId
          }
        }
      )

      if (updateError) {
        console.error('Error updating existing user metadata:', updateError)
      }
    } else {
      // Create new auth user with temporary password
      const tempPassword = 'ia360graus'
      
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          role: 'company',
          company_id: companyId
        }
      })

      if (authError || !authUser.user) {
        console.error('Error creating auth user:', authError)
        return new Response(
          JSON.stringify({ error: 'Failed to create auth user' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      authUserId = authUser.user.id
      console.log('Successfully created new auth user:', authUserId)
    }

    // Update company with auth_user_id
    const { error: updateError } = await supabaseAdmin
      .from('companies')
      .update({ 
        auth_user_id: authUserId,
        needs_password_change: true 
      })
      .eq('id', companyId)

    if (updateError) {
      console.error('Error updating company:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update company' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully linked auth user to company:', { authUserId, companyId })

    return new Response(
      JSON.stringify({ 
        success: true, 
        authUserId: authUserId,
        needsPasswordChange: true 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-company-auth-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
