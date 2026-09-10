import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Terminal, ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_30px_rgba(255,46,91,0.3)]">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <Badge variant="red" size="md" className="mb-4">
        HTTP STATUS // 404 NOT FOUND
      </Badge>

      <h1 className="text-4xl sm:text-6xl font-black font-['Space_Grotesk'] text-white tracking-tight">
        DEAD NODE <span className="text-[#FF4D1C]">DETECTED</span>
      </h1>

      <p className="mt-3 text-sm font-mono text-zinc-400 max-w-md">
        The requested packet route does not resolve to an active cluster. The node may have been relocated, decommissioned, or encrypted.
      </p>

      <div className="mt-8 flex gap-4">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Perimeter
          </Button>
        </Link>
        <Link to="/events">
          <Button variant="secondary" size="md">
            View Events
          </Button>
        </Link>
      </div>
    </div>
  );
};
