import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Calendar,
  Sparkles,
  Video,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export interface SliderMediaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  type: 'image' | 'video';
  mediaUrl: string;
  posterUrl?: string;
}

interface HighlightSliderProps {
  items?: SliderMediaItem[];
  autoPlayInterval?: number;
}

// Real SCS event media from society archives
const DEFAULT_SLIDES: SliderMediaItem[] = [
  {
    id: 'hl-vid-1',
    title: 'Shadow Code Society // Live Event Highlight Reel',
    description: 'Captured moments from our campus-wide cybersecurity events, workshops, and interactive sessions at JIET Universe.',
    category: 'Event',
    date: '2025-11-22',
    type: 'video',
    mediaUrl: '/media/event-highlight.mov',
    posterUrl: '/media/workshop-presentation.jpg',
  },
  {
    id: 'hl-img-1',
    title: 'Technical Workshop // Linux Timeline & Systems Deep Dive',
    description: 'Members engaged in an interactive session on the evolution of Linux, open-source systems, and kernel architecture at JIET Universe.',
    category: 'Workshop',
    date: '2025-10-14',
    type: 'image',
    mediaUrl: '/media/workshop-presentation.jpg',
  },
  {
    id: 'hl-img-2',
    title: 'Shadow Code Society // Full Team Assembly',
    description: 'The complete SCS roster assembled after a successful workshop session — researchers, operators, and new recruits united.',
    category: 'Team',
    date: '2025-09-08',
    type: 'image',
    mediaUrl: '/media/team-group-photo.jpg',
  },
  {
    id: 'hl-img-3',
    title: 'Core Team Award Ceremony // JIET Recognition',
    description: 'The SCS founding core team being recognized and awarded for outstanding contributions to campus cybersecurity education and research.',
    category: 'Achievement',
    date: '2025-07-30',
    type: 'image',
    mediaUrl: '/media/award-ceremony.jpg',
  },
  {
    id: 'hl-img-4',
    title: 'Seminar & Knowledge Exchange // Campus-Wide Gathering',
    description: 'Society-hosted seminar bringing together students from across departments for hands-on security awareness and collaborative learning.',
    category: 'Seminar',
    date: '2025-06-19',
    type: 'image',
    mediaUrl: '/media/members-gathering.jpg',
  },
];


