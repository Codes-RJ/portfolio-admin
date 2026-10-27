# RohanOS Studio Master Architecture & Technical Documentation

> **Document Version**: 2.0  
> **Repository**: `d:\Portfolio\admin`  
> **Runtime Target**: Node.js >= 22.0.0, Vite 6, React 18, TypeScript 5.7 (Strict)

---

## 1. System Topology & Decoupling Model

RohanOS uses a decoupled multi-app repository architecture:

```
                  ┌────────────────────────────────────────┐
                  │       Supabase PostgreSQL + Storage   │
                  │   - site_content (row: 'portfolio')    │
                  │   - site_content_revisions (RPC)       │
                  │   - contact_messages (RLS protected)   │
                  │   - portfolio-media bucket             │
                  └───────────────▲────────────────────────┘
                                  │
                 Realtime Sync    │   REST Admin API
                 WebSocket (sub-  │   & Storage Uploads
                 100ms)           │   (Bearer Token)
                                  │
        ┌─────────────────────────┴────────────────────────┐
        │                                                  │
┌───────┴───────────────────────┐  ┌───────────────────────┴────────────────────────┐
│     rohan (Port 3000)         │  │     admin (Port 3001)                          │
│  - Public Visitor Portfolio   │  │  - RohanOS Studio CMS & Editor                │
│  - Zero Admin Code / Tokens   │  │  - Visual Portfolio Replica Engine            │
│  - 114 KiB Eager JS Bundle    │  │  - Pre-Publish Snapshot Diff Review           │
│  - Cloudflare / Netlify / Verc│  │  - 1-Click PostgreSQL Rollback RPC            │
└───────────────────────────────┘  └────────────────────────────────────────────────┘
```

### Boundary Guarantees:
* `rohan` never imports any administrative code or auth secrets. Its build enforces this via `check-app-boundaries.mjs`.
* `admin` contains the administrative tools, credentials, and image manipulation engines.
* Both applications share identical data contracts defined in `initialData.ts`, `validation.ts`, and `publishedContent.json` via `scripts/sync-schema.mjs`.

---

## 2. Authentication & Session Lifecycle (`src/context/AuthContext.tsx`)

`AuthContext` provides dual-mode authentication:

1. **Supabase Mode** (`isSupabaseConfigured === true`):
   * Authenticates against Supabase Auth (`/auth/v1/token?grant_type=password`).
   * Validates `app_metadata.role === 'admin'`. Unauthorized accounts are immediately rejected.
   * Auto-refreshes tokens 60 seconds before expiry (`refreshAheadMs = 60_000`).
   * Uses the Web Locks API (`navigator.locks.request('rohanos-auth-refresh')`) to serialize token refresh across multiple open tabs, preventing refresh token invalidation race conditions.
   * Listens to `window.onfocus` and `document.visibilitychange` to proactively refresh expired sessions when the user returns to the tab.
2. **Local Mode** (`VITE_ENABLE_LOCAL_ADMIN === 'true'` in Dev):
   * Authenticates against `VITE_LOCAL_ADMIN_EMAIL` and `VITE_LOCAL_ADMIN_PASSWORD`.
   * Preserves session in `localStorage` under `rohanos_local_admin_session`.
   * Completely disabled in production builds.

---

## 3. Data Flow & Concurrency Engine (`src/context/DataContext.tsx`)

### The 15 Domain Slices:
1. `profile`: User personal info, avatar, titles, and resume PDF URLs.
2. `siteSettings`: SEO metadata, website branding, navigation links, and primary color scale.
3. `projects`: Portfolio projects, flags, categories, and GitHub links.
4. `projectCategories`: Dynamic list of project filter categories.
5. `certificateCategories`: Dynamic list of certificate taxonomies.
6. `blogCategories`: Blog post category labels.
7. `experiences`: Professional employment history and achievements.
8. `skills`: Skill items with category and proficiency levels.
9. `skillCategories`: Hierarchical groupings of skills.
10. `toolsList`: Developer tools with catalog icons.
11. `techStack`: Core languages and frameworks.
12. `currentlyLearning`: Emerging technologies and active study topics.
13. `achievements`: Honors, competitions, and awards.
14. `certificates`: Credentials, issuers, verification URLs, and icon badges.
15. `blogPosts`: Articles, read times, slugs, and publishing dates.
16. `researchPapers`: Academic papers, abstracts, and publications.
17. `gallery`: Visual assets and photography.

### Optimistic Concurrency Protocol:
1. When content is loaded from Supabase, `cloudContentVersionRef` stores the current `updated_at` timestamp.
2. Any edit made in the Studio updates local React state and writes to `localStorage` draft key `rohanos_editor_draft_v1:portfolio`.
3. Auto-save or clicking **"Save & Publish"** executes `savePublishedContent(payload, accessToken, expectedUpdatedAt)`.
4. The request sends a conditional Supabase `PATCH`:
   ```
   PATCH /rest/v1/site_content?id=eq.portfolio&updated_at=eq.<expectedUpdatedAt>
   ```
5. If the timestamp does not match (another session edited content), PostgreSQL returns 0 updated rows, triggering `PublishedContentConflictError`. Studio halts the save and notifies the user to reload before overwriting data.

---

## 4. PostgreSQL Database Migrations & RPC Contract

Database migrations are stored in [supabase/migrations/](file:///d:/Portfolio/admin/supabase/migrations/):

### Revisions Migration (`20261024122500_revisions_rpc.sql`):
* `site_content_revisions`: Table storing historical versions of `site_content.payload` whenever updated.
* `list_portfolio_revisions()`:
  ```sql
  SELECT revision_id, replaced_at FROM site_content_revisions ORDER BY replaced_at DESC LIMIT 20;
  ```
* `restore_portfolio_revision(target_revision_id bigint)`:
  Atomic function that restores a historical snapshot to `site_content` and creates an audit entry.

---

## 5. Quality Verification Pipeline

The repository includes a comprehensive 4-stage quality check:
```bash
npm run check
```
1. **Linting (`npm run lint`)**: ESLint v10 Flat Config with `react-hooks` and `jsx-a11y-x`.
2. **Type Checking (`npm run typecheck`)**: Strict TypeScript compilation with zero unused parameters or locals.
3. **Unit Tests (`npm test`)**: 12 Vitest suites covering Auth, Concurrency, Media, Messages, and Slices.
4. **Production Build (`npm run build`)**: Vite build with vendor code-splitting (`vendor-react`, `vendor-icons`, `vendor-utils`).
