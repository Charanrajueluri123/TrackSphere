import React, { useState } from 'react';
import { api, saveToken, decodeToken } from '../auth';

export default function AuthPage({ onLogin }) {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
    </div>
  );
}
