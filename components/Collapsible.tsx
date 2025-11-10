
import React, { useState } from 'react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-2 border border-[#2C2C2C] rounded-xl bg-black/20 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-3 text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00BCD4] ${isOpen ? 'bg-[#2C2C2C]/50' : 'hover:bg-[#2C2C2C]/30'} ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[#E0E0E0]">{title}</span>
        <span className="text-[#00BCD4] flex-shrink-0 ml-4">
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>
      {isOpen && (
        <div className="p-3 border-t border-[#2C2C2C] animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};