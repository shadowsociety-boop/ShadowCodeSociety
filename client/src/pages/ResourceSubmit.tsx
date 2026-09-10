import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../services/resource.service';
import { Button } from '../components/ui/Button';
import { soundFx } from '../utils/sound';
import { ArrowLeft, CheckCircle2, AlertCircle, Upload, Shield } from 'lucide-react';

export const ResourceSubmit: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CTF WRITEUPS');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'CTF WRITEUPS',
    'SECURITY NOTES',
    'WORKSHOP MATERIAL',
    'TOOLS',
    'TUTORIALS',
    'RESEARCH',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    soundFx.playTick();

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      if (linkUrl.trim()) formData.append('externalUrl', linkUrl.trim());
      if (authorName.trim()) formData.append('contributorName', authorName.trim());
      if (authorEmail.trim()) formData.append('contributorEmail', authorEmail.trim());

      await resourceService.submitResource(formData);

      setSubmitted(true);
      soundFx.playChime();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit resource to archive queue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-10">
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1A1] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO ARCHIVE</span>
      </Link>

      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
          // REPOSITORY CONTRIBUTION
        </span>
        <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          CONTRIBUTE<br />
          TO THE ARCHIVE.
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
          Have something worth sharing? Submit your exploit writeup, security tool, or research notes to the Shadow Code Society archive.
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
            <div className="w-14 h-14 rounded-full bg-[#FF4D1C]/15 border border-[#FF4D1C]/40 text-[#FF4D1C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] border border-[#FF4D1C]/30 uppercase font-semibold">
                STATUS: PENDING REVIEW
              </span>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
                SUBMISSION RECEIVED
              </h2>
              <p className="text-xs font-mono text-[#A1A1A1] max-w-md mx-auto">
                Thank you for contributing. The core security team reviews all submissions before indexing them in the public archive.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/resources">
                <Button variant="secondary" size="md">
                  Return to Archive
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">CONTRIBUTION TITLE *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SQL Injection via Blind Time-Based Exfiltration"
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">CATEGORY / TOPIC *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#A1A1A1]">EXECUTIVE SUMMARY *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary of what this research or tool covers..."
                className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#A1A1A1]">FULL WRITEUP CONTENT / INSTRUCTIONS (MARKDOWN)</label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your research, payload walkthrough, code snippets, or notes in Markdown format..."
                className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">EXTERNAL LINK / REPO (OPTIONAL)</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">YOUR NAME / HANDLE</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. 0xNull"
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">YOUR EMAIL (FOR NOTIFICATIONS)</label>
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="author@college.edu"
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={submitting} rightIcon={<Upload className="w-4 h-4" />}>
                SUBMIT TO ARCHIVE REVIEW QUEUE
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
