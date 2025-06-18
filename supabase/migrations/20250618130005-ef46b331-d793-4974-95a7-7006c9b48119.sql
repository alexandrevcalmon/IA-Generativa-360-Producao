
-- 1. Corrigir dados inconsistentes na tabela companies
-- Garantir que o max_students reflita os dados do plano de subscrição
UPDATE companies 
SET max_students = CASE 
  WHEN subscription_plan_id IS NOT NULL THEN (
    SELECT sp.max_students 
    FROM subscription_plans sp 
    WHERE sp.id = companies.subscription_plan_id
  )
  WHEN subscription_plan = 'basic' THEN 50
  WHEN subscription_plan = 'starter' THEN 10
  WHEN subscription_plan = 'premium' THEN 200
  WHEN subscription_plan = 'enterprise' THEN 1000
  ELSE 50
END;

-- 2. Garantir que o current_students reflita os colaboradores ativos
UPDATE companies 
SET current_students = (
  SELECT COUNT(*) 
  FROM company_users 
  WHERE company_users.company_id = companies.id 
  AND company_users.is_active = true
);

-- 3. Normalizar os nomes dos planos para consistência
UPDATE companies 
SET subscription_plan = CASE 
  WHEN subscription_plan_id IS NOT NULL THEN (
    SELECT LOWER(sp.name) 
    FROM subscription_plans sp 
    WHERE sp.id = companies.subscription_plan_id
  )
  ELSE COALESCE(subscription_plan, 'basic')
END;

-- 4. Criar função para manter consistência automática
CREATE OR REPLACE FUNCTION public.sync_company_limits()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar max_students baseado no plano de subscrição
  IF NEW.subscription_plan_id IS NOT NULL THEN
    SELECT max_students INTO NEW.max_students
    FROM subscription_plans 
    WHERE id = NEW.subscription_plan_id;
  END IF;
  
  -- Atualizar current_students
  SELECT COUNT(*) INTO NEW.current_students
  FROM company_users 
  WHERE company_id = NEW.id AND is_active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar trigger para manter dados sincronizados
CREATE OR REPLACE TRIGGER sync_company_data_trigger
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION sync_company_limits();

-- 6. Criar trigger para atualizar current_students quando colaboradores mudam
CREATE OR REPLACE FUNCTION public.update_company_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE companies 
    SET current_students = (
      SELECT COUNT(*) 
      FROM company_users 
      WHERE company_id = NEW.company_id AND is_active = true
    )
    WHERE id = NEW.company_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE companies 
    SET current_students = (
      SELECT COUNT(*) 
      FROM company_users 
      WHERE company_id = OLD.company_id AND is_active = true
    )
    WHERE id = OLD.company_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_student_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON company_users
  FOR EACH ROW
  EXECUTE FUNCTION update_company_student_count();
