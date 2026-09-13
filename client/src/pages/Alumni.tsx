import React, { useState, useEffect } from 'react';
import { memberService, MemberItem } from '../services/member.service';
import { Badge } from '../components/ui/Badge';
import { SocialIcon } from '../components/SocialIcon';
import { Globe, Award, Sparkles } from 'lucide-react';

const FALLBACK_ALUMNI: MemberItem[] = [
  {
    id: 'alumni-rudra',
    name: 'Rudra',
    role: 'Founding President',
    department: 'Cybersecurity',
    bio: 'Founding President who established the vision, core values, and foundational research framework of Shadow Code Society.',
    skills: ['Security Architecture', 'Offensive Security', 'Club Leadership', 'CTF Strategy'],
    status: 'ALUMNI',
    order: 19,
    leaveYear: 2024,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-sameer',
    name: 'Sameer Ali',
    role: 'Senior Backend Engineer @ SaveIt',
    department: 'Computer Science & Engineering',
    bio: 'JIET Alumni & Senior Backend Engineer specializing in high-performance distributed systems, NestJS, PostgreSQL, Redis, and NextJS architectures.',
    skills: ['NestJS', 'PostgreSQL', 'Redis', 'NextJS', 'Backend Architecture'],
    linkedin: 'https://www.linkedin.com/in/sameer-ali',
    status: 'ALUMNI',
    order: 20,
    leaveYear: 2024,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-raj',
    name: 'Raj Patel',
    role: 'AI Engineer @ Teqotic',
    department: 'Artificial Intelligence & Machine Learning',
    bio: 'JIET Alumni & AI Engineer. 3x Hackathon Winner, Runner-up at Ethos IIT Guwahati 2024, Runner-up at Tequity Hackathon 2025, and NASA Space Apps Challenge 2025 Global Nominee.',
    skills: ['AI & ML', 'Python', 'n8n', 'Agentic Workflows', 'Hackathons'],
    linkedin: 'https://www.linkedin.com/in/raj-patel',
    status: 'ALUMNI',
    order: 21,
    leaveYear: 2024,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-nishant',
    name: 'Nishant Rankawat',
    role: 'Technical Lead & Full-Stack Security Researcher',
    department: 'Cybersecurity',
    bio: 'Core technical member and full-stack security researcher building resilient platforms, web security tooling, and developing CTF challenges.',
    skills: ['Full-Stack Development', 'Cloud Security', 'CTF', 'DevSecOps'],
    github: 'https://github.com/nishant4086',
    status: 'ALUMNI',
    order: 22,
    leaveYear: 2026,
    createdAt: '',
    updatedAt: '',
  },
];

export const Alumni: React.FC = () => {
  const [alumni, setAlumni] = useState<MemberItem[]>(FALLBACK_ALUMNI);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await memberService.listMembers('ALUMNI');
        if (data.members && data.members.length > 0) {
          setAlumni(data.members);
        }
      } catch (err) {
        console.error('Failed to load alumni:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-16">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
          // LEGACY PROTOCOL
        </span>
        <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          THE ONES WHO<br />
          BUILT THE FOUNDATION.
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
          Honoring former club presidents, lead exploit researchers, and alumni now engineering high-assurance cybersecurity architectures in the industry.
        </p>
      </div>

      {/* Understated Alumni Directory */}
      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-[#666666]">
          INDEXING ALUMNI RECORDS...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((item) => (
            <div
              key={item.id}
              className="bg-[#080808] border border-white/[0.07] hover:border-white/15 rounded-lg p-6 flex flex-col justify-between transition-colors space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A1A1A1] uppercase font-medium">{item.role}</span>
                  <span className="text-[10px] text-[#666666]">LEGACY</span>
                </div>

                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  {item.name}
                </h3>

                {item.bio && (
                  <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed line-clamp-3">
                    {item.bio}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition-colors" title="GitHub">
                      <SocialIcon type="github" className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {item.linkedin && (
                    <a href={item.linkedin} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition-colors" title="LinkedIn">
                      <SocialIcon type="linkedin" className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {item.portfolio && (
                    <a href={item.portfolio} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition-colors" title="Portfolio">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <span className="text-[10px] font-mono text-[#666666]">ALUMNI // VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
