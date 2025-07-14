import { useState } from 'react';
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const userMessage: Message = { id: nanoid(), role: 'user', content };
      setMessages((prev) => [...prev, userMessage]);

      // --- BACKEND INTEGRATION POINT ---
      // This is where you would make an API call to your chatbot backend.
      // The backend would process the user's message and the chat history,
      // and return the assistant's response.

      // For demonstration, we'll use a simple rule-based mock response.
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      let assistantContent = "I'm sorry, I can only provide mock responses for this demo. In a real application, I would connect to a powerful AI to answer your questions about vehicle parts and compatibility.";
      const lowerCaseContent = content.toLowerCase();

      if (lowerCaseContent.includes("hello") || lowerCaseContent.includes("hi")) {
        assistantContent = "Hello there! How can I help you with your auto parts needs today?";
      } else if (lowerCaseContent.match(/brake pads for .* (\d{4})/)) {
        const year = lowerCaseContent.match(/brake pads for .* (\d{4})/)?.[1];
        assistantContent = `Searching for brake pads for a ${year} model... In a real app, I'd show you a list of compatible products. For now, I can tell you that we have several options from top brands.`;
      } else if (lowerCaseContent.includes("oil filter")) {
        assistantContent = "To find the right oil filter, I need your vehicle's year, make, and model. Can you provide that information?";
      } else if (lowerCaseContent.includes("shipping")) {
        assistantContent = "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Shipping costs are calculated at checkout based on your location and order size.";
      }

      const assistantMessage: Message = { id: nanoid(), role: 'assistant', content: assistantContent };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
