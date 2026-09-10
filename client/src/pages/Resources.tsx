import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService, ResourceItem } from '../services/resource.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BookOpen, Search, ArrowUpRight, PlusCircle } from 'lucide-react';

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await resourceService.listResources({
          search: search || undefined,
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        });
        setResources(data.resources || []);
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
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
          <span className="text-xs font-mono tracking-[0.2em] text-[#FF4D1C] uppercase font-semibold">
            // REPOSITORY
          </span>
          <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
            THE ARCHIVE
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl font-sans">
            Knowledge left behind by the people who explored the system.
          </p>
        </div>

        <Link to="/resources/submit">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            CONTRIBUTE ENTRY
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
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
            {resources.map((res, idx) => (
              <Link
                key={res.id}
                to={`/resources/${res.slug}`}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors text-xs font-mono group"
              >
                <div className="col-span-1 text-[#666666]">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="col-span-3 text-[#FF4D1C] font-medium uppercase truncate pr-2">
                  {res.category}
                </div>
                <div className="col-span-5 font-sans text-sm text-white font-semibold group-hover:text-[#FF4D1C] transition-colors truncate pr-4">
                  {res.title}
                </div>
                <div className="col-span-2 text-[#A1A1A1] truncate">
                  {res.author || 'Research Team'}
                </div>
                <div className="col-span-1 text-right text-zinc-500 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
