import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService, ResourceItem } from '../services/resource.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BookOpen, Search, ArrowUpRight, PlusCircle } from 'lucide-react';
import { TextReveal, FadeIn } from '../components/ScrollReveal';

const FALLBACK_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Ethical Hacking Basics — Kali Linux',
    slug: 'ethical-hacking-basics-kali-linux',
    description: 'Comprehensive foundational guide to penetration testing and offensive security using Kali Linux tools.',
    author: 'Shadow Research',
    category: 'TUTORIALS',
    tags: ['Kali Linux', 'Ethical Hacking', 'Basics'],
    externalUrl: 'https://www.udemy.com/course/ethical-hacking-basics-kali-20211/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-2',
    title: 'OWASP ZAP From Scratch',
    slug: 'owasp-zap-from-scratch',
    description: 'Learn automated and manual web application vulnerability scanning using the OWASP Zed Attack Proxy.',
    author: 'Shadow Research',
    category: 'TOOLS',
    tags: ['OWASP', 'ZAP', 'Web Security'],
    externalUrl: 'https://www.udemy.com/course/owasp-zap-from-scratch/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-3',
    title: 'Cybersecurity Kali Linux Course — Part 1',
    slug: 'cybersecurity-kali-linux-course-part-1',
    description: 'Hands-on offensive cyber defense and tool mastery with Kali Linux suite Part 1.',
    author: 'Techlatest / SCS',
    category: 'TUTORIALS',
    tags: ['Kali Linux', 'Recon', 'Offensive'],
    externalUrl: 'https://www.udemy.com/course/cybersecurity-kali-linux-course-by-techlatest-part-1/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-4',
    title: 'Cybersecurity Kali Linux Course — Part 3',
    slug: 'cybersecurity-kali-linux-course-part-3',
    description: 'Advanced wireless analysis, credential harvesting, and pivoting workflows in Kali Linux.',
    author: 'Techlatest / SCS',
    category: 'TUTORIALS',
    tags: ['Kali Linux', 'Exploitation', 'Wireless'],
    externalUrl: 'https://www.udemy.com/course/cybersecurity-kali-linux-course-by-techlatest-part-3/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-5',
    title: 'Practical AWS Cloud Security',
    slug: 'practical-aws-cloud-security',
    description: 'Securing cloud infrastructure, IAM permissions, VPC design, and AWS security best practices.',
    author: 'Cloud Sec Team',
    category: 'SECURITY NOTES',
    tags: ['AWS', 'Cloud Security', 'IAM'],
    externalUrl: 'https://www.udemy.com/course/practical-aws-cloud-security/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-6',
    title: 'Networking for Ethical Hacker and Penetration Tester',
    slug: 'networking-for-ethical-hacker-and-penetration-tester',
    description: 'Master TCP/IP, subnetting, Wireshark packet dissection, and network socket communication fundamentals.',
    author: 'Network Ops',
    category: 'SECURITY NOTES',
    tags: ['Networking', 'TCP/IP', 'Wireshark'],
    externalUrl: 'https://www.udemy.com/course/networking-for-ethical-hacker-and-penetration-tester/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-7',
    title: 'Ethical Hacking Primer',
    slug: 'ethical-hacking-primer',
    description: 'Primer on offensive security concepts, defensive controls, and legal frameworks for penetration testing.',
    author: 'Shadow Research',
    category: 'TUTORIALS',
    tags: ['Ethical Hacking', 'Primer', 'Security'],
    externalUrl: 'https://www.udemy.com/course/ethical-hacking-primer/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-8',
    title: 'Manage Network Security with pfSense Firewall',
    slug: 'manage-network-security-with-pfsense-firewall',
    description: 'Building and administering enterprise-grade firewall filtering and IDS/IPS networks with pfSense.',
    author: 'Infrastructure Squad',
    category: 'TOOLS',
    tags: ['pfSense', 'Firewall', 'Network Defense'],
    externalUrl: 'https://www.udemy.com/course/crash-course-manage-network-security-with-pfsense-firewall/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-9',
    title: 'Ethical Hacker',
    slug: 'ethical-hacker',
    description: 'End-to-end curriculum for aspiring penetration testers, covering methodology from recon to post-exploitation.',
    author: 'Core Council',
    category: 'RESEARCH',
    tags: ['Penetration Testing', 'Methodology', 'Red Team'],
    externalUrl: 'https://www.udemy.com/course/ethical-hacker/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'res-10',
    title: 'Web Hacking — Cross-Site Scripting & SQL Injection',
    slug: 'web-hacking-xss-sqli',
    description: 'Deep dive into exploiting and remediating XSS, Blind SQLi, second-order injections, and modern web flaws.',
    author: 'Web Sec Division',
    category: 'CTF WRITEUPS',
    tags: ['XSS', 'SQLi', 'Web Exploitation'],
    externalUrl: 'https://www.udemy.com/course/lees-web-hacking-cross-site-scripting-sql-injection/',
    published: true,
    createdAt: '',
    updatedAt: '',
  },
];

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>(FALLBACK_RESOURCES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await resourceService.listResources({
          search: search || undefined,
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        });
        if (data.resources && data.resources.length > 0) {
          setResources(data.resources);
        } else if (!search && selectedCategory === 'ALL') {
          setResources(FALLBACK_RESOURCES);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error('Failed to load resources:', err);
      }
    };
    const timer = setTimeout(fetchResources, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const categories = [
    'ALL',
    'CTF WRITEUPS',
    'SECURITY NOTES',
    'WORKSHOP MATERIAL',
    'TOOLS',
    'TUTORIALS',
    'RESEARCH',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-10">
        <div className="space-y-4">
          <FadeIn delay={0.05}>
            <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
              // REPOSITORY
            </span>
          </FadeIn>
          <TextReveal as="h1" delay={0.1} duration={0.8} className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
            THE ARCHIVE
          </TextReveal>
          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
              Knowledge left behind by the people who explored the system.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <Link to="/resources/submit">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              CONTRIBUTE ENTRY
            </Button>
          </Link>
        </FadeIn>
      </div>

      {/* Filter & Search Bar */}
      <FadeIn delay={0.15}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#080808] p-4 rounded border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter archive by title, tool, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050505] border border-white/10 rounded pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FF4D1C] placeholder-zinc-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-mono tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/[0.04] text-[#A1A1A1] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      </FadeIn>

      {/* Table Editorial Layout */}
      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-[#666666]">
          SEARCHING ARCHIVE INDEX...
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-[#080808] rounded border border-white/10 space-y-3">
          <div className="text-sm font-mono text-[#A1A1A1]">NO ARCHIVE ENTRIES FOUND</div>
          <p className="text-xs text-[#666666]">Try adjusting your search terms or category selection.</p>
        </div>
      ) : (
        <FadeIn delay={0.1}>
        <div className="border border-white/[0.08] rounded-lg overflow-hidden bg-[#0B0B0B]">
          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3.5 bg-white/[0.02] border-b border-white/[0.08] text-[11px] font-mono text-[#666666] uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-3">DOMAIN</div>
            <div className="col-span-5">TITLE & TOPIC</div>
            <div className="col-span-2">CONTRIBUTOR</div>
            <div className="col-span-1 text-right">ACTION</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.05]">
            {resources.map((res, idx) => {
              const isExternal = !!res.externalUrl;
              const content = (
                <>
                  <div className="col-span-1 text-[#666666]">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-3 text-[#FF4D1C] font-medium uppercase truncate pr-2 flex items-center gap-2">
                    <span>{res.category}</span>
                    {isExternal && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF4D1C]/20 border border-[#FF4D1C]/30 text-[#FF4D1C] font-mono">
                        UDEMY
                      </span>
                    )}
                  </div>
                  <div className="col-span-5 font-sans text-sm text-white font-semibold group-hover:text-[#FF4D1C] transition-colors truncate pr-4">
                    {res.title}
                  </div>
                  <div className="col-span-2 text-[#A1A1A1] truncate">
                    {res.author || 'Research Team'}
                  </div>
                  <div className="col-span-1 text-right text-zinc-500 group-hover:text-[#FF4D1C] transition-colors">
                    <ArrowUpRight className="w-4 h-4 ml-auto" />
                  </div>
                </>
              );

              return isExternal ? (
                <a
                  key={res.id}
                  href={res.externalUrl!}
                  target="_blank"
                  rel="noreferrer"
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors text-xs font-mono group"
                  title={`Open ${res.title} on Udemy`}
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={res.id}
                  to={`/resources/${res.slug}`}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors text-xs font-mono group"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
        </FadeIn>
      )}
    </div>
  );
};
