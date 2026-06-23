import React, { useEffect, useState } from 'react';
import { api } from '../auth';
import Modal from './Modal';

export default function Projects({ role }) {
  const isAdmin = role === 'ADMIN';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    // GET /api/projects/getall
    api.getAllProjects().then(setProjects).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function create(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      // POST /api/projects/create  (ADMIN only)
      await api.createProject(form);
      setShowCreate(false);
      setForm({ name: '', description: '' });
      load();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function del(id, name) {
    if (!window.confirm(`Delete project "${name}"? This cannot be undone.`)) return;
    try {
      // DELETE /api/projects/{id}  (ADMIN only)
      await api.deleteProject(id);
      load();
    } catch (e) { alert(e.message); }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Projects</h1>
        {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            + New Project
          </button>
        )}
      </div>

      {loading && <div className="loading">Loading…</div>}

      {!loading && projects.length === 0 && (
        <div className="empty">No projects yet.</div>
      )}

      {!loading && projects.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: '#9ca3af' }}>#{p.id}</td>
                  <td><strong>{p.name}</strong></td>
                  <td style={{ color: '#6b7280' }}>{p.description || '—'}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => del(p.id, p.name)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <Modal title="Create Project" onClose={() => setShowCreate(false)}>
          <form onSubmit={create}>
            <div className="form-group">
              <label>Project Name</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Payment Gateway" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={set('description')} placeholder="Brief description…" />
            </div>
            {err && <div className="alert-error">{err}</div>}
            <div className="gap" style={{ marginTop: 4 }}>
              <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Create'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
