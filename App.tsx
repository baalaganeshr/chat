import React, { useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import { Header } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';

function App() {
  const { messages, isLoading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, error]);

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-[#E0E0E0]">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 md:px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <ChatBubble 
              key={msg.id} 
              message={msg} 
              isLoading={isLoading && index === messages.length - 1 && msg.role === 'model'}
            />
          ))}
          
          {error && (
            <ChatBubble
              isError={true}
              message={{
                id: 'error-message',
                role: 'model',
                content: `Sorry, something went wrong:\n${error.message}`,
              }}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <ChatInput 
        onSendMessage={sendMessage} 
        isLoading={isLoading} 
        showSuggestions={messages.length === 1 && !isLoading && !error}
      />
    </div>
  );
}

export default App;