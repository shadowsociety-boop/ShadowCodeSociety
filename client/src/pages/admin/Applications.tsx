import React, { useState, useEffect } from 'react';
import { joinService, JoinApplicationItem } from '../../services/join.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SocialIcon } from '../../components/SocialIcon';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Download,
  Search,
  User,
} from 'lucide-react';

export const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<JoinApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedApp, setSelectedApp] = useState<JoinApplicationItem | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await joinService.listApplications({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const notes = window.prompt(`Optional notes for marking candidate as ${newStatus}:`);
    try {
      await joinService.updateStatus(id, newStatus, notes || undefined);
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch {
      alert('Status update failed.');
    }
  };

  const statuses = ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'ALL'];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange" size="md">CANDIDATE VETTING</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Membership Candidate Screening
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Review incoming applications, inspect background credentials, and issue admission decisions.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              statusFilter === st
                ? 'bg-[#FF4D1C] text-white font-bold shadow-[0_0_12px_rgba(255,77,28,0.3)]'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121520] border-b border-white/10 text-zinc-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">College & Year</th>
                <th className="px-6 py-3.5">Track / Experience</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Review & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    SCANNING CANDIDATE APPLICANTS...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    NO APPLICATIONS IN THIS STATUS
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm font-sans">{app.name}</div>
                      <div className="text-[10px] text-zinc-400">{app.email}</div>
                      {app.phone && <div className="text-[9px] text-zinc-600">{app.phone}</div>}
                    </td>

                    <td className="px-6 py-4 text-zinc-300">
                      <div>{app.college}</div>
                      <span className="text-[10px] text-zinc-500">{[app.course, app.year].filter(Boolean).join(' • ')}</span>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="cyan">{app.domainInterest || 'General'}</Badge>
                      <span className="block text-[10px] text-zinc-400 mt-1">{app.experience}</span>
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          app.status === 'ACCEPTED'
                            ? 'green'
                            : app.status === 'REJECTED'
                            ? 'red'
                            : app.status === 'UNDER_REVIEW'
                            ? 'cyan'
                            : 'orange'
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        Inspect Application
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
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

      {/* Detail Inspection Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Candidate: ${selectedApp?.name}`}
        subtitle={`${selectedApp?.college} • ${selectedApp?.year}`}
        maxWidth="xl"
      >
        {selectedApp && (
          <div className="space-y-6 text-left text-xs font-mono">
            {/* Identity & Contacts */}
            <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-xl border border-white/[0.06]">
              <div>
                <span className="text-zinc-500 block text-[10px]">EMAIL</span>
                <span className="text-white">{selectedApp.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">PHONE</span>
                <span className="text-white">{selectedApp.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">TRACK</span>
                <span className="text-[#FF4D1C] font-bold">{selectedApp.domainInterest}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">PROFICIENCY</span>
                <span className="text-[#FF4D1C]">{selectedApp.experience}</span>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <span className="text-zinc-400 block text-xs font-bold uppercase mb-1">
                Statement of Motivation:
              </span>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-zinc-300 font-sans text-sm leading-relaxed whitespace-pre-line">
                {selectedApp.motivation}
              </div>
            </div>

            {/* Skills */}
            {selectedApp.skills && selectedApp.skills.length > 0 && (
              <div>
                <span className="text-zinc-400 block text-xs font-bold uppercase mb-2">
                  Claimed Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/10">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Handles & Resume */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
              {selectedApp.github && (
                <a href={selectedApp.github} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1.5">
                  <SocialIcon type="github" className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {selectedApp.linkedin && (
                <a href={selectedApp.linkedin} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#FF4D1C] flex items-center gap-1.5">
                  <SocialIcon type="linkedin" className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {selectedApp.resumeUrl && (
                <a href={selectedApp.resumeUrl} target="_blank" download rel="noreferrer" className="text-[#FF4D1C] hover:underline flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>Download Resume Attachment</span>
                </a>
              )}
            </div>

            {/* Decision Actions in Modal */}
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleUpdateStatus(selectedApp.id, 'UNDER_REVIEW')}
              >
                Mark Under Review
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
              >
                Reject Candidate
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleUpdateStatus(selectedApp.id, 'ACCEPTED')}
              >
                Accept into Society
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
