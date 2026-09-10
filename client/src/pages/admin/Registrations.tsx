import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { eventService, EventItem } from '../../services/event.service';
import { registrationService, RegistrationItem, RegistrationStats } from '../../services/registration.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const AdminRegistrations: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId') || '';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load all events for dropdown
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.adminListEvents({ limit: 100 });
        const list = data.events || [];
        setEvents(list);
        if (!selectedEventId && list.length > 0) {
          setSelectedEventId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load events for registrations:', err);
      }
    };
    loadEvents();
  }, []);

  // Load registrations when selectedEventId or filters change
  useEffect(() => {
    if (!selectedEventId) return;
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const [regData, statsData] = await Promise.all([
          registrationService.listRegistrations(selectedEventId, {
            search: search || undefined,
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
          }),
          registrationService.getStats(selectedEventId).catch(() => null),
        ]);
        setRegistrations(regData.registrations || []);
        if (statsData) setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchRegistrations, 300);
    return () => clearTimeout(timer);
  }, [selectedEventId, search, statusFilter]);

  const handleStatusChange = async (regId: string, newStatus: string) => {
    try {
      await registrationService.updateStatus(regId, newStatus);
      setRegistrations(prev =>
        prev.map(r => (r.id === regId ? { ...r, status: newStatus as any } : r))
      );
    } catch {
      alert('Failed to update attendee status.');
    }
  };

  const handleExportExcel = () => {
    if (!selectedEventId) return;
    window.location.href = `/api/events/${selectedEventId}/export`;
  };

  const currentEvent = events.find(e => e.id === selectedEventId);
  const statuses = ['ALL', 'REGISTERED', 'WAITLISTED', 'ATTENDED', 'CANCELLED', 'NO_SHOW'];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="green" size="md">ATTENDEE ROSTER</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Registration Management & Export
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Monitor registered delegates, check attendance status, and export real Excel (.xlsx) reports.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleExportExcel}
          disabled={!selectedEventId}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export to Excel (.xlsx)
        </Button>
      </div>

      {/* Event Selector & Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 lg:col-span-2 border-white/10 bg-[#0c0e14]">
          <label className="text-xs font-mono uppercase text-zinc-400 block mb-2 font-semibold">
            Active Event Operation:
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setSearchParams({ eventId: e.target.value });
            }}
            className="w-full bg-[#141722] text-white border border-white/10 rounded-xl px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#FF4D1C]"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({new Date(e.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </Card>

        {/* Quick Stats Pill */}
        <Card className="p-4 border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Registered</span>
            <span className="text-2xl font-black text-white font-['Space_Grotesk']">{stats?.total ?? registrations.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FF4D1C]/10 text-[#FF4D1C]">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Waitlist / Overflow</span>
            <span className="text-2xl font-black text-[#FF4D1C] font-['Space_Grotesk']">{stats?.waitlisted ?? 0}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FF4D1C]/10 text-[#FF4D1C]">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0c13] p-4 rounded-2xl border border-white/10">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Filter by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono uppercase transition-all ${
                statusFilter === st
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121520] border-b border-white/10 text-zinc-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Ticket #</th>
                <th className="px-6 py-3.5">Attendee Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Custom Form Responses</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    SEARCHING ATTENDEE DATABASE...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    NO ATTENDEES MATCHING CURRENT FILTER
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#FF4D1C]">
                      #{String(reg.registrationNumber).padStart(4, '0')}
                    </td>

                    <td className="px-6 py-4 font-bold text-white font-sans">
                      {reg.name}
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {reg.email}
                    </td>

                    <td className="px-6 py-4">
                      {reg.responses && Object.keys(reg.responses).length > 0 ? (
                        <div className="space-y-1 max-w-xs">
                          {Object.entries(reg.responses).slice(0, 2).map(([k, v]) => (
                            <div key={k} className="truncate text-zinc-400">
                              <span className="text-zinc-600 uppercase">{k}:</span> {String(v)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-600">Standard Pass</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          reg.status === 'ATTENDED'
                            ? 'green'
                            : reg.status === 'WAITLISTED'
                            ? 'orange'
                            : reg.status === 'CANCELLED'
                            ? 'red'
                            : 'cyan'
                        }
                      >
                        {reg.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <select
                        value={reg.status}
                        onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                        className="bg-[#141722] text-xs text-zinc-200 border border-white/10 rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#FF4D1C]"
                      >
                        <option value="REGISTERED">REGISTERED</option>
                        <option value="WAITLISTED">WAITLISTED</option>
                        <option value="ATTENDED">ATTENDED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="NO_SHOW">NO_SHOW</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
