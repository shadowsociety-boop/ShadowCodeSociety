import React from 'react';
import { ShieldCheck, Lock, Activity, Cpu } from 'lucide-react';
import { SecurityCore } from './SecurityCore';

interface DefenseLayerProps {
  className?: string;
}

export const DefenseLayer: React.FC<DefenseLayerProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {/* Defensive Forcefield Geometry */}
      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
        {/* Layer 1: Hexagonal Perimeter Forcefield */}
        <div className="absolute inset-4 border-2 border-[#FF4D1C]/40 rounded-[40px] rotate-12 animate-[pulse_4s_easeInOut_infinite]" />
        <div className="absolute inset-8 border border-emerald-500/30 rounded-[36px] -rotate-6" />

        {/* Layer 2: Concentric Zero-Trust Boundary Rings */}
        <div className="absolute inset-16 border border-[#FF4D1C]/30 rounded-full border-dashed animate-[spin_50s_linear_infinite]" />
        <div className="absolute inset-28 border border-white/10 rounded-full animate-[spin_70s_linear_infinite_reverse]" />

        {/* Layer 3: Central Shield Core Protected */}
        <div className="relative z-20">
          <SecurityCore bootStage="defense" size="lg" />
        </div>

        {/* Layer 4: Orbital Security Satellites */}
        <div className="absolute top-[18%] left-[20%] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black/90 border border-emerald-500/50 flex items-center justify-center shadow-lg">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[8.5px] font-mono text-zinc-300">
            ENCRYPTION: AES-256
          </div>
        </div>

        <div className="absolute bottom-[20%] right-[18%] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black/90 border border-[#FF4D1C]/60 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-4 h-4 text-[#FF4D1C]" />
          </div>
          <div className="px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[8.5px] font-mono text-zinc-300">
            ZERO TRUST: ACTIVE
          </div>
        </div>
      </div>

      {/* Floating Tactical Defense Matrix Cards */}
      <div className="absolute top-4 right-4 sm:right-6 z-20 bg-[#06080A]/90 border border-emerald-500/30 rounded-xl p-3 sm:p-4 text-left font-mono max-w-[240px] shadow-[0_16px_36px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold pb-2 border-b border-white/10">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FIREWALL MATRIX</span>
          <span className="ml-auto text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
            ENGAGED
          </span>
        </div>
        <div className="pt-2 text-[9px] space-y-1.5 text-zinc-300">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">IDS/IPS:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" /> MONITORING
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">CIPHER:</span>
            <span className="text-white font-medium">AES-256-GCM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">HONEYPOT:</span>
            <span className="text-[#FF4D1C]">SYNCED (0 THREATS)</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 sm:left-6 z-20 bg-[#06080A]/90 border border-white/10 rounded-xl p-3 sm:p-4 text-left font-mono max-w-[210px] shadow-[0_16px_36px_rgba(0,0,0,0.9)] backdrop-blur-md hidden sm:block">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] pb-1.5 border-b border-white/10">
          <Cpu className="w-3.5 h-3.5 text-[#FF4D1C]" />
          <span>HARDENED KERNEL</span>
        </div>
        <div className="pt-2 text-[8.5px] text-zinc-400 space-y-1">
          <div>eBPF TELEMETRY: 100%</div>
          <div className="text-emerald-400">MEMORY SAFE (RING-0)</div>
        </div>
      </div>
    </div>
  );
};
