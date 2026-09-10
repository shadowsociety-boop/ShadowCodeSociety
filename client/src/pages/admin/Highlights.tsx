import React, { useState, useEffect } from 'react';
import { highlightService, HighlightItem } from '../../services/highlight.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Image, PlusCircle, Trash2, Calendar, Upload } from 'lucide-react';

export const AdminHighlights: React.FC = () => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<any>('Photo');
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      const data = await highlightService.listHighlights({ limit: 100 });
      setHighlights(data.highlights || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) {
      alert('Title and Image file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('featured', String(featured));
    if (date) formData.append('date', date);
    formData.append('image', file);

    setSaving(true);
    try {
      await highlightService.createHighlight(formData);
      setModalOpen(false);
      setTitle('');
      setDescription('');
      setFile(null);
      await fetchHighlights();
    } catch {
      alert('Failed to create highlight.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!window.confirm(`Delete highlight "${titleStr}"?`)) return;
    try {
      await highlightService.deleteHighlight(id);
      setHighlights(prev => prev.filter(h => h.id !== id));
    } catch {
      alert('Failed to delete highlight.');
    }
  };

  const categories = ['Photo', 'Achievement', 'Event', 'Workshop', 'Competition', 'Other'];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange" size="md">RECORD OF HONORS</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Highlights & Gallery Archive
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Publish event photographs, CTF victory records, and notable accomplishments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add New Highlight
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="h-60 animate-pulse bg-white/[0.02]" children={null} />
          ))}
        </div>
      ) : highlights.length === 0 ? (
        <Card className="text-center py-16 border-white/10">
          <Image className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">No Highlights Recorded</h3>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <Card key={h.id} className="p-0 overflow-hidden border-white/10 group">
              <div className="h-44 w-full bg-[#141722] relative overflow-hidden">
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <Badge variant={h.category === 'Achievement' ? 'green' : 'orange'} className="absolute top-3 right-3">
                  {h.category}
                </Badge>
              </div>

              <div className="p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {new Date(h.date).toLocaleDateString()}
                  </span>
                  <h4 className="text-base font-bold text-white font-['Space_Grotesk'] mt-0.5 mb-1">
                    {h.title}
                  </h4>
                  {h.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {h.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex justify-end">
                  <button
                    onClick={() => handleDelete(h.id, h.title)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record New Highlight / Achievement"
        subtitle="Upload visual evidence and summary of club milestones."
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            required
            placeholder="e.g. 1st Place at National Inter-College CTF 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories}
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            />
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Textarea
            label="Description / Context"
            placeholder="Details about the event, team performance, problems solved..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Image file */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 font-medium">
              Image File (Required)
            </label>
            <div className="border border-dashed border-white/10 hover:border-white/20 rounded-xl p-4 text-center cursor-pointer bg-[#0a0c13]">
              <input
                type="file"
                id="highlight-file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="highlight-file" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                <span className="text-xs text-zinc-300 font-mono">
                  {file ? file.name : 'Select high-res JPG or PNG image'}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button variant="secondary" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={saving}>
              Record Highlight
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
