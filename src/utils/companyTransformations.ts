
import { CompanyWithPlan } from "@/hooks/useCompaniesWithPlans";
import { Company } from "@/hooks/useCompanies";

export const transformCompanyWithPlanToCompany = (companyWithPlan: CompanyWithPlan): Company => {
  return {
    id: companyWithPlan.id,
    name: companyWithPlan.name,
    logo_url: companyWithPlan.logo_url,
    max_students: companyWithPlan.max_students,
    current_students: companyWithPlan.current_students,
    is_active: companyWithPlan.is_active,
    created_at: companyWithPlan.created_at,
    updated_at: companyWithPlan.created_at, // Use created_at as fallback for updated_at
    subscription_plan_id: companyWithPlan.subscription_plan?.id || null,
    subscription_plan: companyWithPlan.subscription_plan,
    // Add other optional fields with default values
    official_name: undefined,
    cnpj: undefined,
    email: undefined,
    phone: undefined,
    address_street: undefined,
    address_number: undefined,
    address_complement: undefined,
    address_district: undefined,
    address_city: undefined,
    address_state: undefined,
    address_zip_code: undefined,
    contact_name: undefined,
    contact_email: undefined,
    contact_phone: undefined,
    notes: undefined,
    billing_period: undefined,
  };
};
