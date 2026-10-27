# RohanOS Studio | Admin CMS & Visual Editor

RohanOS Studio is the dedicated, decoupled Content Management System (CMS) and interactive visual editor for the RohanOS Portfolio ecosystem.

* **Port**: `http://localhost:3001` (Dev & Preview)
* **Live Visitor Portfolio**: `http://localhost:3000` (`../rohan`)
* **Shared Database**: Supabase PostgreSQL (`site_content`, `contact_messages`, `site_content_revisions`, `portfolio-media` storage)

---

## 1. Dual-Engine Architecture

RohanOS Studio features a dual-engine architecture toggled from the top bar:

1. **Studio CMS Dashboard (`/admin/*`)**:
   Full content control center featuring 14 dedicated management panels:
   * **Overview**: Quick system metrics, media cleanup tool, and 1-click database snapshot rollback.
   * **Home & Identity**: Profile metadata, hero copy, titles, avatar, and resume PDF upload.
   * **Complete Controls**: Comprehensive configuration overrides.
   * **Page Titles & Copy**: Microcopy and heading overrides across all subpages.
   * **Projects Hub**: CRUD, flagship project highlighting, GitHub/live links, and custom tag management.
   * **Skills & Tools Matrix**: Categorized tech stack, proficiency bars, and tools.
   * **Experience**: Professional timeline and milestones.
   * **Certificates**: Credential verification links, issue dates, and icon badges.
   * **Blog & Articles**: Markdown publication and reading times.
   * **Research Papers**: Academic papers, DOIs, and abstract links.
   * **Gallery**: Media assets and visual showcases.
   * **Honors & Recognitions**: Awards and accolades.
   * **Categories Hub**: Cross-cutting category taxonomies for projects, certificates, and articles.
   * **Theme Studio**: Dynamic primary color palette customizer with real-time HSL CSS variable injection.
   * **Inbox**: Visitor message management, pagination, and status tracking (unread / read / replied).

2. **Visual Portfolio Replica (`/*`)**:
   A 1:1 replica of the visitor portfolio powered by live administrative state. Allows the administrator to preview changes and launch contextual editor modals directly from sections before saving to production.

---

## 2. Developer Commands

All standard quality commands are unified in `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Studio dev server on `http://localhost:3001`. |
| `npm run build` | Compiles strict TypeScript (`tsc`) and outputs production bundle via Vite. |
| `npm run preview` | Previews the production build locally on port 3001. |
| `npm run lint` | Runs ESLint with flat config across all `.ts` and `.tsx` source files. |
| `npm test` | Runs the full Vitest suite (13 test files / 60 tests in JSDOM). |
| `npm run test:watch` | Runs Vitest in interactive watch mode for TDD. |
| `npm run typecheck` | Validates TypeScript in strict mode (`--noEmit`). |
| `npm run check` | Full CI validation: lint + typecheck + test + build. |
| `npm run sync:schema` | Synchronizes shared schemas and JSON data files from `rohan`. |

---

## 3. Environment Variables

Create `.env` in the root of `admin` (or copy from `.env.example`):

```env
# Local Admin Mode (for offline development without cloud credentials)
VITE_ENABLE_LOCAL_ADMIN=true
VITE_LOCAL_ADMIN_EMAIL=admin@rohanos.local
VITE_LOCAL_ADMIN_PASSWORD=rohanos-local-admin

# Supabase Production Database (Same DB as ../rohan)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here

# Portfolio Visitor Site URL (for preview & cross-linking)
VITE_PORTFOLIO_URL=http://localhost:3000
```

---

## 4. Concurrency & Data Safety

* **Optimistic Local Buffering**: Edits are stored in browser `localStorage` drafts (`rohanos_editor_draft_v1:portfolio`) to prevent data loss during network hiccups or tab closures.
* **Concurrency Detection**: Publications check `updated_at` timestamps using Supabase REST `PATCH`. If another session published changes in the interim, the save aborts with `PublishedContentConflictError` rather than silently overwriting work.
* **1-Click Rollback**: Published versions are versioned in `site_content_revisions` in PostgreSQL. Rollbacks can be executed with 1 click directly from the Overview panel.
* **Media Cleanup**: Unused images older than 7 days can be reviewed and pruned safely via the built-in media scanner.
