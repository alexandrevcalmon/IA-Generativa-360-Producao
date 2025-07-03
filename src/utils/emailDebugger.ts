import { supabase } from '@/integrations/supabase/client';

export interface EmailDebugInfo {
  isConfigured: boolean;
  redirectUrl: string;
  userAgent: string;
  timestamp: string;
  suggestions: string[];
}

export const getEmailDebugInfo = (): EmailDebugInfo => {
  const redirectUrl = `${window.location.origin}/auth?reset=true`;
  const userAgent = navigator.userAgent;
  const timestamp = new Date().toISOString();
  
  const suggestions = [
    "1. Verifique se as configurações SMTP estão corretas no Supabase Dashboard",
    "2. Confirme se o domínio de email está verificado (para providers como Resend)",
    "3. Teste com um email pessoal (Gmail, Outlook) primeiro",
    "4. Verifique a pasta de spam/lixeira do destinatário",
    "5. Aguarde até 10 minutos - alguns provedores têm delay",
    "6. Verifique os logs de auth no Supabase Dashboard"
  ];

  return {
    isConfigured: true, // We'll assume it's configured since we're using Supabase
    redirectUrl,
    userAgent,
    timestamp,
    suggestions
  };
};

export const logEmailAttempt = (email: string, success: boolean, error?: any) => {
  const debugInfo = getEmailDebugInfo();
  
  console.group('📧 Email Reset Debug Info');
  console.log('Email:', email);
  console.log('Success:', success);
  console.log('Redirect URL:', debugInfo.redirectUrl);
  console.log('Timestamp:', debugInfo.timestamp);
  console.log('User Agent:', debugInfo.userAgent);
  
  if (error) {
    console.error('Error Details:', error);
  }
  
  if (!success) {
    console.log('🔧 Troubleshooting Suggestions:');
    debugInfo.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`);
    });
  }
  
  console.groupEnd();
  
  return debugInfo;
};

export const testEmailConfiguration = async (testEmail: string) => {
  console.log('🧪 Testing email configuration...');
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${window.location.origin}/auth?reset=true&test=true`
    });
    
    if (error) {
      console.error('❌ Email configuration test failed:', error);
      return { success: false, error };
    } else {
      console.log('✅ Email configuration test successful');
      return { success: true, error: null };
    }
  } catch (error) {
    console.error('💥 Email configuration test error:', error);
    return { success: false, error };
  }
};