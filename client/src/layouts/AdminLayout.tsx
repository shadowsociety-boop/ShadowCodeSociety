import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService, NotificationItem } from '../services/admin.service';
import { Logo } from '../components/Logo';
import { Badge } from '../components/ui/Badge';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileSpreadsheet,
  BookOpen,
  Image,
  FileCheck,
  BarChart3,
  ShieldAlert,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Search,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, isMentor } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await adminService.getNotifications();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread || 0);
      } catch {
        // silent fallback
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n.id === id || id === 'all' ? { ...n, read: true } : n)));
      if (id === 'all') setUnreadCount(0);
      else setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/admin/events?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Events & Forms', path: '/admin/events', icon: CalendarDays },
    { label: 'Registrations', path: '/admin/registrations', icon: FileSpreadsheet },
    { label: 'Resource Hub', path: '/admin/resources', icon: BookOpen },
    { label: 'Member Directory', path: '/admin/members', icon: Users },
    { label: 'Highlights & Gallery', path: '/admin/highlights', icon: Image },
    { label: 'Join Applications', path: '/admin/applications', icon: FileCheck },
    { label: 'Analytics & Growth', path: '/admin/analytics', icon: BarChart3 },
    ...(isMentor ? [{ label: 'Audit Trail', path: '/admin/audit-logs', icon: ShieldAlert }] : []),
    { label: 'Broadcast & Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-[#e2e8f0] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0a0c13] border-r border-white/[0.08] flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Clearance Badge */}
        <div className="px-5 py-3.5 bg-black/30 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Clearance:
            </span>
          </div>
          <Badge variant={isMentor ? 'orange' : 'zinc'} size="sm">
            {user?.role || 'OPERATOR'}
          </Badge>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF4D1C]/15 text-[#FF4D1C] font-bold border border-[#FF4D1C]/30 shadow-[0_0_15px_-3px_rgba(255,77,28,0.25)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#07080b]/60 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </span>
            <span className="text-[10px] text-zinc-600">↗</span>
          </Link>

          <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">{user?.name}</span>
              <span className="text-[10px] font-mono text-zinc-500 truncate">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              title="Terminate Session"
              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0c13]/80 backdrop-blur-xl border-b border-white/[0.08] h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search events, members..."
                className="w-full bg-[#07080b] text-xs font-mono text-zinc-200 placeholder-zinc-600 pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#FF4D1C]/60"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4D1C] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0d0f16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                      Notifications ({unreadCount})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => handleMarkRead('all')}
                        className="text-[10px] font-mono text-[#FF4D1C] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs font-mono text-zinc-500">
                        NO NEW ALERTS
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkRead(n.id)}
                          className={`p-3 text-left transition-colors cursor-pointer ${
                            n.read ? 'bg-transparent hover:bg-white/5 opacity-60' : 'bg-[#FF4D1C]/5 hover:bg-[#FF4D1C]/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-white">{n.title}</span>
                            <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-[#FF4D1C]/20 border border-[#FF4D1C]/40 flex items-center justify-center text-xs font-bold text-[#FF4D1C]">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-white">{user?.name}</span>
                <span className="text-[9px] font-mono text-[#FF4D1C] uppercase font-semibold mt-0.5">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
