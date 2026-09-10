import React, { useState, useEffect } from 'react';
import { adminService, AuditLogItem } from '../../services/admin.service';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldAlert, Clock, Filter, User, Terminal } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAuditLogs({ page, limit: 25 });
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange" size="md">SECURITY COMPLIANCE</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1">
            System Audit Trail // Forensic Log
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Immutable log of all administrative operations, entity modifications, approvals, and IP origins. (Mentor Clearance)
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="p-0 overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121520] border-b border-white/10 text-zinc-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Operator</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Target Entity</th>
                <th className="px-6 py-3.5">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    DECRYPTING AUDIT ARCHIVE...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    NO AUDIT LOGS RECORDED
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                      <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                      <span className="text-[10px] text-zinc-600">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-bold">{log.admin?.name || 'Operator'}</span>
                      <span className="text-[10px] font-mono text-[#FF4D1C] block">{log.admin?.role}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="orange" size="sm">
                        {log.action}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                      <span className="font-semibold text-white">{log.entity}</span>
                      {log.entityId && (
                        <span className="text-[10px] text-zinc-600 block truncate max-w-[120px]">
                          {log.entityId}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-zinc-400 max-w-sm">
                      <p className="line-clamp-2">{log.details || 'Action completed.'}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 disabled:opacity-30 text-white"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-white/5 disabled:opacity-30 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
