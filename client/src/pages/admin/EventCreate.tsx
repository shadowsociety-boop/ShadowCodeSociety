import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Upload, Calendar, AlertCircle } from 'lucide-react';

export const EventCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Workshop');
  const [mode, setMode] = useState<'ONLINE' | 'OFFLINE' | 'HYBRID'>('OFFLINE');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('Computer Science Lab - Block A');
  const [meetingLink, setMeetingLink] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('80');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [banner, setBanner] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const eventTypes = ['Workshop', 'CTF', 'Seminar', 'Hackathon', 'Meetup', 'Other'];
  const modes = ['OFFLINE', 'ONLINE', 'HYBRID'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !date.trim() || !description.trim()) {
      setError('Please provide title, event date, and full description.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('eventType', eventType);
    formData.append('mode', mode);
    formData.append('date', date);
    if (startTime.trim()) formData.append('startTime', startTime);
    if (endTime.trim()) formData.append('endTime', endTime);
    if (location.trim()) formData.append('location', location);
    if (meetingLink.trim()) formData.append('meetingLink', meetingLink);
    if (maxParticipants.trim()) formData.append('maxParticipants', maxParticipants);
    if (shortDescription.trim()) formData.append('shortDescription', shortDescription);
    formData.append('description', description);
    formData.append('featured', String(featured));
    formData.append('published', String(published));
    if (banner) formData.append('banner', banner);

    setLoading(true);
    try {
      const data = await eventService.createEvent(formData);
      // Navigate to form builder to configure questions!
      navigate(`/admin/events/${data.event.id}/form`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <Link to="/admin/events" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO EVENTS</span>
      </Link>

      <Card className="p-8 sm:p-10 border-white/10">
        <div className="mb-6 pb-6 border-b border-white/10">
          <Badge variant="orange" className="mb-2">OPERATION INITIALIZATION</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            Create New Society Event
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            After saving basic details, you will be directed to customize the registration question builder.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Event Title"
            required
            placeholder="e.g. Reverse Engineering & Binary Exploitation 101"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              placeholder="e.g. Lab 4, Block B"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Meeting Link (if Online/Hybrid)"
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
            placeholder="Brief 1-sentence teaser for cards..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />

          <Textarea
            label="Full Detailed Description"
            required
            rows={5}
            placeholder="Detailed curriculum, agenda, speaker details, prerequisites..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Banner Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 font-medium">
              Event Banner Graphic (Optional)
            </label>
            <div className="border border-dashed border-white/10 hover:border-white/20 rounded-xl p-4 text-center cursor-pointer bg-[#0a0c13]">
              <input
                type="file"
                id="banner-file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setBanner(e.target.files?.[0] || null)}
              />
              <label htmlFor="banner-file" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                <span className="text-xs text-zinc-300 font-mono">
                  {banner ? banner.name : 'Select JPG, PNG or WEBP banner'}
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
              <span>Publish immediately to public website</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-[#FF4D1C] focus:ring-[#FF4D1C]"
              />
              <span>Feature on homepage banner</span>
            </label>
          </div>

          <div className="pt-6 border-t border-white/10">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Save & Proceed to Form Builder →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
