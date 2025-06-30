
import { supabase } from '@/integrations/supabase/client';
import { updateUserMetadata } from './authUtils';

export const createProducerSignInService = (toast: any) => {
  const signInProducer = async (email: string, password: string) => {
    console.log(`[ProducerSignIn] Attempting producer sign-in. Email: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error(`[ProducerSignIn] Producer login error for ${email}: ${error.message}`);
        toast({ title: "Erro no Login", description: error.message, variant: "destructive" });
        return { error };
      }
      
      if (data.user) {
        console.log(`[ProducerSignIn] Authentication successful for ${email}, checking producer status...`);
        
        // Use enhanced producer check with auto-migration
        const { data: producerData, error: producerError } = await supabase.rpc('is_current_user_producer_enhanced');

        if (producerError) {
          console.error(`[ProducerSignIn] Error checking producer status for ${email}:`, producerError);
          toast({ 
            title: "Erro de Verificação", 
            description: "Erro ao verificar permissões de produtor.", 
            variant: "destructive" 
          });
          await supabase.auth.signOut();
          return { error: new Error("Producer verification failed") };
        }

        if (!producerData) {
          console.error(`[ProducerSignIn] User ${email} is not a producer or is inactive`);
          toast({ 
            title: "Acesso Negado", 
            description: "Esta conta não tem permissões de produtor ou está inativa.", 
            variant: "destructive" 
          });
          await supabase.auth.signOut();
          return { error: new Error("User is not a producer") };
        }

        console.log(`[ProducerSignIn] Producer status confirmed for ${email}`);
        
        // Update user metadata to ensure consistency
        if (data.user.user_metadata?.role !== 'producer') {
          console.log(`[ProducerSignIn] Updating metadata to 'producer' for ${email}`);
          try {
            await updateUserMetadata({ role: 'producer' });
          } catch (metadataError) {
            console.warn(`[ProducerSignIn] Failed to update metadata for ${email}:`, metadataError);
            // Continue anyway, this is not critical
          }
        }
        
        console.log(`[ProducerSignIn] Login successful for producer ${email}`);
        toast({ title: "Login de Produtor bem-sucedido!", description: "Bem-vindo!" });
        return { error: null, user: data.user, session: data.session, needsPasswordChange: false };
      }
      
      console.error(`[ProducerSignIn] Producer login for ${email} succeeded but user data is missing.`);
      return { error: new Error("User data not found for producer.") };

    } catch (criticalError) {
      console.error(`[ProducerSignIn] Critical error during producer login for ${email}:`, criticalError);
      toast({ 
        title: "Erro Crítico", 
        description: "Erro inesperado durante o login. Tente novamente.", 
        variant: "destructive" 
      });
      return { error: criticalError };
    }
  };

  return { signInProducer };
};
