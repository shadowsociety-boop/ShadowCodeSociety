import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { eventService, EventItem, EventFormField } from '../services/event.service';
import { registrationService } from '../services/registration.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { soundFx } from '../utils/sound';
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Calendar,
  MapPin,
  AlertCircle,
  User,
  GraduationCap,
  Lock,
  Check,
  ExternalLink,
} from 'lucide-react';

export const EventRegister: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Multi-step state: 0 = Personal, 1 = Academic, 2 = Security/Dynamic, 3 = Confirmation Review
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1st Year');
  const [experience, setExperience] = useState('Beginner');
  const [discord, setDiscord] = useState('');
  const [teamName, setTeamName] = useState('');
  const [dynamicResponses, setDynamicResponses] = useState<Record<string, any>>({});
  const [dynamicFields, setDynamicFields] = useState<EventFormField[]>([]);

  // Success State
  const [successRegistration, setSuccessRegistration] = useState<{
    registrationNumber: number;
    status: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      try {
        const data = await eventService.getEventBySlug(slug);
        const evt = data.event;
        setEvent(evt);

        if (evt.form && evt.form.fields) {
          const parsedFields: EventFormField[] =
            typeof evt.form.fields === 'string'
              ? JSON.parse(evt.form.fields)
              : evt.form.fields;
          setDynamicFields(parsedFields);
        }
      } catch (err) {
        setError('Failed to load event registration details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const steps = [
    { num: '01', title: 'PERSONAL', icon: User },
    { num: '02', title: 'ACADEMIC', icon: GraduationCap },
    { num: '03', title: 'SECURITY', icon: Lock },
    { num: '04', title: 'CONFIRM', icon: ShieldCheck },
  ];

  const handleNextStep = () => {
    setError('');
    soundFx.playTick();

    if (currentStep === 0) {
      if (!name.trim() || !email.trim()) {
        setError('Please provide your full legal name and institutional email address.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
    } else if (currentStep === 1) {
      if (!collegeId.trim() || !department.trim()) {
        setError('Please enter your student / roll ID and academic department.');
        return;
      }
    }

    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
  };

  const handlePrevStep = () => {
    setError('');
    soundFx.playTick();
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setError('');
    setSubmitting(true);
    soundFx.playTick();

    try {
      const allResponses = {
        collegeId,
        department,
        year,
        experience,
        discord,
        teamName,
        ...dynamicResponses,
      };

      const result = await registrationService.registerForEvent(event.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        responses: allResponses,
      });

      setSuccessRegistration({
        registrationNumber: result.registration.registrationNumber,
        status: result.registration.status,
        id: result.registration.id,
      });

      soundFx.playChime();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF4D1C', '#ffffff', '#FF7A50'],
        });
      } catch {
        // Confetti optional
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center text-xs font-mono text-[#A1A1A1]">
        LOADING OPERATION REGISTRATION DATA...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">OPERATION NOT FOUND</h2>
        <Link to="/events">
          <Button variant="secondary" size="sm">Return to Operations →</Button>
        </Link>
      </div>
    );
  }

  if (event.externalFormUrl) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-left space-y-6">
        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1A1] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO {event.title.toUpperCase()}</span>
        </Link>
        <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-8 sm:p-10 space-y-6 shadow-2xl">
          <Badge variant="orange">EXTERNAL REGISTRATION PORTAL</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            {event.title}
          </h2>
          <p className="text-sm font-sans text-zinc-400 leading-relaxed">
            Registration for this operation is hosted on an authorized third-party platform. Click below to complete your registration.
          </p>
          <div className="pt-2">
            <a
              href={event.externalFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" variant="primary" rightIcon={<ExternalLink className="w-4 h-4" />}>
                OPEN EXTERNAL FORM
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left">
      {/* Back Link */}
      <Link
        to={`/events/${event.slug}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1A1] hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO {event.title.toUpperCase()}</span>
      </Link>

      {/* Main Container */}
      <div className="bg-[#0B0B0B] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 border-b border-white/10 bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#FF4D1C] uppercase font-semibold">
                EVENT REGISTRATION PROTOCOL
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
                {event.title}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1A1]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF4D1C]" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF4D1C]" />
                <span className="truncate max-w-[120px]">{event.location}</span>
              </div>
            </div>
          </div>

          {/* 4-Step Progress Indicator */}
          {!successRegistration && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-8 pt-6 border-t border-white/10">
              {steps.map((s, idx) => {
                const isCurrent = idx === currentStep;
                const isPassed = idx < currentStep;
                return (
                  <div key={s.num} className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono transition-colors ${
                          isPassed
                            ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/40'
                            : isCurrent
                            ? 'bg-[#FF4D1C] text-white font-bold'
                            : 'bg-white/5 text-[#666666] border border-white/10'
                        }`}
                      >
                        {isPassed ? <Check className="w-3.5 h-3.5" /> : s.num}
                      </div>
                      <span
                        className={`hidden sm:inline text-[11px] font-mono tracking-wider uppercase ${
                          isCurrent ? 'text-white font-bold' : 'text-[#666666]'
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                    {/* Hairline Progress Bar */}
                    <div
                      className={`h-[2px] rounded-full transition-colors ${
                        isPassed ? 'bg-[#FF4D1C]' : isCurrent ? 'bg-[#FF4D1C]' : 'bg-white/10'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Form Body or Success State */}
        <div className="p-6 sm:p-10">
          {error && (
            <div className="mb-6 p-4 rounded bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successRegistration ? (
            /* Digital Badge Pass Confirmation */
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 rounded-full bg-[#FF4D1C]/15 border border-[#FF4D1C]/40 text-[#FF4D1C] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
                  REGISTRATION CONFIRMED
                </h2>
                <p className="text-xs font-mono text-[#A1A1A1] max-w-md mx-auto">
                  Your entry pass has been generated and queued on the network ledger.
                </p>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="max-w-md mx-auto bg-[#070707] border border-white/15 rounded-lg p-6 text-left space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-[#666666] block">OPERATIONAL ACCESS PASS</span>
                    <span className="text-white font-bold">{event.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] border border-[#FF4D1C]/30 text-[10px] font-bold">
                    {successRegistration.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="text-[#666666] block">NAME</span>
                    <span className="text-white">{name}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">EMAIL</span>
                    <span className="text-white truncate block">{email}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">PASS NUMBER</span>
                    <span className="text-[#FF4D1C] font-bold">#SCS-{String(successRegistration.registrationNumber).padStart(4, '0')}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">REF ID</span>
                    <span className="text-[#A1A1A1]">{successRegistration.id.slice(0, 10)}...</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="h-7 flex items-center gap-[2px]">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-white/${i % 3 === 0 ? '60' : i % 2 === 0 ? '90' : '30'} ${
                          i % 4 === 0 ? 'w-1' : 'w-[2px]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-[#666666]">VERIFIED // 0xSCS</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <Link to="/events">
                  <Button variant="secondary" size="md">
                    Explore Other Events
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="primary" size="md">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Multi-step progressive form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 01: PERSONAL */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-mono tracking-wider text-[#A1A1A1] uppercase">
                    01 // CANDIDATE IDENTIFICATION
                  </h3>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#A1A1A1]">FULL LEGAL NAME *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#A1A1A1]">INSTITUTIONAL / PERSONAL EMAIL *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex.mercer@college.edu"
                      className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 02: ACADEMIC */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-mono tracking-wider text-[#A1A1A1] uppercase">
                    02 // ACADEMIC DETAILS
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-[#A1A1A1]">STUDENT / ROLL ID *</label>
                      <input
                        type="text"
                        required
                        value={collegeId}
                        onChange={(e) => setCollegeId(e.target.value)}
                        placeholder="e.g. 23CS0188"
                        className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-[#A1A1A1]">ACADEMIC YEAR *</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#A1A1A1]">DEPARTMENT / BRANCH *</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 03: SECURITY & PROFILES */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-mono tracking-wider text-[#A1A1A1] uppercase">
                    03 // SECURITY PROFILE & HANDLES
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-[#A1A1A1]">EXPERIENCE LEVEL</label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                      >
                        <option value="Beginner">Beginner (Curious, getting started)</option>
                        <option value="Intermediate">Intermediate (Linux, basic tools)</option>
                        <option value="Advanced">Advanced (Active CTF / Exploit dev)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-[#A1A1A1]">DISCORD HANDLE (FOR ROLES)</label>
                      <input
                        type="text"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        placeholder="username or user#0000"
                        className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#A1A1A1]">CTF TEAM NAME (OPTIONAL)</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. ZeroDayCorps"
                      className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                    />
                  </div>

                  {/* Custom Dynamic Questions if any */}
                  {dynamicFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-xs font-mono text-[#A1A1A1]">
                        {field.label.toUpperCase()} {field.required && '*'}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        required={field.required}
                        value={dynamicResponses[field.id] || ''}
                        onChange={(e) => setDynamicResponses(prev => ({ ...prev, [field.id]: e.target.value }))}
                        placeholder={field.placeholder || ''}
                        className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 04: CONFIRMATION REVIEW */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-mono tracking-wider text-[#A1A1A1] uppercase">
                    04 // REVIEW & CONFIRM
                  </h3>

                  <div className="bg-[#050505] border border-white/10 rounded p-4 font-mono text-xs space-y-2.5">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#666666]">EVENT</span>
                      <span className="text-white font-bold">{event.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#666666]">CANDIDATE</span>
                      <span className="text-white">{name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#666666]">EMAIL</span>
                      <span className="text-white">{email}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#666666]">STUDENT ID</span>
                      <span className="text-white">{collegeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">DEPARTMENT</span>
                      <span className="text-white">{department} ({year})</span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-[#666666]">
                    By submitting, you agree to abide by the Shadow Code Society Code of Ethics and competition guidelines.
                  </p>
                </motion.div>
              )}

              {/* Step Navigation Actions */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevStep}
                    leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  >
                    PREVIOUS
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    CONTINUE
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={submitting}
                    rightIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                  >
                    COMPLETE REGISTRATION
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
