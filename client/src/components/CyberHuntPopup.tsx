import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  X,
  Sparkles,
  MapPin,
  Users,
  Target,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Clock,
  Award,
  Zap,
  Globe,
  FileText,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from './ui/Button';
import { PopupTransmission } from '../services/admin.service';

const DEFAULT_POPUP: PopupTransmission = {
  enabled: true,
  transmissionTag: '// ACTIVE TRANSMISSION • EVENT 18.09.2026',
  date: '18 SEPTEMBER 2026',
  title: 'CYBER HUNT II',
  subtitle: 'Campus-Wide Technical Scavenger Hunt',
  description: `Get ready for Cyber Hunt II, an entry-level technical scavenger hunt designed to test your observational skills, basic tech knowledge, and teamwork!

Spread across the college campus, teams will decode beginner-friendly riddles, solve simple logic puzzles, and scan hidden QR codes to uncover clues that lead to the next destination. Perfect for first-time participants, this level requires zero advanced coding skills — just quick thinking, sharp eyes, and a good strategy.`,
  showBanner: false,
  banner: null,
  highlights: [
    { icon: 'sparkles', label: 'Level', value: 'Basic (Beginner-Friendly)' },
    { icon: 'mapPin', label: 'Venue', value: 'Campus-wide (JIET Jodhpur)' },
    { icon: 'users', label: 'Team Size', value: '3–6 Members' },
    { icon: 'target', label: 'Objective', value: 'Decode clues & reach final terminal' },
  ],
  ctaText: 'REGISTER TEAM',
  ctaLink: '/events/cyber-hunt-ii',
  footerNote: 'LIMITED TEAM SLOTS AVAILABLE',
  expiryDate: '2026-09-18T23:59:59',
};

// Map string icon names to Lucide icons
export const renderHighlightIcon = (name: string, className = 'w-4 h-4 text-[#FF4D1C] shrink-0 mt-0.5') => {
  const n = (name || '').toLowerCase();
  if (n.includes('sparkle') || n.includes('star') || n.includes('level')) {
    return <Sparkles className={className} />;
  }
  if (n.includes('map') || n.includes('pin') || n.includes('venue') || n.includes('loc')) {
    return <MapPin className={className} />;
  }
  if (n.includes('user') || n.includes('team') || n.includes('member') || n.includes('group')) {
    return <Users className={className} />;
  }
  if (n.includes('target') || n.includes('goal') || n.includes('obj')) {
    return <Target className={className} />;
  }
  if (n.includes('clock') || n.includes('time') || n.includes('hour')) {
    return <Clock className={className} />;
  }
  if (n.includes('cal') || n.includes('date')) {
    return <Calendar className={className} />;
  }
  if (n.includes('shield') || n.includes('sec')) {
    return <ShieldAlert className={className} />;
  }
  if (n.includes('award') || n.includes('prize') || n.includes('trophy')) {
    return <Award className={className} />;
  }
  if (n.includes('zap') || n.includes('flash') || n.includes('mode')) {
    return <Zap className={className} />;
  }
  if (n.includes('globe') || n.includes('net') || n.includes('web')) {
    return <Globe className={className} />;
  }
  if (n.includes('check')) {
    return <CheckCircle2 className={className} />;
  }
  return <FileText className={className} />;
};

