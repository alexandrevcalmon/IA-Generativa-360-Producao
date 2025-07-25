
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
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('Form submitted with message:', inputMessage);
    if (inputMessage?.trim() && !isDisabled) {
      onSubmit(); // Call without parameters
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input value changed:', e.target.value);
    onInputChange(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage?.trim() && !isDisabled) {
        handleSubmit(); // Call without event
      }
    }
  };

  console.log('ChatInput render:', { 
    inputMessage, 
    isDisabled, 
    hasLessonId: !!lessonId,
    inputLength: inputMessage?.length || 0
  });

  return (
    <div className="border-t border-slate-700/50 bg-slate-900/20 p-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={inputMessage || ''}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={lessonId ? "Pergunte sobre a lição..." : "Digite sua pergunta..."}
          className="flex-1 text-sm border-slate-600 bg-slate-800/50 text-slate-200 placeholder:text-slate-400"
          disabled={isDisabled}
          autoComplete="off"
          autoFocus={false}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!inputMessage?.trim() || isDisabled}
          className="px-3 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-700/50 disabled:text-slate-500"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
