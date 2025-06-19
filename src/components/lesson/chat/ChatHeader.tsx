
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, X, BookOpen } from 'lucide-react';
import { ChatHeaderProps } from './types';

export const ChatHeader = ({ lessonId, onClose }: ChatHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <Bot className="h-4 w-4" />
        Assistente IA
        {lessonId && (
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            <BookOpen className="h-3 w-3" />
            Contexto da Lição
          </div>
        )}
      </CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </CardHeader>
  );
};
