import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BarChart3, TrendingUp, Users, Calendar, BookOpen, Shield } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const eventRegs = data?.registrationsPerEvent || [];
  const maxRegs = Math.max(...eventRegs.map((e: any) => e.count), 1);

  const resourceCats = data?.resourceCategories || [];
  const maxCatCount = Math.max(...resourceCats.map((r: any) => r.count), 1);

  const appStats = data?.applicationStats || {};
  const totalApps =
    (appStats.PENDING || 0) +
    (appStats.UNDER_REVIEW || 0) +
    (appStats.ACCEPTED || 0) +
    (appStats.REJECTED || 0);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <Badge variant="orange" size="md">TELEMETRY & GROWTH</Badge>
        <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
          Operational Analytics & Engagement
        </h1>
        <p className="text-xs font-mono text-zinc-400">
          Aggregated event registration volumes, recruitment conversion ratios, and knowledge base saturation.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-6 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase">Registered Events</span>
            <Calendar className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl font-black text-white font-['Space_Grotesk'] mt-2">
            {eventRegs.length}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 mt-1 block">Active event telemetry</span>
        </Card>

        <Card className="p-6 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase">Candidate Pipeline</span>
            <Users className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl font-black text-white font-['Space_Grotesk'] mt-2">
            {totalApps}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
            {appStats.ACCEPTED || 0} accepted into core
          </span>
        </Card>

        <Card className="p-6 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase">Knowledge Artifacts</span>
            <BookOpen className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="text-3xl font-black text-white font-['Space_Grotesk'] mt-2">
            {resourceCats.reduce((sum: number, c: any) => sum + c.count, 0)}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 mt-1 block">Indexed guides and tools</span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registrations Per Event (Visual Cyber Bars) */}
        <Card className="p-6 border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <span className="text-[#FF4D1C]">//</span> Event Turnout by Operations
            </h3>
            <span className="text-xs font-mono text-zinc-500">DELEGATES</span>
          </div>

          <div className="space-y-4">
            {eventRegs.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500 text-center py-8">NO EVENT DATA</p>
            ) : (
              eventRegs.map((e: any, idx: number) => {
                const pct = Math.max(5, Math.round((e.count / maxRegs) * 100));
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-200 truncate max-w-[280px]">{e.name}</span>
                      <span className="text-[#FF4D1C] font-bold">{e.count} Attendees</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF4D1C] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Application Status Pipeline */}
        <Card className="p-6 border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <span className="text-[#FF4D1C]">//</span> Candidate Conversion Funnel
            </h3>
            <span className="text-xs font-mono text-zinc-500">STATUS</span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Accepted', count: appStats.ACCEPTED || 0, color: 'bg-[#FF4D1C]', text: 'text-[#FF4D1C]' },
              { label: 'Pending Review', count: appStats.PENDING || 0, color: 'bg-white/60', text: 'text-zinc-300' },
              { label: 'Under Review', count: appStats.UNDER_REVIEW || 0, color: 'bg-[#FF4D1C]/50', text: 'text-[#FF4D1C]' },
              { label: 'Rejected', count: appStats.REJECTED || 0, color: 'bg-zinc-700', text: 'text-zinc-400' },
            ].map((st, i) => {
              const pct = totalApps > 0 ? Math.round((st.count / totalApps) * 100) : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">{st.label}</span>
                    <span className={`${st.text} font-bold`}>{st.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${st.color} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(3, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Resource Category Breakdown */}
        <Card className="p-6 border-white/10 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <span className="text-[#FF4D1C]">//</span> Cyber Library Saturation by Category
            </h3>
            <span className="text-xs font-mono text-zinc-500">ARTIFACTS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resourceCats.map((rc: any, i: number) => {
              const pct = Math.max(5, Math.round((rc.count / maxCatCount) * 100));
              return (
                <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/[0.05] space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white font-bold">{rc.category}</span>
                    <span className="text-[#FF4D1C] font-bold">{rc.count} items</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF4D1C] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
