
import React from 'react';
import { ChatContextIndicatorProps } from './types';

export const ChatContextIndicator = ({ lessonId, materialsCount }: ChatContextIndicatorProps) => {
  if (!lessonId || materialsCount === 0) return null;

  return (
    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded text-center">
      📚 Tenho acesso ao conteúdo da lição e {materialsCount} material(is) de apoio
    </div>
  );
};
