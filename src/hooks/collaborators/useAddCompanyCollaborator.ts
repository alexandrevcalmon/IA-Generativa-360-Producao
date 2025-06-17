import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateCollaboratorData } from "./types";
import { findExistingCompanyUser } from "./utils";

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

      console.log("Starting collaborator creation for:", email);

      try {
        // 1. First, check if user is already a collaborator in this or another company
        const existingCompanyUser = await findExistingCompanyUser(email);
        
        if (existingCompanyUser) {
          if (existingCompanyUser.company_id === company_id) {
            if (existingCompanyUser.is_active) {
              throw new Error(`O usuário ${email} já é um colaborador ativo desta empresa.`);
            } else {
              // Reactivate existing collaborator in the same company
              const { data: reactivatedData, error: reactivateError } = await supabase
                .from("company_users")
                .update({
                  name: name,
                  phone: phone,
                  position: position,
                  is_active: true,
                  needs_password_change: false, // Existing user doesn't need password change
                })
                .eq("auth_user_id", existingCompanyUser.auth_user_id)
                .eq("company_id", company_id)
                .select()
                .single();

              if (reactivateError) {
                console.error("Error reactivating collaborator:", reactivateError);
                throw new Error(`Erro ao reativar colaborador: ${reactivateError.message}`);
              }

              return reactivatedData;
            }
          } else {
            // User exists in another company
            throw new Error(`O usuário ${email} já é colaborador de outra empresa. Um usuário não pode estar vinculado a múltiplas empresas simultaneamente.`);
          }
        }

        // 2. Try to sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: defaultPassword,
        });

        if (signUpError) {
          console.log("SignUp error:", signUpError);
          
          // Check if error is due to user already existing in auth
          if (signUpError.message.includes("User already registered") || 
              signUpError.message.includes("already registered") ||
              signUpError.message.includes("already been registered")) {
            
            console.log("User already exists in auth.users, but not linked to any company");
            isExistingUser = true;
            
            // In this case, we need to handle this differently
            // The user exists in auth.users but isn't linked to any company
            // We can try to sign them in to get their ID, but since we don't know their password,
            // we'll need to create a new user with a different approach
            
            throw new Error(`O email ${email} já está registrado no sistema mas não está vinculado a nenhuma empresa. Por favor, entre em contato com o administrador para resolver esta situação ou use um email diferente.`);
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

        // 3. Insert new collaborator record
        const { data: companyUserData, error: companyUserError } = await supabase
          .from("company_users")
          .insert([
            {
              auth_user_id: auth_user_id,
              company_id: company_id,
              name: name,
              email: email,
              phone: phone,
              position: position,
              is_active: true,
              needs_password_change: !isExistingUser, // New users need password change
            },
          ])
          .select()
          .single();

        if (companyUserError) {
          console.error("Error inserting into company_users:", companyUserError);
          throw new Error(`Erro ao adicionar colaborador à empresa: ${companyUserError.message}`);
        }

        console.log("Successfully created collaborator:", companyUserData);
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
        title: isReactivation ? "Colaborador reativado com sucesso!" : "Colaborador adicionado com sucesso!",
        description: isReactivation 
          ? `${variables.name} foi reativado na empresa.`
          : `${variables.name} foi adicionado à empresa e receberá instruções para definir a senha.`,
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
