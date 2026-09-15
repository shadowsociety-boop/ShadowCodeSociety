import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ArrowLeft, Upload, Calendar, AlertCircle, Plus, Trash2, Target, Shield, Tag, Award, Laptop } from 'lucide-react';

const DEFAULT_OBJECTIVES = [
  {
    title: 'Live Exploitation',
    description: 'Hands-on execution in dedicated cloud sandboxes with isolated targets and real vulnerabilities.',
  },
  {
    title: 'Defensive Countermeasures',
    description: 'Understanding log telemetry, patch verification, and constructing detection rules.',
  },
];

const DEFAULT_RULES = [
  'Only designated target IP addresses and ranges are in-scope. Do not scan out-of-scope hosts.',
  'Denial of Service (DoS) attacks on scoring servers or event infrastructure are strictly prohibited.',
  'Collaboration and flag sharing between opposing teams will result in immediate disqualification.',
];

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
  const [objectives, setObjectives] = useState<Array<{ title: string; description: string }>>(DEFAULT_OBJECTIVES);
  const [rules, setRules] = useState<string[]>(DEFAULT_RULES);
  const [cost, setCost] = useState('FREE / COMPLIMENTARY');
  const [prerequisites, setPrerequisites] = useState('LAPTOP + BROWSER');
  const [certificate, setCertificate] = useState('ISSUED UPON COMPLETION');
  const [accessStatus, setAccessStatus] = useState('');
  const [passNote, setPassNote] = useState('Instant digital pass generated upon submission.');
  const [externalFormUrl, setExternalFormUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [banner, setBanner] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const eventTypes = ['Workshop', 'CTF', 'Seminar', 'Hackathon', 'Meetup', 'Other'];
  const modes = ['OFFLINE', 'ONLINE', 'HYBRID'];

  const handleAddObjective = () => {
    setObjectives([...objectives, { title: '', description: '' }]);
  };

  const handleUpdateObjective = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...objectives];
    updated[index] = { ...updated[index], [field]: value };
    setObjectives(updated);
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleAddRule = () => {
    setRules([...rules, '']);
  };

  const handleUpdateRule = (index: number, value: string) => {
    const updated = [...rules];
    updated[index] = value;
    setRules(updated);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

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
    formData.append('objectives', JSON.stringify(objectives));
    formData.append('rules', JSON.stringify(rules.filter((r) => r.trim().length > 0)));
    formData.append('cost', cost.trim());
    formData.append('prerequisites', prerequisites.trim());
    formData.append('certificate', certificate.trim());
    formData.append('accessStatus', accessStatus.trim());
    formData.append('passNote', passNote.trim());
    formData.append('externalFormUrl', externalFormUrl.trim());
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

          <RichTextEditor
            label="Full Detailed Description"
            required
            rows={6}
            placeholder="Detailed curriculum, agenda, speaker details, prerequisites..."
            value={description}
            onChange={setDescription}
          />

          {/* Section 02: Operational Objectives */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#FF4D1C]" />
                  <label className="text-xs font-mono tracking-wider uppercase text-white font-semibold">
                    02 // Operational Objectives ({objectives.length})
                  </label>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Core mission objectives and learning milestones displayed on the public event dossier.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddObjective}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Objective
              </Button>
            </div>

            <div className="space-y-3">
              {objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="bg-[#080808] border border-white/10 rounded-xl p-4 space-y-3 relative group transition-colors hover:border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D1C] font-bold">
                      OBJECTIVE #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Remove objective"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Objective Title (e.g. Live Exploitation)"
                      value={obj.title}
                      onChange={(e) => handleUpdateObjective(idx, 'title', e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D1C]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Brief operational breakdown and hands-on deliverables..."
                      value={obj.description}
                      onChange={(e) => handleUpdateObjective(idx, 'description', e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#FF4D1C] resize-none"
                    />
                  </div>
                </div>
              ))}
              {objectives.length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs font-mono text-zinc-500">
                  No objectives configured. Click &quot;+ Add Objective&quot; to define one.
                </div>
              )}
            </div>
          </div>

          {/* Section 03: Rules of Engagement */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF4D1C]" />
                  <label className="text-xs font-mono tracking-wider uppercase text-white font-semibold">
                    03 // Rules of Engagement ({rules.length})
                  </label>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Scope boundaries, participation rules, and disqualification protocols.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRule}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Rule
              </Button>
            </div>

            <div className="space-y-2.5">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 bg-[#080808] border border-white/10 rounded-xl p-3 focus-within:border-[#FF4D1C] transition-colors"
                >
                  <span className="text-xs font-mono text-[#FF4D1C] font-bold pt-2 flex-shrink-0 w-6 text-right">
                    {idx + 1}.
                  </span>
                  <textarea
                    rows={2}
                    placeholder={`Rule statement #${idx + 1}...`}
                    value={rule}
                    onChange={(e) => handleUpdateRule(idx, e.target.value)}
                    className="flex-1 bg-transparent border-0 p-1 text-xs font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors flex-shrink-0 mt-1"
                    title="Remove rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {rules.length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs font-mono text-zinc-500">
                  No rules configured. Click &quot;+ Add Rule&quot; to define one.
                </div>
              )}
            </div>
          </div>

          {/* Section: Sidebar Parameters & Pass Specifications */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF4D1C]" />
                <label className="text-xs font-mono tracking-wider uppercase text-white font-semibold">
                  Sidebar Parameters & Registration Info
                </label>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Customize the action sidebar on the public event page (Access Status, Cost, Prerequisites, Certificate, and Footnote).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Cost / Fee"
                placeholder="e.g. FREE / COMPLIMENTARY or ₹199"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
              <Input
                label="Prerequisites"
                placeholder="e.g. LAPTOP + BROWSER"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
              />
              <Input
                label="Certificate Status"
                placeholder="e.g. ISSUED UPON COMPLETION"
                value={certificate}
                onChange={(e) => setCertificate(e.target.value)}
              />
              <Input
                label="Access Status Override"
                placeholder="e.g. REGISTRATION OPEN (Leave blank for automatic)"
                value={accessStatus}
                onChange={(e) => setAccessStatus(e.target.value)}
              />
            </div>

            <Input
              label="Footer Note (Under Register Button)"
              placeholder="e.g. Instant digital pass generated upon submission."
              value={passNote}
              onChange={(e) => setPassNote(e.target.value)}
            />

            <div className="pt-2">
              <Input
                label="Third-Party / External Form Link (Optional)"
                placeholder="e.g. https://forms.gle/... or https://unstop.com/..."
                value={externalFormUrl}
                onChange={(e) => setExternalFormUrl(e.target.value)}
                helperText="When filled, clicking 'REGISTER NOW' on the public event page will open this link in a new tab instead of the internal registration form."
              />
            </div>
          </div>

          {/* Banner Upload */}
          <div className="space-y-1.5 pt-4 border-t border-white/10">
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
