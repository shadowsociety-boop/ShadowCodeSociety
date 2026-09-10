import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService, EventItem } from '../../services/event.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  Calendar,
  PlusCircle,
  Search,
  Sliders,
  FileSpreadsheet,
  Trash2,
  Edit,
  ExternalLink,
  Users,
  Star,
  CheckCircle,
} from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.adminListEvents({ search: search || undefined });
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to fetch admin events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete event "${title}"?`)) return;
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange" size="md">MANAGEMENT MATRIX</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Event & Operations Control
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Publish, edit schedules, customize dynamic registration forms, and manage participant quotas.
          </p>
        </div>

        <Link to="/admin/events/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#0a0c13] p-4 rounded-2xl border border-white/10">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Total Indexed: <strong className="text-white">{events.length}</strong>
        </span>
      </div>

      {/* Events Table / Card List */}
      <Card className="p-0 overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121520] border-b border-white/10 text-zinc-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Event Title & Type</th>
                <th className="px-6 py-3.5">Date / Mode</th>
                <th className="px-6 py-3.5">Attendees</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Form Builder</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    LOADING EVENTS...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    NO EVENTS RECORDED
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const dateStr = new Date(event.date).toLocaleDateString();
                  const regCount = event._count?.registrations || 0;
                  const maxCap = event.maxParticipants || 'Open';

                  return (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={event.eventType === 'CTF' ? 'red' : 'orange'}>
                            {event.eventType}
                          </Badge>
                          {event.featured && (
                            <Star className="w-3.5 h-3.5 text-[#FF4D1C] fill-[#FF4D1C]" />
                          )}
                        </div>
                        <div className="font-bold text-white text-sm font-sans mt-1">
                          {event.title}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          /{event.slug}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                        <div>{dateStr}</div>
                        <span className="text-[10px] text-zinc-500">{event.mode}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-bold">{regCount}</span>
                        <span className="text-zinc-500"> / {maxCap}</span>
                        <Link
                          to={`/admin/registrations?eventId=${event.id}`}
                          className="block text-[10px] text-[#FF4D1C] hover:underline mt-0.5"
                        >
                          View Roster →
                        </Link>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            event.status === 'UPCOMING'
                              ? 'green'
                              : event.status === 'COMPLETED'
                              ? 'zinc'
                              : 'orange'
                          }
                        >
                          {event.status}
                        </Badge>
                        <span className="block text-[10px] text-zinc-500 mt-0.5">
                          {event.published ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/admin/events/${event.id}/form`}>
                          <Button variant="outline" size="sm" leftIcon={<Sliders className="w-3.5 h-3.5" />}>
                            Configure Form
                          </Button>
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <Link to={`/events/${event.slug}`} target="_blank">
                          <button
                            title="Preview Public Page"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          title="Delete Event"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
