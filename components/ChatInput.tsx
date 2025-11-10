import React, { useState, useRef, useEffect } from 'react';
import { SuggestionChips } from './SuggestionChips';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  showSuggestions: boolean;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, showSuggestions }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === '/') {
            event.preventDefault();
            textareaRef.current?.focus();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionSelect = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent pt-4">
      <div className="max-w-4xl mx-auto px-4 pb-4">
        {showSuggestions && <SuggestionChips onSelect={handleSuggestionSelect} />}
        <form 
          onSubmit={handleSubmit} 
          className={`
            w-full flex items-end p-2 bg-[#1A1A1A] rounded-xl border border-[#2C2C2C] 
            transition-all duration-300 shadow-lg 
            focus-within:border-[#00BCD4] focus-within:shadow-[0_0_0_2px_#00BCD440]
            ${showSuggestions ? 'mt-4' : 'mt-0'}`
          }
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or paste code... (⌘+/)"
            rows={1}
            className="flex-1 bg-transparent text-[#E0E0E0] placeholder-[#B0B0B0]/60 focus:outline-none resize-none max-h-48 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] px-2 py-1 rounded-md"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] text-white disabled:bg-[#2C2C2C] disabled:text-[#B0B0B0] hover:from-[#0097A7] hover:to-[#00BCD4] transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A1A1A] focus:ring-[#00BCD4]"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};