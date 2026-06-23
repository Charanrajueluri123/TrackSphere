import React, { useEffect, useState } from 'react';
import { api } from '../auth';
import Modal from './Modal';
import Badge from './Badge';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Valid next statuses per current status (mirrors backend isValidTransition)
const NEXT_STATUS = {
  OPEN:        ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED:    ['CLOSED'],
  CLOSED:      [],
};

export default function BugDetail({ bug, role, onClose, onRefresh }) {
  const isAdmin     = role === 'ADMIN';
  const isDeveloper = role === 'DEVELOPER';

  const [comments,   setComments]   = useState([]);
  const [developers, setDevelopers] = useState([]); // GET /api/users/developers → [{id, name}]
  const [assignId,   setAssignId]   = useState('');
  const [newStatus,  setNewStatus]  = useState('');
  const [msg,        setMsg]        = useState('');
  const [info,       setInfo]       = useState('');
  const [err,        setErr]        = useState('');
  const [busyAssign, setBusyAssign] = useState(false);
  const [busyStatus, setBusyStatus] = useState(false);
  const [busyComment,setBusyComment]= useState(false);

  useEffect(() => {
    // GET /api/comments/{bugId}
    api.getComments(bug.id).then(setComments).catch(() => {});
    // GET /api/users/developers  — load developer list for assign dropdown (ADMIN only)
    if (isAdmin) {
      api.getDevelopers().then(setDevelopers).catch(() => {});
    }
  }, [bug.id, isAdmin]);

  const flash = (i, e) => { setInfo(i || ''); setErr(e || ''); };

  // ── Assign bug  PUT /api/bugs/{bugId}/assign/{developerId}  ADMIN only
  async function assign(e) {
    e.preventDefault();
    flash(); setBusyAssign(true);
    try {
      await api.assignBug(bug.id, parseInt(assignId));
      flash('Bug assigned successfully.');
      setAssignId('');
      onRefresh();
    } catch (e) { flash('', e.message); }
    finally { setBusyAssign(false); }
  }

  // ── Update status  PUT /api/bugs/{bugId}/status?status=X  DEVELOPER only
  async function changeStatus(e) {
    e.preventDefault();
    flash(); setBusyStatus(true);
    try {
      await api.updateBugStatus(bug.id, newStatus);
      flash(`Status updated to ${newStatus.replace('_', ' ')}.`);
      setNewStatus('');
      onRefresh();
    } catch (e) { flash('', e.message); }
    finally { setBusyStatus(false); }
  }

  // ── Add comment  POST /api/comments/add
  async function postComment(e) {
    e.preventDefault();
    flash(); setBusyComment(true);
    try {
      await api.addComment({ bugId: bug.id, message: msg });
      setMsg('');
      const updated = await api.getComments(bug.id);
      setComments(updated);
      flash('Comment posted.');
    } catch (e) { flash('', e.message); }
    finally { setBusyComment(false); }
  }

  const allowedNextStatuses = NEXT_STATUS[bug.status] || [];

  return (
    <Modal title={`Bug #${bug.id}`} onClose={onClose} width="500px">

      {/* ── Bug summary ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{bug.title}</div>
        <p style={{ marginTop: 6, fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
          {bug.description || <span style={{ color: '#9ca3af' }}>No description.</span>}
        </p>
        <div className="bug-meta">
          <span>Priority: <Badge value={bug.priority} /></span>
          <span>Status: <Badge value={bug.status} /></span>
          <span>Project: <strong>{bug.project?.name || '—'}</strong></span>
          <span>Reported by: <strong>{bug.createdBy?.name || '—'}</strong></span>
          <span>Assigned to: <strong>{bug.assignedTo?.name || <span style={{ color: '#9ca3af' }}>Unassigned</span>}</strong></span>
        </div>
      </div>

      {/* ── ADMIN: assign developer (dropdown from GET /api/users/developers) ── */}
      {isAdmin && (
        <>
          <hr className="divider" />
          <div className="section-title">Assign Developer</div>
          <form onSubmit={assign}>
            <div className="form-group">
              <label>Select Developer</label>
              <select value={assignId} onChange={(e) => setAssignId(e.target.value)} required>
                <option value="">— choose a developer —</option>
                {developers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} (ID: {d.id})</option>
                ))}
              </select>
              {developers.length === 0 && (
                <div className="form-hint">No developers registered yet.</div>
              )}
            </div>
            <button className="btn btn-secondary btn-sm" disabled={busyAssign || !assignId}>
              {busyAssign ? 'Assigning…' : 'Assign'}
            </button>
          </form>
        </>
      )}

      {/* ── DEVELOPER: update status (only valid next transitions shown) ── */}
      {isDeveloper && (
        <>
          <hr className="divider" />
          <div className="section-title">Update Status</div>
          {allowedNextStatuses.length === 0
            ? <p style={{ fontSize: 12, color: '#9ca3af' }}>This bug is CLOSED — no further transitions.</p>
            : (
              <form onSubmit={changeStatus}>
                <div className="form-group">
                  <label>Move to</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} required>
                    <option value="">— select status —</option>
                    {allowedNextStatuses.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <div className="form-hint">
                    Allowed: {bug.status} → {allowedNextStatuses.join(', ')}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" disabled={busyStatus || !newStatus}>
                  {busyStatus ? 'Updating…' : 'Update Status'}
                </button>
              </form>
            )}
        </>
      )}

      {/* ── Feedback messages ── */}
      {err  && <div className="alert-error"   style={{ marginTop: 10 }}>{err}</div>}
      {info && <div className="alert-success" style={{ marginTop: 10 }}>{info}</div>}

      {/* ── Comments ── GET /api/comments/{bugId} ── */}
      <hr className="divider" />
      <div className="section-title">Comments ({comments.length})</div>
      <div className="comment-list">
        {comments.length === 0
          ? <p style={{ fontSize: 12, color: '#9ca3af' }}>No comments yet.</p>
          : comments.map((c) => (
            <div className="comment-item" key={c.id}>
              <div className="c-msg">{c.message}</div>
              <div className="c-meta">
                {c.user?.name || 'Unknown'}
                {c.createdAt ? ` · ${new Date(c.createdAt).toLocaleString()}` : ''}
              </div>
            </div>
          ))}
      </div>

      {/* ── Add comment  POST /api/comments/add ── */}
      <form onSubmit={postComment} style={{ marginTop: 12 }}>
        <div className="form-group">
          <label>Add Comment</label>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={2}
            placeholder="Write a comment…"
            required
          />
        </div>
        <button className="btn btn-primary btn-sm" disabled={busyComment}>
          {busyComment ? 'Posting…' : 'Post Comment'}
        </button>
      </form>
    </Modal>
  );
}
