import React, { useState, useEffect, useRef } from 'react';
import { memberService } from '../../services/member.service';
import { adminService, PopupTransmission, PopupTransmissionHighlight } from '../../services/admin.service';
import { eventService, EventItem } from '../../services/event.service';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Settings,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Radio,
  Sparkles,
  MapPin,
  Users,
  Target,
  Calendar,
  Clock,
  Trash2,
  Plus,
  Eye,
  Save,
  ExternalLink,
  Smartphone,
  Monitor,
  X,
  ArrowRight,
  ShieldAlert,
  Award,
  Zap,
  Globe,
  FileText,
} from 'lucide-react';
import { renderHighlightIcon } from '../../components/CyberHuntPopup';

const DEFAULT_POPUP: PopupTransmission = {
  enabled: true,
  transmissionTag: '// ACTIVE TRANSMISSION • EVENT 18.09.2026',
  date: '18 SEPTEMBER 2026',
  title: 'CYBER HUNT II',
  subtitle: 'Campus-Wide Technical Scavenger Hunt',
  description: `Get ready for Cyber Hunt II, an entry-level technical scavenger hunt designed to test your observational skills, basic tech knowledge, and teamwork!

Spread across the college campus, teams will decode beginner-friendly riddles, solve simple logic puzzles, and scan hidden QR codes to uncover clues that lead to the next destination. Perfect for first-time participants, this level requires zero advanced coding skills — just quick thinking, sharp eyes, and a good strategy.`,
  showBanner: false,
  banner: null,
  highlights: [
    { icon: 'sparkles', label: 'Level', value: 'Basic (Beginner-Friendly)' },
    { icon: 'mapPin', label: 'Venue', value: 'Campus-wide (JIET Jodhpur)' },
    { icon: 'users', label: 'Team Size', value: '3–6 Members' },
    { icon: 'target', label: 'Objective', value: 'Decode clues & reach final terminal' },
  ],
  ctaText: 'REGISTER TEAM',
  ctaLink: '/events/cyber-hunt-ii',
  footerNote: 'LIMITED TEAM SLOTS AVAILABLE',
  expiryDate: '2026-09-18T23:59:59',
};

const AVAILABLE_ICONS = [
  { id: 'sparkles', label: 'Sparkles / Level' },
  { id: 'mapPin', label: 'MapPin / Venue' },
  { id: 'users', label: 'Users / Team Size' },
  { id: 'target', label: 'Target / Objective' },
  { id: 'calendar', label: 'Calendar / Date' },
  { id: 'clock', label: 'Clock / Duration' },
  { id: 'award', label: 'Award / Prize' },
  { id: 'shield', label: 'Shield / Security' },
  { id: 'zap', label: 'Zap / Speed' },
  { id: 'globe', label: 'Globe / Online' },
  { id: 'fileText', label: 'Document / Info' },
];

