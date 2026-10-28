import React, { useEffect, useState } from 'react';
import { userApi } from '../../api';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = (p = 0) => {
    setLoading(true);
    userApi.getAll(p, 10).then(res => {
      const data = res.data.data;
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(page); }, [page]);

  const toggleStatus = async (id: number) => {
    await userApi.toggleStatus(id);
    loadUsers(page);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👥 User Management</div>
          <div className="page-subtitle">Manage system users and their roles</div>
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
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td><span className={`role-tag role-${user.role}`}>{user.role.replace('ROLE_', '')}</span></td>
                    <td>
                      <span className={`badge ${user.active ? 'badge-green' : 'badge-red'}`}>
                        {user.active ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>◀</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={i === page ? 'active' : ''} onClick={() => setPage(i)}>
                {i + 1}
              </button>
            ))}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>▶</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
