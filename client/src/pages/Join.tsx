import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { joinService } from '../services/join.service';
import { Button } from '../components/ui/Button';
import { soundFx } from '../utils/sound';
import { ArrowLeft, CheckCircle2, AlertCircle, Upload, ShieldCheck, ArrowRight } from 'lucide-react';

export const Join: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('B.Tech');
  const [year, setYear] = useState('1st Year');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [experience, setExperience] = useState('Beginner');
  const [skills, setSkills] = useState('');
  const [motivation, setMotivation] = useState('');
  const [domainInterest, setDomainInterest] = useState('Ethical Hacking / WebSec');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [resume, setResume] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const courses = ['B.Tech', 'BCA', 'B.Sc (Cybersecurity/IT)', 'MCA', 'M.Tech', 'Other'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];
  const experienceLevels = [
    'Beginner (No prior cybersecurity background)',
    'Intermediate (Know Linux, basic networking, web basics)',
    'Advanced (Active on HackTheBox / TryHackMe / CTFs)',
  ];
  const domains = [
    'Ethical Hacking / WebSec',
    'Binary Exploitation / Reverse Engineering',
    'Applied Cryptography',
    'Digital Forensics & Incident Response',
    'Cloud Security & DevSecOps',
    'CTF Operations & Challenge Creation',
    'Design, Media & Community Ops',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !college.trim() || !motivation.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    soundFx.playTick();

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim().toLowerCase());
    formData.append('phone', phone.trim());
    formData.append('college', college.trim());
    formData.append('course', course);
    formData.append('year', year);
    formData.append('branch', branch.trim());
    formData.append('experience', experience);
    formData.append('skills', skills.trim());
    formData.append('motivation', motivation.trim());
    formData.append('domainInterest', domainInterest);
    if (github.trim()) formData.append('github', github.trim());
    if (linkedin.trim()) formData.append('linkedin', linkedin.trim());
    if (portfolio.trim()) formData.append('portfolio', portfolio.trim());
    if (resume) formData.append('resume', resume);

    try {
      await joinService.submitApplication(formData);
      setSubmitted(true);
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
      setError(err.response?.data?.message || 'Failed to submit candidate application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1A1] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO HOME</span>
      </Link>

      {/* Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
          // RECRUITMENT PROTOCOL
        </span>
        <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          READY TO ENTER<br />
          THE <span className="text-[#FF4D1C]">SHADOW?</span>
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
          Learn with us. Build with us. Break things responsibly. We evaluate passion, problem solving, and ethical integrity over existing credentials.
        </p>
      </div>

      <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-6 sm:p-10 shadow-2xl">
        {error && (
          <div className="mb-6 p-4 rounded bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FF4D1C]/15 border border-[#FF4D1C]/40 text-[#FF4D1C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] border border-[#FF4D1C]/30 uppercase font-semibold">
                DOSSIER INGESTED
              </span>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
                APPLICATION SUBMITTED
              </h2>
              <p className="text-xs font-mono text-[#A1A1A1] max-w-md mx-auto">
                Your application has been received and routed to the lead operators. We will contact you at {email} regarding next steps.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/">
                <Button variant="secondary" size="md">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Candidate Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-wider text-[#FF4D1C] uppercase font-semibold">
                01 // CANDIDATE IDENTIFICATION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">FULL NAME *</label>
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
                  <label className="block text-xs font-mono text-[#A1A1A1]">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@college.edu"
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">COLLEGE / INSTITUTION *</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Engineering Campus A"
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Academic & Domain Track */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="text-xs font-mono tracking-wider text-[#FF4D1C] uppercase font-semibold">
                02 // ACADEMIC PROFILE & TRACK SELECTION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">DEGREE PROGRAM</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  >
                    {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">ACADEMIC YEAR</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  >
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">DEPARTMENT</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. CSE / IT / ECE"
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">PRIMARY DOMAIN OF INTEREST</label>
                  <select
                    value={domainInterest}
                    onChange={(e) => setDomainInterest(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  >
                    {domains.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">EXPERIENCE LEVEL</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  >
                    {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Technical Background & Motivation */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="text-xs font-mono tracking-wider text-[#FF4D1C] uppercase font-semibold">
                03 // STATEMENT & PROFILES
              </h3>
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">KEY SKILLS / TOOLS FAMILIARITY</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Linux, Python, C++, Burp Suite, Wireshark, Cryptography, CTF experience"
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">WHY DO YOU WANT TO JOIN SHADOW CODE SOCIETY? *</label>
                <textarea
                  required
                  rows={4}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Tell us what motivates you in cybersecurity and what you aim to build or research..."
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">GITHUB PROFILE</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">LINKEDIN PROFILE</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">RESUME ATTACHMENT (PDF)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-xs text-[#A1A1A1] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                SUBMIT CANDIDATE APPLICATION
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
