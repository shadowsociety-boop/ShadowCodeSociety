import React from 'react';
import { AlertTriangle, ShieldAlert, Crosshair, Terminal } from 'lucide-react';

interface ThreatLayerProps {
  className?: string;
}

export const ThreatLayer: React.FC<ThreatLayerProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {/* Sweeping Threat Radar Grid */}
      <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
        {/* Radar concentric circles */}
        <div className="absolute inset-0 border border-red-500/20 rounded-full" />
        <div className="absolute inset-12 border border-red-500/30 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-24 border border-red-500/15 rounded-full" />
        <div className="absolute inset-36 border border-white/10 rounded-full" />

        {/* Tactical Crosshair Axis */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-500/20" />
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-red-500/20" />

        {/* Active Radar Sweep Cone */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(239,68,68,0.22)_60deg,transparent_60deg)] animate-[spin_4s_linear_infinite] pointer-events-none" />

        {/* Threat Target Anomalies */}
        <div className="absolute top-[28%] right-[26%] flex items-center gap-2 animate-bounce">
          <div className="relative w-7 h-7 border border-red-500 rounded flex items-center justify-center bg-red-950/50 backdrop-blur-sm">
            <Crosshair className="w-4 h-4 text-red-400 animate-spin" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="px-2 py-1 bg-black/90 border border-red-500/50 rounded text-[9px] font-mono text-red-300">
            UNKNOWN_VECTOR: 0x9F4C
          </div>
        </div>

        <div className="absolute bottom-[30%] left-[24%] flex items-center gap-2">
          <div className="w-5 h-5 border border-amber-500/60 rounded flex items-center justify-center bg-amber-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="px-1.5 py-0.5 bg-black/80 border border-white/10 rounded text-[8px] font-mono text-zinc-400">
            SYN_FLOOD // MITIGATING
          </div>
        </div>

        {/* Central SecOps Lock Reticle */}
        <div className="relative z-10 w-28 h-28 rounded-2xl bg-black/85 border border-red-500/60 p-3 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)] backdrop-blur-md">
          <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
          <div className="text-[8px] font-mono text-red-400 font-bold tracking-widest mt-1">
            ALERT ENGAGED
          </div>
        </div>
      </div>

      {/* Floating Tactical SecOps Alert Panels */}
      <div className="absolute top-4 left-4 sm:left-6 z-20 bg-[#0B0507]/90 border border-red-500/40 rounded-xl p-3 sm:p-4 text-left font-mono max-w-[240px] shadow-[0_16px_36px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold pb-2 border-b border-red-500/20">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>THREAT DETECTED</span>
        </div>
        <div className="pt-2 text-[9px] space-y-1 text-zinc-300">
          <div className="flex justify-between">
            <span className="text-zinc-500">TARGET:</span>
            <span className="text-white font-bold">UNKNOWN NODE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">SEVERITY:</span>
            <span className="text-red-400 font-bold">CRITICAL (9.4)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">VECTOR:</span>
            <span className="text-amber-400">PORT 8443 BUFFER</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 sm:right-6 z-20 bg-[#0B0507]/90 border border-white/10 rounded-xl p-3 sm:p-4 text-left font-mono max-w-[220px] shadow-[0_16px_36px_rgba(0,0,0,0.9)] backdrop-blur-md hidden sm:block">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] pb-1.5 border-b border-white/10">
          <Terminal className="w-3.5 h-3.5 text-red-400" />
          <span>SYSTEM RESPONSE</span>
        </div>
        <div className="pt-2 text-[8.5px] text-zinc-300 space-y-1">
          <div className="text-emerald-400">✓ AUTO-ISOLATE INITIATED</div>
          <div className="text-zinc-400">→ HEURISTICS AUDIT</div>
          <div className="text-red-400 font-semibold">BLOCK_RULE // 0xSCS_APEX</div>
        </div>
      </div>
    </div>
  );
};
