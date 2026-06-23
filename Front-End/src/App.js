import React, { useState } from 'react';
import './index.css';
import { getCurrentUser, removeToken } from './auth';
import AuthPage  from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Projects  from './components/Projects';
import Bugs      from './components/Bugs';
import EmployeeManagement from './components/EmployeeManagement';

/*
  Sidebar nav per role — only show what that role actually uses
  ─────────────────────────────────────────────────────────────
  ADMIN     → Dashboard | Employees | Bugs (all bugs, assign) | Projects (create/delete)
  DEVELOPER → Dashboard | Bugs (only assigned to them, update status)
  TESTER    → Dashboard | Bugs (only reported by them, report new bugs)
*/
const NAV = {
  ADMIN:     [
    { key: 'dashboard', label: 'Dashboard', icon: '▦' },
    { key: 'employees', label: 'Employees', icon: '👥' },
    { key: 'bugs',      label: 'Bugs',      icon: '⚠' },
    { key: 'projects',  label: 'Projects',  icon: '⊞' },
  ],
  DEVELOPER: [
    { key: 'dashboard', label: 'Dashboard', icon: '▦' },
    { key: 'bugs',      label: 'My Assigned Bugs', icon: '⚠' },
  ],
  TESTER: [
    { key: 'dashboard', label: 'Dashboard',        icon: '▦' },
    { key: 'bugs',      label: 'My Reported Bugs', icon: '⚠' },
  ],
};

export default function App() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [page, setPage] = useState('dashboard');

  function handleLogin(u) { setUser(u); setPage('dashboard'); }
  function logout() { removeToken(); setUser(null); setPage('dashboard'); }

  if (!user) return <AuthPage onLogin={handleLogin} />;

  const navItems = NAV[user.role] || NAV.TESTER;
  const activePage = navItems.find((n) => n.key === page) ? page : 'dashboard';

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-header">
          <div className="sb-logo">TrackSphere</div>
          <div className="sb-version">v3</div>
          <div className={`sb-role ${user.role}`}>{user.role}</div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Menu</div>
          {navItems.map((n) => (
            <div
              key={n.key}
              className={`sb-link ${activePage === n.key ? 'active' : ''}`}
              onClick={() => setPage(n.key)}
            >
              <span className="icon">{n.icon}</span>
              {n.label}
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sb-email">{user.email}</div>
          <button className="sb-logout" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main">
        {activePage === 'dashboard' && <Dashboard role={user.role} />}
        {activePage === 'employees'  && user.role === 'ADMIN' && <EmployeeManagement />}
        {activePage === 'bugs'      && <Bugs      role={user.role} />}
        {activePage === 'projects'  && <Projects  role={user.role} />}
      </main>
    </div>
  );
}