export const CyberHuntPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupTransmission>(DEFAULT_POPUP);

  useEffect(() => {
    let isMounted = true;

    const initPopup = async () => {
      // Check session dismissal
      const dismissed = sessionStorage.getItem('scs_cyberhunt_dismissed_v3');
      if (dismissed) return;

      try {
        const res = await fetch('/api/events/popup-transmission');
        if (res.ok) {
          const json = await res.json();
          if (json.popup && isMounted) {
            const data: PopupTransmission = { ...DEFAULT_POPUP, ...json.popup };
            setPopupData(data);

            // Check if explicitly disabled
            if (!data.enabled) return;

            // Check if expired
            if (data.expiryDate) {
              const expiryTime = new Date(data.expiryDate).getTime();
              if (Date.now() > expiryTime) return;
            }

            // Delayed appearance for smooth experience
            setTimeout(() => {
              if (isMounted) setIsOpen(true);
            }, 1100);
            return;
          }
        }
      } catch (err) {
        // Fallback to default
      }

      // Default fallback check
      if (isMounted) {
        const expiryDate = new Date('2026-09-18T23:59:59').getTime();
        if (Date.now() <= expiryDate) {
          setTimeout(() => {
            if (isMounted) setIsOpen(true);
          }, 1100);
        }
      }
    };

    initPopup();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('scs_cyberhunt_dismissed_v3', 'true');
  };

  const isExternalLink =
    popupData.ctaLink?.startsWith('http://') || popupData.ctaLink?.startsWith('https://');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
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
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-[#090909] border border-[#FF4D1C]/40 rounded-2xl shadow-[0_0_50px_rgba(255,77,28,0.22)] overflow-hidden text-left z-10 flex flex-col my-auto"
          >
            {/* Top Tactical Signal Bar */}
            <div className="bg-[#FF4D1C]/10 border-b border-[#FF4D1C]/20 px-3.5 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-ping shrink-0" />
                <span className="w-2 h-2 rounded-full bg-[#FF4D1C] -ml-4 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FF4D1C] uppercase font-bold truncate">
                  {popupData.transmissionTag || '// ACTIVE TRANSMISSION'}
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                title="Close"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Optional Banner Image */}
            {popupData.showBanner && popupData.banner && (
              <div className="relative w-full h-32 xs:h-40 sm:h-48 md:h-52 bg-zinc-900 overflow-hidden shrink-0 border-b border-white/5">
                <img
                  src={popupData.banner}
                  alt={popupData.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Cyber Matrix Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/60 via-transparent to-black/40 pointer-events-none" />

                {/* Subtle corner badge on banner */}
                <div className="absolute bottom-2.5 left-3 sm:left-6 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-[#FF4D1C]/30 text-[9px] font-mono text-[#FF4D1C] uppercase tracking-wider font-semibold">
                    SIGNAL BROADCAST
                  </span>
                </div>
              </div>
            )}

            {/* Glowing Ambient Corner Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D1C]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overscroll-contain relative z-10 custom-scrollbar">
              {/* Event Header */}
              <div className="space-y-1.5 sm:space-y-2">
                {popupData.date && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-[#FF4D1C]" />
                    <span>DATE: {popupData.date}</span>
                  </div>
                )}
                <h3 className="font-['Syne'] font-extrabold text-2xl xs:text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  {popupData.title}
                </h3>
                {popupData.subtitle && (
                  <p className="text-xs font-mono text-[#FF4D1C] tracking-wider uppercase font-semibold">
                    {popupData.subtitle}
                  </p>
                )}
              </div>

              {/* Event Overview Text */}
              {popupData.description && (
                <div className="space-y-2.5 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-line">
                  {popupData.description}
                </div>
              )}

              {/* Key Highlights Grid - 2 columns on mobile & desktop */}
              {popupData.highlights && popupData.highlights.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
                  {popupData.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0e0e0e] border border-white/5 rounded-xl p-2.5 sm:p-3.5 flex items-start gap-2.5 hover:border-white/10 transition-colors"
                    >
                      {renderHighlightIcon(hl.icon)}
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wider block truncate">
                          {hl.label}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white leading-snug break-words line-clamp-2">
                          {hl.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="shrink-0 p-3 sm:p-5 bg-[#090909]/95 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-20">
              {popupData.footerNote ? (
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 order-2 sm:order-1 text-center sm:text-left">
                  {popupData.footerNote}
                </span>
              ) : (
                <div className="order-2 sm:order-1" />
              )}

              <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                <button
                  onClick={handleDismiss}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-center"
                >
                  DISMISS
                </button>

                {isExternalLink ? (
                  <a
                    href={popupData.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDismiss}
                    className="flex-1 sm:flex-none"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ExternalLink className="w-4 h-4" />}
                      className="w-full sm:w-auto shadow-[0_0_20px_rgba(255,77,28,0.4)] text-xs sm:text-sm font-semibold"
                    >
                      {popupData.ctaText || 'REGISTER'}
                    </Button>
                  </a>
                ) : (
                  <Link
                    to={popupData.ctaLink || '/events'}
                    onClick={handleDismiss}
                    className="flex-1 sm:flex-none"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto shadow-[0_0_20px_rgba(255,77,28,0.4)] text-xs sm:text-sm font-semibold"
                    >
                      {popupData.ctaText || 'REGISTER'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
