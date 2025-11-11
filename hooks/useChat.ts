import { useState, useRef, useCallback, useEffect } from 'react';
import { startChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { WELCOME_MESSAGE } from '../constants/welcome';

// Define the OllamaChat type to match our service
type OllamaChat = {
  sendMessage(content: string, onToken?: (token: string) => void): Promise<string>;
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const chatRef = useRef<OllamaChat | null>(null);

  useEffect(() => {
    // Initialize the chat session when the hook is first used
    try {
      chatRef.current = startChat();
    } catch (e) {
      setError(e as Error);
    }
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!chatRef.current) {
      setError(new Error("Chat is not initialized."));
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    let modelMessageId = '';
    try {
      modelMessageId = (Date.now() + 1).toString();

      // Add a placeholder for the bot's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: modelMessageId, role: 'model', content: '' },
      ]);

      // Get streaming response from Ollama
      let currentContent = '';
      await chatRef.current.sendMessage(message, (token: string) => {
        currentContent += token;
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === modelMessageId ? { ...msg, content: currentContent } : msg
          )
        );
      });
    } catch (e) {
      const err = e as Error;
      // Set the error state without adding an error message to the chat history
      setError(err);
      // Remove the bot's placeholder message on error
      if (modelMessageId) {
        setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== modelMessageId));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, sendMessage };
};