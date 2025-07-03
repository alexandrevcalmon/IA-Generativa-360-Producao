import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

// SMTP configuration for titan.email
const SMTP_CONFIG = {
  hostname: "smtp.titan.email",
  port: 465,
  username: "contato@grupocalmon.com",
  password: Deno.env.get("SMTP_PASSWORD"),
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
  redirectUrl: string;
}

const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  const boundary = "boundary_" + Math.random().toString(36).substr(2, 9);
  
  const emailContent = [
    `To: ${to}`,
    `From: Calmon Academy <contato@grupocalmon.com>`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    htmlContent,
    ``,
    `--${boundary}--`,
    ``
  ].join('\r\n');

  try {
    const conn = await Deno.connectTls({
      hostname: SMTP_CONFIG.hostname,
      port: SMTP_CONFIG.port,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Read initial response
    const buffer = new Uint8Array(1024);
    await conn.read(buffer);

    // EHLO
    await conn.write(encoder.encode(`EHLO ${SMTP_CONFIG.hostname}\r\n`));
    await conn.read(buffer);

    // AUTH LOGIN
    await conn.write(encoder.encode("AUTH LOGIN\r\n"));
    await conn.read(buffer);

    // Username (base64 encoded)
    const username = btoa(SMTP_CONFIG.username);
    await conn.write(encoder.encode(`${username}\r\n`));
    await conn.read(buffer);

    // Password (base64 encoded)
    const password = btoa(SMTP_CONFIG.password || "");
    await conn.write(encoder.encode(`${password}\r\n`));
    await conn.read(buffer);

    // MAIL FROM
    await conn.write(encoder.encode(`MAIL FROM:<${SMTP_CONFIG.username}>\r\n`));
    await conn.read(buffer);

    // RCPT TO
    await conn.write(encoder.encode(`RCPT TO:<${to}>\r\n`));
    await conn.read(buffer);

    // DATA
    await conn.write(encoder.encode("DATA\r\n"));
    await conn.read(buffer);

    // Email content
    await conn.write(encoder.encode(emailContent));
    await conn.write(encoder.encode("\r\n.\r\n"));
    await conn.read(buffer);

    // QUIT
    await conn.write(encoder.encode("QUIT\r\n"));
    await conn.read(buffer);

    conn.close();
    return { success: true };
  } catch (error) {
    console.error("SMTP Error:", error);
    return { success: false, error: error.message };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { email, redirectUrl }: ResetPasswordRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate reset password link using Supabase
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Supabase reset password error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // For now, we'll just confirm the reset was initiated
    // The actual email will be sent by Supabase's built-in system
    // Later we can customize this to send through our SMTP
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Calmon Academy</h1>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Redefinição de Senha</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Recebemos uma solicitação para redefinir a senha da sua conta em Calmon Academy.
          </p>
          <p style="color: #6b7280; margin-bottom: 30px;">
            Se você fez esta solicitação, verifique seu email para o link de redefinição de senha.
            Se você não fez esta solicitação, pode ignorar este email com segurança.
          </p>
          <div style="background-color: #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #374151; margin: 0; font-size: 14px;">
              <strong>Email da conta:</strong> ${email}
            </p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Este é um email automático, por favor não responda.
          </p>
        </div>
      </div>
    `;

    // Send confirmation email via our SMTP
    const emailResult = await sendEmail(
      email,
      "Solicitação de Redefinição de Senha - Calmon Academy",
      htmlContent
    );

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // Don't fail the request, as Supabase will still send the reset email
    }

    return new Response(
      JSON.stringify({ 
        message: "Email de redefinição de senha enviado com sucesso",
        customEmailSent: emailResult.success 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-reset-password-email function:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);