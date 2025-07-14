import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../hooks/useChat';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start space-x-3', isUser ? 'justify-end' : '')}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <Bot size={20} />
        </div>
      )}
      <div
        className={cn(
          'p-3 rounded-lg max-w-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-text-primary',
          message.id === 'loading' ? 'animate-pulse' : ''
        )}
      >
        <p className="text-sm break-words">{message.content}</p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-text-secondary">
          <User size={20} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
