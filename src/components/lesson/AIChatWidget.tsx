
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, MessageCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAIChatSessions, useAIChatMessages, useCreateAIChatSession, useCreateAIChatMessage } from '@/hooks/useAIChatSessions';

interface AIChatWidgetProps {
  lessonId: string;
  companyId: string;
  aiConfigurationId?: string;
}

export const AIChatWidget = ({ lessonId, companyId, aiConfigurationId }: AIChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions } = useAIChatSessions(lessonId);
  const { data: messages } = useAIChatMessages(currentSessionId || undefined);
  const createSession = useCreateAIChatSession();
  const createMessage = useCreateAIChatMessage();

  const currentSession = sessions?.[0];

  useEffect(() => {
    if (currentSession && !currentSessionId) {
      setCurrentSessionId(currentSession.id);
    }
  }, [currentSession, currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async () => {
    if (!currentSession) {
      const result = await createSession.mutateAsync({
        lessonId,
        companyId,
        aiConfigurationId
      });
      setCurrentSessionId(result.id);
    }
    setIsOpen(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSessionId) return;

    const userMessage = message;
    setMessage('');

    await createMessage.mutateAsync({
      sessionId: currentSessionId,
      role: 'user',
      content: userMessage
    });

    // Simulate AI response (in a real implementation, this would call your AI service)
    setTimeout(async () => {
      await createMessage.mutateAsync({
        sessionId: currentSessionId,
        role: 'assistant',
        content: `Esta é uma resposta simulada do assistente de IA sobre: "${userMessage}". Em uma implementação real, isso seria processado por um modelo de IA usando o conteúdo da lição como contexto.`
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleStartChat}
          className="rounded-full h-12 w-12 md:h-14 md:w-14 shadow-lg"
          size="lg"
        >
          <Bot className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 sm:w-96 h-80 sm:h-96 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 md:h-5 md:w-5" />
              <CardTitle className="text-sm md:text-base">Assistente de IA</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant="secondary" className="text-xs w-fit">
            Pergunte sobre o conteúdo da lição
          </Badge>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-64 sm:h-80">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {!messages?.length && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <MessageCircle className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs md:text-sm">Faça uma pergunta sobre o conteúdo desta lição</p>
                </div>
              )}
              {messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-xs md:text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="p-3 md:p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="flex-1 text-sm"
                disabled={createMessage.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || createMessage.isPending}
                size="sm"
              >
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
