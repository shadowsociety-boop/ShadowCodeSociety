import React from 'react';
import { Link } from 'react-router-dom';
import { SocialIcon } from './SocialIcon';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#050505] hairline-t pt-20 pb-12 overflow-hidden text-left">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-28 bg-[#FF4D1C]/[0.03] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Identity / Huge Typography */}
          <div className="lg:col-span-6 space-y-4">
            <div className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
              SHADOW<br />
              CODE<br />
              <span className="text-[#FF4D1C]">SOCIETY.</span>
            </div>
            <p className="text-xs font-mono tracking-[0.2em] text-[#666666] uppercase pt-2">
              LEARN. HACK. DEFEND.
            </p>
            <p className="text-sm text-[#A1A1A1] max-w-md leading-relaxed pt-2">
              College Cybersecurity & Ethical Hacking Society. An elite research collective advancing offensive capabilities and digital resilience.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#666666] uppercase font-semibold">
              INDEX
            </h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link to="/about" className="text-[#A1A1A1] hover:text-white transition-colors flex items-center justify-between group py-1">
                  <span>About Society</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF4D1C]" />
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-[#A1A1A1] hover:text-white transition-colors flex items-center justify-between group py-1">
                  <span>Operations & CTFs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF4D1C]" />
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-[#A1A1A1] hover:text-white transition-colors flex items-center justify-between group py-1">
                  <span>The Archive</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF4D1C]" />
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-[#A1A1A1] hover:text-white transition-colors flex items-center justify-between group py-1">
                  <span>Team Directory</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF4D1C]" />
                </Link>
              </li>
              <li>
                <Link to="/alumni" className="text-[#A1A1A1] hover:text-white transition-colors flex items-center justify-between group py-1">
                  <span>Hall of Fame (Alumni)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF4D1C]" />
                </Link>
              </li>
              <li>
                <Link to="/join" className="text-[#A1A1A1] hover:text-[#FF4D1C] transition-colors flex items-center justify-between group py-1 font-medium">
                  <span>Apply For Membership</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF4D1C]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#666666] uppercase font-semibold">
              CHANNELS
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://github.com/shadowsociety-boop"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded bg-[#0B0B0B] border border-white/10 hover:border-[#FF4D1C]/60 hover:text-white flex items-center justify-center text-[#A1A1A1] transition-colors"
                title="GitHub"
              >
                <SocialIcon type="github" className="w-4 h-4" />
              </a>
              <a
                href="mailto:shadow.society@jietjodhpur.ac.in"
                className="w-10 h-10 rounded bg-[#0B0B0B] border border-white/10 hover:border-[#FF4D1C]/60 hover:text-white flex items-center justify-center text-[#A1A1A1] transition-colors"
                title="Email: shadow.society@jietjodhpur.ac.in"
              >
                <SocialIcon type="email" className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com/channels/1412278329381228677/1412278329922551910"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded bg-[#0B0B0B] border border-white/10 hover:border-[#FF4D1C]/60 hover:text-white flex items-center justify-center text-[#A1A1A1] transition-colors"
                title="Discord Community"
              >
                <SocialIcon type="discord" className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/shadowcode_jiet/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded bg-[#0B0B0B] border border-white/10 hover:border-[#FF4D1C]/60 hover:text-white flex items-center justify-center text-[#A1A1A1] transition-colors"
                title="Instagram @shadowcode_jiet"
              >
                <SocialIcon type="instagram" className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-xs font-mono text-[#666666] space-y-1">
              <div>HQ: ADVANCED SECURITY LAB // BLOCK A</div>
              <div>COMMS: PGP ENCRYPTED</div>
            </div>
          </div>
        </div>

        {/* Bottom Hairline Bar */}
        <div className="pt-8 hairline-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666666]">
          <p>© {new Date().getFullYear()} Shadow Code Society. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#A1A1A1] transition-colors">
              Code of Ethics
            </Link>
            <Link to="/contact" className="hover:text-[#A1A1A1] transition-colors">
              PGP Key
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
