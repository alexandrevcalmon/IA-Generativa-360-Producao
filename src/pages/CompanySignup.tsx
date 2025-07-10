import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, CreditCard, User, MapPin, Phone, Mail } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  max_students: number;
}

interface CompanyData {
  name: string;
  official_name: string;
  cnpj: string;
  email: string;
  password: string;
  phone: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_district: string;
  address_city: string;
  address_state: string;
  address_zip_code: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  notes: string;
}

const CompanySignup = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    official_name: '',
    cnpj: '',
    email: '',
    password: '',
    phone: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_district: '',
    address_city: '',
    address_state: '',
    address_zip_code: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    notes: ''
  });

  useEffect(() => {
    if (planId) {
      fetchPlan();
    } else {
      navigate('/plans');
    }
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      setSelectedPlan(data);
    } catch (error: any) {
      console.error('Error fetching plan:', error);
      toast({
        title: "Erro",
        description: "Plano não encontrado",
        variant: "destructive",
      });
      navigate('/plans');
    }
  };

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return companyData.name && companyData.official_name && companyData.cnpj && 
           companyData.email && companyData.password && companyData.phone;
  };

  const validateStep2 = () => {
    return companyData.address_street && companyData.address_number && 
           companyData.address_city && companyData.address_state && 
           companyData.address_zip_code;
  };

  const validateStep3 = () => {
    return companyData.contact_name && companyData.contact_email && companyData.contact_phone;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId: selectedPlan.id,
          companyData,
          email: companyData.email
        }
      });

      if (error) throw error;

      if (data.url) {
        // Redirect to Stripe checkout
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o pagamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cadastro da Empresa
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Passo {step} de 4 - Plano selecionado: {selectedPlan.name}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm text-gray-600">{step}/4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {step === 1 && <Building2 className="h-5 w-5" />}
                    {step === 2 && <MapPin className="h-5 w-5" />}
                    {step === 3 && <User className="h-5 w-5" />}
                    {step === 4 && <CreditCard className="h-5 w-5" />}
                    {step === 1 && "Dados da Empresa"}
                    {step === 2 && "Endereço"}
                    {step === 3 && "Contato"}
                    {step === 4 && "Confirmação"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && "Informações básicas da sua empresa"}
                    {step === 2 && "Endereço da sede da empresa"}
                    {step === 3 && "Dados do responsável pelo contrato"}
                    {step === 4 && "Revise os dados e finalize o pagamento"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Step 1: Company Data */}
                  {step === 1 && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Fantasia *</Label>
                          <Input
                            id="name"
                            value={companyData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Nome da empresa"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="official_name">Razão Social *</Label>
                          <Input
                            id="official_name"
                            value={companyData.official_name}
                            onChange={(e) => handleInputChange('official_name', e.target.value)}
                            placeholder="Razão social"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cnpj">CNPJ *</Label>
                          <Input
                            id="cnpj"
                            value={companyData.cnpj}
                            onChange={(e) => handleInputChange('cnpj', e.target.value)}
                            placeholder="00.000.000/0000-00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input
                            id="phone"
                            value={companyData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={companyData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="email@empresa.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Senha *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={companyData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Senha de acesso"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Address */}
                  {step === 2 && (
                    <>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="address_street">Rua/Avenida *</Label>
                          <Input
                            id="address_street"
                            value={companyData.address_street}
                            onChange={(e) => handleInputChange('address_street', e.target.value)}
                            placeholder="Nome da rua"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address_number">Número *</Label>
                          <Input
                            id="address_number"
                            value={companyData.address_number}
                            onChange={(e) => handleInputChange('address_number', e.target.value)}
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address_complement">Complemento</Label>
                          <Input
                            id="address_complement"
                            value={companyData.address_complement}
                            onChange={(e) => handleInputChange('address_complement', e.target.value)}
                            placeholder="Sala, andar, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address_district">Bairro *</Label>
                          <Input
                            id="address_district"
                            value={companyData.address_district}
                            onChange={(e) => handleInputChange('address_district', e.target.value)}
                            placeholder="Nome do bairro"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address_city">Cidade *</Label>
                          <Input
                            id="address_city"
                            value={companyData.address_city}
                            onChange={(e) => handleInputChange('address_city', e.target.value)}
                            placeholder="Nome da cidade"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address_state">Estado *</Label>
                          <Input
                            id="address_state"
                            value={companyData.address_state}
                            onChange={(e) => handleInputChange('address_state', e.target.value)}
                            placeholder="SP"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address_zip_code">CEP *</Label>
                          <Input
                            id="address_zip_code"
                            value={companyData.address_zip_code}
                            onChange={(e) => handleInputChange('address_zip_code', e.target.value)}
                            placeholder="00000-000"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 3: Contact */}
                  {step === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="contact_name">Nome do Responsável *</Label>
                        <Input
                          id="contact_name"
                          value={companyData.contact_name}
                          onChange={(e) => handleInputChange('contact_name', e.target.value)}
                          placeholder="Nome completo"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_email">Email do Responsável *</Label>
                          <Input
                            id="contact_email"
                            type="email"
                            value={companyData.contact_email}
                            onChange={(e) => handleInputChange('contact_email', e.target.value)}
                            placeholder="responsavel@empresa.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact_phone">Telefone do Responsável *</Label>
                          <Input
                            id="contact_phone"
                            value={companyData.contact_phone}
                            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                          id="notes"
                          value={companyData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Informações adicionais sobre a empresa..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {/* Step 4: Confirmation */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Resumo dos Dados</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Empresa:</strong> {companyData.name}<br />
                            <strong>CNPJ:</strong> {companyData.cnpj}<br />
                            <strong>Email:</strong> {companyData.email}
                          </div>
                          <div>
                            <strong>Responsável:</strong> {companyData.contact_name}<br />
                            <strong>Telefone:</strong> {companyData.contact_phone}<br />
                            <strong>Cidade:</strong> {companyData.address_city}, {companyData.address_state}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Ao continuar, você será redirecionado para o Stripe para completar o pagamento.
                        </p>
                        <Button 
                          onClick={handleSubmit}
                          disabled={loading}
                          size="lg"
                          className="bg-green-600 hover:bg-green-700 text-white px-8"
                        >
                          {loading ? 'Processando...' : 'Finalizar e Pagar'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  {step < 4 && (
                    <div className="flex justify-between pt-6">
                      <Button 
                        variant="outline" 
                        onClick={handlePrevious}
                        disabled={step === 1}
                      >
                        Anterior
                      </Button>
                      <Button 
                        onClick={handleNext}
                        disabled={
                          (step === 1 && !validateStep1()) ||
                          (step === 2 && !validateStep2()) ||
                          (step === 3 && !validateStep3())
                        }
                      >
                        Próximo
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Plan Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {selectedPlan.description}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span>Valor mensal:</span>
                      <span className="font-semibold text-lg">
                        {formatPrice(selectedPlan.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Máximo de colaboradores:</span>
                      <span>{selectedPlan.max_students}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Importante:</strong> O pagamento será processado através do Stripe de forma segura. Você pode cancelar a qualquer momento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;