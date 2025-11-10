
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <span className="w-0.5 h-5 bg-[#00BCD4] animate-pulse"></span>
    </div>
  );
};
