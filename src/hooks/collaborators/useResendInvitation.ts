
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResendInvitationData {
  collaborator_id: string;
  company_id: string;
}

export const useResendInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ResendInvitationData) => {
      console.log("Resending invitation for collaborator:", data.collaborator_id);

      const { data: result, error } = await supabase.functions.invoke('resend-invitation', {
        body: data
      });

      if (error) {
        console.error("Edge Function error:", error);
        throw new Error(error.message || "Erro ao reenviar convite");
      }

      if (!result) {
        throw new Error("Nenhum dado retornado da função");
      }

      if (result.error) {
        throw new Error(result.error);
      }

      console.log("Invitation resent successfully:", result);
      return result;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companyCollaborators", variables.company_id] });
      
      toast({
        title: "Convite reenviado!",
        description: "Um novo convite de ativação foi enviado por email. O colaborador deve verificar o email e clicar no link para definir sua senha.",
      });
    },
    onError: (error: Error) => {
      console.error("Resend invitation error:", error);
      toast({
        title: "Erro ao reenviar convite",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};
