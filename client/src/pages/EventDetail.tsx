import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService, EventItem } from '../services/event.service';
import { getImageUrl } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FormattedDescription } from '../components/FormattedDescription';
import { soundFx } from '../utils/sound';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

export const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      try {
        const data = await eventService.getEventBySlug(slug);
        setEvent(data.event);
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center text-xs font-mono text-[#666666]">
        LOADING OPERATION SPECIFICATIONS...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">OPERATION RECORD NOT FOUND</h2>
        <Link to="/events">
          <Button variant="secondary" size="sm">Back to All Operations</Button>
        </Link>
      </div>
    );
  }

  const isUpcoming = event.status === 'UPCOMING';
  const eventDate = new Date(event.date);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-12">
      {/* Back Link */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1A1] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO OPERATIONS</span>
      </Link>

      {/* Official Event Graphic Banner */}
      {event.banner && (
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#080808] shadow-2xl group">
          <img
            src={getImageUrl(event.banner)}
            alt={event.title}
            className="w-full max-h-[460px] object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3 text-[#FF4D1C]" />
            <span>EVENT BANNER</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF4D1C]/[0.06] blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] uppercase font-semibold border border-[#FF4D1C]/30">
              {event.eventType}
            </span>
            <span className="text-xs font-mono text-[#666666]">
              STATUS: {event.status}
            </span>
          </div>

          <h1 className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight max-w-3xl">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#A1A1A1] pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF4D1C]" />
              <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF4D1C]" />
              <span>{event.location}</span>
            </div>
            {event.maxParticipants && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF4D1C]" />
                <span>CAPACITY: {event._count?.registrations || 0} / {event.maxParticipants} SEATS</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Registration Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Deep Operational Dossier */}
        <div className="lg:col-span-8 space-y-10">
          {/* About */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
              01 // ABOUT THE OPERATION
            </h2>
            <div className="bg-[#080808] border border-white/[0.08] rounded-xl p-6 font-sans text-sm text-[#A1A1A1] leading-relaxed">
              <FormattedDescription content={event.description} />
            </div>
          </div>

          {/* What You'll Learn / Objectives */}
          {(() => {
            const defaultObjectives = [
              {
                title: 'Live Exploitation',
                description: 'Hands-on execution in dedicated cloud sandboxes with isolated targets and real vulnerabilities.',
              },
              {
                title: 'Defensive Countermeasures',
                description: 'Understanding log telemetry, patch verification, and constructing detection rules.',
              },
            ];

            let objectivesList = defaultObjectives;
            if (event.objectives) {
              if (Array.isArray(event.objectives)) {
                objectivesList = event.objectives as any;
              } else if (typeof event.objectives === 'string') {
                try {
                  const parsed = JSON.parse(event.objectives);
                  if (Array.isArray(parsed)) {
                    objectivesList = parsed;
                  }
                } catch {
                  // Keep default if unparseable
                }
              }
            }

            if (!objectivesList || objectivesList.length === 0) return null;

            return (
              <div className="space-y-4">
                <h2 className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
                  02 // OPERATIONAL OBJECTIVES
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {objectivesList.map((obj, idx) => (
                    <div key={idx} className="bg-[#080808] border border-white/[0.08] rounded-lg p-5 space-y-2">
                      <span className="text-xs font-mono text-white font-bold block">{obj.title}</span>
                      <p className="text-xs text-[#A1A1A1] leading-relaxed">
                        {obj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Rules & Guidelines */}
          {(() => {
            const defaultRules = [
              'Only designated target IP addresses and ranges are in-scope. Do not scan out-of-scope hosts.',
              'Denial of Service (DoS) attacks on scoring servers or event infrastructure are strictly prohibited.',
              'Collaboration and flag sharing between opposing teams will result in immediate disqualification.',
            ];

            let rulesList = defaultRules;
            if (event.rules) {
              if (Array.isArray(event.rules)) {
                rulesList = event.rules as any;
              } else if (typeof event.rules === 'string') {
                try {
                  const parsed = JSON.parse(event.rules);
                  if (Array.isArray(parsed)) {
                    rulesList = parsed;
                  }
                } catch {
                  const lines = event.rules.split('\n').map((l: string) => l.trim()).filter(Boolean);
                  if (lines.length > 0) {
                    rulesList = lines;
                  }
                }
              }
            }

            if (!rulesList || rulesList.length === 0) return null;

            return (
              <div className="space-y-4">
                <h2 className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
                  03 // RULES OF ENGAGEMENT
                </h2>
                <div className="bg-[#080808] border border-white/[0.08] rounded-lg p-6 space-y-2.5 text-xs font-mono text-[#A1A1A1]">
                  {rulesList.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#FF4D1C] font-bold flex-shrink-0">{idx + 1}.</span>
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right: Sticky Action Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-[#0B0B0B] border border-white/15 rounded-xl p-6 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#666666] uppercase block">ACCESS STATUS</span>
              <div className="text-xl font-bold font-['Space_Grotesk'] text-white">
                {event.accessStatus || (isUpcoming ? 'REGISTRATION OPEN' : 'OPERATION CONCLUDED')}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono text-[#A1A1A1]">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#666666] flex-shrink-0">COST</span>
                <span className="text-[#FF4D1C] font-bold text-right">
                  {event.cost || 'FREE / COMPLIMENTARY'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#666666] flex-shrink-0">PREREQUISITES</span>
                <span className="text-white text-right">
                  {event.prerequisites || 'LAPTOP + BROWSER'}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#666666] flex-shrink-0">CERTIFICATE</span>
                <span className="text-white text-right">
                  {event.certificate || 'ISSUED UPON COMPLETION'}
                </span>
              </div>
            </div>

            {isUpcoming ? (
              event.externalFormUrl ? (
                <a
                  href={event.externalFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full"
                    rightIcon={<ExternalLink className="w-4 h-4" />}
                  >
                    REGISTER NOW
                  </Button>
                </a>
              ) : (
                <Link to={`/events/${event.slug}/register`} className="block w-full">
                  <Button size="lg" variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    REGISTER NOW
                  </Button>
                </Link>
              )
            ) : (
              <Button size="lg" variant="secondary" disabled className="w-full">
                REGISTRATION CLOSED
              </Button>
            )}

            {(event.passNote !== null && event.passNote !== undefined ? event.passNote.trim() : 'Instant digital pass generated upon submission.') && (
              <div className="pt-2 text-center">
                <span className="text-[10px] font-mono text-[#666666]">
                  {event.passNote || 'Instant digital pass generated upon submission.'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
