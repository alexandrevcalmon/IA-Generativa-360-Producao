
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateCollaboratorData } from "./types";

// Mutation Hook: Add Company Collaborator using Edge Function
export const useAddCompanyCollaborator = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (collaboratorData: CreateCollaboratorData) => {
      console.log("Starting collaborator creation via Edge Function for:", collaboratorData.email);

      try {
        // Call the Edge Function to create the collaborator
        const { data, error } = await supabase.functions.invoke('create-collaborator', {
          body: collaboratorData
        });

        if (error) {
          console.error("Edge Function error:", error);
          throw new Error(error.message || "Erro ao chamar função de criação de colaborador");
        }

        if (!data) {
          throw new Error("Nenhum dado retornado da função de criação");
        }

        if (data.error) {
          throw new Error(data.error);
        }

        console.log("Successfully created collaborator via Edge Function:", data.data);
        return data;

      } catch (error) {
        console.error("Error in addCollaborator mutation:", error);
        throw error;
      }
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companyCollaborators", variables.company_id] });
      
      const isReactivation = response.isReactivation;
      
      toast({
        title: isReactivation ? "Colaborador reativado!" : "Colaborador adicionado!",
        description: isReactivation 
          ? `${variables.name} foi reativado na empresa. Um convite de ativação foi enviado por email.`
          : `${variables.name} foi adicionado à empresa. Um convite de ativação foi enviado para ${variables.email}. O colaborador deve verificar o email e clicar no link para definir sua senha e ativar a conta.`,
      });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Erro ao adicionar colaborador",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};
