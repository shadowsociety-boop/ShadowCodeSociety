import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourceService, ResourceItem } from '../services/resource.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, ExternalLink, User, Calendar, BookOpen, Download } from 'lucide-react';

export const ResourceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [resource, setResource] = useState<ResourceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      if (!slug) return;
      try {
        const data = await resourceService.getResourceBySlug(slug);
        setResource(data.resource);
      } catch (err) {
        setError('Failed to load archive entry.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center text-xs font-mono text-[#666666]">
        FETCHING ARCHIVE DOSSIER...
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">ARCHIVE RECORD NOT FOUND</h2>
        <Link to="/resources">
          <Button variant="secondary" size="sm">Back to Archive →</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left space-y-12">
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1A1] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO ARCHIVE</span>
      </Link>

      <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-8 sm:p-12 relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-[#FF4D1C]/15 text-[#FF4D1C] uppercase font-semibold border border-[#FF4D1C]/30">
            {resource.category}
          </span>
          <span className="text-xs font-mono text-[#666666]">
            RECORD ID: {resource.id.slice(0, 8)}
          </span>
        </div>

        <h1 className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          {resource.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#A1A1A1] pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF4D1C]" />
            <span>AUTHOR: {resource.author || 'Research Team'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF4D1C]" />
            <span>INDEXED: {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {resource.externalUrl && (
            <a
              href={resource.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#FF4D1C] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>EXTERNAL REPO / REFERENCE</span>
            </a>
          )}
        </div>
      </div>

      <div className="space-y-8 bg-[#080808] border border-white/[0.08] rounded-xl p-8 sm:p-10 text-left">
        <div className="space-y-2">
          <h3 className="text-xs font-mono tracking-widest text-[#FF4D1C] uppercase font-semibold">
            // DOSSIER SPECIFICATION
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
            {resource.description}
          </p>
        </div>

        {resource.fileUrl && (
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-white font-bold block">ATTACHED RESEARCH ASSET</span>
              <span className="text-[11px] font-mono text-[#666666]">Verified security document</span>
            </div>
            <a href={resource.fileUrl} target="_blank" download rel="noreferrer">
              <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                DOWNLOAD ASSET
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
