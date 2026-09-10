import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, DashboardStats, AuditLogItem } from '../../services/admin.service';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Users,
  CalendarDays,
  FileSpreadsheet,
  BookOpen,
  FileCheck,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  Shield,
  Activity,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, isMentor } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data.stats);
        setActivity(data.recentActivity || []);
      } catch (err) {
        console.error('Failed to load dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <div className="space-y-12 text-left">
      {/* Header with Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-8">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#FF4D1C] uppercase font-semibold">
            CENTRAL OPERATIONS CONSOLE
          </span>
          <h1 className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
            {greeting}, {user?.name?.split(' ')[0] || 'ADMIN'}.
          </h1>
          <p className="text-xs font-mono text-[#A1A1A1] pt-1">
            NODE AUTH: {user?.email} // ROLE: {user?.role} // ENCRYPTION: ACTIVE
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/events/new">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
              NEW OPERATION
            </Button>
          </Link>
          <Link to="/" target="_blank">
            <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              LIVE SITE
            </Button>
          </Link>
        </div>
      </div>

      {/* Large Numerical Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Events */}
        <Link
          to="/admin/events"
          className="bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 p-5 rounded-lg transition-colors group space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
            <span>EVENTS</span>
            <CalendarDays className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors">
            {stats?.totalEvents ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#A1A1A1]">
            {stats?.upcomingEvents ?? 0} UPCOMING
          </div>
        </Link>

        {/* Registrations */}
        <Link
          to="/admin/registrations"
          className="bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 p-5 rounded-lg transition-colors group space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
            <span>REGISTRATIONS</span>
            <FileSpreadsheet className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors">
            {stats?.totalRegistrations ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#A1A1A1]">
            ACTIVE ATTENDEES
          </div>
        </Link>

        {/* Members */}
        <Link
          to="/admin/members"
          className="bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 p-5 rounded-lg transition-colors group space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
            <span>MEMBERS</span>
            <Users className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors">
            {stats?.currentMembers ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#A1A1A1]">
            {stats?.alumni ?? 0} ALUMNI
          </div>
        </Link>

        {/* Resources */}
        <Link
          to="/admin/resources"
          className="bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 p-5 rounded-lg transition-colors group space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
            <span>RESOURCES</span>
            <BookOpen className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors">
            {stats?.pendingResources ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#A1A1A1]">
            PENDING REVIEWS
          </div>
        </Link>

        {/* Applications */}
        <Link
          to="/admin/applications"
          className="bg-[#0B0B0B] border border-white/[0.08] hover:border-white/20 p-5 rounded-lg transition-colors group space-y-2 col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
            <span>APPLICATIONS</span>
            <FileCheck className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white group-hover:text-[#FF4D1C] transition-colors">
            {stats?.pendingApplications ?? 0}
          </div>
          <div className="text-[10px] font-mono text-[#FF4D1C]">
            PENDING TRIAGE
          </div>
        </Link>
      </div>

      {/* Main Split: Quick Controls + Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Actions & Management Shortcuts */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0B0B0B] border border-white/[0.08] rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-mono tracking-wider text-[#A1A1A1] uppercase font-semibold">
              // MANAGEMENT DISPATCH
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/events/new"
                className="p-4 bg-[#050505] border border-white/10 hover:border-[#FF4D1C]/50 rounded text-left transition-colors space-y-1 block"
              >
                <span className="text-xs font-mono text-white font-bold block">Create Event</span>
                <span className="text-[10px] text-[#666666]">Add workshops or CTFs</span>
              </Link>
              <Link
                to="/admin/registrations"
                className="p-4 bg-[#050505] border border-white/10 hover:border-[#FF4D1C]/50 rounded text-left transition-colors space-y-1 block"
              >
                <span className="text-xs font-mono text-white font-bold block">Export XLSX</span>
                <span className="text-[10px] text-[#666666]">Attendee data spreadsheets</span>
              </Link>
              <Link
                to="/admin/applications"
                className="p-4 bg-[#050505] border border-white/10 hover:border-[#FF4D1C]/50 rounded text-left transition-colors space-y-1 block"
              >
                <span className="text-xs font-mono text-white font-bold block">Review Candidates</span>
                <span className="text-[10px] text-[#666666]">Screen applicant queue</span>
              </Link>
              <Link
                to="/admin/resources"
                className="p-4 bg-[#050505] border border-white/10 hover:border-[#FF4D1C]/50 rounded text-left transition-colors space-y-1 block"
              >
                <span className="text-xs font-mono text-white font-bold block">Approve Content</span>
                <span className="text-[10px] text-[#666666]">Review community guides</span>
              </Link>
            </div>
          </div>

          <div className="bg-[#0B0B0B] border border-white/[0.08] rounded-lg p-6 space-y-3 font-mono text-xs text-[#A1A1A1]">
            <div className="flex items-center justify-between text-white font-bold border-b border-white/10 pb-2">
              <span>SYSTEM ENVIRONMENT</span>
              <span className="text-[#FF4D1C]">HEALTHY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">DATABASE</span>
              <span>SQLITE / PRISMA ENGINE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">API GATEWAY</span>
              <span>EXPRESS 5.0 // PORT 5001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">AUTH PROTOCOL</span>
              <span>JWT HS256 + BCRYPT</span>
            </div>
          </div>
        </div>

        {/* Right: Forensic Activity & Audit Stream */}
        <div className="lg:col-span-6">
          <div className="bg-[#0B0B0B] border border-white/[0.08] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF4D1C]" />
                <h3 className="text-xs font-mono tracking-wider text-white font-bold uppercase">
                  FORENSIC ACTIVITY FEED
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#666666]">REALTIME</span>
            </div>

            {activity.length === 0 ? (
              <div className="text-center py-10 text-xs font-mono text-[#666666]">
                NO RECENT LOG ENTRIES
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05] text-xs font-mono">
                {activity.slice(0, 7).map((log) => (
                  <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-white font-medium">{log.action}</div>
                      <div className="text-[10px] text-[#666666]">{log.details || log.entity}</div>
                    </div>
                    <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
