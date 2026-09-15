import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Logo } from '../../components/Logo';
import { Shield, Lock, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  // Eagerly pre-warm backend server as soon as login page loads
  useEffect(() => {
    api.get('/api/health').catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your administrator credentials.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      if (!err.response) {
        setError('Unable to reach server. Make sure the backend server is running.');
      } else {
        setError(err.response?.data?.error || 'Authentication rejected. Verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#050608] flex flex-col items-center justify-center p-4 relative overflow-hidden text-left">
      {/* Background Grids & Ambient Glow */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF4D1C]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to Site */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Site</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Card */}
        <Card className="p-8 sm:p-10 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(255,77,28,0.2)]">
          {/* Brand Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo size="lg" clickable={false} />
            </div>
            <div className="pt-2">
              <Badge variant="orange" size="md">
                SECURE CONSOLE GATEWAY
              </Badge>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white mt-2">
                OPERATOR AUTHORIZATION
              </h2>
              <p className="text-xs font-mono text-zinc-500">
                Authenticate with administrative credentials
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Operator Email"
              type="email"
              required
              placeholder="admin@shadowcode.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
              label="Access Passphrase"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<Lock className="w-4 h-4" />}
            >
              Authorize & Enter
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>DEMO CREDENTIALS:</span>
              <span className="text-[#FF4D1C]">ONE-CLICK FILL</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('mentor@shadowcode.dev', 'mentor123')}
                className="p-2 rounded-xl bg-white/5 hover:bg-[#FF4D1C]/15 border border-white/10 hover:border-[#FF4D1C]/40 text-left transition-all"
              >
                <span className="text-[11px] font-bold text-white block">Mentor (Full)</span>
                <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">mentor@shadowcode.dev</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('president@shadowcode.dev', 'president123')}
                className="p-2 rounded-xl bg-white/5 hover:bg-[#FF4D1C]/15 border border-white/10 hover:border-[#FF4D1C]/40 text-left transition-all"
              >
                <span className="text-[11px] font-bold text-white block">President (Ops)</span>
                <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">president@shadowcode.dev</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Security Warning */}
        <p className="text-[10px] font-mono text-zinc-600 text-center uppercase tracking-wider">
          UNAUTHORIZED INTRUSION ATTEMPTS ARE RECORDED AND LOGGED WITH IP AUDIT PROTOCOLS.
        </p>
      </div>
    </div>
  );
};
