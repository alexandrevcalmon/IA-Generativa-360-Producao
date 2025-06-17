
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Company {
  id: string;
  name: string;
  official_name?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  logo_url?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_district?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  max_students: number;
  current_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subscription_plan_id: string | null;
  billing_period?: 'semester' | 'annual'; // New field for billing period
  subscription_plan?: {
    id: string;
    name: string;
    price: number;
    annual_price: number;
    semester_price: number;
    max_students: number;
  };
}

export interface CompanyData {
  name: string;
  official_name?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_district?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  subscription_plan_id: string | null;
  billing_period?: 'semester' | 'annual'; // New field for billing period
}

export interface UpdateCompanyData extends CompanyData {
  id: string;
}

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          subscription_plan:subscription_plan_id (
            id,
            name,
            price,
            annual_price,
            semester_price,
            max_students
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      return data as Company[];
    }
  });
};

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
