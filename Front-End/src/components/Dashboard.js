import React, { useEffect, useState } from 'react';
import { api } from '../auth';

// ── Admin dashboard ── GET /api/dashboard/admin
// AdminDashboardResponse: totalProjects, totalBugs, openBugs, inProgressBugs,
//                         resolvedBugs, closedBugs, totalDevelopers, totalTesters
function AdminDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr]   = useState('');

  useEffect(() => {
    api.getAdminDashboard().then(setData).catch((e) => setErr(e.message));
  }, []);

  if (err)   return <div className="alert-error">{err}</div>;
  if (!data) return <div className="loading">Loading…</div>;

  const stats = [
    { lbl: 'Total Projects',  num: data.totalProjects },
    { lbl: 'Total Bugs',      num: data.totalBugs },
    { lbl: 'Open',            num: data.openBugs },
    { lbl: 'In Progress',     num: data.inProgressBugs },
    { lbl: 'Resolved',        num: data.resolvedBugs },
    { lbl: 'Closed',          num: data.closedBugs },
    { lbl: 'Developers',      num: data.totalDevelopers },
    { lbl: 'Testers',         num: data.totalTesters },
  ];

  return (
    <>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
        System-wide overview for Admin
      </p>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="s-num">{s.num}</div>
            <div className="s-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Developer dashboard ── GET /api/dashboard/developer
// DeveloperDashboardResponse: assignedBugs, openTasks, inProgressTasks,
//                              resolvedTasks, closedTasks
function DeveloperDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr]   = useState('');

  useEffect(() => {
    api.getDeveloperDashboard().then(setData).catch((e) => setErr(e.message));
  }, []);

  if (err)   return <div className="alert-error">{err}</div>;
  if (!data) return <div className="loading">Loading…</div>;

  const stats = [
    { lbl: 'Assigned to Me',  num: data.assignedBugs },
    { lbl: 'Open Tasks',      num: data.openTasks },
    { lbl: 'In Progress',     num: data.inProgressTasks },
    { lbl: 'Resolved',        num: data.resolvedTasks },
    { lbl: 'Closed',          num: data.closedTasks },
  ];

  return (
    <>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
        Your personal workload
      </p>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="s-num">{s.num}</div>
            <div className="s-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Tester dashboard ── GET /api/dashboard/tester
// TesterDashboardResponse: reportedBugs, openReports, inProgressReports,
//                           resolvedReports, closedReports
function TesterDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr]   = useState('');

  useEffect(() => {
    api.getTesterDashboard().then(setData).catch((e) => setErr(e.message));
  }, []);

  if (err)   return <div className="alert-error">{err}</div>;
  if (!data) return <div className="loading">Loading…</div>;

  const stats = [
    { lbl: 'Reported by Me', num: data.reportedBugs },
    { lbl: 'Open',           num: data.openReports },
    { lbl: 'In Progress',    num: data.inProgressReports },
    { lbl: 'Resolved',       num: data.resolvedReports },
    { lbl: 'Closed',         num: data.closedReports },
  ];

  return (
    <>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
        Status of bugs you reported
      </p>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="s-num">{s.num}</div>
            <div className="s-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Entry point — picks correct dashboard by role ──
export default function Dashboard({ role }) {
  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      {role === 'ADMIN'     && <AdminDashboard />}
      {role === 'DEVELOPER' && <DeveloperDashboard />}
      {role === 'TESTER'    && <TesterDashboard />}
    </div>
  );
}
