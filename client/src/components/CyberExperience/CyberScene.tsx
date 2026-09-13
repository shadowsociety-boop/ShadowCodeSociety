import React from 'react';

interface CyberSceneProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const CyberScene: React.FC<CyberSceneProps> = ({ id, className = '', children }) => {
  return (
    <div
      id={id}
      className={`w-screen h-screen flex-shrink-0 relative flex items-center justify-center px-4 sm:px-8 lg:px-16 overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-center relative z-10">
        {children}
      </div>
    </div>
  );
};
