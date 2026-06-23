# TrackSphere UI — v3

React frontend matching TrackSphere backend V3.

## Setup

```bash
cd tracksphere-ui
npm install
npm start
```

Opens at http://localhost:3000. Backend must run on http://localhost:8080.
Change `BASE` in `src/auth.js` if your port differs.

---

## V3 Changes vs V2

### 1. Role-specific dashboards
Each role hits its own endpoint and sees different stats:

| Role      | Endpoint                     | What it shows |
|-----------|------------------------------|---------------|
| ADMIN     | GET /api/dashboard/admin     | totalProjects, totalBugs by status, totalDevelopers, totalTesters |
| DEVELOPER | GET /api/dashboard/developer | assignedBugs, openTasks, inProgressTasks, resolvedTasks, closedTasks |
| TESTER    | GET /api/dashboard/tester    | reportedBugs, openReports, inProgressReports, resolvedReports, closedReports |

### 2. Developer dropdown for bug assignment
Admin no longer types a developer ID manually.
Calls `GET /api/users/developers` → `[{ id, name }]` and shows a dropdown.

### 3. "Reported by Me" bug view
New button uses `GET /api/bugs/my-reported-bugs` (V3 endpoint).
Shows bugs the current user created — primarily useful for Testers.

---

## Role access summary

| Feature                        | ADMIN | DEVELOPER | TESTER |
|--------------------------------|-------|-----------|--------|
| Dashboard (role-specific stats)| ✅   | ✅        | ✅     |
| View all bugs                  | ✅   | ✅        | ✅     |
| Filter by status / priority    | ✅   | ✅        | ✅     |
| Bugs assigned to me            | ✅   | ✅        | ✅     |
| Bugs reported by me (V3)       | ✅   | ✅        | ✅     |
| Report a bug                   | ✅   | ✅        | ✅     |
| Add comments                   | ✅   | ✅        | ✅     |
| Assign bug to developer        | ✅   | ❌        | ❌     |
| Update bug status              | ❌   | ✅        | ❌     |
| Projects page                  | ✅   | ❌        | ❌     |
| Create / delete projects       | ✅   | ❌        | ❌     |

---

## All API endpoints used

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/dashboard/admin          ← ADMIN only
GET    /api/dashboard/developer      ← DEVELOPER only
GET    /api/dashboard/tester         ← TESTER only

GET    /api/users/developers         ← any auth user (for assign dropdown)

GET    /api/bugs/getall
GET    /api/bugs/{bugId}
GET    /api/bugs/my-bugs
GET    /api/bugs/my-reported-bugs    ← V3 new
GET    /api/bugs/status?status=X
GET    /api/bugs/priority?priority=X
POST   /api/bugs/create
PUT    /api/bugs/{bugId}/assign/{developerId}   ← ADMIN
PUT    /api/bugs/{bugId}/status?status=X        ← DEVELOPER

GET    /api/projects/getall
POST   /api/projects/create         ← ADMIN
DELETE /api/projects/{id}           ← ADMIN

POST   /api/comments/add
GET    /api/comments/{bugId}
```
