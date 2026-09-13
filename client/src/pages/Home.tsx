import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService, EventItem } from '../services/event.service';
import { resourceService, ResourceItem } from '../services/resource.service';
import { memberService, MemberItem } from '../services/member.service';
import { highlightService, HighlightItem } from '../services/highlight.service';
import { HighlightSlider, SliderMediaItem } from '../components/HighlightSlider';
import { TextReveal, FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { Button } from '../components/ui/Button';
import { HeroVisual } from '../components/HeroVisual';
import { ScrollStackSection } from '../components/ScrollStackSection';
import { DottedWorldMapBg } from '../components/DottedWorldMapBg';
import { soundFx } from '../utils/sound';
import {
  ArrowRight,
  ArrowUpRight,
  Terminal,
  Calendar,
  MapPin,
  Award,
} from 'lucide-react';

export const Home: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightItem | null>(null);
  const [mentor, setMentor] = useState<MemberItem | null>(null);
  const [, setLoading] = useState(true);

  // Active domain hover state
  const [activeDomain, setActiveDomain] = useState<number>(0);

  // Terminal Easter Egg state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Shadow Code Society Shell v3.0 // Type "help" or "events" to execute.',
    'Session authenticated: GUEST_OPERATOR [0xSCS]',
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, resourcesData, membersData, highlightsData] = await Promise.all([
          eventService.listEvents({ limit: 4 }),
          resourceService.listResources({ limit: 5 }),
          memberService.listMembers('CURRENT'),
          highlightService.listHighlights({ limit: 4 }).catch(() => ({ highlights: [] })),
        ]);
        const loadedEvents: EventItem[] = (eventsData.events || []).sort((a: EventItem, b: EventItem) => {
          if (a.slug === 'cyber-hunt-ii') return -1;
          if (b.slug === 'cyber-hunt-ii') return 1;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setEvents(loadedEvents);
        setResources(resourcesData.resources || []);

        const fetchedHighlights: HighlightItem[] = highlightsData.highlights || [];
        if (fetchedHighlights.length > 0) {
          setHighlights(fetchedHighlights.slice(0, 4));
        } else {
          // Curated fallback highlights if database has none
          setHighlights([
            {
              id: 'hl-1',
              title: 'Core Team Award Ceremony // JIET Recognition',
              description: 'The SCS founding core team being recognized and awarded for outstanding contributions to campus cybersecurity education and research.',
              category: 'Achievement',
              featured: true,
              date: '2025-11-18',
              image: '/media/award-ceremony.jpg',
              createdAt: '2025-11-18T00:00:00.000Z',
              updatedAt: '2025-11-18T00:00:00.000Z',
            },
            {
              id: 'hl-2',
              title: 'Technical Workshop // Linux Timeline & Systems Deep Dive',
              description: 'Members engaged in an interactive session on the evolution of Linux, open-source systems, and kernel architecture at JIET Universe.',
              category: 'Workshop',
              featured: false,
              date: '2025-09-24',
              image: '/media/workshop-presentation.jpg',
              createdAt: '2025-09-24T00:00:00.000Z',
              updatedAt: '2025-09-24T00:00:00.000Z',
            },
            {
              id: 'hl-3',
              title: 'Seminar & Knowledge Exchange // Campus-Wide Gathering',
              description: 'Society-hosted seminar bringing together students from across departments for hands-on security awareness and collaborative learning.',
              category: 'Event',
              featured: false,
              date: '2025-08-12',
              image: '/media/members-gathering.jpg',
              createdAt: '2025-08-12T00:00:00.000Z',
              updatedAt: '2025-08-12T00:00:00.000Z',
            },
          ]);

        }

        const allMembers: MemberItem[] = membersData.members || [];
        const foundMentor = allMembers.find(
          (m) =>
            m.role.toLowerCase().includes('mentor') ||
            m.role.toLowerCase().includes('faculty')
        );
        setMentor(foundMentor || allMembers[0] || null);
        setMembers(allMembers.filter((m) => m.id !== foundMentor?.id).slice(0, 5));
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    soundFx.playGlitch();

    let reply = `Command not recognized: "${cmd}". Type "help" for options.`;
    if (cmd === 'help') {
      reply = 'AVAILABLE COMMANDS: help, events, whoami, join, status, clear, ethics';
    } else if (cmd === 'events') {
      reply = `Active events in queue: ${events.map((e) => e.title).join(' | ') || 'None'}`;
    } else if (cmd === 'whoami') {
      reply =
        'GUEST_OPERATOR // Privileges: READ_PUBLIC. Apply to join for full society credentials.';
    } else if (cmd === 'join') {
      reply = 'Navigating to candidate application portal...';
      window.location.href = '/join';
      return;
    } else if (cmd === 'status') {
      reply = 'CORE SYSTEMS: 100% OPERATIONAL // FIREWALL: ACTIVE // ENCRYPTION: AES-GCM-256';
    } else if (cmd === 'ethics') {
      reply =
        'OFFENSE FOR DEFENSE. We never attack systems without written authorization. Hack responsibly.';
    } else if (cmd === 'clear') {
      setTerminalLogs(['Console cleared. Ready for input.']);
      setTerminalInput('');
      return;
    }

    setTerminalLogs((prev) => [...prev, `> ${terminalInput}`, reply]);
    setTerminalInput('');
  };

  const domainList = [
    {
      num: '01',
      title: 'WEB SECURITY & EXPLOITATION',
      tag: 'APPSEC',
      desc: 'Deep inspection of client-side vulnerabilities, server-side request forgeries (SSRF), GraphQL authorization flaws, and zero-day authentication bypasses.',
    },
    {
      num: '02',
      title: 'NETWORK SECURITY & TELEMETRY',
      tag: 'NETSEC',
      desc: 'Traffic analysis, packet sniffing, protocol reverse engineering, IDS/IPS evasion techniques, and perimeter firewall auditing.',
    },
    {
      num: '03',
      title: 'CLOUD SECURITY & DEVSECOPS',
      tag: 'CLOUDSEC',
      desc: 'IAM privilege escalation, container escape vulnerabilities, Kubernetes cluster hardening, and secure continuous integration pipelines.',
    },
    {
      num: '04',
      title: 'DIGITAL FORENSICS & INCIDENT RESPONSE',
      tag: 'DFIR',
      desc: 'Volatile memory dump analysis via Volatility 3, timeline reconstruction, rootkit detection, and active threat hunting.',
    },
    {
      num: '05',
      title: 'OSINT & RECONNAISSANCE',
      tag: 'INTEL',
      desc: 'Open Source Intelligence gathering, passive DNS graph analysis, satellite metadata extraction, and attack surface discovery.',
    },
    {
      num: '06',
      title: 'CRYPTOGRAPHY & CIPHER VAULTS',
      tag: 'CRYPTO',
      desc: 'Cryptanalysis of modern ciphers, RSA factorization attacks, Elliptic Curve vulnerabilities, and post-quantum lattice constructions.',
    },
    {
      num: '07',
      title: 'COMPETITIVE CTF OPERATIONS',
      tag: 'CTF',
      desc: 'Specialized training for national and international Jeopardy & Attack-Defense Capture The Flag competitions.',
    },
    {
      num: '08',
      title: 'OFFENSIVE SECURITY RESEARCH',
      tag: 'RESEARCH',
      desc: 'Vulnerability disclosure, proof-of-concept development, kernel exploitation, and whitepaper publications.',
    },
  ];

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen overflow-x-hidden selection:bg-[#FF4D1C]/25 selection:text-[#FF4D1C] relative">

      {/* ── DECK 01: CINEMATIC EDITORIAL HERO SECTION ───────────────── */}
      <ScrollStackSection index={0} badge="CORE OVERVIEW" className="bg-[#050505]">
        <div className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden hairline-b">
          {/* Subtle Background Grid & World Map Hero Atmosphere */}
          <div className="absolute inset-0 bg-subtle-grid opacity-20 pointer-events-none" />

          <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Massive Editorial Typography */}
              <div className="lg:col-span-7 text-left space-y-8">
                {/* Category Pill Tag */}

                {/* Giant Headline — staggered height-reveal per line */}
                <div className="space-y-1">
                  <h1 className="font-['Syne'] font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-[0.92]">
                    {/* Line 1: ENTER */}
                    <span className="block overflow-hidden pb-1">
                      <motion.span
                        className="block"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        ENTER
                      </motion.span>
                    </span>

                    {/* Line 2: THE */}
                    <span className="block overflow-hidden pb-1">
                      <motion.span
                        className="block"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        THE
                      </motion.span>
                    </span>

                    {/* Line 3: SHADOW. (accent color) */}
                    <span className="block overflow-hidden pb-1">
                      <motion.span
                        className="block text-[#FF4D1C]"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      >
                        SHADOW.
                      </motion.span>
                    </span>
                  </h1>
                </div>

                {/* Supporting Statement — fade up after headline */}
                <motion.p
                  className="text-base sm:text-lg text-[#A1A1A1] max-w-xl font-sans leading-relaxed pt-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  Shadow Code Society is an elite cybersecurity collective where students dissect real-world vulnerabilities, master offensive tradecraft, and build resilient defense architectures.
                </motion.p>

                {/* Action Buttons — fade up staggered */}
                <motion.div
                  className="flex flex-wrap items-center gap-4 pt-4"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
                >
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
                </motion.div>

                {/* Sub-header Metatag */}

              </div>

              {/* Right Column: Sophisticated Hero Visual — scale-in reveal */}
              <motion.div
                className="lg:col-span-5 flex justify-center"
                initial={{ opacity: 0, scale: 0.88, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <HeroVisual />
              </motion.div>
            </div>
          </div>
        </div>
      </ScrollStackSection>

      {/* ── DECK 02: MISSION HIGHLIGHTS SECTION (AUTO SLIDER) ───────── */}
      <ScrollStackSection index={1} className="bg-[#080808]">
        <div className="py-20 sm:py-32 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <FadeIn>
                  <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
                    // FIELD RECORDS & LIVESTREAM
                  </span>
                </FadeIn>
                <TextReveal as="h2" className="mt-2">
                  <span className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                    MISSION HIGHLIGHTS
                  </span>
                </TextReveal>
                <FadeIn delay={0.15}>
                  <p className="text-sm text-[#A1A1A1] mt-2 font-sans">
                    Auto-playing field dispatches, tournament victories, live exploit demos, and hardware reverse engineering footage.
                  </p>
                </FadeIn>
              </div>
              <FadeIn delay={0.2}>
                <Link to="/highlights">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    VIEW ARCHIVE GALLERY
                  </Button>
                </Link>
              </FadeIn>
            </div>

            {/* High-Tech Auto Image & Video Slider */}
            <FadeIn delay={0.25} y={40}>
              <HighlightSlider autoPlayInterval={5500} />
            </FadeIn>
          </div>
        </div>
      </ScrollStackSection>

      {/* ── DECK 03: CORE CAPABILITIES / SPECIALIZATIONS ────────────── */}
      <ScrollStackSection index={2} className="bg-[#070707]">
        <div className="py-24 sm:py-32 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <FadeIn>
                  <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
                    // SPECIALIZATIONS
                  </span>
                </FadeIn>
                <TextReveal as="h2" className="mt-2">
                  <span className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                    CORE CAPABILITIES
                  </span>
                </TextReveal>
              </div>
              <FadeIn delay={0.15}>
                <p className="text-xs font-mono text-[#A1A1A1] max-w-sm">
                  HOVER TO INSPECT RESEARCH DOMAINS & OPERATIONAL SPECIALIZATIONS.
                </p>
              </FadeIn>
            </div>

            {/* Interactive Editorial Domain List */}
            <FadeIn delay={0.1} y={20}>
            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {domainList.map((domain, index) => {
                const isSelected = activeDomain === index;
                return (
                  <div
                    key={domain.num}
                    onMouseEnter={() => {
                      setActiveDomain(index);
                      soundFx.playTick();
                    }}
                    className={`group py-7 sm:py-8 px-4 transition-all duration-300 cursor-pointer ${isSelected ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                      }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Number & Domain Title */}
                      <div className="lg:col-span-6 flex items-center gap-6">
                        <span
                          className={`text-xs font-mono transition-colors duration-200 ${isSelected ? 'text-[#FF4D1C] font-bold' : 'text-[#666666]'
                            }`}
                        >
                          {domain.num}
                        </span>
                        <h3
                          className={`text-lg sm:text-2xl font-bold font-['Space_Grotesk'] tracking-tight transition-colors duration-200 ${isSelected ? 'text-white' : 'text-[#A1A1A1] group-hover:text-white'
                            }`}
                        >
                          {domain.title}
                        </h3>
                      </div>

                      {/* Tag */}
                      <div className="lg:col-span-2 hidden lg:block">
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#0B0B0B] border border-white/10 text-[#666666] group-hover:text-[#A1A1A1] uppercase tracking-wider">
                          {domain.tag}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-4">
                        <p
                          className={`text-xs sm:text-sm font-sans leading-relaxed transition-colors duration-200 ${isSelected ? 'text-[#A1A1A1]' : 'text-[#666666] group-hover:text-[#A1A1A1]'
                            }`}
                        >
                          {domain.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </FadeIn>
          </div>
        </div>
      </ScrollStackSection>

      {/* ── DECK 04: FEATURED OPERATION (CTF BANNER) ───────────────── */}
      <ScrollStackSection index={3} className="bg-[#080808]">
        <div className="py-20 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative rounded-2xl border border-white/15 bg-[#0B0B0B] p-8 sm:p-14 overflow-hidden shadow-2xl">
              {/* Dotted World Map & Atmospheric Node Telemetry */}
              <DottedWorldMapBg opacity={0.45} highlightNodes={true} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-8 space-y-5">
                  <FadeIn>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FF4D1C]/15 border border-[#FF4D1C]/30 text-[10px] font-mono tracking-widest text-[#FF4D1C] uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
                      ACTIVE COMPETITION // CAMPUS PRIORITY
                    </div>
                  </FadeIn>

                  <TextReveal as="h3">
                    <span className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                      CYBER HUNT II // TECHNICAL SCAVENGER HUNT
                    </span>
                  </TextReveal>

                  <FadeIn delay={0.15}>
                    <p className="text-sm sm:text-base text-[#A1A1A1] max-w-2xl font-sans leading-relaxed">
                      Get ready for Cyber Hunt II, an entry-level technical scavenger hunt across college campus! Decode beginner-friendly riddles, solve logic puzzles, and scan hidden QR codes to reach the final terminal first.
                    </p>
                  </FadeIn>

                  <FadeIn delay={0.25}>
                    <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-[#A1A1A1]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF4D1C]" />
                        <span>18 SEPTEMBER 2026</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FF4D1C]" />
                        <span>CAMPUS-WIDE // JIET JODHPUR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#FF4D1C]" />
                        <span className="text-[#FF4D1C] font-semibold">TEAMS: 3–6 MEMBERS</span>
                      </div>
                    </div>
                  </FadeIn>
                </div>

                <FadeIn delay={0.3} className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-start lg:items-end">
                  <Link to="/events/cyber-hunt-ii" className="w-full sm:w-auto">
                    <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      REGISTER FOR HUNT
                    </Button>
                  </Link>
                  <Link to="/events" className="w-full sm:w-auto">
                    <Button size="lg" variant="secondary">
                      VIEW ALL MISSIONS
                    </Button>
                  </Link>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </ScrollStackSection>

      {/* ── DECK 05: OPERATIONS / UPCOMING SCHEDULE ─────────────────── */}
      <ScrollStackSection index={4} className="bg-[#060606]">
        <div className="py-20 sm:py-32 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div>
                <FadeIn>
                  <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
                    // SCHEDULE
                  </span>
                </FadeIn>
                <TextReveal as="h2" className="mt-2">
                  <span className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                    OPERATIONS
                  </span>
                </TextReveal>
                <FadeIn delay={0.15}>
                  <p className="text-sm text-[#A1A1A1] mt-2 font-sans">
                    Upcoming missions, workshops, and offensive security drills.
                  </p>
                </FadeIn>
              </div>
              <FadeIn delay={0.2}>
                <Link to="/events">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    VIEW ALL EVENTS
                  </Button>
                </Link>
              </FadeIn>
            </div>

            {/* Asymmetric Events Grid */}
            <StaggerContainer stagger={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <StaggerItem key={event.id}>
                <div
                  className="group relative bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#FF4D1C] font-semibold">{event.eventType}</span>
                      <span className="text-[#666666]">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-xs text-[#A1A1A1] line-clamp-3 font-sans leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#666666]">
                      <MapPin className="w-3 h-3 text-[#FF4D1C]" />
                      <span className="truncate max-w-[140px]">{event.location}</span>
                    </div>

                    <Link
                      to={`/events/${event.slug}`}
                      className="text-xs font-mono text-white hover:text-[#FF4D1C] flex items-center gap-1 transition-colors"
                    >
                      <span>DETAILS</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </ScrollStackSection>



      {/* ── DECK 07: THE ARCHIVE (KNOWLEDGE REPOSITORY TABLE) ──────── */}
      <ScrollStackSection index={5} className="bg-[#050505]">
        <div className="py-20 sm:py-32 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div>
                <FadeIn>
                  <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
                    // REPOSITORY
                  </span>
                </FadeIn>
                <TextReveal as="h2" className="mt-2">
                  <span className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                    THE ARCHIVE
                  </span>
                </TextReveal>
                <FadeIn delay={0.15}>
                  <p className="text-sm text-[#A1A1A1] mt-2 font-sans">
                    Knowledge left behind by the people who explored the system.
                  </p>
                </FadeIn>
              </div>
              <FadeIn delay={0.2}>
                <Link to="/resources">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    BROWSE ARCHIVE
                  </Button>
                </Link>
              </FadeIn>
            </div>

            {/* Editorial Table Layout with Responsive Overflow */}
            <FadeIn delay={0.1} y={20}>
            <div className="border border-white/[0.08] rounded-xl overflow-x-auto bg-[#0B0B0B]">
              <div className="min-w-[640px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-3.5 bg-white/[0.02] border-b border-white/[0.08] text-[11px] font-mono text-[#666666] uppercase tracking-wider">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">DOMAIN</div>
                  <div className="col-span-5">TITLE & TOPIC</div>
                  <div className="col-span-2">CONTRIBUTOR</div>
                  <div className="col-span-1 text-right">ACTION</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-white/[0.05]">
                  {resources.map((res, idx) => (
                    <Link
                      key={res.id}
                      to={`/resources/${res.slug}`}
                      className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors text-xs font-mono group"
                    >
                      <div className="col-span-1 text-[#666666]">0{idx + 1}</div>
                      <div className="col-span-3 text-[#FF4D1C] font-medium uppercase truncate pr-2">
                        {res.category}
                      </div>
                      <div className="col-span-5 font-sans text-sm text-white font-semibold group-hover:text-[#FF4D1C] transition-colors truncate pr-4">
                        {res.title}
                      </div>
                      <div className="col-span-2 text-[#A1A1A1] truncate">
                        {res.author || 'Research Team'}
                      </div>
                      <div className="col-span-1 text-right text-zinc-500 group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            </FadeIn>
          </div>
        </div>
      </ScrollStackSection>

      {/* ── DECK 08: THE PEOPLE BEHIND SHADOW (MEMBERS & MENTOR) ─────── */}
      <ScrollStackSection index={6} className="bg-[#080808]">
        <div className="py-24 sm:py-32 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <FadeIn>
                  <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
                    // RESEARCHERS
                  </span>
                </FadeIn>
                <TextReveal as="h2" className="mt-2">
                  <span className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                    THE PEOPLE BEHIND THE SHADOW
                  </span>
                </TextReveal>
              </div>
              <FadeIn delay={0.15}>
                <Link to="/members">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    VIEW FULL DIRECTORY
                  </Button>
                </Link>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Featured Mentor Card */}
              {mentor && (
                <FadeIn delay={0.1} className="lg:col-span-5 bg-[#0B0B0B] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] uppercase font-semibold border border-[#FF4D1C]/30">
                      FACULTY MENTOR & ADVISOR
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-4">
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-mono text-[#A1A1A1] mt-1">{mentor.role}</p>

                    <p className="text-sm text-[#A1A1A1] font-sans leading-relaxed mt-4">
                      {mentor.bio || 'Advising on high-assurance security engineering, ethical disclosure, and advanced exploitation research.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#666666]">
                    <span>LAB: ADVANCED SEC_01</span>
                    <Link to="/members" className="text-white hover:text-[#FF4D1C] transition-colors flex items-center gap-1">
                      <span>PROFILE</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </FadeIn>
              )}

              {/* Core Team Roster */}
              <StaggerContainer stagger={0.08} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {members.map((member) => (
                  <StaggerItem key={member.id}>
                  <div
                    className="bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 rounded-xl p-5 flex flex-col justify-between transition-colors h-full"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-[#FF4D1C] uppercase">
                        {member.role}
                      </span>
                      <h4 className="text-base font-bold font-['Space_Grotesk'] text-white mt-1">
                        {member.name}
                      </h4>
                      {member.bio && (
                        <p className="text-xs text-[#A1A1A1] line-clamp-2 mt-2 font-sans">
                          {member.bio}
                        </p>
                      )}
                    </div>

                    {member.skills && member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-white/[0.05]">
                        {member.skills.slice(0, 3).map((skill, sIdx) => (
                          <span key={sIdx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-[#A1A1A1]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </ScrollStackSection>

      {/* ── DECK 09: JOIN CTA & INTERACTIVE TERMINAL SHELL ───────────── */}
      <ScrollStackSection index={7} className="bg-[#050505]">
        <div className="py-24 sm:py-36 relative overflow-hidden">
          {/* Dotted Global Matrix Background */}
          <DottedWorldMapBg opacity={0.3} highlightNodes={true} />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <FadeIn>
              <span className="text-xs font-mono tracking-[0.25em] text-[#FF4D1C] uppercase font-semibold">
                // JOIN THE CORPS
              </span>
            </FadeIn>

            <TextReveal as="h2">
              <span className="font-['Syne'] font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[0.95] block">
                READY TO ENTER
              </span>
            </TextReveal>
            <TextReveal as="h2" delay={0.15}>
              <span className="font-['Syne'] font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[0.95] block">
                THE <span className="text-[#FF4D1C]">SHADOW?</span>
              </span>
            </TextReveal>

            <FadeIn delay={0.3}>
              <p className="text-base sm:text-lg text-[#A1A1A1] max-w-xl mx-auto font-sans leading-relaxed">
                Learn with us. Build with us. Break things responsibly. We accept candidates across all skill levels with a passion for offensive and defensive computer science.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link to="/join" onClick={() => soundFx.playChime()}>
                  <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    APPLY FOR MEMBERSHIP
                  </Button>
                </Link>
                <Link to="/about" onClick={() => soundFx.playTick()}>
                  <Button size="lg" variant="secondary">
                    EXPLORE SOCIETY CODE OF ETHICS
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Interactive Terminal Shell */}
          <FadeIn delay={0.2} y={40}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 text-left">
            <div className="rounded-xl bg-[#0B0B0B] border border-white/10 shadow-2xl overflow-hidden font-mono">
              {/* Terminal Chrome */}
              <div className="bg-[#111111] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#A1A1A1]">
                  <Terminal className="w-3.5 h-3.5 text-[#FF4D1C]" />
                  <span>shadowcode@corp:~$</span>
                </div>
                <span className="text-[10px] text-[#666666]">INTERACTIVE SHELL</span>
              </div>

              {/* Terminal Body */}
              <div className="p-4 bg-[#070707] text-xs space-y-2 min-h-[140px] max-h-56 overflow-y-auto text-[#A1A1A1]">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith('>') ? 'text-white font-bold' : ''}>
                    {log}
                  </div>
                ))}
              </div>

              {/* Terminal Input */}
              <form onSubmit={handleTerminalSubmit} className="flex border-t border-white/10 bg-[#090909]">
                <span className="pl-4 py-3 text-xs text-[#FF4D1C] select-none">&gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type 'help', 'events', 'whoami', 'join'..."
                  className="w-full bg-transparent px-3 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 text-xs text-[#A1A1A1] hover:text-white border-l border-white/10 uppercase"
                >
                  EXEC
                </button>
              </form>
            </div>
          </div>
          </FadeIn>
        </div>
      </ScrollStackSection>
    </div>
  );
};
