import React, { useState } from 'react';
import { CornerDownLeft, Loader2 } from 'lucide-read';
import { useSettings } from '../context/SettingsContext';
import { useAutoResizeTextArea } from '../hooks/useAutoResizeTextArea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const { settings } = useSettings();
  const textAreaRef = useAutoResizeTextArea(inputValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative flex-1">
        <textarea
          ref={textAreaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={settings.t('chat_input_placeholder', 'Ask about parts, fitment, or anything else...')}
          className="w-full bg-muted border border-border-color rounded-lg py-2 pr-10 pl-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          style={{ maxHeight: '100px', overflowY: 'auto' }}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary disabled:opacity-50"
          disabled={isLoading || !inputValue.trim()}
          aria-label={settings.t('chat_send_button_label', 'Send message')}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <CornerDownLeft size={20} />}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
