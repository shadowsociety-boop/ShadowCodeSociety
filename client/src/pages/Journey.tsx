import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberWorldScroll } from '../components/CyberWorldScroll';

export const Journey: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#050608] min-h-screen">
      <CyberWorldScroll onExit={() => navigate('/')} />
    </div>
  );
};