export const HighlightSlider: React.FC<HighlightSliderProps> = ({
  items = DEFAULT_SLIDES,
  autoPlayInterval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<SliderMediaItem | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentItem = items[currentIndex] || items[0];

  // Handle auto-advance
  useEffect(() => {
    if (!isPlaying || isHovered || lightboxItem) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    progressTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentIndex, isPlaying, isHovered, lightboxItem, items.length, autoPlayInterval]);

  const goToNext = () => {
    soundFx.playTick();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrev = () => {
    soundFx.playTick();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleSelect = (idx: number) => {
    soundFx.playTick();
    setCurrentIndex(idx);
  };

  const togglePlayPause = () => {
    soundFx.playTick();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    soundFx.playTick();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div
      className="relative w-full space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── MAIN CINEMATIC SCREEN ────────────────────────────────────── */}
      <div className="relative rounded-2xl bg-[#080808] border border-white/15 overflow-hidden shadow-2xl min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col justify-end">
        
        {/* Active Media (Image or Video) with Cross-Fade Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#050505] overflow-hidden"
          >
            {currentItem.type === 'video' ? (
              <video
                ref={videoRef}
                src={currentItem.mediaUrl}
                poster={currentItem.posterUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={currentItem.mediaUrl}
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Flat Solid Contrast Dimmer */}
            <div className="absolute inset-0 bg-[#050505]/65 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* ── TOP CONTROLS & TELEMETRY HEADER ──────────────────────────── */}
        <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 mb-auto">
          {/* Category & Media Type Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded bg-black/80 text-[#FF4D1C] border border-[#FF4D1C]/30 uppercase font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse" />
              {currentItem.category}
            </span>

            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-black/70 text-[#A1A1A1] border border-white/10 uppercase flex items-center gap-1.5">
              {currentItem.type === 'video' ? (
                <>
                  <Video className="w-3 h-3 text-[#FF4D1C]" />
                  <span>4K VIDEO FEED</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3 h-3 text-white" />
                  <span>FIELD RECORD</span>
                </>
              )}
            </span>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            {currentItem.type === 'video' && (
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg bg-black/80 border border-white/10 text-[#A1A1A1] hover:text-white transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FF4D1C]" />}
              </button>
            )}

            <button
              onClick={togglePlayPause}
              className="p-2 rounded-lg bg-black/80 border border-white/10 text-[#A1A1A1] hover:text-white transition-colors"
              title={isPlaying ? 'Pause Slider' : 'Play Slider'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#FF4D1C]" />}
            </button>

            <button
              onClick={() => {
                soundFx.playChime();
                setLightboxItem(currentItem);
              }}
              className="p-2 rounded-lg bg-black/80 border border-white/10 text-[#A1A1A1] hover:text-white transition-colors"
              title="Expand Fullscreen Preview"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── BOTTOM CAPTION & NARRATIVE OVERLAY ───────────────────────── */}
        <div className="relative z-20 p-6 sm:p-10 space-y-4 max-w-3xl text-left">
          {currentItem.date && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1A1]">
              <Calendar className="w-3.5 h-3.5 text-[#FF4D1C]" />
              <span>
                {new Date(currentItem.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-[#666666]">//</span>
              <span className="text-[#FF4D1C] font-mono">MISSION {String(currentIndex + 1).padStart(2, '0')}</span>
            </div>
          )}

          <h3 className="font-['Syne'] font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            {currentItem.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#A1A1A1] font-sans leading-relaxed line-clamp-3">
            {currentItem.description}
          </p>

          {/* Navigation Arrows & Counter */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-lg bg-black/80 hover:bg-white/10 border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-lg bg-black/80 hover:bg-white/10 border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs font-mono text-[#A1A1A1]">
              <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-[#666666]"> / </span>
              <span>{String(items.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── THUMBNAIL TRACK WITH REALTIME COUNTDOWN PROGRESS BARS ─────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-left">
        {items.map((item, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(idx)}
              className={`group relative p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-[#0B0B0B] border-[#FF4D1C] shadow-lg'
                  : 'bg-[#070707] border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              {/* Active Slide Top Progress Line */}
              {isActive && isPlaying && !isHovered && (
                <motion.div
                  key={`prog-${idx}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
                  className="absolute top-0 left-0 h-[2px] bg-[#FF4D1C]"
                />
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-[#FF4D1C] font-bold' : 'text-[#666666]'}>
                    0{idx + 1}
                  </span>
                  <span className="text-[#666666] uppercase text-[9px]">
                    {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
                  </span>
                </div>

                <div className={`text-xs font-bold font-['Space_Grotesk'] line-clamp-1 transition-colors ${
                  isActive ? 'text-white' : 'text-[#A1A1A1] group-hover:text-white'
                }`}>
                  {item.title}
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#666666] pt-2">
                {item.category}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── LIGHTBOX FULLSCREEN MODAL ─────────────────────────────────── */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full bg-[#0B0B0B] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#111111]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/30 uppercase font-semibold">
                    {lightboxItem.category}
                  </span>
                  <span className="text-xs font-mono text-[#A1A1A1]">
                    {lightboxItem.date && new Date(lightboxItem.date).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1A1] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Media Player */}
              <div className="relative max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
                {lightboxItem.type === 'video' ? (
                  <video
                    src={lightboxItem.mediaUrl}
                    controls
                    autoPlay
                    className="max-h-[65vh] w-full object-contain"
                  />
                ) : (
                  <img
                    src={lightboxItem.mediaUrl}
                    alt={lightboxItem.title}
                    className="max-h-[65vh] w-full object-contain"
                  />
                )}
              </div>

              {/* Caption */}
              <div className="p-6 space-y-2 text-left">
                <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                  {lightboxItem.title}
                </h3>
                <p className="text-sm text-[#A1A1A1] font-sans leading-relaxed">
                  {lightboxItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
