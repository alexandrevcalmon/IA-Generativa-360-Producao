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
  phone?: string | null; // Added phone field
  position: string | null; // Cargo
  is_active: boolean;
  created_at: string;
  updated_at?: string; // Added missing property
  needs_password_change?: boolean; // Optional, as it might not always be present or relevant after first login
}

export interface CreateCollaboratorData {
  company_id: string;
  name: string;
  email: string;
  phone?: string | null; // Added phone field
  position?: string | null;
}

export interface UpdateCollaboratorData {
  name?: string;
  email?: string;
  phone?: string | null; // Added phone field
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

// Helper function to check if user exists in auth.users
const checkUserExists = async (email: string) => {
  // We can't directly query auth.users, so we'll try to sign up and catch the specific error
  return null; // We'll handle this in the mutation function
};

// Helper function to get existing user ID by email from company_users or other tables
const findExistingUserByEmail = async (email: string) => {
  // First check if user exists in company_users table
  const { data: existingUser, error } = await supabase
    .from("company_users")
    .select("auth_user_id")
    .eq("email", email)
    .single();

  if (!error && existingUser) {
    return existingUser.auth_user_id;
  }

  // Could also check profiles table or companies table for existing users
  // but for now we'll return null and let the signup handle it
  return null;
};

// Mutation Hook: Add Company Collaborator
export const useAddCompanyCollaborator = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (collaboratorData: CreateCollaboratorData) => {
      const { company_id, name, email, phone, position } = collaboratorData;
      const defaultPassword = "ia360graus"; // Placeholder default password

      let auth_user_id: string;
      let isExistingUser = false;

      try {
        // 1. First, try to sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: defaultPassword,
          options: {
            // You might add user_metadata here if needed immediately upon sign-up
            // data: { full_name: name } // Example, if your auth.users table uses this
          }
        });

        if (signUpError) {
          // Check if error is due to user already existing
          if (signUpError.message.includes("User already registered") || 
              signUpError.message.includes("already registered") ||
              signUpError.message.includes("already been registered")) {
            
            console.log("User already exists, attempting to link existing user");
            isExistingUser = true;
            
            // Try to find the existing user ID
            const existingUserId = await findExistingUserByEmail(email);
            
            if (existingUserId) {
              auth_user_id = existingUserId;
              console.log("Found existing user ID:", auth_user_id);
            } else {
              // For now, we'll throw an error asking user to contact admin
              throw new Error(`Usuário com email ${email} já existe no sistema mas não foi possível vincular automaticamente. Entre em contato com o administrador para vincular esta conta manualmente.`);
            }
          } else {
            // Other signup errors
            console.error("Error signing up new collaborator in auth:", signUpError);
            throw new Error(`Erro ao criar usuário de autenticação: ${signUpError.message}`);
          }
        } else {
          // Successful signup
          if (!signUpData.user) {
            throw new Error("Não foi possível criar o usuário de autenticação. User object não encontrado.");
          }
          auth_user_id = signUpData.user.id;
          console.log("Successfully created new user:", auth_user_id);
        }

        // 2. Check if user is already a collaborator in this company
        const { data: existingCollaborator, error: checkError } = await supabase
          .from("company_users")
          .select("id, is_active")
          .eq("auth_user_id", auth_user_id)
          .eq("company_id", company_id)
          .single();

        if (!checkError && existingCollaborator) {
          if (existingCollaborator.is_active) {
            throw new Error(`O usuário ${email} já é um colaborador ativo desta empresa.`);
          } else {
            // Reactivate existing collaborator
            const { data: reactivatedData, error: reactivateError } = await supabase
              .from("company_users")
              .update({
                name: name,
                phone: phone,
                position: position,
                is_active: true,
                needs_password_change: isExistingUser ? false : true, // Existing users don't need password change
              })
              .eq("id", existingCollaborator.id)
              .select()
              .single();

            if (reactivateError) {
              console.error("Error reactivating collaborator:", reactivateError);
              throw new Error(`Erro ao reativar colaborador: ${reactivateError.message}`);
            }

            return reactivatedData;
          }
        }

        // 3. Insert new collaborator record
        const { data: companyUserData, error: companyUserError } = await supabase
          .from("company_users")
          .insert([
            {
              auth_user_id: auth_user_id,
              company_id: company_id,
              name: name,
              email: email,
              phone: phone, // Added phone field
              position: position,
              is_active: true,
              needs_password_change: isExistingUser ? false : true, // Existing users don't need password change
            },
          ])
          .select()
          .single();

        if (companyUserError) {
          console.error("Error inserting into company_users:", companyUserError);
          throw new Error(`Erro ao adicionar colaborador à empresa: ${companyUserError.message}`);
        }

        return companyUserData;

      } catch (error) {
        console.error("Error in addCollaborator mutation:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companyCollaborators", variables.company_id] });
      
      const isReactivation = !data.needs_password_change;
      
      toast({
        title: isReactivation ? "Colaborador vinculado com sucesso!" : "Colaborador adicionado com sucesso!",
        description: isReactivation 
          ? `${variables.name} foi vinculado à empresa com sua conta existente.`
          : `${variables.name} foi adicionado à empresa e receberá instruções para definir a senha.`,
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