export const AdminSettings: React.FC = () => {
  const { isMentor } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'popup' | 'governance'>('popup');

  // Popup Transmission State
  const [popupData, setPopupData] = useState<PopupTransmission>(DEFAULT_POPUP);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerUrlInput, setBannerUrlInput] = useState('');
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  // Preview State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Governance State
  const [admins, setAdmins] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [selectedAdminId, setSelectedAdminId] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [savingPopup, setSavingPopup] = useState(false);
  const [savingPresident, setSavingPresident] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch popup settings
        try {
          const popupRes = await adminService.getPopupTransmission();
          if (popupRes?.popup) {
            setPopupData({ ...DEFAULT_POPUP, ...popupRes.popup });
            if (popupRes.popup.banner) {
              setBannerPreview(popupRes.popup.banner);
              setBannerUrlInput(popupRes.popup.banner);
            }
          }
        } catch (err) {
          console.warn('Could not load popup transmission settings:', err);
        }

        // Fetch events for quick prefill
        try {
          const eventsRes = await eventService.listEvents({ limit: 50 });
          if (eventsRes?.events) {
            setEventsList(eventsRes.events);
          }
        } catch (err) {
          console.warn('Could not load events list:', err);
        }

        // Fetch admins if mentor
        if (isMentor) {
          try {
            const data = await memberService.getAdmins();
            const list = data.admins || [];
            setAdmins(list);
            const pres = list.find((a) => a.role === 'PRESIDENT');
            if (pres) setSelectedAdminId(pres.id);
          } catch (err) {
            console.warn('Could not load admins list:', err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isMentor]);

  // Handle banner file selection
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
      setBannerUrlInput('');
      setPopupData((prev) => ({ ...prev, showBanner: true }));
    }
  };

  // Handle banner URL input
  const handleBannerUrlBlur = () => {
    if (bannerUrlInput.trim()) {
      setBannerPreview(bannerUrlInput.trim());
      setBannerFile(null);
      setPopupData((prev) => ({ ...prev, banner: bannerUrlInput.trim(), showBanner: true }));
    }
  };

  // Remove banner
  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setBannerUrlInput('');
    setPopupData((prev) => ({ ...prev, banner: null, showBanner: false }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Populate from existing event
  const handlePopulateFromEvent = () => {
    const event = eventsList.find((e) => e.id === selectedEventId);
    if (!event) return;

    const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).toUpperCase();

    const transmissionTag = `// ACTIVE TRANSMISSION • ${event.eventType.toUpperCase()} ${new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

    let bannerUrl = event.banner || null;
    if (bannerUrl) {
      setBannerPreview(bannerUrl);
      setBannerUrlInput(bannerUrl);
      setBannerFile(null);
    }

    setPopupData((prev) => ({
      ...prev,
      enabled: true,
      title: event.title,
      subtitle: event.shortDescription || `${event.eventType} // SHADOW CODE SOCIETY`,
      transmissionTag,
      date: formattedDate,
      description: event.description?.slice(0, 350) || prev.description,
      showBanner: !!bannerUrl,
      banner: bannerUrl,
      highlights: [
        { icon: 'sparkles', label: 'Category', value: event.eventType || 'Event' },
        { icon: 'mapPin', label: 'Venue', value: event.location || 'Campus' },
        { icon: 'users', label: 'Capacity', value: event.maxParticipants ? `${event.maxParticipants} Slots` : 'Open Entry' },
        { icon: 'target', label: 'Access Mode', value: event.mode || 'Offline' },
      ],
      ctaText: 'REGISTER NOW',
      ctaLink: event.externalFormUrl || `/events/${event.slug}`,
      footerNote: 'CONFIRMED PASSES ISSUED UPON SUBMISSION',
      expiryDate: new Date(new Date(event.date).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19),
    }));

    setSuccessMessage(`Form prefilled from "${event.title}". Adjust any fields and click Save.`);
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  // Highlights handlers
  const handleHighlightChange = (index: number, field: keyof PopupTransmissionHighlight, value: string) => {
    setPopupData((prev) => {
      const nextHighlights = [...prev.highlights];
      nextHighlights[index] = { ...nextHighlights[index], [field]: value };
      return { ...prev, highlights: nextHighlights };
    });
  };

  const handleAddHighlight = () => {
    if (popupData.highlights.length >= 6) {
      alert('Maximum 6 highlight metrics permitted.');
      return;
    }
    setPopupData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { icon: 'sparkles', label: 'Field', value: 'Details' }],
    }));
  };

  const handleRemoveHighlight = (index: number) => {
    setPopupData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  // Save popup settings
  const handleSavePopup = async () => {
    setSavingPopup(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('enabled', String(popupData.enabled));
      formData.append('transmissionTag', popupData.transmissionTag);
      formData.append('date', popupData.date);
      formData.append('title', popupData.title);
      formData.append('subtitle', popupData.subtitle);
      formData.append('description', popupData.description);
      formData.append('showBanner', String(popupData.showBanner));
      formData.append('highlights', JSON.stringify(popupData.highlights));
      formData.append('ctaText', popupData.ctaText);
      formData.append('ctaLink', popupData.ctaLink);
      formData.append('footerNote', popupData.footerNote);
      if (popupData.expiryDate) {
        formData.append('expiryDate', popupData.expiryDate);
      }

      if (bannerFile) {
        formData.append('banner', bannerFile);
      } else if (bannerPreview) {
        formData.append('banner', bannerPreview);
      } else {
        formData.append('banner', '');
      }

      const res = await adminService.updatePopupTransmission(formData);
      if (res?.popup) {
        setPopupData({ ...DEFAULT_POPUP, ...res.popup });
        if (res.popup.banner) {
          setBannerPreview(res.popup.banner);
        }
      }

      setSuccessMessage('Transmission broadcast popup settings updated and published live!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.response?.data?.error || 'Failed to save broadcast popup settings.');
    } finally {
      setSavingPopup(false);
    }
  };

  // Assign President handler
  const handleAssignPresident = async () => {
    if (!selectedAdminId) return;
    setSavingPresident(true);
    setSuccessMessage('');
    try {
      const res = await memberService.assignPresident(selectedAdminId);
      setSuccessMessage(res.message || 'President role reassigned successfully.');
      const data = await memberService.getAdmins();
      setAdmins(data.admins || []);
    } catch {
      alert('Failed to assign president.');
    } finally {
      setSavingPresident(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="orange" size="md">ADMIN COMMAND CENTER</Badge>
            <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            System Protocols & Broadcast Control
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Configure site-wide event broadcast popups, banner overlays, and society governance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#121520] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('popup')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'popup'
                ? 'bg-[#FF4D1C] text-white shadow-[0_0_15px_rgba(255,77,28,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Event Pop-up Broadcast</span>
          </button>

          {isMentor && (
            <button
              onClick={() => setActiveTab('governance')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'governance'
                  ? 'bg-[#FF4D1C] text-white shadow-[0_0_15px_rgba(255,77,28,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Governance</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#FF4D1C]/10 border border-[#FF4D1C]/30 text-xs font-mono text-[#FF4D1C] flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(255,77,28,0.15)] animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: EVENT POP-UP BROADCAST */}
      {activeTab === 'popup' && (
        <div className="space-y-6">
          {/* Top Quick Actions Bar */}
          <Card className="p-5 sm:p-6 border-white/10 bg-[#090b10] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${popupData.enabled ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-zinc-600'}`} />
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  TRANSMISSION STATUS: {popupData.enabled ? (
                    <span className="text-emerald-400">ACTIVE // BROADCASTING ON SITE</span>
                  ) : (
                    <span className="text-zinc-500">OFFLINE // HIDDEN</span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400">
                  Toggle whether visitors see this pop-up modal when loading the homepage.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <label className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={popupData.enabled}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 accent-[#FF4D1C] rounded cursor-pointer"
                />
                <span className="text-xs font-mono text-white font-semibold">Enable Broadcast</span>
              </label>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreviewModal(true)}
                leftIcon={<Eye className="w-3.5 h-3.5 text-[#FF4D1C]" />}
              >
                Preview Pop-up
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePopup}
                isLoading={savingPopup}
                leftIcon={<Save className="w-3.5 h-3.5" />}
                className="shadow-[0_0_20px_rgba(255,77,28,0.3)]"
              >
                Publish Changes
              </Button>
            </div>
          </Card>

          {/* Quick Import From Events */}
          {eventsList.length > 0 && (
            <Card className="p-5 border-white/10 bg-[#0c0e16]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#FF4D1C] tracking-wider block font-bold">
                    // QUICK AUTOMATION
                  </span>
                  <h4 className="text-xs font-bold text-white font-mono">
                    Auto-Fill Pop-up From An Existing Event
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Select any published event to copy its title, banner, venue, date, and registration link instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="flex-1 sm:w-64 bg-[#121520] text-white border border-white/10 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#FF4D1C]"
                  >
                    <option value="">-- Choose an Event --</option>
                    {eventsList.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.eventType})
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!selectedEventId}
                    onClick={handlePopulateFromEvent}
                    className="text-xs shrink-0"
                  >
                    Auto-Fill
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Banner Configuration Card */}
          <Card className="p-6 border-white/10 space-y-5">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <Badge variant="orange">HERO DISPLAY</Badge>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk'] mt-1">
                  Pop-up Banner Image
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Upload a high-resolution cyber banner or specify an image URL to render at the top of the pop-up modal.
                </p>
              </div>
              <ImageIcon className="w-6 h-6 text-[#FF4D1C]/60" />
            </div>

            {/* Toggle Show Banner */}
            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <input
                type="checkbox"
                id="showBannerCheck"
                checked={popupData.showBanner}
                onChange={(e) => setPopupData((prev) => ({ ...prev, showBanner: e.target.checked }))}
                className="w-4 h-4 accent-[#FF4D1C] rounded cursor-pointer"
              />
              <label htmlFor="showBannerCheck" className="text-xs font-mono text-zinc-200 cursor-pointer">
                Display Banner Image at Top of Pop-up Modal
              </label>
            </div>

            {/* Banner Preview & Upload Area */}
            <div className="space-y-4">
              {bannerPreview ? (
                <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-[#FF4D1C]/30 bg-black/40 group">
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-black/40" />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={handleRemoveBanner}
                      className="px-2.5 py-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-mono flex items-center gap-1.5 shadow-lg transition-colors"
                      title="Remove banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Banner</span>
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-300 bg-black/70 px-2 py-1 rounded border border-white/10">
                    CURRENT BANNER PREVIEW
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-[#FF4D1C]/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]"
                >
                  <Upload className="w-8 h-8 text-[#FF4D1C]/70 mx-auto mb-2" />
                  <p className="text-xs font-mono text-zinc-300 font-semibold">
                    Click to upload a banner image file
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1">
                    PNG, JPG, WEBP, GIF up to 10MB (recommended 1200x630 or 16:9)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerFileChange}
                className="hidden"
              />

              {/* Or URL input */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-500 uppercase">OR Image URL:</span>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  value={bannerUrlInput}
                  onChange={(e) => setBannerUrlInput(e.target.value)}
                  onBlur={handleBannerUrlBlur}
                  className="flex-1 bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:border-[#FF4D1C]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBannerUrlBlur}
                  className="text-xs shrink-0"
                >
                  Apply URL
                </Button>
              </div>
            </div>
          </Card>

          {/* Transmission Metadata & Header Details */}
          <Card className="p-6 border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] border-b border-white/10 pb-3">
              Transmission Identity & Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                  Top Transmission Signal Tag:
                </label>
                <input
                  type="text"
                  value={popupData.transmissionTag}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, transmissionTag: e.target.value }))}
                  placeholder="// ACTIVE TRANSMISSION • EVENT 18.09.2026"
                  className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                  Event Date Badge:
                </label>
                <input
                  type="text"
                  value={popupData.date}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, date: e.target.value }))}
                  placeholder="18 SEPTEMBER 2026"
                  className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                  Main Event Title:
                </label>
                <input
                  type="text"
                  value={popupData.title}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="CYBER HUNT II"
                  className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-sm font-['Syne'] font-bold focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                  Subtitle / Category Tagline:
                </label>
                <input
                  type="text"
                  value={popupData.subtitle}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="CAMPUS-WIDE TECHNICAL SCAVENGER HUNT"
                  className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-[#FF4D1C] font-semibold focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="pt-1">
              <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                Event Description / Body:
              </label>
              <textarea
                rows={4}
                value={popupData.description}
                onChange={(e) => setPopupData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed event briefing, rules summary, and what participants can expect..."
                className="w-full bg-[#121520] text-zinc-200 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#FF4D1C] leading-relaxed"
              />
            </div>
          </Card>

          {/* Key Highlights Matrix */}
          <Card className="p-6 border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  Highlight Cards (2x2 Matrix)
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Crucial event parameters displayed prominently in the pop-up (Level, Venue, Team Size, Objective, etc.).
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddHighlight}
                leftIcon={<Plus className="w-3.5 h-3.5 text-[#FF4D1C]" />}
              >
                Add Card
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {popupData.highlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e0e0e] border border-white/10 rounded-xl p-3 space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {renderHighlightIcon(hl.icon)}
                      <select
                        value={hl.icon}
                        onChange={(e) => handleHighlightChange(idx, 'icon', e.target.value)}
                        className="bg-[#1a1d2c] text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-[#FF4D1C]"
                      >
                        {AVAILABLE_ICONS.map((ico) => (
                          <option key={ico.id} value={ico.id}>
                            {ico.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Label</span>
                      <input
                        type="text"
                        value={hl.label}
                        onChange={(e) => handleHighlightChange(idx, 'label', e.target.value)}
                        className="w-full bg-[#161822] text-white border border-white/10 rounded-lg px-2 py-1 text-xs font-mono"
                        placeholder="e.g. Venue"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Value</span>
                      <input
                        type="text"
                        value={hl.value}
                        onChange={(e) => handleHighlightChange(idx, 'value', e.target.value)}
                        className="w-full bg-[#161822] text-white border border-white/10 rounded-lg px-2 py-1 text-xs font-sans font-semibold"
                        placeholder="e.g. Campus"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Button & Link Configuration */}
          <Card className="p-6 border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] border-b border-white/10 pb-3">
              Action Destination & Scheduling
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                  CTA Button Text:
                </label>
                <input
                  type="text"
                  value={popupData.ctaText}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="REGISTER TEAM"
                  className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5 flex items-center justify-between">
                  <span>Target Link (URL or Internal Route):</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Supports Google Forms / Unstop</span>
                </label>
                <input
                  type="text"
                  value={popupData.ctaLink}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, ctaLink: e.target.value }))}
                  placeholder="/events/cyber-hunt-ii or https://forms.gle/..."
                  className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                  Bottom Footer Note:
                </label>
                <input
                  type="text"
                  value={popupData.footerNote}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, footerNote: e.target.value }))}
                  placeholder="LIMITED TEAM SLOTS AVAILABLE"
                  className="w-full bg-[#121520] text-zinc-400 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-1.5">
                  Auto-Expiry Date & Time (Optional):
                </label>
                <input
                  type="datetime-local"
                  value={popupData.expiryDate ? popupData.expiryDate.slice(0, 16) : ''}
                  onChange={(e) => setPopupData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-mono text-zinc-500">
                Changes take effect across the entire site immediately upon publishing.
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowPreviewModal(true)}
                  leftIcon={<Eye className="w-4 h-4 text-[#FF4D1C]" />}
                  className="w-full sm:w-auto"
                >
                  Preview Pop-up
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSavePopup}
                  isLoading={savingPopup}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-[0_0_20px_rgba(255,77,28,0.4)]"
                >
                  Save & Publish Broadcast
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: GOVERNANCE (MENTOR ONLY) */}
      {activeTab === 'governance' && isMentor && (
        <div className="space-y-6">
          <Card className="p-8 border-white/10 space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <Badge variant="orange">GOVERNANCE APPOINTMENT</Badge>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mt-1">
                  Designate Society President
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Only faculty mentors have clearance to appoint or transfer the presidential mantle.
                </p>
              </div>
              <Shield className="w-8 h-8 text-[#FF4D1C]/50" />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold">
                Select Administrator to designate as President:
              </label>
              <select
                value={selectedAdminId}
                onChange={(e) => setSelectedAdminId(e.target.value)}
                className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#FF4D1C]"
              >
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email}) — Current Role: [{a.role}]
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                size="md"
                onClick={handleAssignPresident}
                isLoading={savingPresident}
                leftIcon={<UserCheck className="w-4 h-4" />}
              >
                Confirm Presidential Appointment
              </Button>
            </div>
          </Card>

          {/* System Parameter Specifications */}
          <Card className="p-8 border-white/10 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider border-b border-white/10 pb-3">
              Active Security Policies
            </h3>
            <div className="space-y-2 text-zinc-300">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-500">JWT Token Expiry</span>
                <span>24 Hours (HttpOnly, Lax)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-500">Rate Limiting Threshold</span>
                <span>200 requests / 15 minutes per IP</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-500">Storage Destination</span>
                <span>Hybrid (Cloudinary CDN / Local Fallback)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">CORS Protection</span>
                <span className="text-[#FF4D1C]">Active (Strict Origin Whitelist)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* LIVE INTERACTIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-[#07080b] border border-white/15 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Modal Header with Device Switcher */}
            <div className="p-3.5 bg-[#0f121d] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#FF4D1C] font-bold">
                  LIVE POP-UP PREVIEW
                </span>
                {/* Device Selector */}
                <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-[#FF4D1C] text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile View (375px)</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-[#FF4D1C] text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop View (672px)</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Stage Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-radial from-zinc-900/50 via-[#07080b] to-[#07080b]">
              {/* Simulated Device Frame */}
              <div
                className={`transition-all duration-300 w-full ${
                  previewDevice === 'mobile' ? 'max-w-[380px]' : 'max-w-2xl'
                }`}
              >
                <div className="w-full bg-[#090909] border border-[#FF4D1C]/40 rounded-2xl shadow-[0_0_50px_rgba(255,77,28,0.22)] overflow-hidden text-left flex flex-col max-h-[85vh]">
                  {/* Top Tactical Signal Bar */}
                  <div className="bg-[#FF4D1C]/10 border-b border-[#FF4D1C]/20 px-3.5 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-ping shrink-0" />
                      <span className="w-2 h-2 rounded-full bg-[#FF4D1C] -ml-4 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FF4D1C] uppercase font-bold truncate">
                        {popupData.transmissionTag || '// ACTIVE TRANSMISSION'}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 bg-white/5 shrink-0">
                      <X className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Banner in Preview */}
                  {popupData.showBanner && bannerPreview && (
                    <div className="relative w-full h-32 sm:h-44 bg-zinc-900 overflow-hidden shrink-0 border-b border-white/5">
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/40 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 sm:left-6">
                        <span className="px-2 py-0.5 rounded bg-black/70 border border-[#FF4D1C]/30 text-[9px] font-mono text-[#FF4D1C] uppercase tracking-wider font-semibold">
                          SIGNAL BROADCAST
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain relative custom-scrollbar">
                    <div className="space-y-1.5">
                      {popupData.date && (
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-300">
                          <Calendar className="w-3 h-3 text-[#FF4D1C]" />
                          <span>DATE: {popupData.date}</span>
                        </div>
                      )}
                      <h3 className="font-['Syne'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                        {popupData.title || 'EVENT TITLE'}
                      </h3>
                      {popupData.subtitle && (
                        <p className="text-[11px] sm:text-xs font-mono text-[#FF4D1C] tracking-wider uppercase font-semibold">
                          {popupData.subtitle}
                        </p>
                      )}
                    </div>

                    {popupData.description && (
                      <div className="space-y-2 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-line">
                        {popupData.description}
                      </div>
                    )}

                    {/* Highlights */}
                    {popupData.highlights.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {popupData.highlights.map((hl, idx) => (
                          <div
                            key={idx}
                            className="bg-[#0e0e0e] border border-white/5 rounded-xl p-2.5 flex items-start gap-2"
                          >
                            {renderHighlightIcon(hl.icon)}
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block truncate">
                                {hl.label}
                              </span>
                              <span className="text-xs font-semibold text-white leading-snug break-words line-clamp-2">
                                {hl.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="shrink-0 p-3 sm:p-4 bg-[#090909]/95 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <span className="text-[10px] font-mono text-zinc-500 order-2 sm:order-1 text-center sm:text-left">
                      {popupData.footerNote}
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                      <button className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-400 bg-white/5">
                        DISMISS
                      </button>
                      <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#FF4D1C] shadow-[0_0_15px_rgba(255,77,28,0.4)] flex items-center justify-center gap-1.5">
                        <span>{popupData.ctaText || 'REGISTER'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
