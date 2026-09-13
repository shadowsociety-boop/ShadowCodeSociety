import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07080b] text-[#e2e8f0] flex flex-col selection:bg-[#FF4D1C]/30 selection:text-[#FF4D1C] relative overflow-x-hidden">
      {/* Global Dotted World Map Graphic Starting at Top of All Pages */}
      <div
        className="absolute top-0 left-0 right-0 h-[640px] sm:h-[780px] pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07080b]/50 to-[#07080b]" />
      </div>

      <Navbar />
      <main className="flex-1 pt-20 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
