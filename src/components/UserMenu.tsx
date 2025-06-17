
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function UserMenu() {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        variant="outline"
        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        Entrar
      </Button>
    );
  }

  const handleSignOut = async () => {
    console.log('🚪 Starting logout process...');
    
    try {
      const { error } = await signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        toast({
          title: "Erro ao sair",
          description: "Ocorreu um erro ao fazer logout. Tente novamente.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ Logout successful, navigating to home...');
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('💥 Unexpected logout error:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    console.log('Profile clicked for user role:', userRole);
    
    switch (userRole) {
      case 'producer':
        navigate('/producer/profile');
        break;
      case 'company':
        navigate('/company/profile');
        break;
      case 'student':
        navigate('/student/profile');
        break;
      default:
        console.warn('Unknown user role, defaulting to legacy profile');
        navigate('/profile');
    }
  };

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'producer':
        return 'Produtor';
      case 'company':
        return 'Empresa';
      case 'student':
        return 'Colaborador';
      default:
        return 'Usuário';
    }
  };

  const getUserInitials = () => {
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-emerald-100 text-emerald-700">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getRoleDisplay()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
