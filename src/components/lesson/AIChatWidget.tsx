
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useLessonMaterials } from '@/hooks/useLessonMaterials';
import { useAuth } from '@/hooks/auth';

import { ChatToggleButton } from './chat/ChatToggleButton';
import { ChatHeader } from './chat/ChatHeader';
import { ChatContextIndicator } from './chat/ChatContextIndicator';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import { useChatSession } from './chat/hooks/useChatSession';
import { useChatMessages } from './chat/hooks/useChatMessages';
import { AIChatWidgetProps } from './chat/types';

export const AIChatWidget = ({ lessonId, companyId, className }: AIChatWidgetProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const { data: materials = [] } = useLessonMaterials(lessonId || '');
  
  const {
    currentSessionId,
    messages,
    setMessages,
    handleCreateSession,
    createSessionMutation,
    sessions
  } = useChatSession(lessonId, companyId);

  const {
    handleSendMessage,
    sendMessageMutation
  } = useChatMessages();

  console.log('AIChatWidget render:', {
    isOpen,
    inputMessage,
    currentSessionId,
    messagesCount: messages.length,
    isDisabled: sendMessageMutation.isPending || !currentSessionId
  });

  const handleOpenChat = () => {
    console.log('Opening chat...');
    setIsOpen(true);
    if (!currentSessionId && sessions.length === 0) {
      handleCreateSession();
    }
  };

  const handleInputChange = (value: string) => {
    console.log('Input changed in widget:', value);
    setInputMessage(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting message:', inputMessage);
    
    if (!inputMessage.trim() || !currentSessionId) {
      console.log('Cannot submit: empty message or no session');
      return;
    }
    
    await handleSendMessage(
      inputMessage,
      currentSessionId,
      messages,
      setMessages,
      lessonId
    );
    
    setInputMessage('');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <ChatToggleButton
          onClick={handleOpenChat}
          className={className}
        />
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl z-50 flex flex-col">
          <ChatHeader
            lessonId={lessonId}
            onClose={() => setIsOpen(false)}
          />
          
          <CardContent className="flex-1 flex flex-col p-0 space-y-0">
            {/* Context Indicator */}
            {lessonId && materials.length > 0 && (
              <div className="p-3 pb-0">
                <ChatContextIndicator
                  lessonId={lessonId}
                  materialsCount={materials.length}
                />
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-3 pb-0">
              <ChatMessages
                messages={messages}
                isLoading={sendMessageMutation.isPending}
              />
            </div>

            {/* Input Area - Always at bottom */}
            {currentSessionId ? (
              <ChatInput
                inputMessage={inputMessage}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isDisabled={sendMessageMutation.isPending}
                lessonId={lessonId}
              />
            ) : (
              <div className="p-3 border-t bg-white">
                <Button
                  onClick={handleCreateSession}
                  variant="outline"
                  size="sm"
                  disabled={createSessionMutation.isPending}
                  className="w-full"
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
