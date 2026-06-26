import React, { useState } from 'react';
import { api, saveToken, decodeToken } from '../auth';

const demoAccounts = [
  {
    key: 'admin',
    label: 'Admin',
    role: '👑 Administrator',
    email: 'admin@tracksphere.com',
    password: 'Admin@123',
  },
  {
    key: 'developer',
    label: 'Developer',
    role: '👨‍💻 Developer',
    email: 'developer@tracksphere.com',
    password: 'Developer@123',
  },
  {
    key: 'tester',
    label: 'Tester',
    role: '🧪 Tester',
    email: 'tester@tracksphere.com',
    password: 'Tester@123',
  },
];

export default function AuthPage({ onLogin }) {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function fillDemo(account) {
    setForm((f) => ({ ...f, email: account.email, password: account.password }));
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      // POST /api/auth/login → returns JWT string directly
      const token = await api.login({ email: form.email, password: form.password });
      const payload = decodeToken(token);
      if (!payload) throw new Error('Invalid token received from server');
      saveToken(token);
      onLogin({ token, email: payload.sub, role: payload.role });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-shell">
        <div className="auth-box">
          <h2>TrackSphere</h2>
          <p className="subtitle">Sign in to continue</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }} disabled={busy}>
              {busy ? 'Please wait…' : 'Login'}
            </button>
          </form>
        </div>

        <div className="auth-demo-card">
          <div className="auth-demo-header">
            <h3>Demo Access</h3>
            {/* <span className="auth-demo-badge">Interview Ready</span> */}
          </div>
          <p className="auth-demo-copy">
            This application follows an enterprise workflow. User registration is intentionally disabled.
            Only administrators can create employee accounts.
          </p>

          <div className="auth-demo-actions">
            {demoAccounts.map((account) => (
              <button key={account.key} type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemo(account)}>
                Use {account.label}
              </button>
            ))}
          </div>

          <div className="auth-demo-list">
            {demoAccounts.map((account) => (
              <div key={account.key} className="auth-demo-account">
                <div className="auth-demo-role">{account.role}</div>
                <div className="auth-demo-cred"><strong>Email:</strong> {account.email}</div>
                <div className="auth-demo-cred"><strong>Password:</strong> {account.password}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
