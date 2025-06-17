
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Brain, Users, Award, BarChart3, MessageCircle, Building2, GraduationCap, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-calmon-400/20 to-calmon-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/logo-calmon-academy.png" 
                alt="Calmon Academy" 
                className="h-32 w-auto drop-shadow-lg"
              />
            </div>
            
            <Badge variant="outline" className="calmon-gradient text-white border-0 px-6 py-2 text-sm font-medium shadow-lg">
              Plataforma de Aprendizagem Corporativa
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              <span className="calmon-gradient-text">IA Generativa</span>
              <br />
              <span className="text-4xl lg:text-6xl text-calmon-800">360º</span>
            </h1>
            
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Transforme sua equipe com aprendizagem contínua em IA Generativa e saúde mental. 
              Uma plataforma completa para empresas que querem liderar o futuro.
            </p>
          </div>
        </div>
      </div>

      {/* Access Selection Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha seu tipo de acesso
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Digite qual perfil melhor se adapta às suas necessidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Producer Access */}
          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Sou Produtor</CardTitle>
              <CardDescription className="text-base">
                Crie e gerencie conteúdos educacionais para empresas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li>• Criação de cursos e trilhas</li>
                <li>• Gestão de conteúdo</li>
                <li>• Analytics de engajamento</li>
                <li>• Biblioteca de recursos</li>
              </ul>
              <Link to="/login-produtor" className="block">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg">
                  Acessar Painel do Produtor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Company Access */}
          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 calmon-gradient" />
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto calmon-gradient rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Sou Empresa</CardTitle>
              <CardDescription className="text-base">
                Gerencie equipes e acompanhe o desenvolvimento corporativo
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li>• Gestão de colaboradores</li>
                <li>• Relatórios e analytics</li>
                <li>• Configuração de planos</li>
                <li>• Dashboard executivo</li>
              </ul>
              <Link to="/company-dashboard" className="block">
                <Button className="w-full calmon-gradient hover:scale-105 transition-all duration-200 text-white shadow-lg">
                  Acessar Painel da Empresa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Student Access */}
          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-calmon-500 to-calmon-700" />
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-calmon-500 to-calmon-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Sou Aluno</CardTitle>
              <CardDescription className="text-base">
                Acesse cursos, trilhas e desenvolva suas habilidades
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li>• Cursos e certificações</li>
                <li>• Progresso personalizado</li>
                <li>• Comunidade e mentoria</li>
                <li>• Gamificação e rewards</li>
              </ul>
              <Link to="/dashboard" className="block">
                <Button className="w-full bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white shadow-lg">
                  Acessar Área do Aluno
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tudo que sua empresa precisa em uma plataforma
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie aprendizagem, engajamento e resultados com tecnologia de ponta
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 calmon-gradient rounded-lg flex items-center justify-center mb-4 shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Cursos & Trilhas</CardTitle>
              <CardDescription>
                Biblioteca completa de cursos com trilhas personalizadas por IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vídeos HD com transcrição automática</li>
                <li>• Quizzes adaptativos</li>
                <li>• Certificados digitais</li>
                <li>• Progresso em tempo real</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 calmon-gradient rounded-lg flex items-center justify-center mb-4 shadow-md">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle>IA Contextual</CardTitle>
              <CardDescription>
                Chatbot inteligente e recomendações personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Suporte por aula via Gemini API</li>
                <li>• Recomendações inteligentes</li>
                <li>• Análise de progresso</li>
                <li>• Insights comportamentais</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 calmon-gradient rounded-lg flex items-center justify-center mb-4 shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Gestão de Equipes</CardTitle>
              <CardDescription>
                Controle total de assentos e colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Planos Starter 5-100</li>
                <li>• SSO empresarial</li>
                <li>• Provisionamento SCIM</li>
                <li>• Relatórios detalhados</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 calmon-gradient rounded-lg flex items-center justify-center mb-4 shadow-md">
                <Award className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Gamificação</CardTitle>
              <CardDescription>
                Sistema completo de engajamento e recompensas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• XP e leaderboards</li>
                <li>• Badges e conquistas</li>
                <li>• Nudges automáticos</li>
                <li>• Competições em equipe</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 calmon-gradient rounded-lg flex items-center justify-center mb-4 shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Analytics Avançado</CardTitle>
              <CardDescription>
                Dashboards e relatórios customizáveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• KPIs em tempo real</li>
                <li>• Construtor drag-and-drop</li>
                <li>• Alertas proativos</li>
                <li>• Exportação CSV/Excel</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 calmon-gradient rounded-lg flex items-center justify-center mb-4 shadow-md">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Comunidade</CardTitle>
              <CardDescription>
                Networking e mentorias ao vivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Feed de discussões</li>
                <li>• Mentorias agendadas</li>
                <li>• Calendário integrado</li>
                <li>• Suporte em tempo real</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/60 backdrop-blur-sm border-y shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold calmon-gradient-text">500+</div>
              <div className="text-gray-600">Horas de Conteúdo</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold calmon-gradient-text">50+</div>
              <div className="text-gray-600">Empresas Ativas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold calmon-gradient-text">10k+</div>
              <div className="text-gray-600">Colaboradores</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold calmon-gradient-text">95%</div>
              <div className="text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 calmon-gradient opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Pronto para transformar sua equipe?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se às empresas líderes que já estão preparando seus colaboradores para o futuro da IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/company-dashboard">
              <Button size="lg" variant="outline" className="bg-white text-calmon-700 hover:bg-gray-50 px-8 py-6 text-lg shadow-lg">
                Começar como Empresa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="bg-white text-calmon-700 hover:bg-gray-50 px-8 py-6 text-lg shadow-lg">
                Começar como Aluno
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
