import React from 'react';

const CppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#B0B0B0]">
    <path d="M14 9.5H12.5V11H14V12.5H12.5V14H14V15.5H11V8H14V9.5Z" fill="#E0E0E0"/>
    <path d="M8 9.5H6.5V11H8V12.5H6.5V14H8V15.5H5V8H8V9.5Z" fill="#E0E0E0"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M3 1C1.89543 1 1 1.89543 1 3V21C1 22.1046 1.89543 23 3 23H21C22.1046 23 23 22.1046 23 21V3C23 1.89543 22.1046 1 21 1H3ZM3 3H21V21H3V3Z" fill="#424242"/>
    <path d="M16 11H18V13H16V15H14V13H16V11Z" fill="#00BCD4"/>
    <path d="M19 11H21V13H19V15H17V13H19V11Z" fill="#00BCD4"/>
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center pt-6 pb-8">
      <div className="flex items-center justify-center gap-3">
        <CppIcon />
        <h1 className="text-2xl md:text-3xl font-semibold text-[#E0E0E0]">
          C/C++ Assistant
        </h1>
      </div>
      <p className="text-sm text-[#B0B0B0] mt-1">Your compiler's smarter cousin</p>
    </header>
  );
};