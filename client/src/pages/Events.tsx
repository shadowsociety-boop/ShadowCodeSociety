import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService, EventItem } from '../services/event.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Calendar, MapPin, Clock, Search, ArrowRight, ArrowUpRight } from 'lucide-react';
import { TextReveal, FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.listEvents({
          search: search || undefined,
          type: selectedType !== 'ALL' ? selectedType : undefined,
          status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        });
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [search, selectedType, selectedStatus]);

  const categories = ['ALL', 'Workshop', 'CTF', 'Seminar', 'Hackathon', 'Meetup'];
  const statuses = ['ALL', 'UPCOMING', 'COMPLETED'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-12">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <FadeIn>
          <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
            // SCHEDULE
          </span>
        </FadeIn>
        <TextReveal as="h1">
          <span className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight block">
            OPERATIONS
          </span>
        </TextReveal>
        <FadeIn delay={0.2}>
          <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
            Upcoming missions, workshops, CTF competitions, and offensive security drills.
          </p>
        </FadeIn>
      </div>

      {/* Filter Ribbon */}
      <FadeIn delay={0.1}>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#080808] p-4 rounded border border-white/10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operations by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050505] border border-white/10 rounded pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FF4D1C] placeholder-zinc-700"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              className={`px-3 py-1 rounded text-xs font-mono tracking-wider transition-colors ${
                selectedType === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/[0.04] text-[#A1A1A1] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      </FadeIn>

      {/* Events List / Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-[#666666]">
          QUERYING MISSION OPERATIONS DATABASE...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-[#080808] rounded border border-white/10 space-y-3">
          <div className="text-sm font-mono text-[#A1A1A1]">NO MATCHING OPERATIONS FOUND</div>
          <p className="text-xs text-[#666666]">Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <StaggerContainer stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isUpcoming = event.status === 'UPCOMING';
            const eventDate = new Date(event.date);
            return (
              <StaggerItem key={event.id}>
                <div className="h-full group relative bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
                  <div className="space-y-4">
                    {/* Category & Date Header */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#FF4D1C] font-semibold tracking-wider uppercase">
                        {event.eventType}
                      </span>
                      <span className="text-[#666666]">
                        {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#A1A1A1] line-clamp-3 font-sans leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Footer Details & Action */}
                  <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#666666]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF4D1C]" />
                      <span className="truncate max-w-[130px]">{event.location}</span>
                    </div>

                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono text-white group-hover:text-[#FF4D1C] font-medium tracking-wider uppercase transition-colors"
                    >
                      <span>{isUpcoming ? 'REGISTER' : 'DETAILS'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
};
