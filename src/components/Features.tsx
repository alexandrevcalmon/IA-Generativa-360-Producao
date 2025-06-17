
import { BookOpen, Users, TrendingUp, Shield, Zap, Award } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Conteúdo de qualidade",
      description: "Cursos criados por especialistas e produtores de conteúdo verificados, sempre atualizados com as últimas tendências do mercado."
    },
    {
      icon: Users,
      title: "Gestão de equipes",
      description: "Acompanhe o progresso de toda sua equipe, identifique gaps de conhecimento e promova o desenvolvimento colaborativo."
    },
    {
      icon: TrendingUp,
      title: "Analytics avançado",
      description: "Relatórios detalhados sobre engajamento, performance e ROI dos treinamentos para tomada de decisões estratégicas."
    },
    {
      icon: Shield,
      title: "Segurança empresarial",
      description: "Plataforma segura com controle de acesso, conformidade LGPD e infraestrutura robusta para dados corporativos."
    },
    {
      icon: Zap,
      title: "Aprendizado adaptativo",
      description: "Sistema inteligente que personaliza a jornada de aprendizado baseado no perfil e desempenho de cada colaborador."
    },
    {
      icon: Award,
      title: "Certificações",
      description: "Emita certificados reconhecidos no mercado e acompanhe as conquistas dos colaboradores em tempo real."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tudo que sua empresa precisa para crescer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma plataforma completa que conecta produtores de conteúdo, empresas e colaboradores 
            em um ecossistema de aprendizado contínuo e resultados mensuráveis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:shadow-lg transition-all duration-300 hover:border-calmon-200">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-calmon-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-calmon-200 transition-colors">
                    <Icon className="h-6 w-6 text-calmon-600" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-calmon-50 to-calmon-100 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Pronto para transformar sua empresa?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Junte-se a centenas de empresas que já estão revolucionando 
              a capacitação de suas equipes com nossa plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-calmon-600 hover:bg-calmon-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Começar teste gratuito
              </button>
              <button className="border border-calmon-600 text-calmon-600 hover:bg-calmon-50 px-8 py-3 rounded-lg font-medium transition-colors">
                Falar com especialista
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
