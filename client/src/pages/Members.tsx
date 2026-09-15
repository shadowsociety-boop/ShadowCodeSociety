import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { memberService, MemberItem } from '../services/member.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SocialIcon } from '../components/SocialIcon';
import { Globe, Users, ArrowRight, ShieldCheck, ArrowUpRight, Search, Award, Sparkles, Code2 } from 'lucide-react';
import { TextReveal, FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

const FALLBACK_MENTOR: MemberItem = {
  id: 'mentor-sohaib',
  name: 'Sohaib Khan',
  role: 'Faculty Mentor',
  department: 'Cybersecurity & Computing',
  year: 'Faculty',
  branch: 'FACULTY',
  bio: 'Faculty Mentor guiding Shadow Code Society in cybersecurity research, student development, competitive CTF strategy, and security architecture.',
  skills: ['Cybersecurity', 'Mentorship', 'Security Architecture', 'Network Defense'],
  status: 'CURRENT',
  order: 0,
  createdAt: '',
  updatedAt: '',
};

const FALLBACK_CURRENT_MEMBERS: MemberItem[] = [
  {
    id: 'mem-1',
    name: 'Aditya Kumawat',
    role: 'Club Captain',
    department: 'Cybersecurity',
    branch: 'CYS',
    year: '3rd Year',
    bio: 'Club Captain leading Shadow Code Society operations, student council coordination, and cybersecurity initiatives.',
    skills: ['Leadership', 'Cybersecurity', 'Web Security', 'Offensive Security', 'Python'],
    status: 'CURRENT',
    order: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-2',
    name: 'Nakshtra Pal Parihar',
    role: 'Vice-Captain',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '3rd Year',
    bio: 'Vice-Captain coordinating society operations, AI security research, and inter-domain technical collaborations.',
    skills: ['AI/ML', 'Adversarial Machine Learning', 'Python', 'Security Analytics', 'System Defense'],
    status: 'CURRENT',
    order: 2,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-3',
    name: 'Pramod Patel',
    role: 'Technical Lead',
    department: 'Cybersecurity',
    branch: 'CYS',
    year: '2nd Year',
    bio: 'Core technical member specializing in vulnerability assessment, web application penetration testing, and security tooling.',
    skills: ['Web Security', 'Penetration Testing', 'Linux', 'OWASP Top 10', 'Bash'],
    status: 'CURRENT',
    order: 3,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-4',
    name: 'Nishant Rankawat',
    role: 'Technical Lead',
    department: 'Cybersecurity',
    branch: 'CYS',
    year: '3rd Year',
    bio: 'Core technical member and full-stack security researcher building resilient platforms and developing CTF challenges.',
    skills: ['Full-Stack Development', 'Cloud Security', 'CTF', 'DevSecOps', 'Application Security'],
    github: 'https://github.com/nishant4086',
    status: 'CURRENT',
    order: 4,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-5',
    name: 'Nikhil Adwani',
    role: 'Technical Member',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '3rd Year',
    bio: 'Technical team member exploring intelligent security automation, model vulnerabilities, and algorithmic defense.',
    skills: ['Python', 'Data Analytics', 'Machine Learning', 'Network Security', 'Linux'],
    status: 'CURRENT',
    order: 5,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-6',
    name: 'Kushagraa',
    role: 'Technical Lead',
    department: 'Cybersecurity & Systems',
    branch: 'CYS',
    year: '3rd Year',
    bio: 'Technical Lead driving infrastructure hardening, network protocol analysis, and offensive security research.',
    skills: ['Network Security', 'Systems Architecture', 'Cyber Defense', 'Python', 'Linux'],
    status: 'CURRENT',
    order: 6,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-7',
    name: 'Lakshay Jain',
    role: 'Management Lead',
    department: 'Cybersecurity',
    branch: 'CYS',
    year: '3rd Year',
    bio: 'Leading society logistics, event execution, and participant operations for workshops and hackathons.',
    skills: ['Event Management', 'Operations', 'Resource Planning', 'Cybersecurity Awareness'],
    status: 'CURRENT',
    order: 7,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-8',
    name: 'Vaibhav Panwar',
    role: 'Management Lead',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '3rd Year',
    bio: 'Management Lead coordinating member operations, workshop logistics, and institutional security drills.',
    skills: ['Operations Management', 'Coordination', 'Public Relations', 'Team Logistics'],
    status: 'CURRENT',
    order: 8,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-9',
    name: 'Komal Sayal',
    role: 'Management Member',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '3rd Year',
    bio: 'Management core member driving community engagement, attendee operations, and student council communications.',
    skills: ['Community Engagement', 'Event Operations', 'Communication', 'Team Building'],
    status: 'CURRENT',
    order: 9,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-10',
    name: 'Rajshree Solanki',
    role: 'Management Member',
    department: 'Cybersecurity',
    branch: 'CYS',
    year: '2nd Year',
    bio: 'Supporting event coordination, attendee management, and cybersecurity awareness sessions.',
    skills: ['Event Logistics', 'Documentation', 'Cyber Awareness', 'Coordination'],
    status: 'CURRENT',
    order: 10,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-11',
    name: 'Lakshay Vyas',
    role: 'PR & Management Member',
    department: 'Cybersecurity',
    branch: 'CYS',
    year: '3rd Year',
    bio: 'Supporting public relations, institutional outreach, and event operations for society initiatives.',
    skills: ['Public Relations', 'Media Relations', 'Management', 'Outreach'],
    status: 'CURRENT',
    order: 11,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-12',
    name: 'Daarein Khan',
    role: 'Public Relations Lead',
    department: 'Public Relations & Outreach',
    branch: 'AI/ML',
    year: '3rd Year',
    bio: 'Directing society media campaigns, student outreach initiatives, and strategic institutional partnerships.',
    skills: ['Public Relations', 'Brand Strategy', 'Community Outreach', 'Communications'],
    status: 'CURRENT',
    order: 12,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-13',
    name: 'Fardeen Khan',
    role: 'PR & Social Media Lead',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '2nd Year',
    bio: 'Managing digital branding, Instagram campaigns, and creative outreach for Shadow Code Society.',
    skills: ['Social Media Strategy', 'Digital Marketing', 'Content Creation', 'Brand Design'],
    status: 'CURRENT',
    order: 13,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-14',
    name: 'Akhilesh Sharma',
    role: 'Design & Documentation Lead',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '2nd Year',
    bio: 'Overseeing visual design, documentation archives, event posters, and UI assets.',
    skills: ['Graphic Design', 'Technical Documentation', 'UI/UX Design', 'Figma'],
    status: 'CURRENT',
    order: 14,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-15',
    name: 'Jaideep Vaishnav',
    role: 'Documentation Lead',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '2nd Year',
    bio: 'Leading official technical writeups, knowledge base documentation, meeting proceedings, and research records.',
    skills: ['Technical Writing', 'Documentation', 'Research', 'Information Architecture'],
    status: 'CURRENT',
    order: 15,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-16',
    name: 'Kratika Singh',
    role: 'Public Relations Member',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '2nd Year',
    bio: 'Driving community relations, inter-college club outreach, and media communications.',
    skills: ['Public Relations', 'Communications', 'Networking', 'Event Promotion'],
    status: 'CURRENT',
    order: 16,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mem-17',
    name: 'Azeem',
    role: 'Management & Technical Member',
    department: 'Artificial Intelligence & Machine Learning',
    branch: 'AI/ML',
    year: '2nd Year',
    bio: 'Management and technical contributor supporting workshops, society operations, and algorithmic security research.',
    skills: ['Management', 'Technical Operations', 'Python', 'Machine Learning'],
    status: 'CURRENT',
    order: 17,
    createdAt: '',
    updatedAt: '',
  },
];

const FALLBACK_ALUMNI_MEMBERS: MemberItem[] = [
  {
    id: 'alumni-lakshya',
    name: 'Lakshya Siyota',
    role: 'Technical & Management Specialist',
    department: 'Computer Science & Engineering',
    year: 'Alumni',
    branch: 'CSE',
    bio: 'Contributed to technical & management operations and society inter-domain infrastructure.',
    skills: ['Tech & Management', 'CSE', 'System Operations', 'Cybersecurity'],
    status: 'ALUMNI',
    order: 18,
    leaveYear: 2025,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-riddhi',
    name: 'Riddhi Gandhi',
    role: 'PR & Communications Contributor',
    department: 'Artificial Intelligence & Machine Learning',
    year: 'Alumni',
    branch: 'AI/ML',
    bio: 'Contributed to society public relations, social media outreach, and early community campaigns.',
    skills: ['Social Media', 'Public Relations', 'Digital Marketing', 'Content Strategy'],
    status: 'ALUMNI',
    order: 19,
    leaveYear: 2025,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-yash',
    name: 'Yash Kumar',
    role: 'Technical Research Contributor',
    department: 'Artificial Intelligence & Machine Learning',
    year: 'Alumni',
    branch: 'AI/ML',
    bio: 'Contributed to machine learning security exploration, automation, and Python scripts.',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Problem Solving'],
    status: 'ALUMNI',
    order: 20,
    leaveYear: 2025,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-rudra',
    name: 'Rudra',
    role: 'Founding President',
    department: 'Cybersecurity',
    year: 'Alumni',
    branch: 'CYS',
    bio: 'Founding President who established the vision, core values, and foundational research framework of Shadow Code Society.',
    skills: ['Security Architecture', 'Offensive Security', 'Club Leadership', 'CTF Strategy'],
    status: 'ALUMNI',
    order: 21,
    leaveYear: 2024,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-sameer',
    name: 'Sameer Ali',
    role: 'Senior Backend Engineer @ SaveIt',
    department: 'Computer Science & Engineering',
    year: 'Alumni',
    branch: 'CSE',
    bio: 'JIET Alumni & Senior Backend Engineer specializing in high-performance distributed systems, NestJS, PostgreSQL, Redis, and NextJS architectures.',
    skills: ['NestJS', 'PostgreSQL', 'Redis', 'NextJS', 'Backend Architecture'],
    linkedin: 'https://www.linkedin.com/in/sameer-ali',
    status: 'ALUMNI',
    order: 22,
    leaveYear: 2024,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'alumni-raj',
    name: 'Raj Patel',
    role: 'AI Engineer @ Teqotic',
    department: 'Artificial Intelligence & Machine Learning',
    year: 'Alumni',
    branch: 'AI/ML',
    bio: 'JIET Alumni & AI Engineer. 3x Hackathon Winner, Runner-up at Ethos IIT Guwahati 2024, Runner-up at Tequity Hackathon 2025, and NASA Space Apps Challenge 2025 Global Nominee.',
    skills: ['AI & ML', 'Python', 'n8n', 'Agentic Workflows', 'Hackathons'],
    linkedin: 'https://www.linkedin.com/in/raj-patel',
    status: 'ALUMNI',
    order: 23,
    leaveYear: 2024,
    createdAt: '',
    updatedAt: '',
  },
];

export const Members: React.FC = () => {
  const [currentMembers, setCurrentMembers] = useState<MemberItem[]>(FALLBACK_CURRENT_MEMBERS);
  const [alumniMembers, setAlumniMembers] = useState<MemberItem[]>(FALLBACK_ALUMNI_MEMBERS);
  const [mentor, setMentor] = useState<MemberItem | null>(FALLBACK_MENTOR);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'CURRENT' | 'ALUMNI'>('CURRENT');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      try {
        const [currentRes, alumniRes] = await Promise.allSettled([
          memberService.listMembers('CURRENT'),
          memberService.listMembers('ALUMNI'),
        ]);

        if (!isMounted) return;

        if (currentRes.status === 'fulfilled' && currentRes.value?.members?.length > 0) {
          const list: MemberItem[] = currentRes.value.members;
          const foundMentor = list.find(m => m.role.toLowerCase().includes('mentor') || m.role.toLowerCase().includes('faculty'));
          setMentor(foundMentor || list[0] || FALLBACK_MENTOR);
          setCurrentMembers(list.filter(m => m.id !== foundMentor?.id));
        }

        if (alumniRes.status === 'fulfilled' && alumniRes.value?.members?.length > 0) {
          setAlumniMembers(alumniRes.value.members);
        }
      } catch (err) {
        console.warn('Using static verified roster:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    return () => { isMounted = false; };
  }, []);

  // Filtering for active roster & alumni
  const filteredMembers = useMemo(() => {
    const targetList = activeTab === 'CURRENT' ? currentMembers : alumniMembers;
    return targetList.filter((m) => {
      // Domain filter (applied primarily to current roster)
      if (activeTab === 'CURRENT') {
        if (selectedDomain === 'LEADERSHIP') {
          const isLead = m.role.toLowerCase().includes('captain') || m.role.toLowerCase().includes('president') || m.role.toLowerCase().includes('lead');
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
      }

      // Search query filter (applies across both active & alumni)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        const matchBranch = m.branch?.toLowerCase().includes(q);
        const matchDept = m.department?.toLowerCase().includes(q);
        const matchYear = m.year?.toLowerCase().includes(q);
        const matchSkills = (m.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchRole && !matchBranch && !matchDept && !matchYear && !matchSkills) {
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
        <FadeIn delay={0.05}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
              // SOCIETY ROSTER
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              OFFICIAL STUDENT COUNCIL ROSTER
            </span>
          </div>
        </FadeIn>

        <TextReveal as="h1" delay={0.1} duration={0.8} className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
          <span>THE PEOPLE</span><br />
          <span>BEHIND THE SHADOW.</span>
        </TextReveal>

        <FadeIn delay={0.2}>
          <p className="text-sm sm:text-base text-[#A1A1A1] max-w-2xl font-sans">
            The selected researchers, core captains, and operations team driving cybersecurity education, competitive CTF engagements, and technological defense at Shadow Code Society.
          </p>
        </FadeIn>

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
            <FadeIn>
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
            </FadeIn>
          )}

          {/* Members Grid */}
          <div className="space-y-6">
            <FadeIn>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-xs font-mono tracking-[0.2em] text-[#A1A1A1] uppercase font-semibold">
                  // {activeTab === 'CURRENT' ? 'ACTIVE OPERATORS & RESEARCHERS' : 'HALL OF FAME ALUMNI'}
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  {filteredMembers.length} {filteredMembers.length === 1 ? 'PERSON' : 'MEMBERS'}
                </span>
              </div>
            </FadeIn>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-16 bg-[#0B0B0B] border border-white/10 rounded-xl space-y-2">
                <p className="text-sm font-mono text-zinc-400">NO MEMBERS MATCH CRITERIA</p>
                <p className="text-xs text-zinc-600 font-sans">Try modifying your search query or switching domain filters.</p>
              </div>
            ) : (
              <StaggerContainer stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                  const isCaptain = member.role.toLowerCase().includes('captain') && !member.role.toLowerCase().includes('vice');
                  const isVice = member.role.toLowerCase().includes('vice');
                  const isLead = member.role.toLowerCase().includes('lead');

                  return (
                    <StaggerItem key={member.id}>
                    <div
                      className="h-full bg-[#0B0B0B] border border-white/[0.08] hover:border-[#FF4D1C]/40 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 space-y-6 group relative overflow-hidden"
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
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

