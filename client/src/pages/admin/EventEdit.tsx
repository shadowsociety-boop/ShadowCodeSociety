import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService, EventItem } from '../../services/event.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import {
  ArrowLeft,
  Upload,
  Calendar,
  AlertCircle,
  CheckCircle,
  Sliders,
  Users,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

export const EventEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Event State
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Workshop');
  const [mode, setMode] = useState<'ONLINE' | 'OFFLINE' | 'HYBRID'>('OFFLINE');
  const [status, setStatus] = useState<'DRAFT' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('80');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [eventSlug, setEventSlug] = useState('');

  const eventTypes = ['Workshop', 'CTF', 'Seminar', 'Hackathon', 'Meetup', 'Competition', 'Other'];
  const modes = ['OFFLINE', 'ONLINE', 'HYBRID'];
  const statuses = ['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

  useEffect(() => {
    if (!id) return;
    const loadEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await eventService.getEventById(id);
        const ev = data.event;
        if (!ev) throw new Error('Event data not found');

        setTitle(ev.title || '');
        setEventType(ev.eventType || 'Workshop');
        setMode(ev.mode || 'OFFLINE');
        setStatus(ev.status || 'UPCOMING');
        setStartTime(ev.startTime || '');
        setEndTime(ev.endTime || '');
        setLocation(ev.location || '');
        setMeetingLink(ev.meetingLink || '');
        setMaxParticipants(ev.maxParticipants ? String(ev.maxParticipants) : '');
        setShortDescription(ev.shortDescription || '');
        setDescription(ev.description || '');
        setFeatured(Boolean(ev.featured));
        setPublished(Boolean(ev.published));
        setCurrentBanner(ev.banner || null);
        setEventSlug(ev.slug || '');

        if (ev.date) {
          const d = new Date(ev.date);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDate(`${yyyy}-${mm}-${dd}`);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError('');
    setSuccess('');

    if (!title.trim() || !date.trim() || !description.trim()) {
      setError('Please provide event title, date, and full description.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('eventType', eventType);
    formData.append('mode', mode);
    formData.append('status', status);
    formData.append('date', date);
    formData.append('startTime', startTime.trim());
    formData.append('endTime', endTime.trim());
    formData.append('location', location.trim());
    formData.append('meetingLink', meetingLink.trim());
    formData.append('maxParticipants', maxParticipants.trim());
    formData.append('shortDescription', shortDescription.trim());
    formData.append('description', description.trim());
    formData.append('featured', String(featured));
    formData.append('published', String(published));
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    setSaving(true);
    try {
      const data = await eventService.updateEvent(id, formData);
      setSuccess('Event specifications and description updated successfully!');
      if (data.event?.banner) {
        setCurrentBanner(data.event.banner);
      }
      if (data.event?.slug) {
        setEventSlug(data.event.slug);
      }
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update event specifications.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center text-xs font-mono text-zinc-400">
        LOADING EVENT SPECIFICATIONS...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Navigation and Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO EVENTS MATRIX</span>
        </Link>

        {id && (
          <div className="flex items-center gap-2">
            <Link to={`/admin/events/${id}/form`}>
              <Button variant="outline" size="sm" leftIcon={<Sliders className="w-3.5 h-3.5" />}>
                Form Builder
              </Button>
            </Link>
            <Link to={`/admin/registrations?eventId=${id}`}>
              <Button variant="outline" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>
                Roster
              </Button>
            </Link>
            {eventSlug && (
              <Link to={`/events/${eventSlug}`} target="_blank">
                <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Preview
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <Card className="p-8 sm:p-10 border-white/10">
        <div className="mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="orange">EVENT MODIFICATION // MATRIX</Badge>
            <Badge
              variant={
                status === 'UPCOMING'
                  ? 'green'
                  : status === 'COMPLETED'
                  ? 'zinc'
                  : status === 'DRAFT'
                  ? 'orange'
                  : 'red'
              }
            >
              {status}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-2">
            Edit Event Specifications
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Update event title, detailed description, schedule, capacity, and live status.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Event Title"
            required
            placeholder="e.g. Cyber Hunt II"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Event Type"
              options={eventTypes}
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            />
            <Select
              label="Delivery Mode"
              options={modes}
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            />
            <Select
              label="Operational Status"
              options={statuses}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Event Date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Physical Location"
              placeholder="e.g. JIET Conference Hall / Campus-wide"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Meeting Link (if Online / Hybrid)"
              placeholder="https://meet.google.com/..."
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>

          <Input
            label="Max Participant Capacity"
            type="number"
            placeholder="e.g. 100 (Leave blank for unlimited)"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />

          <Input
            label="Short Summary"
            placeholder="Brief 1-sentence teaser for cards and previews..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />

          <div className="space-y-1.5">
            <Textarea
              label="Full Detailed Description"
              required
              rows={8}
              placeholder="Detailed curriculum, rules, agenda, registration instructions, links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-[11px] font-mono text-zinc-500">
              Tip: Supports multi-line paragraphs, bullet points (•), rules, and external links.
            </p>
          </div>

          {/* Banner Upload & Current Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 font-medium">
              Event Banner Graphic
            </label>

            {currentBanner && (
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 mb-3 max-h-48">
                <img
                  src={currentBanner}
                  alt={title || 'Event banner'}
                  className="w-full h-48 object-cover opacity-90"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3 h-3 text-[#FF4D1C]" />
                  <span>Current Banner</span>
                </div>
              </div>
            )}

            <div className="border border-dashed border-white/10 hover:border-white/20 rounded-xl p-4 text-center cursor-pointer bg-[#0a0c13]">
              <input
                type="file"
                id="banner-edit-file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="banner-edit-file" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                <span className="text-xs text-zinc-300 font-mono">
                  {bannerFile ? bannerFile.name : currentBanner ? 'Replace Banner Image (JPG, PNG, WEBP)' : 'Select JPG, PNG or WEBP banner'}
                </span>
              </label>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 pt-2 font-mono text-xs text-zinc-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-[#FF4D1C] focus:ring-[#FF4D1C]"
              />
              <span>Published (Visible to public visitors)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-[#FF4D1C] focus:ring-[#FF4D1C]"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:flex-1"
              isLoading={saving}
            >
              {saving ? 'Saving Changes...' : 'Save Event Specifications'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/admin/events')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
