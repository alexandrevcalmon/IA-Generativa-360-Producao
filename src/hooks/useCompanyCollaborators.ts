import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Interfaces
export interface Collaborator {
  id: string; // UUID from company_users table
  auth_user_id: string; // UUID from auth.users table
  company_id: string; // UUID
  name: string;
  email: string;
  position: string | null; // Cargo
  is_active: boolean;
  created_at: string;
  needs_password_change?: boolean; // Optional, as it might not always be present or relevant after first login
}

export interface CreateCollaboratorData {
  company_id: string;
  name: string;
  email: string;
  position?: string | null;
}

export interface UpdateCollaboratorData {
  name?: string;
  email?: string;
  position?: string | null;
  is_active?: boolean;
  needs_password_change?: boolean;
}

// Query Hook: Get Company Collaborators
export const useGetCompanyCollaborators = (companyId?: string | null) => {
  return useQuery<Collaborator[], Error>({
    queryKey: ["companyCollaborators", companyId],
    queryFn: async () => {
      if (!companyId) throw new Error("Company ID is required to fetch collaborators.");

      const { data, error } = await supabase
        .from("company_users")
        .select("*") // Select all fields defined in Collaborator interface
        .eq("company_id", companyId)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching company collaborators:", error);
        throw error;
      }
      return data as Collaborator[];
    },
    enabled: !!companyId, // Only run query if companyId is provided
  });
};

// Mutation Hook: Add Company Collaborator
export const useAddCompanyCollaborator = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // TODO: DB schema for company_users needs 'needs_password_change' field.
  // TODO: Securely manage default password and inform user. 'ia360graus' is a placeholder from docs.
  // TODO: Handle existing auth.users more gracefully (e.g., invitation flow or admin linking). Current logic primarily supports new user creation in auth.

  return useMutation({
    mutationFn: async (collaboratorData: CreateCollaboratorData) => {
      const { company_id, name, email, position } = collaboratorData;
      const defaultPassword = "ia360graus"; // Placeholder default password

      // 1. Attempt to sign up the user in auth.users
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: defaultPassword,
        options: {
          // You might add user_metadata here if needed immediately upon sign-up
          // data: { full_name: name } // Example, if your auth.users table uses this
        }
      });

      if (signUpError) {
        // This error could mean user already exists, or other issues (e.g., weak password policy if not default)
        console.error("Error signing up new collaborator in auth:", signUpError);
        // Check for specific error indicating user already exists
        if (signUpError.message.includes("User already registered")) {
            // For now, we throw an error. Future enhancement: try to link existing auth user.
            throw new Error(`Usuário com email ${email} já existe. Funcionalidade de vincular usuário existente pendente.`);
        }
        throw new Error(`Erro ao criar usuário de autenticação: ${signUpError.message}`);
      }

      if (!signUpData.user) {
        throw new Error("Não foi possível criar o usuário de autenticação. User object não encontrado.");
      }

      const auth_user_id = signUpData.user.id;

      // If auth user has name in user_metadata and you want to sync it to your public users table or profile
      // You might do it here, or rely on triggers/functions in Supabase.
      // For now, we use the name provided in CreateCollaboratorData for the company_users table.

      // 2. Insert into company_users table
      const { data: companyUserData, error: companyUserError } = await supabase
        .from("company_users")
        .insert([
          {
            auth_user_id: auth_user_id,
            company_id: company_id,
            name: name,
            email: email, // Denormalizing email here, ensure it's consistent with auth.users.email
            position: position,
            is_active: true,
            needs_password_change: true,
          },
        ])
        .select()
        .single();

      if (companyUserError) {
        console.error("Error inserting into company_users:", companyUserError);
        // Potentially try to clean up the auth.users entry if company_users insert fails
        // This is complex and might require admin privileges or specific handling.
        // await supabase.auth.admin.deleteUser(auth_user_id); // Requires admin client
        throw new Error(`Erro ao adicionar colaborador à empresa: ${companyUserError.message}`);
      }

      return companyUserData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companyCollaborators", variables.company_id] });
      toast({
        title: "Colaborador adicionado com sucesso!",
        description: `${variables.name} foi adicionado à empresa e receberá instruções para definir a senha.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar colaborador",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};

// Mutation Hook: Update Company Collaborator
export const useUpdateCompanyCollaborator = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      collaboratorId,
      companyId,
      data
    }: {
      collaboratorId: string;
      companyId: string;
      data: UpdateCollaboratorData
    }) => {
      // TODO: Implement email change in auth.users (requires admin privileges or specific flow).
      if (data.email) {
        console.warn("Attempting to change email in company_users. Auth.users email update is not yet implemented.");
        // Consider if you want to prevent email changes from here or allow them only in company_users table.
      }

      const { data: updatedData, error } = await supabase
        .from("company_users")
        .update(data)
        .eq("id", collaboratorId)
        .select()
        .single();

      if (error) {
        console.error("Error updating company collaborator:", error);
        throw error;
      }
      return updatedData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companyCollaborators", variables.companyId] });
      toast({
        title: "Colaborador atualizado!",
        description: `Os dados de ${data.name} foram atualizados.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar colaborador",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};

// Mutation Hook: Toggle Collaborator Status
export const useToggleCollaboratorStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      collaboratorId,
      companyId,
      currentStatus
    }: {
      collaboratorId: string;
      companyId: string;
      currentStatus: boolean
    }) => {
      const { data, error } = await supabase
        .from("company_users")
        .update({ is_active: !currentStatus })
        .eq("id", collaboratorId)
        .select()
        .single();

      if (error) {
        console.error("Error toggling collaborator status:", error);
        throw error;
      }
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companyCollaborators", variables.companyId] });
      toast({
        title: "Status do colaborador alterado!",
        description: `${data.name} foi ${data.is_active ? "desbloqueado(a)" : "bloqueado(a)"}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};
