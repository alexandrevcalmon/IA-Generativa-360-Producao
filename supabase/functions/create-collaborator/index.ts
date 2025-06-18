
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client for authorization check
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify the requesting user is authenticated and is a producer
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is a producer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'producer') {
      console.error('Authorization error - not a producer:', profileError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { company_id, name, email, phone, position } = await req.json();
    const defaultPassword = "ia360graus";

    console.log(`Creating collaborator for company ${company_id}: ${email}`);

    // Check if user already exists in company_users
    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from('company_users')
      .select('auth_user_id, company_id, is_active')
      .eq('email', email)
      .single();

    if (existingUser && !existingUserError) {
      if (existingUser.company_id === company_id) {
        if (existingUser.is_active) {
          return new Response(
            JSON.stringify({ error: `O usuário ${email} já é um colaborador ativo desta empresa.` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Reactivate existing user
          const { data: reactivatedData, error: reactivateError } = await supabaseAdmin
            .from('company_users')
            .update({
              name: name,
              phone: phone,
              position: position,
              is_active: true,
              needs_password_change: false,
            })
            .eq('auth_user_id', existingUser.auth_user_id)
            .eq('company_id', company_id)
            .select()
            .single();

          if (reactivateError) {
            console.error('Error reactivating collaborator:', reactivateError);
            return new Response(
              JSON.stringify({ error: `Erro ao reativar colaborador: ${reactivateError.message}` }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ data: reactivatedData, isReactivation: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: `O usuário ${email} já é colaborador de outra empresa.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create new user using Admin API (this won't affect current session)
    const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: defaultPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'collaborator',
        company_id: company_id,
        name: name
      }
    });

    if (createAuthError) {
      console.error('Error creating auth user:', createAuthError);
      
      if (createAuthError.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: `O email ${email} já está registrado mas não está vinculado a nenhuma empresa. Entre em contato com o administrador.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Erro ao criar usuário: ${createAuthError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'Erro ao criar usuário - dados não encontrados' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Created auth user successfully:', authData.user.id);

    // Create company_users record
    const { data: companyUserData, error: companyUserError } = await supabaseAdmin
      .from('company_users')
      .insert([
        {
          auth_user_id: authData.user.id,
          company_id: company_id,
          name: name,
          email: email,
          phone: phone,
          position: position,
          is_active: true,
          needs_password_change: true,
        },
      ])
      .select()
      .single();

    if (companyUserError) {
      console.error('Error creating company user:', companyUserError);
      
      // Clean up the auth user if company_users creation failed
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(
        JSON.stringify({ error: `Erro ao adicionar colaborador à empresa: ${companyUserError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully created collaborator:', companyUserData);

    return new Response(
      JSON.stringify({ data: companyUserData, isReactivation: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in create-collaborator function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
