import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { soundFx } from '../utils/sound';
import { Shield, Radio, Activity, CheckCircle2, Lock, Zap } from 'lucide-react';

// Geographic node definitions
interface GeoNode {
  id: string;
  code: string;
  city: string;
  lat: number;
  lon: number;
  status: 'ONLINE' | 'SECURE' | 'PROTECTED' | 'VERIFIED' | 'STABLE';
  latency: string;
  metric: string;
}

const CYBER_NODES: GeoNode[] = [
  { id: 'SF', code: 'NODE_01', city: 'SAN FRANCISCO', lat: 37.77, lon: -122.41, status: 'PROTECTED', latency: '9ms', metric: 'Zero-Day Shield: ACTIVE' },
  { id: 'TYO', code: 'NODE_02', city: 'TOKYO', lat: 35.68, lon: 139.69, status: 'ONLINE', latency: '18ms', metric: 'TLS 1.3 // 840 MB/s' },
  { id: 'FRA', code: 'NODE_03', city: 'FRANKFURT', lat: 50.11, lon: 8.68, status: 'SECURE', latency: '14ms', metric: 'Firewall Tier-5 Active' },
  { id: 'BOM', code: 'NODE_04', city: 'MUMBAI', lat: 19.07, lon: 72.87, status: 'VERIFIED', latency: '12ms', metric: 'Deep Packet Inspection: PASS' },
  { id: 'LON', code: 'NODE_05', city: 'LONDON', lat: 51.50, lon: -0.12, status: 'ONLINE', latency: '11ms', metric: 'AES-256 Tunnel Active' },
  { id: 'SYD', code: 'NODE_06', city: 'SYDNEY', lat: -33.86, lon: 151.20, status: 'STABLE', latency: '22ms', metric: 'Packet Loss: 0.00%' },
];

// Connection routes between nodes
const NETWORK_ROUTES: [string, string][] = [
  ['SF', 'TYO'],
  ['TYO', 'BOM'],
  ['BOM', 'FRA'],
  ['FRA', 'LON'],
  ['LON', 'SF'],
  ['TYO', 'SYD'],
  ['SF', 'LON'],
];

// Continents bounding approximations for land density
function isLandCoordinate(lat: number, lon: number): boolean {
  if (lat >= 15 && lat <= 70 && lon >= -140 && lon <= -55) return true; // N. America
  if (lat >= -55 && lat <= 12 && lon >= -80 && lon <= -35) return true; // S. America
  if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 45) return true;   // Europe
  if (lat >= -35 && lat <= 36 && lon >= -18 && lon <= 50) return true;  // Africa
  if (lat >= 8 && lat <= 72 && lon >= 45 && lon <= 145) return true;   // Asia
  if (lat >= -40 && lat <= -11 && lon >= 113 && lon <= 154) return true; // Australia
  if (lat >= 8 && lat <= 35 && lon >= 68 && lon <= 90) return true;     // India
  return false;
}

