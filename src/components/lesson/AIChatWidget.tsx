
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Loader2, X } from 'lucide-react';
import { useAIChatSessions, useCreateChatSession, useSendChatMessage, ChatMessage } from '@/hooks/useAIChatSessions';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

interface AIChatWidgetProps {
  lessonId?: string;
  companyId?: string;
  className?: string;
}

export const AIChatWidget = ({ lessonId, companyId, className }: AIChatWidgetProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions = [] } = useAIChatSessions(lessonId);
  const createSessionMutation = useCreateChatSession();
  const sendMessageMutation = useSendChatMessage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load existing session or create new one when widget opens
  useEffect(() => {
    if (isOpen && !currentSessionId && sessions.length > 0) {
      const latestSession = sessions[0];
      setCurrentSessionId(latestSession.id);
      setMessages(latestSession.session_data || []);
    }
  }, [isOpen, sessions, currentSessionId]);

  const handleCreateSession = async () => {
    try {
      const session = await createSessionMutation.mutateAsync({
        lessonId,
        companyId
      });
      setCurrentSessionId(session.id);
      setMessages([]);
      
      // Add welcome message from assistant
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: lessonId 
          ? 'Olá! Sou seu assistente de IA para esta lição. Como posso ajudá-lo com o conteúdo?' 
          : 'Olá! Sou seu assistente de IA. Como posso ajudá-lo hoje?',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Erro ao iniciar conversa com IA');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !currentSessionId) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');

    try {
      const response = await sendMessageMutation.mutateAsync({
        sessionId: currentSessionId,
        messages: updatedMessages,
        lessonId
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the user message if sending fails
      setMessages(messages);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    if (!currentSessionId && sessions.length === 0) {
      handleCreateSession();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={handleOpenChat}
          className={`fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-50 ${className}`}
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Assistente IA
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-3 space-y-2">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <Bot className="h-6 w-6 mt-1 text-blue-600 flex-shrink-0" />
                    )}
                    <div
                      className={`max-w-[70%] p-2 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <User className="h-6 w-6 mt-1 text-gray-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
                
                {sendMessageMutation.isPending && (
                  <div className="flex gap-2 justify-start">
                    <Bot className="h-6 w-6 mt-1 text-blue-600 flex-shrink-0" />
                    <div className="bg-gray-100 p-2 rounded-lg text-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Pensando...
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua pergunta..."
                className="flex-1 text-sm"
                disabled={sendMessageMutation.isPending || !currentSessionId}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputMessage.trim() || sendMessageMutation.isPending || !currentSessionId}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {!currentSessionId && (
              <div className="text-center">
                <Button
                  onClick={handleCreateSession}
                  variant="outline"
                  size="sm"
                  disabled={createSessionMutation.isPending}
                >
                  {createSessionMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    'Iniciar Conversa'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
