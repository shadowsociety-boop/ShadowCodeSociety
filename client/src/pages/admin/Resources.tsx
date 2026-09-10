import React, { useState, useEffect } from 'react';
import { resourceService, ResourceItem, ResourceSubmissionItem } from '../../services/resource.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import {
  BookOpen,
  PlusCircle,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Upload,
  Clock,
  Filter,
} from 'lucide-react';

export const AdminResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'official' | 'submissions'>('official');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [submissions, setSubmissions] = useState<ResourceSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Resource Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Cheat Sheet');
  const [newAuthor, setNewAuthor] = useState('Shadow Code Core');
  const [newTags, setNewTags] = useState('');
  const [newExternalUrl, setNewExternalUrl] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchOfficial = async () => {
    try {
      const data = await resourceService.adminListResources({ limit: 100 });
      setResources(data.resources || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const data = await resourceService.listSubmissions({ status: 'PENDING' });
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOfficial(), fetchSubmissions()]).finally(() => setLoading(false));
  }, []);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('description', newDesc);
    formData.append('category', newCategory);
    formData.append('author', newAuthor);
    if (newExternalUrl.trim()) formData.append('externalUrl', newExternalUrl);
    if (newFile) formData.append('file', newFile);

    const tagArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    tagArray.forEach((t, i) => formData.append(`tags[${i}]`, t));

    setCreating(true);
    try {
      await resourceService.createResource(formData);
      setCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewTags('');
      setNewExternalUrl('');
      setNewFile(null);
      await fetchOfficial();
    } catch (err) {
      alert('Failed to create official resource.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await resourceService.deleteResource(id);
      setResources(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  const handleApproveSubmission = async (id: string) => {
    try {
      await resourceService.approveSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      await fetchOfficial();
      alert('Submission approved and published to public library!');
    } catch {
      alert('Approval failed.');
    }
  };

  const handleRejectSubmission = async (id: string) => {
    const notes = window.prompt('Provide rejection reason (optional):');
    try {
      await resourceService.rejectSubmission(id, notes || undefined);
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('Rejection failed.');
    }
  };

  const categories = ['Cheat Sheet', 'Roadmap', 'Writeup', 'Tool', 'Guide', 'Research'];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan" size="md">KNOWLEDGE ARCHIVE</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Cybersecurity Resource Hub & Moderation
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Publish official roadmaps and review community-contributed research and writeups.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Publish New Resource
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('official')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
            activeTab === 'official'
              ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Official Resources ({resources.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold flex items-center gap-2 transition-all ${
            activeTab === 'submissions'
              ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>Community Submissions Queue</span>
          {submissions.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#FF4D1C] text-white text-[10px] flex items-center justify-center font-bold">
              {submissions.length}
            </span>
          )}
        </button>
      </div>

      {/* Official Resources Table */}
      {activeTab === 'official' ? (
        <Card className="p-0 overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#121520] border-b border-white/10 text-zinc-400 uppercase">
                <tr>
                  <th className="px-6 py-3.5">Title & Category</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Tags</th>
                  <th className="px-6 py-3.5">Links</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      LOADING ARCHIVE...
                    </td>
                  </tr>
                ) : resources.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      NO RESOURCES PUBLISHED YET
                    </td>
                  </tr>
                ) : (
                  resources.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <Badge variant="orange" className="mb-1">{res.category}</Badge>
                        <div className="font-bold text-white text-sm font-sans">{res.title}</div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-sm mt-0.5">{res.description}</p>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {res.author}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(res.tags || []).slice(0, 3).map((t, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {res.externalUrl ? (
                          <a href={res.externalUrl} target="_blank" rel="noreferrer" className="text-[#FF4D1C] hover:underline flex items-center gap-1">
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-zinc-600">Internal</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(res.id, res.title)}
                          className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Submissions Approval Queue */
        <Card className="p-0 overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#121520] border-b border-white/10 text-zinc-400 uppercase">
                <tr>
                  <th className="px-6 py-3.5">Proposed Resource</th>
                  <th className="px-6 py-3.5">Contributor</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Triage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-mono">
                      APPROVAL QUEUE IS CLEAR // ZERO PENDING SUBMISSIONS
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <Badge variant="orange" className="mb-1">{sub.category}</Badge>
                        <div className="font-bold text-white text-sm font-sans">{sub.title}</div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 max-w-sm mt-0.5">{sub.description}</p>
                        {sub.externalUrl && (
                          <a href={sub.externalUrl} target="_blank" rel="noreferrer" className="text-[#FF4D1C] hover:underline flex items-center gap-1 text-[10px] mt-1">
                            <span>{sub.externalUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        <div className="font-semibold text-white">{sub.contributorName}</div>
                        <div className="text-[10px] text-zinc-500">{sub.contributorEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApproveSubmission(sub.id)}
                          leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        >
                          Approve & Publish
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectSubmission(sub.id)}
                          leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Resource Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Publish Official Cybersecurity Resource"
        subtitle="Add a roadmap, tool guide, or exploit reference to the central library."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateResource} className="space-y-4">
          <Input
            label="Resource Title"
            required
            placeholder="e.g. Active Directory Penetration Testing Cheat Sheet"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Input
              label="Author / Curator"
              required
              placeholder="e.g. SCS Research Division"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
          </div>

          <Textarea
            label="Description / Abstract"
            required
            rows={4}
            placeholder="Detailed writeup, instructions, links..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          <Input
            label="Tags (Comma-separated)"
            placeholder="ad, kerberos, bloodhound, windows"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />

          <Input
            label="External Documentation URL"
            placeholder="https://..."
            value={newExternalUrl}
            onChange={(e) => setNewExternalUrl(e.target.value)}
          />

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button variant="secondary" size="md" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={creating}>
              Publish Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
