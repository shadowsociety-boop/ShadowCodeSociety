import React, { useState, useEffect } from 'react';
import { highlightService, HighlightItem } from '../services/highlight.service';
import { Badge } from '../components/ui/Badge';
import { Calendar, Tag, Maximize2 } from 'lucide-react';
import { TextReveal, FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

export const Highlights: React.FC = () => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<HighlightItem | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await highlightService.listHighlights();
        setHighlights(data.highlights || []);
      } catch (err) {
        console.error('Failed to load highlights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-16">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <FadeIn delay={0.05}>
          <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
            // FIELD MEMORIES & ACHIEVEMENTS
          </span>
        </FadeIn>
        <TextReveal as="h1" delay={0.1} duration={0.8} className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          MISSION HIGHLIGHTS.
        </TextReveal>
        <FadeIn delay={0.2}>
          <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
            Moments from national CTF tournaments, hardware hacking workshops, security drills, and community gatherings.
          </p>
        </FadeIn>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-[#666666]">
          LOADING GALLERY ARCHIVE...
        </div>
      ) : highlights.length === 0 ? (
        <div className="text-center py-20 bg-[#080808] rounded border border-white/10 space-y-2">
          <div className="text-sm font-mono text-[#A1A1A1]">NO HIGHLIGHTS RECORDED</div>
          <p className="text-xs text-[#666666]">Images will appear here following scheduled operations.</p>
        </div>
      ) : (
        /* Asymmetric Editorial Gallery */
        <StaggerContainer stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {highlights.map((item, idx) => {
            // Span varying columns for masonry rhythm
            const colSpan = idx % 5 === 0 ? 'lg:col-span-8' : idx % 5 === 1 ? 'lg:col-span-4' : idx % 5 === 2 ? 'lg:col-span-4' : idx % 5 === 3 ? 'lg:col-span-4' : 'lg:col-span-4';
            return (
              <StaggerItem key={item.id} className={`${colSpan} flex flex-col`}>
                <div
                  onClick={() => setSelectedImage(item)}
                  className="w-full h-full group relative bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 min-h-[300px] flex flex-col justify-end p-6"
                >
                  {/* Background Image / Abstract Overlay */}
                  {item.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <div className="absolute inset-0 bg-[#050505]/70" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-[#080808] flex items-center justify-center">
                      <div className="text-xs font-mono text-[#666666]">IMAGE RECORD</div>
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#FF4D1C] border border-[#FF4D1C]/30 uppercase font-semibold">
                        {item.category || 'OPERATION'}
                      </span>
                      {item.date && (
                        <span className="text-[10px] font-mono text-zinc-400">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-[#A1A1A1] line-clamp-2 font-sans">
                        {item.description}
                      </p>
                    )}

                    {/* Accent Line */}
                    <div className="h-[2px] w-0 bg-[#FF4D1C] group-hover:w-full transition-all duration-300" />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#0B0B0B] border border-white/15 rounded-xl overflow-hidden shadow-2xl space-y-4 p-6"
          >
            {selectedImage.image && (
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[60vh] object-contain rounded"
              />
            )}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#FF4D1C] uppercase font-semibold">
                {selectedImage.category}
              </span>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="text-xs text-[#A1A1A1] font-sans pt-1">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
