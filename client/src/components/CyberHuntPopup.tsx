import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Sparkles, MapPin, Users, Target, ArrowRight, ShieldAlert, Calendar } from 'lucide-react';
import { Button } from './ui/Button';

export const CyberHuntPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if event has passed (active till 18.09.2026 end of day)
    const expiryDate = new Date('2026-09-18T23:59:59').getTime();
    const now = new Date().getTime();

    // If already dismissed in this session, don't nag immediately
    const dismissed = sessionStorage.getItem('scs_cyberhunt_dismissed');

    if (now <= expiryDate && !dismissed) {
      // Gentle delayed appearance for premium feel
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('scs_cyberhunt_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#090909] border border-[#FF4D1C]/40 rounded-2xl shadow-[0_0_50px_rgba(255,77,28,0.2)] overflow-hidden text-left z-10 my-8"
          >
            {/* Top Tactical Signal Bar */}
            <div className="bg-[#FF4D1C]/10 border-b border-[#FF4D1C]/20 px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#FF4D1C] -ml-4" />
                <span className="text-[11px] font-mono tracking-widest text-[#FF4D1C] uppercase font-bold">
                  // ACTIVE TRANSMISSION • EVENT 18.09.2026
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Glowing ambient corner */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF4D1C]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-6 sm:p-8 space-y-6 relative z-10">
              {/* Event Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-[#FF4D1C]" />
                  <span>DATE: 18 SEPTEMBER 2026</span>
                </div>
                <h3 className="font-['Syne'] font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  CYBER HUNT II
                </h3>
                <p className="text-xs font-mono text-[#FF4D1C] tracking-wider uppercase font-semibold">
                  Campus-Wide Technical Scavenger Hunt
                </p>
              </div>

              {/* Event Overview Text from docx */}
              <div className="space-y-3 text-sm text-zinc-300 font-sans leading-relaxed">
                <p>
                  Get ready for <strong className="text-white">Cyber Hunt II</strong>, an entry-level technical scavenger hunt designed to test your observational skills, basic tech knowledge, and teamwork!
                </p>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Spread across the college campus, teams will decode beginner-friendly riddles, solve simple logic puzzles, and scan hidden QR codes to uncover clues that lead to the next destination. Perfect for first-time participants, this level requires <strong className="text-zinc-200">zero advanced coding skills</strong> — just quick thinking, sharp eyes, and a good strategy.
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#FF4D1C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Level</span>
                    <span className="text-xs font-semibold text-white">Basic (Beginner-Friendly)</span>
                  </div>
                </div>

                <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FF4D1C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Venue</span>
                    <span className="text-xs font-semibold text-white">Campus-wide (JIET Jodhpur)</span>
                  </div>
                </div>

                <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#FF4D1C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Team Size</span>
                    <span className="text-xs font-semibold text-white">3–6 Members</span>
                  </div>
                </div>

                <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <Target className="w-4 h-4 text-[#FF4D1C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Objective</span>
                    <span className="text-xs font-semibold text-white">Decode clues & reach final terminal</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                <span className="text-[11px] font-mono text-zinc-500 order-2 sm:order-1">
                  LIMITED TEAM SLOTS AVAILABLE
                </span>
                <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    DISMISS
                  </button>
                  <Link
                    to="/events/cyber-hunt-ii"
                    onClick={handleDismiss}
                    className="flex-1 sm:flex-none"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto shadow-[0_0_20px_rgba(255,77,28,0.4)]"
                    >
                      REGISTER TEAM
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
