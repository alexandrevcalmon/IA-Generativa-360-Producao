import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"; // Corrected: useQuery added here
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// TODO: DB schema needs update for new fields if they don't exist.
// Assuming fields like official_name, cnpj, address details, contact details, notes might be new.
export interface CompanyData {
  name: string; // Nome Fantasia
  official_name?: string | null; // Razão Social
  cnpj?: string | null;
  email?: string | null; // Email da Empresa
  phone?: string | null; // Telefone da Empresa

  // Endereço
  address_street?: string | null;
  address_number?: string | null;
  address_complement?: string | null;
  address_district?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip_code?: string | null;

  // Contato Principal
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;

  notes?: string | null; // Observações
  subscription_plan_id: string | null; // FK to subscription_plans table

  // Fields like logo_url, current_students, max_students, is_active are typically handled separately
  // or derived. logo_url would be an upload, students/active status might be managed by other processes
  // or backend logic based on subscription.
}

export interface Company extends CompanyData {
  id: string;
  created_at: string;
  is_active: boolean;
  subscription_plan: { // Renamed from subscription_plan:subscription_plans
    id: string;
    name: string;
    semester_price: number;
    annual_price: number;
    max_students: number;
  } | null;
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (companyData: CompanyData) => {
      const { data, error } = await supabase
        .from("companies")
        .insert([companyData])
        .select()
        .single();

      if (error) {
        console.error("Error creating company:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies-with-plans"] });
      toast({
        title: "Empresa criada com sucesso!",
        description: "A nova empresa foi adicionada à sua lista.",
      });
    },
    onError: (error: Error) => {
      console.error("Error creating company:", error);
      toast({
        title: "Erro ao criar empresa",
        description: error.message || "Ocorreu um erro ao tentar criar a empresa.",
        variant: "destructive",
      });
    },
  });
};

// TODO: Consider implications for related data (company_users, enrollments, etc.) upon company deletion.
// Cascade or cleanup might be needed via database setup or additional logic here.
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", companyId);

      if (error) {
        console.error(`Error deleting company ${companyId}:`, error);
        throw error;
      }
      // No data returned on delete by default, unless using .select().single() if needed
    },
    onSuccess: (data, companyId) => {
      queryClient.invalidateQueries({ queryKey: ["companies-with-plans"] });
      // If the user is on the deleted company's details page, they might need to be navigated away.
      // This can be handled in the component calling the mutation.
      // queryClient.removeQueries({ queryKey: ["company", companyId] }); // Optionally remove specific company query
      toast({
        title: "Empresa excluída com sucesso!",
        description: "A empresa foi removida da sua lista.",
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting company:", error);
      toast({
        title: "Erro ao excluir empresa",
        description: error.message || "Ocorreu um erro ao tentar excluir a empresa.",
        variant: "destructive",
      });
    },
  });
};

export const useToggleCompanyStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      const { data, error } = await supabase
        .from("companies")
        .update({ is_active: !currentStatus })
        .eq("id", id)
        .select("id, name, is_active") // Select only what's needed for the toast or immediate feedback
        .single();

      if (error) {
        console.error(`Error toggling status for company ${id}:`, error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies-with-plans"] });
      queryClient.invalidateQueries({ queryKey: ["company", data.id] });
      toast({
        title: "Status da empresa atualizado!",
        description: `A empresa "${data.name}" foi ${data.is_active ? "desbloqueada (ativa)" : "bloqueada (inativa)"}.`,
      });
    },
    onError: (error: Error) => {
      console.error("Error toggling company status:", error);
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Ocorreu um erro ao tentar alterar o status da empresa.",
        variant: "destructive",
      });
    },
  });
};

export const useCompanyById = (id?: string | null) => {
  return useQuery<Company, Error>({
    queryKey: ["company", id],
    queryFn: async () => {
      if (!id) throw new Error("Company ID is required");

      const { data, error } = await supabase
        .from("companies")
        .select(`
          id,
          name,
          official_name,
          cnpj,
          email,
          phone,
          address_street,
          address_number,
          address_complement,
          address_district,
          address_city,
          address_state,
          address_zip_code,
          contact_name,
          contact_email,
          contact_phone,
          notes,
          is_active,
          created_at,
          subscription_plan_id,
          subscription_plan:subscription_plans (id, name, semester_price, annual_price, max_students)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching company ${id}:`, error);
        if (error.code === 'PGRST116') {
          throw new Error("Empresa não encontrada.");
        }
        throw error;
      }
      if (!data) {
        throw new Error("Empresa não encontrada.");
      }
      // Manually handle the aliased subscription_plan if it's an array with one item
      // This can happen if Supabase client doesn't automatically resolve the single joined item from an array
      // when `single()` is used with a one-to-one join that could technically be one-to-many.
      // However, the select `subscription_plan:subscription_plans(...)` should ideally handle this.
      // This is more of a safeguard or for cases where the join is not strictly one-to-one by DB constraint.
      // For simple foreign key joins where `subscription_plan_id` points to `subscription_plans.id`,
      // Supabase usually handles this correctly with `.single()`.
      // The issue might be if `subscription_plans` itself is an array due to how the join is perceived.
      // Given the select syntax `subscription_plan:subscription_plans(...)`, it should be aliased correctly.
      // Let's assume the direct data structure is as expected by `Company` interface.
      return data as Company;
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      if (error.message === "Empresa não encontrada.") {
        return false;
      }
      return failureCount < 3;
    }
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<CompanyData>) => {
      const { data, error } = await supabase
        .from("companies")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating company ${id}:`, error);
        throw error;
      }
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies-with-plans"] });
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] });
      toast({
        title: "Empresa atualizada com sucesso!",
        description: "As informações da empresa foram salvas.",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating company:", error);
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message || "Ocorreu um erro ao tentar atualizar a empresa.",
        variant: "destructive",
      });
    },
  });
};
