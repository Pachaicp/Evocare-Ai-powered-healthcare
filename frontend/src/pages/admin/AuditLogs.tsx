import React, { useEffect, useState } from 'react';
import { auditApi } from '../../api';
import { AuditLog } from '../../types';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    auditApi.getLogs(page, 20).then(res => {
      const data = res.data.data;
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🔍 Audit Logs</div>
          <div className="page-subtitle">System-wide activity history</div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner"/></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32 }}>No audit logs yet</td></tr>
                ) : logs.map(log => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>{log.user?.name || 'System'}</td>
                    <td><span className="badge badge-blue">{log.action}</span></td>
                    <td>{log.entityType ? `${log.entityType} #${log.entityId}` : '—'}</td>
                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>◀</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={i === page ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>▶</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
