# MediaHub CMS — v3 (Routing Fixed + Full Role Coverage)

## What changed in this version

### 1. Routing bug fixed
Every sidebar nav item now points to a route that actually exists. Previously
"Team", "Analytics", and other links fell through to the app's wildcard route
and redirected to `/login`, which looked like being signed out. Root cause:
`shell.component.ts` referenced routes that were never registered in
`app.routes.ts`. All routes are now registered as children of the shell route.

### 2. Full feature coverage per role (matching the case study exactly)

| Role | Pages | Case study requirement |
|---|---|---|
| Content Creator | My Content | Upload, manage, edit content; track status |
| Editor | Review Queue (+ content preview dialog) | Review, approve, schedule; track workflow |
| Marketing | Distribution, **Analytics (new)** | Distribute to channels; monitor engagement |
| Manager | Overview, **Team (new)**, System | Monitor performance; track team activity |
| IT Support | System, Team | Data security, integrations, uptime |

**New backend endpoint added:** `GET /api/users` (Manager + IT Support only) —
backs the new Team page. This is the only backend change; everything else
uses APIs that already existed.

**New frontend pages added:**
- `manager-team` — user roster with content-count per person
- `system-status` — channel connection health + API status, for IT Support
- `marketing-analytics` — engagement metrics per published content item
- `content-preview-dialog` — lets editors read the full content body before approving (previously they only saw a title)
- `distribute-dialog` — marketing now picks specific channels instead of always distributing to all 4

### 3. Angular file structure standardised
Every component was converted from inline `template`/`styles` strings to
separate files using `templateUrl` / `styleUrl`, each in its own folder:

```
feature-name/
  feature-name.component.ts
  feature-name.component.html
  feature-name.component.scss
```

This matches standard Angular project conventions and is much easier to
navigate and edit.

---

## Setup

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
Open `backend/` in IntelliJ, set your MySQL password in
`application.properties`, run `MediaHubApplication.java`.

### 3. Frontend
```bash
cd frontend
npm install
ng serve
```

Login with any demo account (password `Test@1234`):
- alice@mediahub.com — Content Creator
- bob@mediahub.com — Editor
- carol@mediahub.com — Marketing
- dave@mediahub.com — Manager
- eve@mediahub.com — IT Support
