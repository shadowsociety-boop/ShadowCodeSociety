import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Shield, Globe, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { Button } from '../ui/Button';
import { NetworkLayer } from './NetworkLayer';
import { CyberScene } from './CyberScene';
import { CyberGlobe } from './CyberGlobe';
import { SecurityCore } from './SecurityCore';
import { ThreatLayer } from './ThreatLayer';
import { DefenseLayer } from './DefenseLayer';
import { StatusBadge, MetricCard } from './StatusPanel';
import { ScrollController } from './ScrollController';

gsap.registerPlugin(ScrollTrigger);

export const CyberExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);

  const [currentStage, setCurrentStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse parallax tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stickyRef.current) return;
    const rect = stickyRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  // Jump to stage programmatically
  const handleJumpToStage = (stageIndex: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerRef.current.offsetTop + (totalHeight * (stageIndex / 4));
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    soundFx.playTick();
  };

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const bgGrid = bgGridRef.current;
    if (!container || !track) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Simple static view without aggressive translation for accessibility
        return;
      }

      // Master horizontal scrub timeline
      // 5 scenes total -> slides track from 0% to -80% (each scene is 100vw, total 500vw)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const prog = self.progress;
            setScrollProgress(prog);
            // Derive stage 0..4
            const stage = Math.min(4, Math.floor(prog * 5));
            setCurrentStage(stage);
          },
        },
      });

      // Layer 1: Horizontal slide track
      tl.to(track, {
        xPercent: -80,
        ease: 'none',
        duration: 1,
      });

      // Layer 2: Subtle Parallax on Background Grid (moves at different speed)
      if (bgGrid) {
        tl.to(
          bgGrid,
          {
            xPercent: -20,
            ease: 'none',
            duration: 1,
          },
          0
        );
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450vh] bg-[#050505]"
    >
      {/* ── Sticky Viewport (100vh) ─────────────────────────────────── */}
      <div
        ref={stickyRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505] flex items-center select-none"
      >
        {/* Parallax Background Grid */}
        <div ref={bgGridRef} className="absolute inset-0 w-[140%] h-full pointer-events-none">
          <NetworkLayer intensity="medium" />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-radial from-[#FF4D1C]/[0.09] via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* ── 5-Scene Horizontal Virtual Space Track (500vw) ────────── */}
        <div
          ref={trackRef}
          className="flex h-full w-[500vw] will-change-transform"
        >
          {/* ════════════════════════════════════════════════════════════
              SCENE 01: SYSTEM INITIALIZATION / HERO
              ════════════════════════════════════════════════════════════ */}
          <CyberScene id="scene-boot">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
              {/* Left Column: Hero Typography */}
              <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8 z-20">
                {/* Category Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.2em] text-[#A1A1A1] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
                  CYBERSECURITY • ETHICAL HACKING • CTF
                </div>

                {/* Giant Headline */}
                <div className="space-y-1">
                  <h1 className="font-['Syne'] font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-[0.92]">
                    ENTER<br />
                    THE<br />
                    <span className="text-[#FF4D1C]">SHADOW.</span>
                  </h1>
                </div>

                {/* Supporting Statement */}
                <p className="text-base sm:text-lg text-[#A1A1A1] max-w-xl font-sans leading-relaxed">
                  Shadow Code Society is an elite cybersecurity collective where students dissect real-world vulnerabilities, master offensive tradecraft, and build resilient defense architectures.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link to="/events" onClick={() => soundFx.playTick()}>
                    <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      EXPLORE EVENTS
                    </Button>
                  </Link>
                  <Link to="/join" onClick={() => soundFx.playTick()}>
                    <Button size="lg" variant="secondary" rightIcon={<ArrowUpRight className="w-4 h-4 text-[#FF4D1C]" />}>
                      JOIN THE SOCIETY
                    </Button>
                  </Link>
                </div>

                {/* Sub-header Metatag */}
                <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#666666]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
                    <span>AUTONOMOUS RESEARCH NODE</span>
                  </div>
                  <div>EST. 2024 // ALL PROTOCOLS VERIFIED</div>
                </div>
              </div>

              {/* Right Column: State 01 Boot Core Visual */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                <div
                  className="relative w-full max-w-[420px] aspect-square flex items-center justify-center"
                  style={{
                    transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
                    transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  <SecurityCore bootStage="boot" size="lg" />

                  {/* Boot Status Diagnostics */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                    <StatusBadge label="SYSTEM BOOT" value="ONLINE" status="online" />
                  </div>
                </div>

                {/* Scroll Indicator Cue */}
                <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500 animate-pulse">
                  <span>SCROLL TO ENTER NETWORK</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </CyberScene>

          {/* ════════════════════════════════════════════════════════════
              SCENE 02: GLOBAL NETWORK (3D CYBER GLOBE)
              ════════════════════════════════════════════════════════════ */}
          <CyberScene id="scene-network">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
              {/* Left Column: Network Mission Specs */}
              <div className="lg:col-span-6 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FF4D1C]/10 border border-[#FF4D1C]/30 text-[11px] font-mono tracking-[0.2em] text-[#FF4D1C] uppercase">
                  <Globe className="w-3.5 h-3.5" />
                  STATE 02 // GLOBAL TELEMETRY
                </div>

                <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
                  DECENTRALIZED<br />
                  <span className="text-[#FF4D1C]">DEFENSE GRID.</span>
                </h2>

                <p className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed font-sans">
                  Real-time encrypted relays synchronize threat telemetry across 6 global nodes. Packets flow across authenticated zero-trust pipelines.
                </p>

                {/* Network Telemetry Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <MetricCard title="NODES ONLINE" value="06 / 06" detail="ALL SYSTEMS GREEN" accent="emerald" />
                  <MetricCard title="GLOBAL TRAFFIC" value="2.4 GB/s" detail="LATENCY: 12ms" accent="orange" />
                  <MetricCard title="CIPHER" value="AES-256" detail="TLS 1.3 ENFORCED" accent="orange" className="hidden sm:block" />
                </div>
              </div>

              {/* Right Column: 3D Interactive Cyber Globe */}
              <div className="lg:col-span-6 flex items-center justify-center relative">
                <div
                  className="w-full max-w-[460px] aspect-square"
                  style={{
                    transform: `translate3d(${mousePos.x * 15}px, ${mousePos.y * 15}px, 0)`,
                    transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  <CyberGlobe mousePos={mousePos} active={currentStage >= 0 && currentStage <= 2} />
                </div>
              </div>
            </div>
          </CyberScene>

          {/* ════════════════════════════════════════════════════════════
              SCENE 03: THREAT DETECTION & MITIGATION
              ════════════════════════════════════════════════════════════ */}
          <CyberScene id="scene-threat">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
              {/* Left Column: Incident Response Command */}
              <div className="lg:col-span-6 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/15 border border-red-500/40 text-[11px] font-mono tracking-[0.2em] text-red-400 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                  STATE 03 // ACTIVE THREAT DETECTED
                </div>

                <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
                  ANOMALOUS VECTOR<br />
                  <span className="text-red-500">INTERCEPTED.</span>
                </h2>

                <p className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed font-sans">
                  Heuristic analysis flagged malicious payload traversal across Port 8443. Automated honeypot diversion and perimeter isolation initiated instantly.
                </p>

                {/* Threat Diagnostics */}
                <div className="space-y-2 pt-2 max-w-md font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/80 border border-red-500/30">
                    <span className="text-zinc-400">TARGET ASSET:</span>
                    <span className="text-white font-bold">UNKNOWN NODE // TYO RELAY</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/80 border border-red-500/30">
                    <span className="text-zinc-400">SEVERITY SCORE:</span>
                    <span className="text-red-400 font-bold">CRITICAL (CVSS 9.4)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/80 border border-white/10 text-emerald-400">
                    <span>COUNTERMEASURE:</span>
                    <span className="font-semibold">ISOLATE & RE-ROUTE ✓</span>
                  </div>
                </div>
              </div>

              {/* Right Column: SecOps Radar Threat Map */}
              <div className="lg:col-span-6 flex items-center justify-center relative">
                <div
                  className="w-full max-w-[460px] aspect-square"
                  style={{
                    transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
                    transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  <ThreatLayer />
                </div>
              </div>
            </div>
          </CyberScene>

          {/* ════════════════════════════════════════════════════════════
              SCENE 04: ACTIVE DEFENSIVE ARCHITECTURE
              ════════════════════════════════════════════════════════════ */}
          <CyberScene id="scene-defense">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
              {/* Left Column: Zero-Trust Defense Specs */}
              <div className="lg:col-span-6 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/15 border border-emerald-500/40 text-[11px] font-mono tracking-[0.2em] text-emerald-400 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  STATE 04 // ACTIVE DEFENSE
                </div>

                <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
                  RESILIENT FORTRESS<br />
                  <span className="text-emerald-400">LOCKED DOWN.</span>
                </h2>

                <p className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed font-sans">
                  The threat is dissolved. Multi-tier firewall rings lock in place, eBPF telemetry seals kernel boundaries, and continuous mutual TLS authentication guarantees zero-trust posture.
                </p>

                {/* Defense Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <StatusBadge label="FIREWALL" value="ACTIVE" status="online" />
                  <StatusBadge label="IDS/IPS" value="MONITORING" status="online" />
                  <StatusBadge label="ENCRYPTION" value="AES-256 GCM" status="secure" />
                  <StatusBadge label="ZERO TRUST" value="ENABLED" status="online" />
                </div>
              </div>

              {/* Right Column: Shield Matrix Core */}
              <div className="lg:col-span-6 flex items-center justify-center relative">
                <div
                  className="w-full max-w-[460px] aspect-square"
                  style={{
                    transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
                    transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  <DefenseLayer />
                </div>
              </div>
            </div>
          </CyberScene>

          {/* ════════════════════════════════════════════════════════════
              SCENE 05: SHADOW CODE SOCIETY (FINALE & HAND-OFF)
              ════════════════════════════════════════════════════════════ */}
          <CyberScene id="scene-society">
            <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 relative">
              {/* Grand Central Crest */}
              <div
                className="relative"
                style={{
                  transform: `translate3d(${mousePos.x * 8}px, ${mousePos.y * 8}px, 0)`,
                  transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <SecurityCore bootStage="society" size="lg" />
              </div>

              {/* Tagline */}
              <div className="space-y-3">
                <div className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#FF4D1C] uppercase font-semibold">
                  // SHADOW CODE SOCIETY
                </div>
                <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight">
                  LEARN. <span className="text-[#FF4D1C]">HACK.</span> DEFEND.
                </h2>
                <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
                  Join an autonomous research node committed to defensive engineering, ethical exploitation, and national CTF dominance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link to="/join" onClick={() => soundFx.playTick()}>
                  <Button size="lg" variant="primary" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                    APPLY FOR CADET ACCESS
                  </Button>
                </Link>
                <a
                  href="#domains"
                  onClick={(e) => {
                    e.preventDefault();
                    soundFx.playTick();
                    document.getElementById('deck-specializations')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4 text-[#FF4D1C]" />}>
                    VIEW SPECIALIZATIONS ↓
                  </Button>
                </a>
              </div>
            </div>
          </CyberScene>
        </div>

        {/* ── Fixed Floating Telemetry Controller (Scrub Progress) ─── */}
        <ScrollController
          currentStage={currentStage}
          progress={scrollProgress}
          onSelectStage={handleJumpToStage}
        />
      </div>
    </div>
  );
};

export default CyberExperience;
