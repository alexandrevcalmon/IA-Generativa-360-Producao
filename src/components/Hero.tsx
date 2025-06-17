
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-calmon-50 via-white to-calmon-100 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="lg:pr-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transforme sua empresa com
              <span className="bg-gradient-to-r from-calmon-600 to-calmon-800 bg-clip-text text-transparent"> aprendizado contínuo</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma completa de capacitação corporativa que conecta empresas, colaboradores e produtores de conteúdo para acelerar o crescimento profissional.
            </p>
            
            {/* User Type Selection - Mais destaque */}
            <div className="bg-white border-2 border-calmon-200 rounded-xl p-6 mb-8 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Escolha seu perfil de acesso:
              </h3>
              <div className="grid gap-3">
                <Button 
                  size="lg" 
                  className="bg-calmon-600 hover:bg-calmon-700 text-white px-8 py-4 text-lg w-full"
                  onClick={() => navigate('/auth')}
                >
                  🏢 Sou Empresa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-calmon-600 text-calmon-700 hover:bg-calmon-50 px-8 py-4 text-lg w-full"
                  onClick={() => navigate('/auth')}
                >
                  👤 Sou Colaborador
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-calmon-600 text-calmon-700 hover:bg-calmon-50 px-8 py-4 text-lg w-full"
                  onClick={() => navigate('/login-produtor')}
                >
                  🎓 Sou Produtor
                </Button>
              </div>
            </div>

            {/* Demo Button */}
            <div className="mb-8 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-calmon-200 text-calmon-700 hover:bg-calmon-50 px-8 py-3 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver demonstração
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-calmon-600">500+</div>
                <div className="text-sm text-gray-600">Empresas ativas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-calmon-600">10k+</div>
                <div className="text-sm text-gray-600">Colaboradores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-calmon-600">95%</div>
                <div className="text-sm text-gray-600">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-calmon-400 to-calmon-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gradient-to-br from-calmon-100 to-calmon-200 rounded-lg flex items-center justify-center">
                  <div className="text-calmon-600 font-semibold">Dashboard Interativo</div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-calmon-100 rounded flex-1"></div>
                  <div className="h-8 bg-calmon-500 rounded w-20"></div>
                </div>
              </div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-calmon-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-calmon-500 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-medium">Novo curso</div>
                  <div className="text-xs text-gray-500">Disponível agora</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
              <div className="text-sm font-medium">Progresso da equipe</div>
              <div className="w-24 h-2 bg-gray-200 rounded-full mt-2">
                <div className="w-16 h-2 bg-calmon-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
