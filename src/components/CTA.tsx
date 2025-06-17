
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  const benefits = [
    "Setup gratuito e rápido",
    "Suporte dedicado 24/7",
    "Integração com sistemas existentes",
    "ROI mensurável desde o primeiro mês"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="bg-gradient-to-br from-calmon-600 to-calmon-800 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                Transforme sua empresa hoje mesmo
              </h2>
              <p className="text-xl text-calmon-100 mb-8 max-w-2xl mx-auto">
                Junte-se a centenas de empresas que já revolucionaram a capacitação 
                de suas equipes. Comece seu teste gratuito agora mesmo.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-white text-calmon-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  Começar teste gratuito
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                >
                  Agendar demonstração
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-center md:justify-start text-calmon-100">
                    <CheckCircle className="h-5 w-5 text-calmon-300 mr-3 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary CTAs */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* For Companies */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Para empresas
              </h3>
              <p className="text-gray-600 mb-6">
                Acelere o desenvolvimento da sua equipe com nossa plataforma completa 
                de capacitação corporativa.
              </p>
              <Button 
                className="w-full bg-calmon-600 hover:bg-calmon-700"
                onClick={() => navigate('/auth')}
              >
                Cadastrar empresa
              </Button>
            </div>

            {/* For Producers */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Para produtores
              </h3>
              <p className="text-gray-600 mb-6">
                Compartilhe seu conhecimento e monetize seu conteúdo educacional 
                com nossa rede de empresas.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-calmon-600 text-calmon-600 hover:bg-calmon-50"
                onClick={() => navigate('/login-produtor')}
              >
                Tornar-se produtor
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <p className="text-gray-500 mb-6">Empresas que confiam na nossa plataforma:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Placeholder logos */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-medium">Logo {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
