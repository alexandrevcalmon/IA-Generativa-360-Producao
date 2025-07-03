
import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Mail } from 'lucide-react';

interface ForgotPasswordDialogProps {
  trigger?: React.ReactNode;
}

export function ForgotPasswordDialog({ trigger }: ForgotPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    console.log('🔐 Forgot password dialog - attempting reset for:', email);
    setLoading(true);
    
    try {
      const { error } = await resetPassword(email.trim());
      if (!error) {
        console.log('✅ Reset password request successful');
        setSent(true);
      } else {
        console.error('❌ Reset password request failed:', error);
        // Error handling is done in the resetPassword function
      }
    } catch (error) {
      console.error('💥 Unexpected error in forgot password dialog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSent(false);
    setEmail('');
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="link" className="text-emerald-600 hover:text-emerald-700">
            Esqueci minha senha
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Redefinir senha</DialogTitle>
          <DialogDescription>
            {sent 
              ? "Instruções enviadas para seu email"
              : "Digite seu email para receber as instruções de redefinição"
            }
          </DialogDescription>
        </DialogHeader>
        
        {sent ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <Mail className="h-12 w-12 text-emerald-600" />
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Enviamos as instruções de redefinição de senha para <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-500">
                Verifique sua caixa de entrada e spam. O email pode levar alguns minutos para chegar.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Entendi
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">E-mail</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
