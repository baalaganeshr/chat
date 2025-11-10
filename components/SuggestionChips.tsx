import React from 'react';

interface SuggestionChipsProps {
  onSelect: (prompt: string) => void;
}

const PointerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="m22 2-2.5 2.5"/><path d="M13.294 6.914 8.5 2.5l-2 2L11 9l-4.5 4.5 2 2L13 11l4.086 4.086a2 2 0 0 0 2.828 0l2-2a2 2 0 0 0 0-2.828z"/></svg>
);
const MallocIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const ClassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 14-2 2 2 2"/><path d="m14 14 2 2-2 2"/></svg>
);
const BugIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.5c-4.25 0-7.75-3.5-7.75-7.75V7.5a2 2 0 0 1 2-2h11.5a2 2 0 0 1 2 2v5.25c0 4.25-3.5 7.75-7.75 7.75z"/><path d="M12 15a3 3 0 0 0 3-3V7.5"/><path d="M12 15a3 3 0 0 1-3-3V7.5"/><path d="M18 11.25V7.5"/><path d="M6 11.25V7.5"/><path d="M12 15.5v5"/><path d="M15 18.5h-6"/><path d="M15.5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M8.5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
);


const suggestions = [
  { prompt: "Explain pointers in C", icon: <PointerIcon /> },
  { prompt: "How does `malloc` work?", icon: <MallocIcon /> },
  { prompt: "What is a class in C++?", icon: <ClassIcon /> },
  { prompt: "Debug a segmentation fault", icon: <BugIcon /> },
];

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto mb-4 animate-fade-in">
      {suggestions.map(({ prompt, icon }) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="group flex items-center gap-4 text-left p-4 bg-[#1E1E1E] text-[#E0E0E0] rounded-xl border border-[#2C2C2C] shadow-sm transition-all duration-200 ease-in-out hover:bg-[#2C2C2C] hover:border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
        >
          <div className="text-[#00BCD4] transition-transform duration-200 group-hover:scale-110">
            {icon}
          </div>
          <span className="flex-1 text-sm font-medium">
            {prompt}
          </span>
        </button>
      ))}
    </div>
  );
};