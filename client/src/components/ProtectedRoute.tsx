import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'MENTOR' | 'PRESIDENT';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 border-2 border-[#FF4D1C]/20 border-t-[#FF4D1C] rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          VERIFYING ACCESS PRIVILEGES...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'MENTOR') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2">ACCESS RESTRICTED: 403</h2>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          This operation requires elevated <span className="font-mono text-[#FF4D1C]">{requiredRole}</span> clearance. Your current authorization level is <span className="font-mono text-zinc-300">{user?.role}</span>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
