
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionPlan } from "@/hooks/useSubscriptionPlans";

interface PlanSelectionFieldProps {
  plans: SubscriptionPlan[];
  selectedPlanId: string | null;
  selectedBillingPeriod: 'semester' | 'annual' | null;
  onPlanChange: (planId: string, billingPeriod: 'semester' | 'annual') => void;
  isLoading?: boolean;
  error?: Error | null;
  required?: boolean;
}

export function PlanSelectionField({ 
  plans, 
  selectedPlanId, 
  selectedBillingPeriod,
  onPlanChange, 
  isLoading, 
  error, 
  required = false 
}: PlanSelectionFieldProps) {
  // Create options combining plan and billing period
  const planOptions = plans?.filter(p => p.is_active).flatMap(plan => [
    {
      value: `${plan.id}:semester`,
      label: `${plan.name} (Semestral: R$${plan.semester_price?.toFixed(2)}) - Máx: ${plan.max_students} alunos`,
      planId: plan.id,
      billingPeriod: 'semester' as const,
      price: plan.semester_price
    },
    {
      value: `${plan.id}:annual`,
      label: `${plan.name} (Anual: R$${plan.annual_price?.toFixed(2)}) - Máx: ${plan.max_students} alunos`,
      planId: plan.id,
      billingPeriod: 'annual' as const,
      price: plan.annual_price
    }
  ]) || [];

  const currentValue = selectedPlanId && selectedBillingPeriod 
    ? `${selectedPlanId}:${selectedBillingPeriod}` 
    : "";

  const handleSelectionChange = (value: string) => {
    const [planId, billingPeriod] = value.split(':');
    onPlanChange(planId, billingPeriod as 'semester' | 'annual');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="plan">Plano de Assinatura {required && '*'}</Label>
      <Select
        onValueChange={handleSelectionChange}
        required={required}
        value={currentValue}
      >
        <SelectTrigger disabled={isLoading || !!error}>
          <SelectValue placeholder={
            isLoading 
              ? "Carregando planos..." 
              : (error ? "Erro ao carregar planos" : "Selecione um plano e período de cobrança")
          } />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {planOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {error && <SelectItem value="error" disabled>Não foi possível carregar os planos.</SelectItem>}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">Erro ao carregar planos. Tente novamente.</p>}
    </div>
  );
}
