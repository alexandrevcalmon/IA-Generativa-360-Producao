
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Loader2 } from 'lucide-react';
import { ChatMessagesProps } from './types';

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
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
        
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <Bot className="h-6 w-6 mt-1 text-blue-600 flex-shrink-0" />
            <div className="bg-gray-100 p-2 rounded-lg text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analisando conteúdo...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
