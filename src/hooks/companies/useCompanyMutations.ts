
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CompanyData, UpdateCompanyData } from "./types";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (companyData: CompanyData) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies-with-plans'] });
      toast({
        title: "Empresa criada com sucesso!",
        description: "A nova empresa foi adicionada à plataforma.",
      });
    },
    onError: (error) => {
      console.error('Error creating company:', error);
      toast({
        title: "Erro ao criar empresa",
        description: "Ocorreu um erro ao criar a empresa.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (companyData: UpdateCompanyData) => {
      const { id, ...updateData } = companyData;

      const { data, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies-with-plans'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
      toast({
        title: "Empresa atualizada com sucesso!",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error) => {
      console.error('Error updating company:', error);
      toast({
        title: "Erro ao atualizar empresa",
        description: "Ocorreu um erro ao atualizar a empresa.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: false })
        .eq('id', companyId);

      if (error) {
        console.error('Error deactivating company:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies-with-plans'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
      toast({
        title: "Empresa desativada com sucesso!",
        description: "A empresa foi desativada.",
      });
    },
    onError: (error) => {
      console.error('Error deactivating company:', error);
      toast({
        title: "Erro ao desativar empresa",
        description: "Ocorreu um erro ao desativar a empresa.",
        variant: "destructive",
      });
    }
  });
};

export const useToggleCompanyStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling company status:', error);
        throw error;
      }
    },
    onSuccess: (_, { currentStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies-with-plans'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
      toast({
        title: currentStatus ? "Empresa bloqueada com sucesso!" : "Empresa desbloqueada com sucesso!",
        description: currentStatus ? "A empresa foi bloqueada." : "A empresa foi desbloqueada.",
      });
    },
    onError: (error) => {
      console.error('Error toggling company status:', error);
      toast({
        title: "Erro ao alterar status da empresa",
        description: "Ocorreu um erro ao alterar o status da empresa.",
        variant: "destructive",
      });
    }
  });
};
