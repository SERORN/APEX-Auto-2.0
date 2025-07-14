import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, CornerDownLeft, Bot } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useChat } from '../hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ApexChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const { messages, isLoading, error, sendMessage } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleChat}
        className="bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-lg"
        aria-label={settings.t('chat_button_label', 'Open Apex Assistant')}
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-full max-w-md bg-background rounded-lg shadow-xl border border-border-color z-50 flex flex-col animate-slide-in-up">
          <header className="flex items-center justify-between p-4 border-b border-border-color">
            <div className="flex items-center space-x-2">
              <Bot size={24} className="text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">{settings.t('chat_header', 'Apex Assistant')}</h2>
            </div>
            <button onClick={toggleChat} className="text-text-secondary hover:text-text-primary">
              <X size={20} />
            </button>
          </header>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto h-96">
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <ChatMessage message={{ id: 'loading', role: 'assistant', content: '...' }} />
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 text-center text-destructive">
              <p>{settings.t('chat_error', 'Sorry, something went wrong.')}</p>
            </div>
          )}

          <footer className="p-4 border-t border-border-color">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            <p className="text-xs text-text-secondary text-center mt-2">
              {settings.t('chat_disclaimer', 'Apex Assistant can make mistakes. Consider checking important information.')}
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ApexChat;
