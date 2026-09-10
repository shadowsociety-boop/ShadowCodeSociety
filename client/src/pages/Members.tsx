import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { memberService, MemberItem } from '../services/member.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SocialIcon } from '../components/SocialIcon';
import { Globe, Users, ArrowRight, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Members: React.FC = () => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [mentor, setMentor] = useState<MemberItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await memberService.listMembers('CURRENT');
        const list: MemberItem[] = data.members || [];
        const foundMentor = list.find(m => m.role.toLowerCase().includes('mentor') || m.role.toLowerCase().includes('faculty'));
        setMentor(foundMentor || list[0] || null);
        setMembers(list.filter(m => m.id !== foundMentor?.id));
      } catch (err) {
        console.error('Failed to load members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-16">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
          // ROSTER
        </span>
        <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          THE PEOPLE<br />
          BEHIND THE SHADOW.
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
          The security researchers, offensive engineers, and organizers steering Shadow Code Society operations.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-[#666666]">
          QUERYING TEAM DIRECTORY...
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Club Mentor */}
          {mentor && (
            <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-8 sm:p-12 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] uppercase font-semibold border border-[#FF4D1C]/30">
                    FACULTY ADVISOR & CLUB MENTOR
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
                    {mentor.name}
                  </h2>
                  <p className="text-xs font-mono text-[#A1A1A1]">{mentor.role}</p>

                  <p className="text-sm sm:text-base text-[#A1A1A1] font-sans leading-relaxed pt-2 max-w-2xl">
                    {mentor.bio || 'Advising on high-assurance security engineering, ethical disclosure, and advanced exploitation research.'}
                  </p>

                  {mentor.skills && mentor.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3">
                      {mentor.skills.map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.04] text-[#A1A1A1] border border-white/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-4">
                  <div className="flex items-center gap-3">
                    {mentor.github && (
                      <a href={mentor.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded bg-[#050505] border border-white/10 hover:border-[#FF4D1C]/50 flex items-center justify-center text-[#A1A1A1] hover:text-white transition-colors">
                        <SocialIcon type="github" className="w-4 h-4" />
                      </a>
                    )}
                    {mentor.linkedin && (
                      <a href={mentor.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded bg-[#050505] border border-white/10 hover:border-[#FF4D1C]/50 flex items-center justify-center text-[#A1A1A1] hover:text-white transition-colors">
                        <SocialIcon type="linkedin" className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#666666]">VERIFIED ADVISORY NODE</span>
                </div>
              </div>
            </div>
          )}

          {/* Current Team Directory */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono tracking-[0.2em] text-[#A1A1A1] uppercase font-semibold">
              // ACTIVE OPERATORS & RESEARCHERS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#FF4D1C] font-semibold uppercase">{member.role}</span>
                      <span className="text-[#666666]">OPERATOR</span>
                    </div>

                    <h4 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                      {member.name}
                    </h4>

                    {member.bio && (
                      <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    {member.skills && member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-[#A1A1A1]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="GitHub">
                            <SocialIcon type="github" className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-[#FF4D1C] transition-colors" title="LinkedIn">
                            <SocialIcon type="linkedin" className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.portfolio && (
                          <a href={member.portfolio} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-[#FF4D1C] transition-colors" title="Portfolio">
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#666666]">ACTIVE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
