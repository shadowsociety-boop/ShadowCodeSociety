import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CyberSceneCanvas } from './CyberSceneCanvas';
import { soundFx } from '../utils/sound';
import { Volume2, VolumeX, ArrowRight, Shield, Terminal, ArrowLeft } from 'lucide-react';

export interface WorldSection {
  id: string;
  num: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  tags: string[];
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
}

const DEFAULT_SECTIONS: WorldSection[] = [
  {
    id: 'recon',
    num: '01',
    label: 'Recon & OSINT',
    eyebrow: 'PHASE 01 // PASSIVE & ACTIVE RECONNAISSANCE',
    title: 'MAPPING THE DIGITAL ATTACK SURFACE.',
    body: 'Master Open Source Intelligence (OSINT), satellite imagery, passive DNS graph analysis, and stealth network discovery before ever sending an exploit payload.',
    accent: '#FF4D1C',
    tags: ['Shodan & Censys', 'Amass & Recon-ng', 'Subdomain Enumeration', 'Autonomous ASN Graph'],
  },
  {
    id: 'websec',
    num: '02',
    label: 'Web Security',
    eyebrow: 'PHASE 02 // APPLICATION PENETRATION TESTING',
    title: 'EXPLOITING THE MODERN WEB ARCHITECTURE.',
    body: 'Interception proxies, blind SQL injections, GraphQL authorization bypasses, SSRF cloud pivoting, and zero-day authentication flaw discovery.',
    accent: '#FF4D1C',
    tags: ['Burp Suite Pro', 'SSRF & Cloud Metadata', 'OAuth2 / JWT Hijacking', 'Race Conditions'],
  },
  {
    id: 'pwn',
    num: '03',
    label: 'Binary Exploitation',
    eyebrow: 'PHASE 03 // LOW-LEVEL PWN & REVERSE ENGINEERING',
    title: 'CORRUPTING MEMORY & BENDING CONTROL FLOW.',
    body: 'Deconstructing compiled C/C++ and Rust binaries. Defeating Stack Canaries, ASLR, and NX through custom Return-Oriented Programming (ROP) chains.',
    accent: '#FF4D1C',
    tags: ['GDB-Pwndbg & Ghidra', 'ROP Gadget Synthesis', 'Heap Exploitation', 'Kernel Driver Reversing'],
  },
  {
    id: 'crypto',
    num: '04',
    label: 'Crypto Vault',
    eyebrow: 'PHASE 04 // APPLIED MATHEMATICAL CIPHERS',
    title: 'BREAKING AND DEFENDING MATHEMATICAL VAULTS.',
    body: 'From RSA prime factorization weaknesses to Elliptic Curve side-channel attacks, discrete logarithms, and post-quantum lattice cryptography.',
    accent: '#FF4D1C',
    tags: ['SageMath & Python', 'ECC Curve Bending', 'LWE Lattice Ciphers', 'AES-GCM Authenticated Modes'],
  },
  {
    id: 'dfir',
    num: '05',
    label: 'Forensics & IR',
    eyebrow: 'PHASE 05 // DIGITAL FORENSICS & THREAT HUNTING',
    title: 'HUNTING ADVANCED PERSISTENT THREATS.',
    body: 'Volatile RAM memory triage, master file table parsing, rootkit eradication, and reverse-engineering real-world ransomware attack timelines.',
    accent: '#FF4D1C',
    tags: ['Volatility 3 & Rekall', 'Wireshark PCAP Decryption', 'Autopsy & FTK Imager', 'YARA Rule Authoring'],
  },
  {
    id: 'citadel',
    num: '06',
    label: 'The Citadel',
    eyebrow: 'PHASE 06 // THE SHADOW CORPS COMMUNITY',
    title: 'ENTER SHADOW CODE SOCIETY.',
    body: 'Join elite student researchers, compete in collegiate and DEF CON qualifiers, access our restricted laboratory archives, and forge real cyber capabilities.',
    accent: '#FF4D1C',
    tags: ['Weekly Hands-on Labs', 'DEF CON Qualifier CTF', 'Private Vuln Lab Access', 'Industry Mentorship'],
    cta: {
      primary: { label: 'Apply For Membership', href: '/join' },
      secondary: { label: 'Explore Events & CTFs', href: '/events' },
    },
  },
];

interface CyberWorldScrollProps {
  onExit?: () => void;
}

