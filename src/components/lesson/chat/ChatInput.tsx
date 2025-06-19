
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { ChatInputProps } from './types';

export const ChatInput = ({ 
  inputMessage, 
  onInputChange, 
  onSubmit, 
  isDisabled, 
  lessonId 
}: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        value={inputMessage}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={lessonId ? "Pergunte sobre a lição..." : "Digite sua pergunta..."}
        className="flex-1 text-sm"
        disabled={isDisabled}
      />
      <Button
        type="submit"
        size="sm"
        disabled={!inputMessage.trim() || isDisabled}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
