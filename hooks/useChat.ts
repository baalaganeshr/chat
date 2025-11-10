import { useState, useRef, useCallback, useEffect } from 'react';
import { Chat } from '@google/genai';
import { startChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { WELCOME_MESSAGE } from '../constants/welcome';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const chatRef = useRef<Chat | null>(null);

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
      const stream = await chatRef.current.sendMessageStream({ message });
      let modelResponse = '';
      modelMessageId = (Date.now() + 1).toString();

      // Add a placeholder for the bot's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: modelMessageId, role: 'model', content: '' },
      ]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === modelMessageId ? { ...msg, content: modelResponse } : msg
          )
        );
      }
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