export const CyberSecurityCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mouse parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GeoNode | null>(null);

  // Terminal ticker status
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerLines = useMemo(
    () => [
      'GLOBAL DEFENSE // STANDBY',
      'ENCRYPTION // AES-256 GCM',
      'TRAFFIC 2.4 GB/s // 0.00% LOSS',
      'FIREWALL // 0 THREATS',
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerLines.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [tickerLines.length]);

  // Mouse move handler for 3D parallax
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // ── 3D Canvas Globe Engine ───────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationY = 0;
    let scanAngle = 0;

    interface SpherePoint {
      lat: number;
      lon: number;
      isLand: boolean;
      baseSize: number;
    }

    const points: SpherePoint[] = [];
    const latStep = 7.5;

    for (let lat = -72; lat <= 72; lat += latStep) {
      const radiusAtLat = Math.cos((lat * Math.PI) / 180);
      const stepCount = Math.max(8, Math.round(38 * radiusAtLat));
      const currentLonStep = 360 / stepCount;

      for (let lon = -180; lon < 180; lon += currentLonStep) {
        const isLand = isLandCoordinate(lat, lon);
        if (isLand || (Math.sin(lat * 3) * Math.cos(lon * 3) > 0.42 && Math.random() > 0.5)) {
          points.push({
            lat: (lat * Math.PI) / 180,
            lon: (lon * Math.PI) / 180,
            isLand,
            baseSize: isLand ? 1.35 : 0.8,
          });
        }
      }
    }

    const packets = NETWORK_ROUTES.map((_, i) => ({
      progress: (i * 0.22) % 1,
      speed: 0.0035 + (i % 3) * 0.0012,
    }));

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 560;
      const height = canvas.clientHeight || 560;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateCanvasSize();

    const render = () => {
      const width = canvas.clientWidth || 560;
      const height = canvas.clientHeight || 560;
      const cx = width / 2;
      const cy = height / 2;
      // Generous radius with plenty of breathing room around it
      const radius = Math.min(width, height) * 0.37;

      ctx.clearRect(0, 0, width, height);

      const speed = prefersReducedMotion ? 0 : isHovered ? 0.005 : 0.0032;
      rotationY += speed;
      scanAngle += 0.012;

      const tiltX = 0.22 + (prefersReducedMotion ? 0 : -mousePos.y * 0.15);
      const tiltY = rotationY + (prefersReducedMotion ? 0 : mousePos.x * 0.2);

      const project = (latRad: number, lonRad: number, r: number = radius) => {
        const x0 = r * Math.cos(latRad) * Math.sin(lonRad + tiltY);
        const y0 = -r * Math.sin(latRad);
        const z0 = r * Math.cos(latRad) * Math.cos(lonRad + tiltY);

        const y1 = y0 * Math.cos(tiltX) - z0 * Math.sin(tiltX);
        const z1 = y0 * Math.sin(tiltX) + z0 * Math.cos(tiltX);
        const x1 = x0;

        const fov = 580;
        const scale = fov / (fov - z1);
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;

        return { px, py, z: z1, scale, isFront: z1 > -25 };
      };

      // ── 1. Subtle Outer Glow Halo ──
      const globeGlow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.15);
      globeGlow.addColorStop(0, 'rgba(255, 77, 28, 0.04)');
      globeGlow.addColorStop(0.75, 'rgba(255, 77, 28, 0.015)');
      globeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = globeGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Back Hemisphere Points (Ethereal Depth) ──
      points.forEach((p) => {
        const proj = project(p.lat, p.lon);
        if (!proj.isFront) {
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, Math.max(0.6, p.baseSize * 0.45 * proj.scale), 0, Math.PI * 2);
          ctx.fillStyle = p.isLand ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.025)';
          ctx.fill();
        }
      });

      // ── 3. Subtle Latitude / Longitude Guidance Lines ──
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 77, 28, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Equator ellipse preview
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── 4. Network Routes (Curved Great-Circle Arcs) ──
      const nodeCoordsMap: Record<string, { px: number; py: number; z: number; isFront: boolean }> = {};
      CYBER_NODES.forEach((node) => {
        const latRad = (node.lat * Math.PI) / 180;
        const lonRad = (node.lon * Math.PI) / 180;
        nodeCoordsMap[node.id] = project(latRad, lonRad, radius * 1.01);
      });

      NETWORK_ROUTES.forEach(([fromId, toId], rIdx) => {
        const from = nodeCoordsMap[fromId];
        const to = nodeCoordsMap[toId];
        if (!from || !to) return;

        const midX = (from.px + to.px) / 2;
        const midY = (from.py + to.py) / 2;
        const dist = Math.hypot(to.px - from.px, to.py - from.py);
        const arcLift = Math.min(32, dist * 0.2);
        const cpX = midX;
        const cpY = midY - arcLift;

        const isVisible = from.isFront || to.isFront;
        const alpha = isVisible ? (from.isFront && to.isFront ? 0.32 : 0.12) : 0.04;

        ctx.beginPath();
        ctx.moveTo(from.px, from.py);
        ctx.quadraticCurveTo(cpX, cpY, to.px, to.py);
        ctx.strokeStyle = `rgba(255, 77, 28, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving Data Packet on the route
        if (isVisible && !prefersReducedMotion) {
          const packet = packets[rIdx];
          packet.progress = (packet.progress + packet.speed) % 1;
          const t = packet.progress;

          const invT = 1 - t;
          const pktX = invT * invT * from.px + 2 * invT * t * cpX + t * t * to.px;
          const pktY = invT * invT * from.py + 2 * invT * t * cpY + t * t * to.py;

          ctx.beginPath();
          ctx.arc(pktX, pktY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pktX, pktY, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 77, 28, 0.4)';
          ctx.fill();
        }
      });

      // ── 5. Front Hemisphere Points (Crisp, Luminous) ──
      points.forEach((p) => {
        const proj = project(p.lat, p.lon);
        if (proj.isFront) {
          const depthAlpha = 0.25 + 0.7 * Math.max(0, proj.z / radius);
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, p.baseSize * proj.scale, 0, Math.PI * 2);

          if (p.isLand) {
            ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.8})`;
          } else {
            ctx.fillStyle = `rgba(255, 77, 28, ${depthAlpha * 0.35})`;
          }
          ctx.fill();
        }
      });

      // ── 6. Gentle Radar Sweep Beam ──
      if (!prefersReducedMotion) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.02, scanAngle, scanAngle + 0.28);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        const scanGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.02);
        scanGrad.addColorStop(0, 'rgba(255, 77, 28, 0)');
        scanGrad.addColorStop(1, 'rgba(255, 77, 28, 0.07)');
        ctx.fillStyle = scanGrad;
        ctx.fill();
        ctx.restore();
      }

      // ── 7. Clean Geographic Cyber Nodes ──
      // Keep nodes clean without permanently stamping 6 large text boxes on the sphere!
      CYBER_NODES.forEach((node) => {
        const proj = nodeCoordsMap[node.id];
        if (!proj || !proj.isFront) return;

        const isSelected = selectedNode?.id === node.id;
        const nodeGlowRadius = isSelected ? 7 : 4;

        // Subtle outer radar ripple
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, nodeGlowRadius * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? 'rgba(255, 77, 28, 0.85)' : 'rgba(255, 77, 28, 0.28)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node dot
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, nodeGlowRadius * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4D1C';
        ctx.fill();

        // Node center glint
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Only draw node label if selected or prominent (TYO/SF), kept discreet & uncluttered
        if (isSelected || node.id === 'TYO' || node.id === 'SF') {
          ctx.font = '500 8px "JetBrains Mono", monospace';
          ctx.fillStyle = isSelected ? '#FFFFFF' : 'rgba(240, 240, 240, 0.7)';
          ctx.fillText(node.code, proj.px + 8, proj.py + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => updateCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isHovered, mousePos, prefersReducedMotion, selectedNode]);

  const tiltStyle = useMemo(() => {
    if (prefersReducedMotion) return {};
    return {
      transform: `perspective(1000px) rotateX(${-mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg)`,
      transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
    };
  }, [mousePos, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none mx-auto group cursor-crosshair"
      style={tiltStyle}
    >
      {/* ── Background Cyber Glow & Depth Atmosphere ────────────────── */}
      <div className="absolute inset-0 bg-radial from-[#FF4D1C]/[0.08] via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

      {/* ── Outer 3D Orbital Security Rings (Refined & Airy) ─────────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 540 540"
        fill="none"
      >
        {/* Subtle Outer Boundary Ring */}
        <circle
          cx="270"
          cy="270"
          r="230"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Tilted Elliptical Orbit Ring */}
        <motion.ellipse
          cx="270"
          cy="270"
          rx="225"
          ry="95"
          stroke="rgba(255,77,28,0.18)"
          strokeWidth="1"
          strokeDasharray="14 12 4 12"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '270px 270px' }}
        />

        {/* Fine Meridian Ring */}
        <motion.ellipse
          cx="270"
          cy="270"
          rx="235"
          ry="110"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.8"
          strokeDasharray="30 150"
          animate={{ rotate: -360 }}
          transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '270px 270px' }}
        />

        {/* Tactical Crosshair Marks at perimeter */}
        <line x1="270" y1="20" x2="270" y2="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="270" y1="505" x2="270" y2="520" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="20" y1="270" x2="35" y2="270" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="505" y1="270" x2="520" y2="270" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      </svg>

      {/* ── Main Interactive 3D Cyber Globe (Canvas) ────────────────── */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-20 pointer-events-auto"
      />

      {/* ── Central Holographic Core (Airy, Non-blocking Emblem) ────── */}
      <div className="absolute z-30 flex flex-col items-center pointer-events-none">
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex flex-col items-center"
        >
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute -inset-2 bg-[#FF4D1C]/15 rounded-full blur-md animate-pulse" />

          {/* Minimalist Glass Emblem Badge */}
          <div className="relative w-12 h-12 rounded-xl bg-[#050508]/80 border border-[#FF4D1C]/50 p-2 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all">
            <svg viewBox="0 0 64 64" fill="none" className="w-7 h-7">
              <path
                d="M32 4L8 14V30C8 45.5 18.5 56.5 32 60C45.5 56.5 56 45.5 56 30V14L32 4Z"
                stroke="#FF4D1C"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M22 26L32 20L42 26V36C42 41 38 45 32 46C26 45 22 41 22 36V26Z"
                fill="#FF4D1C"
              />
              <circle cx="28" cy="30" r="2" fill="#050508" />
              <circle cx="36" cy="30" r="2" fill="#050508" />
              <path d="M29 38H35" stroke="#050508" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Sleek Micro-Status Pill */}
          <div className="mt-2 px-2.5 py-0.5 rounded-full bg-[#050508]/85 border border-white/10 text-[8.5px] font-mono tracking-wider text-zinc-300 flex items-center gap-1.5 shadow-md backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-medium">CORE</span>
            <span className="text-zinc-500">//</span>
            <span className="text-emerald-400">SECURE</span>
          </div>
        </motion.div>
      </div>

      {/* ── SLEEK, UNCLUTTERED PERIPHERAL HUD OVERLAYS ────────────────── */}

      {/* 1. TOP TACTICAL STATUS TICKER (Clean, Centered Header) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#060609]/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-300 shadow-lg pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white font-semibold tracking-wider">SEC_01</span>
        <span className="text-zinc-600">|</span>
        <span className="text-[#FF4D1C] truncate max-w-[210px] sm:max-w-[260px]">
          {tickerLines[tickerIndex]}
        </span>
      </div>

      {/* 2. TOP-RIGHT ULTRA-COMPACT NODE STATUS BADGE */}
      <div className="absolute top-3 right-3 z-30 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#060609]/80 border border-white/10 text-[9px] font-mono backdrop-blur-md shadow-md pointer-events-auto">
        <Radio className="w-3 h-3 text-[#FF4D1C]" />
        <span className="text-zinc-400">TYO:</span>
        <span className="text-white font-semibold">18ms</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>

      {/* 3. BOTTOM UNIFIED TELEMETRY DOCK (Placed at bottom border, doesn't overlap globe) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-[480px] flex items-center justify-between px-3 sm:px-4 py-2 rounded-lg bg-[#060609]/85 border border-white/10 backdrop-blur-md text-[9.5px] font-mono text-zinc-400 shadow-xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#FF4D1C]" />
          <span className="text-white font-bold tracking-tight">2.4 GB/s</span>
          <span className="text-emerald-400 text-[8.5px]">↓0.00%</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
          <Lock className="w-3 h-3 text-zinc-400" />
          <span>CIPHER:</span>
          <span className="text-zinc-200 font-medium">AES-256</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-300">SHIELD:</span>
          <span className="text-emerald-400 font-semibold">ACTIVE</span>
        </div>
      </div>

      {/* ── Interactive Node Click Detail Drawer / Modal ───────────── */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 bottom-16 left-1/2 -translate-x-1/2 bg-[#08080C] border border-[#FF4D1C]/60 rounded-xl p-3.5 shadow-[0_16px_40px_rgba(255,77,28,0.25)] text-left font-mono text-xs w-72 backdrop-blur-xl pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D1C]" />
                {selectedNode.code} ({selectedNode.city})
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-zinc-400 hover:text-white px-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="pt-2 text-[10px] space-y-1 text-zinc-300">
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-emerald-400 font-bold">{selectedNode.status}</span>
              </div>
              <div className="flex justify-between">
                <span>LATENCY:</span>
                <span className="text-white font-medium">{selectedNode.latency}</span>
              </div>
              <div className="text-[8.5px] text-zinc-400 pt-0.5">
                {selectedNode.metric}
              </div>
              <div className="pt-1 text-[8px] text-[#FF4D1C] font-semibold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                VERIFIED OPERATIONAL NODE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
