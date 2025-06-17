
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

export function Stats() {
  const stats = [
    {
      icon: Users,
      number: "10k+",
      label: "Colaboradores ativos",
      description: "Profissionais se desenvolvendo diariamente"
    },
    {
      icon: BookOpen,
      number: "2k+",
      label: "Cursos disponíveis",
      description: "Conteúdo em diversas áreas do conhecimento"
    },
    {
      icon: TrendingUp,
      number: "85%",
      label: "Aumento de produtividade",
      description: "Resultado médio das empresas parceiras"
    },
    {
      icon: Award,
      number: "50k+",
      label: "Certificados emitidos",
      description: "Conquistas e especializações reconhecidas"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-calmon-600 to-calmon-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Números que comprovam nossa eficácia
          </h2>
          <p className="text-xl text-calmon-100 max-w-3xl mx-auto">
            Resultados reais de empresas que investem no desenvolvimento de suas equipes 
            através da nossa plataforma de aprendizado corporativo.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Number */}
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {stat.label}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-calmon-100 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Highlight */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  Empresa do ano em inovação educacional
                </h3>
                <p className="text-calmon-100 text-lg">
                  Reconhecida como a melhor plataforma de capacitação corporativa 
                  pelos principais órgãos do setor em 2024.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Award className="h-12 w-12 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
