import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu, X, ArrowUpRight, Terminal, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'Resources', path: '/resources' },
    { label: 'Members', path: '/members' },
    { label: 'Highlights', path: '/highlights' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/[0.07] py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity Logo */}
        <Logo size="md" />

        {/* Center/Right: Primary Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs font-mono uppercase tracking-[0.14em] transition-colors duration-200 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#A1A1A1] hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions & Join Button */}
        <div className="hidden md:flex items-center gap-4">
          {/* Subtle Admin Link */}
          {isAuthenticated ? (
            <Link
              to="/admin"
              className="text-xs font-mono text-[#A1A1A1] hover:text-[#FF4D1C] flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#FF4D1C]" />
              <span>{user?.name?.split(' ')[0] || 'Console'}</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              title="Admin Portal"
              className="text-zinc-600 hover:text-zinc-400 p-1.5 rounded transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Join Society Action Button */}
          <Link
            to="/join"
            className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-mono font-medium tracking-wider text-white bg-[#FF4D1C] hover:bg-[#FF3B00] rounded transition-all duration-200 shadow-[0_0_15px_rgba(255,77,28,0.25)]"
          >
            <span>JOIN THE SOCIETY</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white rounded border border-white/10 bg-white/5"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080808] border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-mono uppercase tracking-wider py-1.5 ${
                    isActive ? 'text-[#FF4D1C] font-semibold' : 'text-[#A1A1A1]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              to="/join"
              className="w-full py-2.5 bg-[#FF4D1C] text-white text-xs font-mono font-semibold text-center rounded tracking-wider uppercase"
            >
              Join The Society →
            </Link>
            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              className="text-center text-xs font-mono text-zinc-500 hover:text-zinc-300 py-1"
            >
              {isAuthenticated ? "Admin Dashboard →" : "Admin Console Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
