import React from 'react';

interface CyberSceneProps {
  sceneId: string;
  progress: number; // 0 to 1 through this scene
  accentColor: string;
}

export const CyberSceneCanvas: React.FC<CyberSceneProps> = ({ sceneId, progress, accentColor }) => {
  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));

  if (sceneId === 'recon') {
    // 01 / RECONNAISSANCE & OSINT
    const radarAngle = (p * 360 * 2) % 360;
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none pointer-events-none">
        <svg className="w-full max-w-2xl aspect-square" viewBox="0 0 500 500" fill="none">
          {/* Concentric Radar Rings */}
          <circle cx="250" cy="250" r="230" stroke={accentColor} strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="250" cy="250" r="180" stroke={accentColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="120" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <circle cx="250" cy="250" r="60" stroke={accentColor} strokeWidth="1" strokeOpacity="0.3" />
          <circle cx="250" cy="250" r="4" fill={accentColor} />

          {/* Coordinate Crosshairs */}
          <line x1="20" y1="250" x2="480" y2="250" stroke={accentColor} strokeWidth="1" strokeOpacity="0.25" />
          <line x1="250" y1="20" x2="250" y2="480" stroke={accentColor} strokeWidth="1" strokeOpacity="0.25" />

          {/* Rotating Radar Sweep Line & Arc */}
          <g transform={`rotate(${radarAngle} 250 250)`}>
            <path d="M 250 250 L 480 250 A 230 230 0 0 0 412 88 Z" fill={accentColor} fillOpacity="0.15" />
            <line x1="250" y1="250" x2="480" y2="250" stroke={accentColor} strokeWidth="2" />
          </g>

          {/* Detected Target Blips */}
          <g transform="translate(180, 140)">
            <circle cx="0" cy="0" r="5" fill={accentColor} className="animate-ping" opacity="0.8" />
            <circle cx="0" cy="0" r="4" fill={accentColor} />
            <text x="10" y="4" fill={accentColor} fontSize="10" fontFamily="monospace" opacity="0.85">
              192.168.1.104 // HOST_UP
            </text>
          </g>
          <g transform="translate(340, 310)">
            <circle cx="0" cy="0" r="4" fill="#FF4D1C" />
            <text x="10" y="4" fill="#FF4D1C" fontSize="10" fontFamily="monospace" opacity="0.85">
              DNS: ns1.target.corp
            </text>
          </g>
          <g transform="translate(120, 360)">
            <circle cx="0" cy="0" r="4" fill="#FF4D1C" />
            <text x="10" y="4" fill="#FF4D1C" fontSize="10" fontFamily="monospace" opacity="0.85">
              VULN: OPEN_PORT_8080
            </text>
          </g>

          {/* Orbiting Satellite Indicator */}
          <g transform={`rotate(${-p * 180} 250 250)`}>
            <rect x="242" y="12" width="16" height="12" fill={accentColor} fillOpacity="0.7" rx="2" />
            <line x1="230" y1="18" x2="270" y2="18" stroke={accentColor} strokeWidth="2" />
          </g>
        </svg>

        {/* Live Telemetry HUD Overlay */}
        <div className="absolute bottom-6 right-6 font-mono text-[11px] bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-lg text-left space-y-1 text-zinc-400">
          <div className="text-white font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-pulse" />
            RADAR TELEMETRY // GLOBAL SCAN
          </div>
          <div>SWEEP BEARING: <span className="text-[#FF4D1C]">{radarAngle.toFixed(1)}°</span></div>
          <div>COORDINATES: 37.7749° N, 122.4194° W</div>
          <div>ACTIVE PROBES: <span className="text-white">1,492 / 2,000</span></div>
          <div>SIGNAL LOCK: <span className="text-[#FF4D1C]">99.4% ENCRYPTED</span></div>
        </div>
      </div>
    );
  }

  if (sceneId === 'websec') {
    // 02 / WEB APPLICATION SECURITY & EXPLOITATION
    const highlightStep = Math.floor(p * 4);
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none pointer-events-none">
        <div className="w-full max-w-2xl bg-[#090b10]/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Window Chrome */}
          <div className="bg-white/5 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white/30" />
              <span className="w-3 h-3 rounded-full bg-white/30" />
              <span className="w-3 h-3 rounded-full bg-white/30" />
              <span className="ml-2 text-xs font-mono text-zinc-400">BURP_REPEATER // EXPLOIT_VECTOR.HTTP</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF4D1C]/20 text-[#FF4D1C] border border-[#FF4D1C]/30">
              INTERCEPT ACTIVE
            </span>
          </div>

          {/* Request Header & Body Stream */}
          <div className="p-4 font-mono text-xs sm:text-sm text-left space-y-2 text-zinc-300">
            <div className="text-zinc-500">// Target Endpoint</div>
            <div className="text-white">
              <span className="text-[#FF4D1C] font-bold">POST</span> /api/v2/auth/session-token HTTP/2
            </div>
            <div className="text-zinc-400">Host: vulnerable-bank.internal.corp</div>
            <div className="text-zinc-400">User-Agent: ShadowCode-SecurityScanner/4.1</div>
            <div className="text-zinc-400">Content-Type: application/json; charset=utf-8</div>
            <div className="text-zinc-400">X-Forwarded-For: 127.0.0.1</div>

            <div className="pt-2 border-t border-white/10 text-zinc-500">// Injection Payload Matrix</div>
            <div className="p-3 bg-black/60 rounded border border-white/5 space-y-1">
              <div className="text-zinc-400">
                {`{`}
              </div>
              <div className="pl-4">
                <span className="text-[#FF4D1C]">"client_id"</span>: <span className="text-zinc-200">"admin"</span>,
              </div>
              <div className={`pl-4 transition-colors ${highlightStep >= 1 ? 'text-[#FF4D1C] font-bold bg-[#FF4D1C]/10 p-1 rounded' : 'text-zinc-200'}`}>
                <span className="text-[#FF4D1C]">"session_key"</span>: <span className="text-[#FF4D1C]">"' OR '1'='1' -- /* BYPASS */"</span>,
              </div>
              <div className={`pl-4 transition-colors ${highlightStep >= 2 ? 'text-[#FF4D1C] font-bold bg-[#FF4D1C]/10 p-1 rounded' : 'text-zinc-200'}`}>
                <span className="text-[#FF4D1C]">"jwt_algorithm"</span>: <span className="text-[#FF4D1C]">"none"</span>,
              </div>
              <div className={`pl-4 transition-colors ${highlightStep >= 3 ? 'text-[#FF4D1C] font-bold bg-[#FF4D1C]/10 p-1 rounded' : 'text-zinc-200'}`}>
                <span className="text-[#FF4D1C]">"ssrf_callback"</span>: <span className="text-[#FF4D1C]">"http://169.254.169.254/latest/meta-data/"</span>
              </div>
              <div className="text-zinc-400">
                {`}`}
              </div>
            </div>

            {/* Server Response Status */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-500">RESPONSE CODE:</span>
              <span className="text-[#FF4D1C] font-bold">HTTP 200 OK // ROOT_PRIVILEGES_GRANTED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sceneId === 'pwn') {
    // 03 / BINARY EXPLOITATION & PWN
    const offsetBytes = Math.floor(p * 64);
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none pointer-events-none">
        <div className="w-full max-w-2xl bg-[#08090d]/90 border border-[#FF4D1C]/30 rounded-xl p-5 shadow-2xl backdrop-blur-md text-left font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-pulse" />
              <span className="text-sm font-bold text-white">GDB-PWNDBG // BINARY REVERSE ENGINEERING</span>
            </div>
            <span className="text-xs text-[#FF4D1C]">ARCH: x86_64 // NO_CANARY // NX_DISABLED</span>
          </div>

          {/* CPU Registers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white/5 p-2 rounded border border-white/5">
              <span className="text-zinc-400 block">$rax</span>
              <span className="text-[#FF4D1C] font-semibold">0x7fff5fbfc040</span>
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/5">
              <span className="text-zinc-400 block">$rbx</span>
              <span className="text-white">0x000000000000</span>
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/5">
              <span className="text-zinc-400 block">$rsp</span>
              <span className="text-[#FF4D1C] font-semibold">0x7fff5fbff7d0</span>
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/5">
              <span className="text-zinc-400 block">$rip</span>
              <span className="text-[#FF4D1C] font-semibold">0x0000004012b5</span>
            </div>
          </div>

          {/* Disassembly View */}
          <div className="bg-black/60 p-3 rounded-lg border border-white/5 text-xs space-y-1">
            <div className="text-zinc-500">// Stack Disassembly</div>
            <div className="text-zinc-400"><span className="text-zinc-600">0x40129a:</span> push   rbp</div>
            <div className="text-zinc-400"><span className="text-zinc-600">0x40129b:</span> mov    rbp, rsp</div>
            <div className="text-[#FF4D1C] font-semibold"><span className="text-zinc-600">0x40129e:</span> sub    rsp, 0x40           ; [64-byte stack buffer]</div>
            <div className="text-zinc-300"><span className="text-zinc-600">0x4012a2:</span> lea    rax, [rbp-0x40]</div>
            <div className="text-white"><span className="text-zinc-600">0x4012a6:</span> mov    rdi, rax</div>
            <div className="text-[#FF4D1C] font-bold"><span className="text-zinc-600">0x4012a9:</span> call   0x401030 &lt;gets@plt&gt;  ; [UNCHECKED INPUT!]</div>
            <div className="text-[#FF4D1C]"><span className="text-zinc-600">0x4012ae:</span> ret                        ; [RET CONTROLLED]</div>
          </div>

          {/* Buffer Overflow Gauge */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>STACK BUFFER INFILTRATION:</span>
              <span className="text-[#FF4D1C]">{offsetBytes} / 64 BYTES OVERWRITTEN</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF4D1C] transition-all duration-100"
                style={{ width: `${Math.min(100, (offsetBytes / 64) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sceneId === 'crypto') {
    // 04 / CRYPTOGRAPHY & CIPHER VAULT
    const rotation1 = p * 360;
    const rotation2 = -p * 270;
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none pointer-events-none">
        <svg className="w-full max-w-xl aspect-square" viewBox="0 0 500 500" fill="none">
          {/* Central Rotating Crypto Wheel 1 */}
          <g transform={`rotate(${rotation1} 250 250)`}>
            <circle cx="250" cy="250" r="210" stroke={accentColor} strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
            <circle cx="250" cy="250" r="190" stroke={accentColor} strokeWidth="2" opacity="0.4" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 250 + 190 * Math.cos(angle);
              const y = 250 + 190 * Math.sin(angle);
              return (
                <circle key={i} cx={x} cy={y} r="3" fill={accentColor} />
              );
            })}
          </g>

          {/* Reverse Rotating Crypto Wheel 2 */}
          <g transform={`rotate(${rotation2} 250 250)`}>
            <circle cx="250" cy="250" r="140" stroke="#FF4D1C" strokeWidth="1.5" opacity="0.5" strokeDasharray="12 4" />
            <circle cx="250" cy="250" r="90" stroke="#FF4D1C" strokeWidth="2" opacity="0.6" />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x = 250 + 140 * Math.cos(angle);
              const y = 250 + 140 * Math.sin(angle);
              return (
                <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill="#FF4D1C" transform={`rotate(45 ${x} ${y})`} />
              );
            })}
          </g>

          {/* Core Prime Factorization Node */}
          <circle cx="250" cy="250" r="45" fill="#0b0d14" stroke={accentColor} strokeWidth="2" />
          <text x="250" y="246" fill="white" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            AES-256
          </text>
          <text x="250" y="262" fill={accentColor} fontSize="9" fontFamily="monospace" textAnchor="middle">
            GCM_VAULT
          </text>
        </svg>

        {/* Live Cipher Telemetry HUD */}
        <div className="absolute bottom-6 left-6 font-mono text-[11px] bg-black/70 backdrop-blur-md border border-[#FF4D1C]/30 p-3 rounded-lg text-left space-y-1 text-zinc-400">
          <div className="text-white font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-pulse" />
            CRYPTOGRAPHIC ENGINE // SECP256K1
          </div>
          <div>MODULUS N: <span className="text-[#FF4D1C]">0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF...</span></div>
          <div>KEY DERIVATION: <span className="text-white">PBKDF2-HMAC-SHA512 // 600,000 ROUNDS</span></div>
          <div>ENTROPY POOL: <span className="text-[#FF4D1C]">256 BITS (MAXIMUM)</span></div>
        </div>
      </div>
    );
  }

  if (sceneId === 'dfir') {
    // 05 / DIGITAL FORENSICS & INCIDENT RESPONSE
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none pointer-events-none">
        <div className="w-full max-w-2xl bg-[#06080c]/95 border border-[#FF4D1C]/30 rounded-xl p-5 shadow-2xl backdrop-blur-md text-left font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4D1C] animate-pulse" />
              <span className="text-sm font-bold text-white">VOLATILITY 3 // MEMORY FORENSICS TRIAGE</span>
            </div>
            <span className="text-xs text-[#FF4D1C]">PROFILE: Win10x64_19041</span>
          </div>

          {/* Hex Dump Window */}
          <div className="bg-black/70 p-3 rounded-lg border border-white/5 text-[11px] sm:text-xs space-y-1 overflow-x-auto text-zinc-300">
            <div className="text-zinc-500">// Process Memory Dump (0x00400000)</div>
            <div className="flex gap-4">
              <span className="text-zinc-500">00000000</span>
              <span className="text-[#FF4D1C]">4d 5a 90 00 03 00 00 00</span>
              <span className="text-zinc-400">04 00 00 00 ff ff 00 00</span>
              <span className="text-white">MZ..............</span>
            </div>
            <div className="flex gap-4">
              <span className="text-zinc-500">00000010</span>
              <span className="text-zinc-400">b8 00 00 00 00 00 00 00</span>
              <span className="text-zinc-400">40 00 00 00 00 00 00 00</span>
              <span className="text-zinc-400">........@.......</span>
            </div>
            <div className="flex gap-4 bg-[#FF4D1C]/10 py-0.5 rounded text-[#FF4D1C]">
              <span className="text-[#FF4D1C]">00000020</span>
              <span className="font-bold">63 32 2e 73 68 61 64 6f</span>
              <span className="font-bold">77 63 6f 64 65 2e 64 65</span>
              <span className="font-bold text-white">c2.shadowcode.de</span>
            </div>
            <div className="flex gap-4">
              <span className="text-zinc-500">00000030</span>
              <span className="text-zinc-400">00 00 00 00 00 00 00 00</span>
              <span className="text-zinc-400">f8 00 00 00 0e 1f ba 0e</span>
              <span className="text-zinc-400">................</span>
            </div>
          </div>

          {/* Process Tree Findings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 p-2.5 rounded border border-white/5 space-y-1">
              <span className="text-zinc-400 block text-[10px]">DETECTED C2 BEACON</span>
              <span className="text-[#FF4D1C] font-semibold block">c2.shadowcode.dev:443</span>
              <span className="text-[10px] text-zinc-500">HEURISTIC CONFIDENCE: 99.8%</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded border border-white/5 space-y-1">
              <span className="text-zinc-400 block text-[10px]">CONTAINMENT STATUS</span>
              <span className="text-[#FF4D1C] font-semibold block">ISOLATED VIA EDR RULE #8812</span>
              <span className="text-[10px] text-zinc-500">MEMORY PRESERVED FOR EVIDENCE</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scene 6: CITADEL // THE SHADOW CORPS
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none pointer-events-none">
      <div className="text-center max-w-lg space-y-6">
        {/* Holographic Shield Emblem */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border border-[#FF4D1C]/40 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#FF4D1C]/40 absolute animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }} />
          <div className="w-20 h-20 rounded-2xl bg-[#FF4D1C]/15 border border-[#FF4D1C]/60 flex items-center justify-center backdrop-blur-md shadow-2xl">
            <svg className="w-10 h-10 text-[#FF4D1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        {/* Tactical Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#FF4D1C]/10 text-[#FF4D1C] border border-[#FF4D1C]/20">
            DEFCON QUALIFIED
          </span>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/5 text-[#F5F5F5] border border-white/10">
            100% STUDENT-LED RESEARCH
          </span>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#FF4D1C]/10 text-[#FF4D1C] border border-[#FF4D1C]/20">
            ZERO PREREQUISITES
          </span>
        </div>
      </div>
    </div>
  );
};
