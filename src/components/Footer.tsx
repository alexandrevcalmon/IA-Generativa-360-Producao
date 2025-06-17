
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <span className="font-bold text-xl">Calmon Academy</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Plataforma completa de capacitação corporativa que conecta empresas, 
              colaboradores e produtores de conteúdo para acelerar o crescimento profissional.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Comunidade
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Certificações
                </a>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Para empresas</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Planos empresariais
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Gestão de equipes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Relatórios
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Integrações
                </a>
              </li>
              <li>
                <Link to="/login-produtor" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Seja um produtor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">contato@calmonacademy.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">+55 (11) 9999-9999</span>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  São Paulo, SP<br />
                  Brasil
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu email"
                  className="bg-gray-800 border border-gray-700 rounded-l-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:border-emerald-500"
                />
                <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-r-lg transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Calmon Academy. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
