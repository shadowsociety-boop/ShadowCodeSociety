import React, { useState, useEffect } from 'react';
import { memberService } from '../../services/member.service';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Settings, Shield, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user, isMentor } = useAuth();
  const [admins, setAdmins] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await memberService.getAdmins();
        const list = data.admins || [];
        setAdmins(list);
        const pres = list.find((a) => a.role === 'PRESIDENT');
        if (pres) setSelectedAdminId(pres.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleAssignPresident = async () => {
    if (!selectedAdminId) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await memberService.assignPresident(selectedAdminId);
      setMessage(res.message || 'President role reassigned successfully.');
      const data = await memberService.getAdmins();
      setAdmins(data.admins || []);
    } catch {
      alert('Failed to assign president.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div>
        <Badge variant="orange" size="md">HIGH CLEARANCE PROTOCOLS</Badge>
        <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
          Society Configuration & Governance
        </h1>
        <p className="text-xs font-mono text-zinc-400">
          Mentor-level privilege delegation and society core parameters.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-[#FF4D1C]/10 border border-[#FF4D1C]/30 text-xs font-mono text-[#FF4D1C] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* President Delegation Card */}
      <Card className="p-8 border-white/10 space-y-6">
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <Badge variant="orange">GOVERNANCE APPOINTMENT</Badge>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mt-1">
              Designate Society President
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Only faculty mentors have clearance to appoint or transfer the presidential mantle.
            </p>
          </div>
          <Shield className="w-8 h-8 text-[#FF4D1C]/50" />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-mono uppercase text-zinc-400 block font-semibold">
            Select Administrator to designate as President:
          </label>
          <select
            value={selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
            className="w-full bg-[#121520] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#FF4D1C]"
          >
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.email}) — Current Role: [{a.role}]
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="md"
            onClick={handleAssignPresident}
            isLoading={saving}
            leftIcon={<UserCheck className="w-4 h-4" />}
          >
            Confirm Presidential Appointment
          </Button>
        </div>
      </Card>

      {/* System Parameter Specifications */}
      <Card className="p-8 border-white/10 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold uppercase text-white tracking-wider border-b border-white/10 pb-3">
          Active Security Policies
        </h3>
        <div className="space-y-2 text-zinc-300">
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-zinc-500">JWT Token Expiry</span>
            <span>24 Hours (HttpOnly, Lax)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-zinc-500">Rate Limiting Threshold</span>
            <span>200 requests / 15 minutes per IP</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-zinc-500">Storage Destination</span>
            <span>Local Disk Volume (/uploads)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-zinc-500">CORS Protection</span>
            <span className="text-[#FF4D1C]">Active (Strict Origin Whitelist)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
