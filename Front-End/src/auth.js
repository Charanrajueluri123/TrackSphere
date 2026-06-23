// ─── Token helpers ────────────────────────────────────────────────
export function getToken()    { return localStorage.getItem('ts_token'); }
export function saveToken(t)  { localStorage.setItem('ts_token', t); }
export function removeToken() { localStorage.removeItem('ts_token'); }

// ─── JWT decoder (no library needed) ──────────────────────────────
// Backend JwtUtil puts: sub=email, role=ROLE_NAME in the payload
export function decodeToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch { return null; }
}

// Returns { email, role } from stored token, or null if missing/expired
export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const p = decodeToken(token);
  if (!p) return null;
  if (p.exp && Date.now() / 1000 > p.exp) { removeToken(); return null; }
  return { email: p.sub, role: p.role }; // role = "ADMIN" | "DEVELOPER" | "TESTER"
}

// ─── Base fetch ───────────────────────────────────────────────────
// const BASE = 'https://tracksphere-rqr5.onrender.com';
const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

async function req(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text)?.message || text; } catch {}
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

// ─── API — all V3 endpoints ───────────────────────────────────────
export const api = {

  // ── Auth  (public) ───────────────────────────────────────────────
  register : (data) => req('POST', '/api/auth/register', data),
  login    : (data) => req('POST', '/api/auth/login', data),

  // ── Dashboard  (role-specific — V3 NEW) ──────────────────────────
  // ADMIN only   → AdminDashboardResponse
  //   { totalProjects, totalBugs, openBugs, inProgressBugs,
  //     resolvedBugs, closedBugs, totalDevelopers, totalTesters }
  getAdminDashboard    : () => req('GET', '/api/dashboard/admin'),

  // DEVELOPER only → DeveloperDashboardResponse
  //   { assignedBugs, openTasks, inProgressTasks, resolvedTasks, closedTasks }
  getDeveloperDashboard: () => req('GET', '/api/dashboard/developer'),

  // TESTER only   → TesterDashboardResponse
  //   { reportedBugs, openReports, inProgressReports, resolvedReports, closedReports }
  getTesterDashboard   : () => req('GET', '/api/dashboard/tester'),

  // ── Users  (V3 NEW) ───────────────────────────────────────────────
  // Returns List<DeveloperResponse> = [{ id, name }, ...]  — any auth user
  getDevelopers: () => req('GET', '/api/users/developers'),

  // ── Bugs ──────────────────────────────────────────────────────────
  createBug        : (data)          => req('POST', '/api/bugs/create', data),
  assignBug        : (bugId, devId)  => req('PUT',  `/api/bugs/${bugId}/assign/${devId}`),   // ADMIN
  updateBugStatus  : (bugId, status) => req('PUT',  `/api/bugs/${bugId}/status?status=${status}`), // DEVELOPER
  getAllBugs        : ()              => req('GET',  '/api/bugs/getall'),
  getBug           : (id)            => req('GET',  `/api/bugs/${id}`),
  getMyAssignedBugs: ()              => req('GET',  '/api/bugs/my-bugs'),             // assigned to me
  getMyReportedBugs: ()              => req('GET',  '/api/bugs/my-reported-bugs'),    // V3 NEW: reported by me
  getBugsByStatus  : (status)        => req('GET',  `/api/bugs/status?status=${status}`),
  getBugsByPriority: (priority)      => req('GET',  `/api/bugs/priority?priority=${priority}`),

  // ── Projects ──────────────────────────────────────────────────────
  createProject : (data) => req('POST',   '/api/projects/create', data),   // ADMIN
  getAllProjects : ()     => req('GET',    '/api/projects/getall'),
  getProject    : (id)   => req('GET',    `/api/projects/${id}`),
  deleteProject : (id)   => req('DELETE', `/api/projects/${id}`),           // ADMIN

  // ── Comments ──────────────────────────────────────────────────────
  addComment  : (data)  => req('POST', '/api/comments/add', data),
  getComments : (bugId) => req('GET',  `/api/comments/${bugId}`),
};
