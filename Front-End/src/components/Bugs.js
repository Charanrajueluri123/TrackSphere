import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../auth';
import Modal from './Modal';
import Badge from './Badge';
import BugDetail from './BugDetail';

const STATUSES   = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

/*
  Role rules (what each role sees on the Bugs page):
  ─────────────────────────────────────────────────────────────────
  ADMIN
    - Sees ALL bugs (default view)
    - Can filter by status / priority
    - Can report a bug
    - Can view bug detail → assign developer, add comment
    - No "Assigned to Me" or "Reported by Me" buttons (not relevant for admin)

  DEVELOPER
    - Default view = MY ASSIGNED BUGS only (GET /api/bugs/my-bugs)
    - Can filter assigned bugs by status / priority
    - NO "Report Bug" button  ← fixed
    - NO "All Bugs" button    ← fixed (only sees their own assigned bugs)
    - Can view bug detail → update status, add comment

  TESTER
    - Default view = MY REPORTED BUGS (GET /api/bugs/my-reported-bugs)
    - Can filter reported bugs by status / priority
    - CAN report a bug (this is their main job)
    - NO "Assigned to Me" button  ← fixed (testers aren't assigned)
    - NO "All Bugs" button        ← fixed
    - Can view bug detail → add comment only
*/

export default function Bugs({ role }) {
  const isAdmin     = role === 'ADMIN';
  const isDeveloper = role === 'DEVELOPER';
  const isTester    = role === 'TESTER';

  // Default view per role
  const defaultView = isAdmin ? 'all' : isDeveloper ? 'assigned' : 'reported';

  const [bugs, setBugs]                     = useState([]);
  const [loading, setLoading]               = useState(false);
  const [filterStatus, setFilterStatus]     = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [selectedBug, setSelectedBug]       = useState(null);
  const [showCreate, setShowCreate]         = useState(false);
  const [projects, setProjects]             = useState([]);
  const [form, setForm]   = useState({ title: '', description: '', priority: 'MEDIUM', projectId: '' });
  const [createErr, setCreateErr] = useState('');
  const [createBusy, setCreateBusy] = useState(false);

  const loadBugs = useCallback(async () => {
    setLoading(true);
    try {
      let data;

      if (isDeveloper) {
        // DEVELOPER always sees only assigned bugs — filter client-side by status/priority
        const all = await api.getMyAssignedBugs(); // GET /api/bugs/my-bugs
        data = all.filter((b) => {
          if (filterStatus   && b.status   !== filterStatus)   return false;
          if (filterPriority && b.priority !== filterPriority) return false;
          return true;
        });
      } else if (isTester) {
        // TESTER always sees only their reported bugs — filter client-side
        const all = await api.getMyReportedBugs(); // GET /api/bugs/my-reported-bugs
        data = all.filter((b) => {
          if (filterStatus   && b.status   !== filterStatus)   return false;
          if (filterPriority && b.priority !== filterPriority) return false;
          return true;
        });
      } else {
        // ADMIN — full access with server-side filters
        if (filterStatus)        data = await api.getBugsByStatus(filterStatus);
        else if (filterPriority) data = await api.getBugsByPriority(filterPriority);
        else                     data = await api.getAllBugs();
      }

      setBugs(Array.isArray(data) ? data : []);
    } catch { setBugs([]); }
    finally { setLoading(false); }
  }, [isDeveloper, isTester, filterStatus, filterPriority]);

  useEffect(() => { loadBugs(); }, [loadBugs]);

  // Projects needed for create-bug dropdown (Tester + Admin can report)
  useEffect(() => {
    if (isAdmin || isTester) {
      api.getAllProjects().then(setProjects).catch(() => {});
    }
  }, [isAdmin, isTester]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function clearFilters() { setFilterStatus(''); setFilterPriority(''); }

  async function createBug(e) {
    e.preventDefault();
    setCreateErr(''); setCreateBusy(true);
    try {
      await api.createBug({ ...form, projectId: parseInt(form.projectId) });
      setShowCreate(false);
      setForm({ title: '', description: '', priority: 'MEDIUM', projectId: '' });
      loadBugs();
    } catch (err) { setCreateErr(err.message); }
    finally { setCreateBusy(false); }
  }

  // Page title per role
  const pageTitle = isDeveloper ? 'My Assigned Bugs' : isTester ? 'My Reported Bugs' : 'All Bugs';

  return (
    <div>
      <div className="page-header">
        <h1>{pageTitle}</h1>
        {/* Only ADMIN and TESTER can report bugs */}
        {(isAdmin || isTester) && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            + Report Bug
          </button>
        )}
      </div>

      {/* ── Filter bar — only status/priority filters, no view switching ── */}
      <div className="filter-bar">
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setFilterPriority(''); }}
        >
          <option value="">Filter by Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>

        <select
          value={filterPriority}
          onChange={(e) => { setFilterPriority(e.target.value); setFilterStatus(''); }}
        >
          <option value="">Filter by Priority</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {(filterStatus || filterPriority) && (
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>× Clear</button>
        )}
      </div>

      {/* ── Bug table ── */}
      {loading && <div className="loading">Loading…</div>}

      {!loading && bugs.length === 0 && (
        <div className="empty">
          {isDeveloper ? 'No bugs assigned to you yet.' :
           isTester    ? 'You have not reported any bugs yet.' :
                         'No bugs found.'}
        </div>
      )}

      {!loading && bugs.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Project</th>
                {/* Admin sees both assigned + reported columns; others see only what's relevant */}
                {(isAdmin || isTester) && <th>Reported By</th>}
                {(isAdmin || isDeveloper) && <th>Assigned To</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((b) => (
                <tr key={b.id}>
                  <td style={{ color: '#9ca3af' }}>#{b.id}</td>
                  <td><strong>{b.title}</strong></td>
                  <td><Badge value={b.priority} /></td>
                  <td><Badge value={b.status} /></td>
                  <td>{b.project?.name || '—'}</td>
                  {(isAdmin || isTester) && <td>{b.createdBy?.name || '—'}</td>}
                  {(isAdmin || isDeveloper) && (
                    <td>{b.assignedTo?.name || <span style={{ color: '#d1d5db' }}>Unassigned</span>}</td>
                  )}
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBug(b)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create Bug Modal (Admin + Tester only) ── */}
      {showCreate && (
        <Modal title="Report a Bug" onClose={() => setShowCreate(false)}>
          <form onSubmit={createBug}>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={set('title')} placeholder="Short summary of the issue" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={set('description')} placeholder="Steps to reproduce, expected vs actual…" />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Project</label>
              <select value={form.projectId} onChange={set('projectId')} required>
                <option value="">— select a project —</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            {createErr && <div className="alert-error">{createErr}</div>}
            <div className="gap" style={{ marginTop: 4 }}>
              <button className="btn btn-primary" disabled={createBusy}>
                {createBusy ? 'Submitting…' : 'Submit Bug'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Bug Detail Modal ── */}
      {selectedBug && (
        <BugDetail
          bug={selectedBug}
          role={role}
          onClose={() => setSelectedBug(null)}
          onRefresh={() => { setSelectedBug(null); loadBugs(); }}
        />
      )}
    </div>
  );
}
