
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[resend-invitation] Function invoked. Method:', req.method);
  if (req.method === 'OPTIONS') {
    console.log('[resend-invitation] Handling OPTIONS request.');
    return new Response('ok', { headers: corsHeaders });
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (e: any) {
    console.error('[resend-invitation] Error parsing request body:', e.message);
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }

  const { collaborator_id, company_id } = requestBody;
  console.log('[resend-invitation] Request body parsed:', { collaborator_id, company_id });

  if (!collaborator_id || !company_id) {
    console.error('[resend-invitation] Missing required parameters: collaborator_id or company_id.');
    return new Response(JSON.stringify({ error: 'Missing required parameters: collaborator_id or company_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    console.log('[resend-invitation] Supabase admin client initialized.');

    // Authorization: Check if the calling user is a producer
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[resend-invitation] Authorization header missing.');
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabaseUserClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });

    console.log('[resend-invitation] Fetching calling user.');
    const { data: { user: callingUser }, error: callingUserError } = await supabaseUserClient.auth.getUser();

    if (callingUserError || !callingUser) {
      console.error('[resend-invitation] Error fetching calling user or user not found:', callingUserError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized: Could not verify calling user' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`[resend-invitation] Calling user: ${callingUser.id}, email: ${callingUser.email}`);

    console.log(`[resend-invitation] Verifying if calling user ${callingUser.id} is a producer.`);
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', callingUser.id)
      .single();

    if (profileError || profile?.role !== 'producer') {
      console.error(`[resend-invitation] Calling user ${callingUser.id} is not a producer. Profile role: ${profile?.role}. Error:`, profileError?.message);
      return new Response(JSON.stringify({ error: 'Forbidden: Calling user is not a producer' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`[resend-invitation] Calling user ${callingUser.id} confirmed as producer.`);

    // Get collaborator data
    console.log(`[resend-invitation] Fetching collaborator data for ID: ${collaborator_id}`);
    const { data: collaborator, error: collaboratorError } = await supabaseAdmin
      .from('company_users')
      .select('email, name, needs_password_change, is_active')
      .eq('id', collaborator_id)
      .eq('company_id', company_id)
      .single();

    if (collaboratorError || !collaborator) {
      console.error(`[resend-invitation] Error fetching collaborator ${collaborator_id}:`, collaboratorError?.message);
      return new Response(JSON.stringify({ error: 'Colaborador não encontrado' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!collaborator.is_active) {
      console.error(`[resend-invitation] Collaborator ${collaborator_id} is not active.`);
      return new Response(JSON.stringify({ error: 'Colaborador não está ativo' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log(`[resend-invitation] Collaborator found: ${collaborator.email}, needs_password_change: ${collaborator.needs_password_change}`);

    // Send invitation email using admin generateLink
    console.log(`[resend-invitation] Sending invitation email to ${collaborator.email}.`);
    try {
      // Build the redirect URL to point to our auth page
      const redirectUrl = `https://generativa-360-platform.lovable.app/auth`;
      console.log(`[resend-invitation] Reset redirect URL: ${redirectUrl}`);
      
      const { data: linkData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: collaborator.email,
        options: {
          redirectTo: redirectUrl
        }
      });

      if (resetError) {
        console.error(`[resend-invitation] Error generating invitation link for ${collaborator.email}:`, resetError.message);
        return new Response(JSON.stringify({ error: `Erro ao enviar convite: ${resetError.message}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } else {
        console.log(`[resend-invitation] Invitation link generated successfully for ${collaborator.email}:`, linkData);
        
        // Update the needs_password_change flag to true to indicate invitation was sent
        const { error: updateError } = await supabaseAdmin
          .from('company_users')
          .update({ needs_password_change: true, updated_at: new Date().toISOString() })
          .eq('id', collaborator_id);

        if (updateError) {
          console.error(`[resend-invitation] Error updating collaborator ${collaborator_id}:`, updateError.message);
        } else {
          console.log(`[resend-invitation] Collaborator ${collaborator_id} updated successfully.`);
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: `Convite reenviado com sucesso para ${collaborator.email}` 
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (emailError: any) {
      console.error(`[resend-invitation] Error sending invitation email:`, emailError.message);
      return new Response(JSON.stringify({ error: `Erro inesperado ao enviar convite: ${emailError.message}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (e: any) {
    console.error('[resend-invitation] Unhandled error in function:', e.message, e.stack);
    return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }
});
