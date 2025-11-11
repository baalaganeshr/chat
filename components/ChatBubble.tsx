import React from 'react';
import type { ChatMessage } from '../types';
import { ChatMessageRenderer } from './ChatMessageRenderer';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
  isError?: boolean;
}

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#007A8A] flex-shrink-0 flex items-center justify-center shadow-[0_2px_8px_rgba(0,188,212,0.3)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.25 7.5L12 3.75L15.75 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 20.25V3.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.75 16.5L12 20.25L8.25 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-[#2C2C2C] border border-[#3A3A3A] flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B0B0B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    </div>
);

const ErrorIcon = () => (
    <div className="w-8 h-8 rounded-full bg-[#F44336]/20 border border-[#F44336] flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F44336]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    </div>
);


export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoading = false, isError = false }) => {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-4 w-full animate-fade-in mb-6">
        <div className="max-w-[85%] md:max-w-[70%]">
          <div className="p-4 rounded-2xl bg-[#2C2C2C] border border-[#3A3A3A] shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
            <div className="text-[#E0E0E0] break-words leading-relaxed">
              <ChatMessageRenderer content={message.content} />
            </div>
          </div>
        </div>
        <UserIcon />
      </div>
    );
  }

  const containerClasses = isError
    ? "bg-[#F44336]/10 border border-[#F44336]/50"
    : "bg-[#1A1A1A] border border-[#2A2A2A] shadow-[0_4px_20px_rgba(0,0,0,0.3)]";
  
  const Icon = isError ? ErrorIcon : BotIcon;

  return (
    <div className="w-full animate-fade-in mb-6">
      <div className={`p-6 rounded-2xl ${containerClasses}`}>
        <div className="flex items-start gap-4 w-full">
          <Icon />
          <div className="flex-1 min-w-0">
            {isLoading && !message.content ? (
              <div className="py-2">
                <LoadingIndicator />
              </div>
            ) : isError ? (
              <div>
                <div className="bg-[#F44336]/20 border border-[#F44336]/50 rounded-lg p-3 mb-4">
                  <p className="font-semibold text-[#F44336] text-sm uppercase tracking-wide">Error</p>
                </div>
                <div className="text-[#E0E0E0] leading-relaxed">
                  <ChatMessageRenderer content={message.content} />
                </div>
              </div>
            ) : (
              <div className="text-[#E0E0E0] leading-relaxed">
                <ChatMessageRenderer content={message.content} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};