import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { soundFx } from '../utils/sound';
import { Mail, MapPin, Shield, Key, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playChime();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-16">
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
          // SECURE COMMUNICATIONS
        </span>
        <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          CONTACT & PGP.
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
          Reach out for collaborations, vulnerability disclosure, guest speaker sessions, or general queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-[#0B0B0B] border border-white/10 rounded-xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FF4D1C]/15 border border-[#FF4D1C]/40 text-[#FF4D1C] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                TRANSMISSION SENT
              </h3>
              <p className="text-xs font-mono text-[#A1A1A1] max-w-sm mx-auto">
                Thank you for contacting us. A member of the core operations team will respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">YOUR NAME *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#A1A1A1]">YOUR EMAIL *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@org.com"
                    className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">SUBJECT *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Vulnerability Inquiry / Partnership"
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#A1A1A1]">MESSAGE CONTENT *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D1C] font-sans"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" rightIcon={<Send className="w-4 h-4" />}>
                  SEND MESSAGE
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right: PGP Key & Headquarters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#080808] border border-white/[0.08] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#FF4D1C]" />
              <span className="text-xs font-mono text-white font-bold">OFFICIAL PGP PUBLIC KEY</span>
            </div>
            <div className="bg-[#050505] border border-white/10 rounded p-4 font-mono text-[10px] text-[#A1A1A1] leading-relaxed break-all select-all">
              -----BEGIN PGP PUBLIC KEY BLOCK-----<br />
              mQGNBGZ9v...SCS_KEY_2026_MASTER<br />
              Fingerprint: 8A4F 29C1 E788 33B0 19A2<br />
              99EC 4D81 CC19 0FF7 44E0<br />
              -----END PGP PUBLIC KEY BLOCK-----
            </div>
            <p className="text-[11px] font-mono text-[#666666]">
              For confidential vulnerability disclosures, please encrypt using our official master key above.
            </p>
          </div>

          <div className="bg-[#080808] border border-white/[0.08] rounded-xl p-6 space-y-3 text-xs font-mono text-[#A1A1A1]">
            <div className="flex items-center gap-2 text-white font-bold">
              <MapPin className="w-4 h-4 text-[#FF4D1C]" />
              <span>HEADQUARTERS & RESEARCH LAB</span>
            </div>
            <p className="font-sans text-xs">
              Block A, Advanced Computer Science Wing<br />
              Cybersecurity Lab #402<br />
              Open Lab Hours: Mon–Fri, 4:00 PM – 8:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
