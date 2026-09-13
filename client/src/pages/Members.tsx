import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { memberService, MemberItem } from '../services/member.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SocialIcon } from '../components/SocialIcon';
import { Globe, Users, ArrowRight, ShieldCheck, ArrowUpRight, Search, Award, Sparkles, Code2 } from 'lucide-react';

export const Members: React.FC = () => {
  const [currentMembers, setCurrentMembers] = useState<MemberItem[]>([]);
  const [alumniMembers, setAlumniMembers] = useState<MemberItem[]>([]);
  const [mentor, setMentor] = useState<MemberItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CURRENT' | 'ALUMNI'>('CURRENT');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [currentRes, alumniRes] = await Promise.all([
          memberService.listMembers('CURRENT'),
          memberService.listMembers('ALUMNI').catch(() => ({ members: [] })),
        ]);
        const list: MemberItem[] = currentRes.members || [];
        const foundMentor = list.find(m => m.role.toLowerCase().includes('mentor') || m.role.toLowerCase().includes('faculty'));
        setMentor(foundMentor || list[0] || null);
        setCurrentMembers(list.filter(m => m.id !== foundMentor?.id));
        setAlumniMembers(alumniRes.members || []);
      } catch (err) {
        console.error('Failed to load members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filtering for active roster
  const filteredMembers = useMemo(() => {
    const targetList = activeTab === 'CURRENT' ? currentMembers : alumniMembers;
    return targetList.filter((m) => {
      // Domain filter
      if (selectedDomain === 'LEADERSHIP') {
        const isLead = m.role.toLowerCase().includes('captain') || m.role.toLowerCase().includes('president');
        if (!isLead) return false;
      } else if (selectedDomain === 'CSE') {
        if (m.branch?.toUpperCase() !== 'CSE') return false;
      } else if (selectedDomain === 'CYS') {
        if (m.branch?.toUpperCase() !== 'CYS') return false;
      } else if (selectedDomain === 'AI/ML') {
        if (m.branch?.toUpperCase() !== 'AI/ML') return false;
      } else if (selectedDomain === 'TECH') {
        const isTech = m.role.toLowerCase().includes('tech') || m.department?.toLowerCase().includes('tech');
        if (!isTech) return false;
      } else if (selectedDomain === 'MAN_PR') {
        const isManPr = m.role.toLowerCase().includes('management') || m.role.toLowerCase().includes('pr') || m.role.toLowerCase().includes('doc');
        if (!isManPr) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        const matchBranch = m.branch?.toLowerCase().includes(q);
        const matchYear = m.year?.toLowerCase().includes(q);
        const matchSkills = (m.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchRole && !matchBranch && !matchYear && !matchSkills) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, currentMembers, alumniMembers, selectedDomain, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-16">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
            // SOCIETY ROSTER
          </span>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            OFFICIAL STUDENT COUNCIL ROSTER
          </span>
        </div>

        <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          THE PEOPLE<br />
          BEHIND THE SHADOW.
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] max-w-2xl font-sans">
          The selected researchers, core captains, and operations team driving cybersecurity education, competitive CTF engagements, and technological defense at Shadow Code Society.
        </p>

        {/* Top Controls: Active vs Alumni Tabs & Search */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('CURRENT'); setSelectedDomain('ALL'); }}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
                activeTab === 'CURRENT'
                  ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/40 shadow-[0_0_15px_rgba(255,77,28,0.15)]'
                  : 'text-zinc-400 hover:text-white bg-white/[0.02] border border-white/5'
              }`}
            >
              Active Roster ({currentMembers.length + (mentor ? 1 : 0)})
            </button>
            <button
              onClick={() => { setActiveTab('ALUMNI'); setSelectedDomain('ALL'); }}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
                activeTab === 'ALUMNI'
                  ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/40 shadow-[0_0_15px_rgba(255,77,28,0.15)]'
                  : 'text-zinc-400 hover:text-white bg-white/[0.02] border border-white/5'
              }`}
            >
              Alumni Hall of Fame ({alumniMembers.length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member, skill, branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[#0B0B0B] text-white placeholder-zinc-500 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF4D1C]/50 transition-colors"
            />
          </div>
        </div>

        {/* Domain Filter Pills (for Current Roster) */}
        {activeTab === 'CURRENT' && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'ALL', label: 'All Members' },
              { id: 'LEADERSHIP', label: 'Captains & Leads' },
              { id: 'CSE', label: 'Computer Science (CSE)' },
              { id: 'CYS', label: 'Cybersecurity (CYS)' },
              { id: 'AI/ML', label: 'AI & Machine Learning' },
              { id: 'TECH', label: 'Tech Team' },
              { id: 'MAN_PR', label: 'Management & PR' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDomain(tab.id)}
                className={`text-[11px] font-mono px-3 py-1 rounded-lg transition-all ${
                  selectedDomain === tab.id
                    ? 'bg-white/15 text-white font-semibold border border-white/20'
                    : 'text-zinc-500 hover:text-zinc-300 bg-white/[0.02] border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-24 text-xs font-mono text-[#666666] tracking-widest animate-pulse">
          QUERYING ARCHIVED TEAM ROSTER & ENCRYPTED DATABASE...
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Club Mentor (shown on Current tab when no specific branch filter) */}
          {activeTab === 'CURRENT' && mentor && (selectedDomain === 'ALL' || selectedDomain === 'LEADERSHIP') && (
            <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-8 sm:p-12 relative overflow-hidden group hover:border-[#FF4D1C]/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D1C]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] uppercase font-semibold border border-[#FF4D1C]/30 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      FACULTY ADVISOR & CLUB MENTOR
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
                    {mentor.name}
                  </h2>
                  <p className="text-xs font-mono text-[#FF4D1C]/90 font-medium">{mentor.role}</p>

                  <p className="text-sm sm:text-base text-[#A1A1A1] font-sans leading-relaxed pt-2 max-w-2xl">
                    {mentor.bio || 'Faculty Mentor guiding Shadow Code Society in cybersecurity research, student development, competitive CTF strategy, and ethical hacking initiatives.'}
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

          {/* Members Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-xs font-mono tracking-[0.2em] text-[#A1A1A1] uppercase font-semibold">
                // {activeTab === 'CURRENT' ? 'ACTIVE OPERATORS & RESEARCHERS' : 'HALL OF FAME ALUMNI'}
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'PERSON' : 'MEMBERS'}
              </span>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-16 bg-[#0B0B0B] border border-white/10 rounded-xl space-y-2">
                <p className="text-sm font-mono text-zinc-400">NO MEMBERS MATCH CRITERIA</p>
                <p className="text-xs text-zinc-600 font-sans">Try modifying your search query or switching domain filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                  const isCaptain = member.role.toLowerCase().includes('captain') && !member.role.toLowerCase().includes('vice');
                  const isVice = member.role.toLowerCase().includes('vice');
                  const isLead = member.role.toLowerCase().includes('lead');

                  return (
                    <div
                      key={member.id}
                      className="bg-[#0B0B0B] border border-white/[0.08] hover:border-[#FF4D1C]/40 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 space-y-6 group relative overflow-hidden"
                    >
                      {/* Accent glow on hover */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D1C]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="space-y-3 relative z-10">
                        {/* Header Row: Role badge & Academic tag */}
                        <div className="flex items-center justify-between gap-2 text-xs font-mono">
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                              isCaptain
                                ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border-[#FF4D1C]/40'
                                : isVice
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : isLead
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                                : 'bg-white/5 text-zinc-300 border-white/10'
                            }`}
                          >
                            {member.role}
                          </span>

                          {/* Branch & Year */}
                          {(member.branch || member.year) && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                              {member.branch && (
                                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-semibold">
                                  {member.branch}
                                </span>
                              )}
                              {member.year && (
                                <span className="text-zinc-500">
                                  {member.year.includes('Year') ? member.year : `${member.year}${member.year === '1' ? 'st' : member.year === '2' ? 'nd' : member.year === '3' ? 'rd' : 'th'} Yr`}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h4 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors pt-1">
                          {member.name}
                        </h4>

                        {/* Department/Domain */}
                        {member.department && (
                          <div className="text-[11px] font-mono text-zinc-500">
                            {member.department}
                          </div>
                        )}

                        {/* Bio */}
                        {member.bio && (
                          <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed line-clamp-3">
                            {member.bio}
                          </p>
                        )}
                      </div>

                      {/* Footer: Skills & Socials */}
                      <div className="space-y-4 pt-4 border-t border-white/[0.06] relative z-10">
                        {member.skills && member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {member.skills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-[#A1A1A1] border border-white/5"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
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
                          <span className="text-[10px] font-mono text-[#666666]">
                            {member.status === 'CURRENT' ? 'ACTIVE' : `CLASS OF ${member.leaveYear || '2024'}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

