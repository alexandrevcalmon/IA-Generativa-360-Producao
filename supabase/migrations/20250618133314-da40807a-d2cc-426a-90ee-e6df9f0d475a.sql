
-- 1. Primeiro, vamos criar dados de teste que funcionem com usuários existentes ou criar novos
-- Vamos usar gen_random_uuid() para evitar conflitos e criar dados válidos

-- Garantir que existe pelo menos um plano de assinatura
INSERT INTO public.subscription_plans (
  id,
  name,
  description,
  price,
  annual_price,
  semester_price,
  max_students,
  features,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Básico',
  'Plano básico para empresas pequenas',
  99.90,
  999.00,
  549.00,
  50,
  '["Acesso aos cursos", "Relatórios básicos", "Suporte por email"]'::jsonb,
  true,
  now(),
  now()
);

-- Criar dados de exemplo que podem ser usados mais tarde
-- Primeiro, vamos verificar se já existem usuários auth e criar dados baseados neles
DO $$
DECLARE
  existing_user_id uuid;
  plan_id uuid;
  company_id uuid;
  existing_profile_count integer;
  existing_company_count integer;
BEGIN
  -- Pegar o primeiro plano de assinatura disponível
  SELECT id INTO plan_id FROM public.subscription_plans LIMIT 1;
  
  -- Verificar se existem usuários no sistema
  SELECT id INTO existing_user_id FROM auth.users LIMIT 1;
  
  IF existing_user_id IS NOT NULL THEN
    -- Se existe um usuário, criar dados para ele
    
    -- Verificar se já existe profile para este usuário
    SELECT COUNT(*) INTO existing_profile_count 
    FROM public.profiles 
    WHERE id = existing_user_id;
    
    -- Criar profile apenas se não existir
    IF existing_profile_count = 0 THEN
      INSERT INTO public.profiles (id, role, created_at, updated_at)
      VALUES (existing_user_id, 'producer', now(), now());
      RAISE NOTICE 'Profile de producer criado para usuário: %', existing_user_id;
    ELSE
      -- Atualizar role se já existe
      UPDATE public.profiles 
      SET role = 'producer', updated_at = now()
      WHERE id = existing_user_id;
      RAISE NOTICE 'Profile atualizado para producer para usuário: %', existing_user_id;
    END IF;
    
    -- Verificar se já existe empresa para este usuário
    SELECT COUNT(*) INTO existing_company_count
    FROM public.companies 
    WHERE auth_user_id = existing_user_id;
    
    -- Criar empresa apenas se não existir
    IF existing_company_count = 0 THEN
      INSERT INTO public.companies (
        id,
        name,
        official_name,
        contact_email,
        auth_user_id,
        subscription_plan_id,
        subscription_plan,
        max_students,
        current_students,
        is_active,
        needs_password_change,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        'Empresa Teste',
        'Empresa Teste LTDA',
        'contato@empresa-teste.com',
        existing_user_id,
        plan_id,
        'básico',
        50,
        0,
        true,
        false,
        now(),
        now()
      );
      RAISE NOTICE 'Empresa criada para usuário: %', existing_user_id;
    ELSE
      RAISE NOTICE 'Empresa já existe para usuário: %', existing_user_id;
    END IF;
    
  ELSE
    RAISE NOTICE 'Nenhum usuário encontrado no sistema. Faça login primeiro e execute novamente.';
  END IF;
END $$;

-- Atualizar current_students para todas as empresas
UPDATE public.companies 
SET current_students = (
  SELECT COUNT(*) 
  FROM public.company_users 
  WHERE company_id = companies.id 
  AND is_active = true
);

-- Criar colaborador de exemplo se não existir nenhum
DO $$
DECLARE
  existing_user_id uuid;
  company_id uuid;
  collaborator_count integer;
BEGIN
  -- Pegar o primeiro usuário e empresa
  SELECT id INTO existing_user_id FROM auth.users LIMIT 1;
  SELECT id INTO company_id FROM public.companies LIMIT 1;
  
  IF existing_user_id IS NOT NULL AND company_id IS NOT NULL THEN
    -- Verificar se já existem colaboradores
    SELECT COUNT(*) INTO collaborator_count FROM public.company_users;
    
    IF collaborator_count = 0 THEN
      -- Criar um colaborador de exemplo
      INSERT INTO public.company_users (
        id,
        company_id,
        auth_user_id,
        name,
        email,
        position,
        phone,
        is_active,
        needs_password_change,
        created_at
      ) VALUES (
        gen_random_uuid(),
        company_id,
        existing_user_id,
        'João Silva',
        'joao@empresa-teste.com',
        'Desenvolvedor',
        '+55 11 99999-9999',
        true,
        false,
        now()
      );
      RAISE NOTICE 'Colaborador de exemplo criado';
    END IF;
  END IF;
END $$;
