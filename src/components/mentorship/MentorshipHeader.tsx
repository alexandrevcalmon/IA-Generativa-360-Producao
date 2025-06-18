
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface MentorshipHeaderProps {
  companyName?: string;
  onRefresh: () => void;
  refreshing: boolean;
}

export const MentorshipHeader = ({ companyName, onRefresh, refreshing }: MentorshipHeaderProps) => {
  return (
    <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-white hover:bg-white/20" />
          <div>
            <h1 className="text-2xl font-bold text-white">Mentorias</h1>
            <p className="text-calmon-100">
              Sessões da {companyName || 'empresa'} e mentorias coletivas
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            disabled={refreshing}
            className="border-white/30 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
          >
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </div>
    </header>
  );
};