export const CyberWorldScroll: React.FC<CyberWorldScrollProps> = ({ onExit }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0); // 0..1 within current scene
  const [muted, setMuted] = useState(soundFx.isMuted());
  const containerRef = useRef<HTMLDivElement>(null);

  const N = DEFAULT_SECTIONS.length;
  // Viewport height multiplier per scene
  const SCENE_WEIGHT = 1.3;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || window.pageYOffset;
          const vh = window.innerHeight;
          const totalScrollHeight = (N - 1) * SCENE_WEIGHT * vh;

          // Global progress 0 to 1
          const globalP = Math.max(0, Math.min(1, y / totalScrollHeight));
          setScrollProgress(globalP);

          // Calculate current active scene index
          const rawIdx = (y / (SCENE_WEIGHT * vh));
          const currentIdx = Math.max(0, Math.min(N - 1, Math.floor(rawIdx)));
          const inSceneP = rawIdx - currentIdx;
          setActiveProgress(inSceneP);

          if (currentIdx !== activeIndex) {
            setActiveIndex(currentIdx);
            soundFx.playGlitch();
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, N]);

  const jumpTo = (index: number) => {
    soundFx.playTick();
    const vh = window.innerHeight;
    const targetY = index * SCENE_WEIGHT * vh;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFx.playChime();
    }
  };

  const currentSection = DEFAULT_SECTIONS[activeIndex];

  return (
    <div ref={containerRef} className="relative bg-[#050608] text-white min-h-screen">
      {/* Laser Beam Top Scrollbar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/10 z-50 pointer-events-none">
        <div
          className="h-full transition-transform duration-75 origin-left"
          style={{
            transform: `scaleX(${scrollProgress})`,
            backgroundColor: currentSection.accent,
            boxShadow: `0 0 12px ${currentSection.accent}`,
          }}
        />
      </div>

      {/* Top Floating HUD Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-md bg-[#050608]/70 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            onClick={onExit}
            className="flex items-center gap-2 group text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#FF4D1C]/60 group-hover:text-[#FF4D1C] transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">EXIT CINEMATIC</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-zinc-300 font-semibold uppercase">
              LETS-SCROLL // CYBER GRID ENGINE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Synthesizer SFX Button */}
          <button
            onClick={handleToggleSound}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono flex items-center gap-1.5 text-zinc-400 hover:text-white transition-all"
            title={muted ? 'Unmute Cyber SFX' : 'Mute Cyber SFX'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF4D1C]" />}
            <span className="hidden sm:inline">{muted ? 'SFX: MUTED' : 'SFX: ACTIVE'}</span>
          </button>

          <Link
            to="/events"
            className="px-4 py-1.5 rounded-full bg-[#FF4D1C] hover:bg-[#ff6136] text-white text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(255,77,28,0.3)] hidden md:inline-flex items-center gap-1"
          >
            <span>JOIN CTF</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Pinned Viewport Stage (100vh) */}
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Ambient Glows */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-3/4 h-96 rounded-full blur-[120px] opacity-25 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: currentSection.accent }}
        />
        <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

        {/* Dynamic Canvas / Scene Layer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CyberSceneCanvas
            sceneId={currentSection.id}
            progress={activeProgress}
            accentColor={currentSection.accent}
          />
        </div>

        {/* Scanline Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat" />
      </div>

      {/* Floating Copy / Narrative Layer */}
      <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-xl text-left pointer-events-auto space-y-4">
          {/* Chapter Number Badge */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white/5 border tracking-widest transition-colors duration-300"
              style={{ borderColor: `${currentSection.accent}40`, color: currentSection.accent }}
            >
              {currentSection.num} / 0{N}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
              {currentSection.label.toUpperCase()}
            </span>
          </div>

          {/* Eyebrow */}
          <p
            className="text-xs font-mono font-semibold tracking-widest uppercase transition-colors duration-300"
            style={{ color: currentSection.accent }}
          >
            {currentSection.eyebrow}
          </p>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-black font-['Space_Grotesk'] tracking-tight text-white leading-tight drop-shadow-md">
            {currentSection.title}
          </h1>

          {/* Body */}
          <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-lg drop-shadow">
            {currentSection.body}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {currentSection.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] font-mono px-3 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08] backdrop-blur-sm shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action CTAs (Scene 06 or interactive) */}
          {currentSection.cta && (
            <div className="pt-4 flex flex-wrap gap-3">
              {currentSection.cta.primary && (
                <Link
                  to={currentSection.cta.primary.href}
                  onClick={() => soundFx.playChime()}
                  className="px-6 py-2.5 rounded-full bg-[#FF4D1C] hover:bg-[#ff6136] text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,77,28,0.4)] flex items-center gap-2"
                >
                  <span>{currentSection.cta.primary.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {currentSection.cta.secondary && (
                <Link
                  to={currentSection.cta.secondary.href}
                  onClick={() => soundFx.playTick()}
                  className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <span>{currentSection.cta.secondary.label}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Route Tracker HUD */}
      <nav className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-5 select-none">
        <div className="absolute top-0 bottom-0 w-px bg-white/10 -z-10" />
        {DEFAULT_SECTIONS.map((sec, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={sec.id}
              onClick={() => jumpTo(idx)}
              className="group relative flex items-center justify-center p-1.5 focus:outline-none"
              title={`${sec.num} - ${sec.label}`}
            >
              {/* Dot Beacon */}
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive ? 'scale-125 ring-4' : 'opacity-40 hover:opacity-100 hover:scale-110'
                }`}
                style={{
                  backgroundColor: isActive ? sec.accent : '#71717a',
                  boxShadow: isActive ? `0 0 10px ${sec.accent}` : 'none',
                }}
              />

              {/* Hover Tooltip Pill */}
              <div className="absolute right-7 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span style={{ color: sec.accent }}>{sec.num}</span> // {sec.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Scroll Hint */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-zinc-500 font-mono text-[11px] tracking-widest uppercase transition-opacity duration-300 pointer-events-none"
        style={{ opacity: scrollProgress > 0.95 ? 0 : 1 }}
      >
        <span>SCROLL TO EXPLORE WORLD</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <div
            className="w-1.5 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: currentSection.accent }}
          />
        </div>
      </div>

      {/* Virtual Height Scroll Track */}
      <div
        className="relative pointer-events-none opacity-0"
        style={{ height: `${(N - 1) * SCENE_WEIGHT * 100 + 100}vh` }}
      />
    </div>
  );
};
