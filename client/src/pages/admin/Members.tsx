import React, { useState, useEffect } from 'react';
import { memberService, MemberItem } from '../../services/member.service';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  PlusCircle,
  Trash2,
  Award,
  ShieldCheck,
  Upload,
} from 'lucide-react';

export const AdminMembers: React.FC = () => {
  const { isMentor } = useAuth();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'CURRENT' | 'ALUMNI'>('CURRENT');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Security Researcher');
  const [department, setDepartment] = useState('Dept of CSE');
  const [year, setYear] = useState('3rd Year');
  const [branch, setBranch] = useState('Computer Science');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await memberService.listMembers(filterStatus);
      setMembers(data.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filterStatus]);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('department', department);
    formData.append('year', year);
    formData.append('branch', branch);
    formData.append('bio', bio);
    formData.append('status', filterStatus);
    if (github.trim()) formData.append('github', github);
    if (linkedin.trim()) formData.append('linkedin', linkedin);
    if (photo) formData.append('photo', photo);

    const skillArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    skillArray.forEach((s, i) => formData.append(`skills[${i}]`, s));

    setSaving(true);
    try {
      await memberService.createMember(formData);
      setModalOpen(false);
      setName('');
      setBio('');
      setSkills('');
      setGithub('');
      setLinkedin('');
      setPhoto(null);
      await fetchMembers();
    } catch (err) {
      alert('Failed to add member.');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToAlumni = async (id: string, memberName: string) => {
    if (!window.confirm(`Move ${memberName} to Alumni Hall of Fame?`)) return;
    try {
      await memberService.moveToAlumni(id);
      await fetchMembers();
    } catch {
      alert('Operation failed.');
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!window.confirm(`Permanently remove member ${memberName}?`)) return;
    try {
      await memberService.deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="md">PERSONNEL MATRIX</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Society Personnel & Core Directory
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Maintain active team researchers, assign roles, and transition graduating members to Alumni status.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add New Member
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setFilterStatus('CURRENT')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
            filterStatus === 'CURRENT'
              ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Current Active Team
        </button>
        <button
          onClick={() => setFilterStatus('ALUMNI')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
            filterStatus === 'ALUMNI'
              ? 'bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Alumni (Hall of Fame)
        </button>
      </div>

      {/* Members Grid / Table */}
      <Card className="p-0 overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121520] border-b border-white/10 text-zinc-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Member</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Academics</th>
                <th className="px-6 py-3.5">Specializations</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    LOADING ROSTER...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    NO MEMBERS IN THIS CATEGORY
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-base">
                          {m.photo ? (
                            <img src={m.photo} alt={m.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            m.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm font-sans">{m.name}</div>
                          <span className="text-[10px] text-zinc-500">{m.department || 'Society Member'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={m.role.toLowerCase().includes('president') || m.role.toLowerCase().includes('mentor') ? 'orange' : 'zinc'}>
                        {m.role}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      <div>{m.branch || 'CSE'}</div>
                      <span className="text-[10px] text-zinc-600">{m.year || '3rd Year'}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(m.skills || []).slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                            #{s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      {filterStatus === 'CURRENT' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMoveToAlumni(m.id, m.name)}
                          leftIcon={<Award className="w-3.5 h-3.5 text-[#FF4D1C]" />}
                        >
                          Move to Alumni
                        </Button>
                      )}
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Remove Member"
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

      {/* Add Member Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Society Member"
        subtitle="Register a new researcher or lead into the directory."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateMember} className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Jordan Miller"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Role / Title"
              required
              placeholder="e.g. CTF Lead / Exploit Analyst"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Input
              label="Year of Study"
              placeholder="e.g. 3rd Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Branch / Major"
              placeholder="e.g. CSE (Cybersecurity)"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
            <Input
              label="Department / College"
              placeholder="e.g. Dept of Computing"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <Input
            label="Skills & Tools (Comma-separated)"
            placeholder="Ghidra, Python, Linux, Reverse Engineering, Metasploit"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <Textarea
            label="Bio / Technical Focus"
            placeholder="Brief profile summary..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Handle/URL"
              placeholder="github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
            <Input
              label="LinkedIn URL"
              placeholder="linkedin.com/in/..."
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button variant="secondary" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={saving}>
              Add to Roster
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
