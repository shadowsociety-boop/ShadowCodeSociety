import React, { useRef, useEffect } from 'react';

interface CyberGlobeProps {
  className?: string;
  mousePos?: { x: number; y: number };
  active?: boolean;
}

interface GeoNode {
  id: string;
  code: string;
  lat: number;
  lon: number;
}

const CYBER_NODES: GeoNode[] = [
  { id: 'SF', code: 'NODE_01', lat: 37.77, lon: -122.41 },
  { id: 'TYO', code: 'NODE_02', lat: 35.68, lon: 139.69 },
  { id: 'FRA', code: 'NODE_03', lat: 50.11, lon: 8.68 },
  { id: 'BOM', code: 'NODE_04', lat: 19.07, lon: 72.87 },
  { id: 'LON', code: 'NODE_05', lat: 51.50, lon: -0.12 },
  { id: 'SYD', code: 'NODE_06', lat: -33.86, lon: 151.20 },
];

const NETWORK_ROUTES: [string, string][] = [
  ['SF', 'TYO'],
  ['TYO', 'BOM'],
  ['BOM', 'FRA'],
  ['FRA', 'LON'],
  ['LON', 'SF'],
  ['TYO', 'SYD'],
  ['SF', 'LON'],
];

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

export const CyberGlobe: React.FC<CyberGlobeProps> = ({
  className = '',
  mousePos = { x: 0, y: 0 },
  active = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
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
    const latStep = 8;

    for (let lat = -72; lat <= 72; lat += latStep) {
      const radiusAtLat = Math.cos((lat * Math.PI) / 180);
      const stepCount = Math.max(8, Math.round(36 * radiusAtLat));
      const currentLonStep = 360 / stepCount;

      for (let lon = -180; lon < 180; lon += currentLonStep) {
        const isLand = isLandCoordinate(lat, lon);
        if (isLand || (Math.sin(lat * 3) * Math.cos(lon * 3) > 0.42 && Math.random() > 0.5)) {
          points.push({
            lat: (lat * Math.PI) / 180,
            lon: (lon * Math.PI) / 180,
            isLand,
            baseSize: isLand ? 1.3 : 0.75,
          });
        }
      }
    }

    const packets = NETWORK_ROUTES.map((_, i) => ({
      progress: (i * 0.25) % 1,
      speed: 0.003 + (i % 3) * 0.0012,
    }));

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 500;
      const height = canvas.clientHeight || 500;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateCanvasSize();

    const render = () => {
      const width = canvas.clientWidth || 500;
      const height = canvas.clientHeight || 500;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      rotationY += 0.0035;
      scanAngle += 0.014;

      const tiltX = 0.22 - mousePos.y * 0.12;
      const tiltY = rotationY + mousePos.x * 0.18;

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

        return { px, py, z: z1, scale, isFront: z1 > -20 };
      };

      // Back hemisphere points
      points.forEach((p) => {
        const proj = project(p.lat, p.lon);
        if (!proj.isFront) {
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, Math.max(0.6, p.baseSize * 0.45 * proj.scale), 0, Math.PI * 2);
          ctx.fillStyle = p.isLand ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)';
          ctx.fill();
        }
      });

      // Perimeter Ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 77, 28, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Network Routes
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
        const arcLift = Math.min(30, dist * 0.18);
        const cpX = midX;
        const cpY = midY - arcLift;

        const isVisible = from.isFront || to.isFront;
        const alpha = isVisible ? (from.isFront && to.isFront ? 0.35 : 0.12) : 0.03;

        ctx.beginPath();
        ctx.moveTo(from.px, from.py);
        ctx.quadraticCurveTo(cpX, cpY, to.px, to.py);
        ctx.strokeStyle = `rgba(255, 77, 28, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Data packets
        if (isVisible) {
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

      // Front hemisphere points
      points.forEach((p) => {
        const proj = project(p.lat, p.lon);
        if (proj.isFront) {
          const depthAlpha = 0.25 + 0.7 * Math.max(0, proj.z / radius);
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, p.baseSize * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = p.isLand
            ? `rgba(255, 255, 255, ${depthAlpha * 0.8})`
            : `rgba(255, 77, 28, ${depthAlpha * 0.35})`;
          ctx.fill();
        }
      });

      // Radar scan beam sweep
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.02, scanAngle, scanAngle + 0.25);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      const scanGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.02);
      scanGrad.addColorStop(0, 'rgba(255, 77, 28, 0)');
      scanGrad.addColorStop(1, 'rgba(255, 77, 28, 0.08)');
      ctx.fillStyle = scanGrad;
      ctx.fill();
      ctx.restore();

      // Nodes
      CYBER_NODES.forEach((node) => {
        const proj = nodeCoordsMap[node.id];
        if (!proj || !proj.isFront) return;

        ctx.beginPath();
        ctx.arc(proj.px, proj.py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4D1C';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(proj.px, proj.py, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        if (node.id === 'TYO' || node.id === 'SF') {
          ctx.font = '500 8px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(240, 240, 240, 0.75)';
          ctx.fillText(node.code, proj.px + 7, proj.py + 3);
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
  }, [active, mousePos]);

  return (
    <div className={`relative w-full aspect-square flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
