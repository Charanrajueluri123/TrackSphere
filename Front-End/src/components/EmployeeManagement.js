import React, { useState, useEffect } from 'react';
import { api } from '../auth';

export default function EmployeeManagement() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'DEVELOPER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Load developers on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoadingEmployees(true);
      const devs = await api.getDevelopers();
      setEmployees(devs || []);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);

    try {
      // Validate form
      if (!form.name.trim()) throw new Error('Full name is required');
      if (!form.email.trim()) throw new Error('Email is required');
      if (!form.password) throw new Error('Password is required');
      if (form.password.length < 6) throw new Error('Password must be at least 6 characters');

      // Call register API (admin-only, requires JWT)
      await api.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setSuccess(`Employee ${form.name} created successfully!`);
      setForm({ name: '', email: '', password: '', role: 'DEVELOPER' });

      // Reload employees list
      await loadEmployees();
    } catch (err) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Employee Management</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Create Employee Form */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Create New Employee</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={set('role')}>
                <option value="DEVELOPER">Developer</option>
                <option value="TESTER">Tester</option>
              </select>
            </div>

            {error && <div className="alert-error" style={{ marginBottom: '12px' }}>{error}</div>}
            {success && <div className="alert-success" style={{ marginBottom: '12px', color: '#16a34a', background: '#dcfce7', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>{success}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              disabled={busy}
            >
              {busy ? 'Creating…' : 'Create Employee'}
            </button>
          </form>
        </div>

        {/* Employees List */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Active Employees</h3>
          {loadingEmployees ? (
            <p style={{ color: '#71717a' }}>Loading employees...</p>
          ) : employees.length === 0 ? (
            <p style={{ color: '#71717a' }}>No employees found</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {employees.map((emp, idx) => (
                <div
                  key={emp.id || idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderBottom: '1px solid #e4e4e7',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{emp.name}</div>
                    <div style={{ color: '#71717a', fontSize: '11px' }}>{emp.id}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
