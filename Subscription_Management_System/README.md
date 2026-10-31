# Brightloop Software — Subscription Management System

![Status](https://img.shields.io/badge/status-hackathon%20MVP-orange)
![Frontend](https://img.shields.io/badge/frontend-React%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Tailwind-blue)
![Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20Express%20%7C%20TypeScript-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)
![Auth](https://img.shields.io/badge/auth-JWT%20%7C%20bcrypt-lightgrey)

> Full technical reference: see [`PROJECT_DOCUMENTATION.md`](./PROJECT_DOCUMENTATION.md) for complete API specs, database schema, and section-by-section implementation status. This README is a project overview and development narrative, not a duplicate of that reference.

---

## 1. Project Introduction

**Brightloop Software — Subscription Management System** is an admin-facing platform for managing recurring subscription businesses: customers, products, subscription plans, active subscriptions, invoicing, and manual payment collection.

### Problem Statement
Subscription businesses need a central system to track who is subscribed to what, bill them on a recurring basis without creating duplicate charges, and record payments against outstanding balances — with clear role separation between administrators, staff, and customers.

### Main Objectives
- Provide a working, demonstrable MVP within a hackathon timeframe.
- Enforce role-based access control at the backend, not just in the UI.
- Generate subscription invoices safely, with no duplicate billing for the same period.
- Support real (manual) payment recording with partial-payment and balance tracking.
- Surface live, database-backed metrics on an admin dashboard.

### Key Features
- JWT authentication with Admin / Staff / Customer roles
- Customer self-registration and admin-gated staff creation
- Subscription lifecycle management (draft → active → paused/cancelled, renew)
- Automated invoice generation from active subscriptions with duplicate prevention
- Manual payment recording (Cash, Bank Transfer, UPI, Card, Other) with partial/full payment support
- Live dashboard KPIs and charts sourced directly from PostgreSQL

### Technology Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, react-router-dom, axios, recharts |
| Backend | Node.js, Express 4, TypeScript |
| Database | PostgreSQL (`pg` driver) |
| Auth & Security | JSON Web Tokens, bcryptjs |

---

## 2. Development Journey — Three Stages

This project was built incrementally across three defined stages, each building on the previous one's codebase rather than restarting from scratch.

### STAGE 1 — Foundation & Initial Setup

The goal of Stage 1 was to establish a working full-stack skeleton: a real login, a real dashboard pulling real numbers, and page foundations for every planned module.

**What was built:**
- **Project structure**: separated `frontend/` (Vite + React + TS + Tailwind) and `backend/` (Express + TS) directories with their own `package.json`, `tsconfig.json`, and configs.
- **Database schema** (`backend/src/schema.sql`): `users`, `customers`, `products`, `product_variants`, `plans`, `subscriptions`, `invoices`, `payments`, `discounts` — the complete table set, created up front even though most modules would only get read access in Stage 1.
- **Authentication & JWT**: a `/api/auth/login` endpoint verifying bcrypt-hashed passwords and issuing an 8-hour JWT containing `{id, role, email}`; `requireAuth` and `requireRole` middleware for protecting routes.
- **Dashboard**: `/api/dashboard/summary`, `/monthly-revenue`, and `/recent-invoices` endpoints running real aggregate SQL (`COUNT`, `SUM`) against the schema — no fabricated numbers, even in Stage 1.
- **UI components**: reusable `Card`, `Button`, `Table` components, and a `Sidebar` + `Header` + `DashboardLayout` shell used by every page.
- **Initial management pages**: Login, Dashboard, Customers, Products, Plans, Subscriptions, Invoices, Payments, Discounts, Settings — all scaffolded, with list pages reading from the database (read-only at this stage).

**Tools used:** Vite, Tailwind CSS, Express, `pg`, `jsonwebtoken`, `bcryptjs`, `recharts`.

---

### STAGE 2 — Core Application Development

Stage 2 targeted authentication hardening, CRUD for core entities, and the subscription/quotation lifecycle.

**Actually implemented:**
- Customer self-registration (`POST /api/auth/register`) with password-strength validation and a transactional insert into both `users` and `customers`.
- One-time admin bootstrap (`POST /api/auth/setup-admin`), gated by an `ADMIN_SETUP_KEY` and blocked once any admin exists.
- Password reset flow: `request-password-reset` (token issued) and `reset-password` (token consumed, password updated) — both using a dedicated `password_reset_tokens` table added via migration.
- Admin-only guard correctly wired onto `create-staff` (`requireAuth, requireRole('admin')`).
- `customers.user_id` foreign key added, linking a registered customer account to their customer record for later ownership checks.

**Planned but not completed in this stage** (carried forward as gaps, not silently dropped):
- Full CRUD (create/update/delete) for Customers and Products — only `GET` list endpoints exist.
- Product variant management — the `product_variants` table exists in the schema but has no routes.
- Subscription plan creation via API — plans currently require a direct SQL insert; no `POST /api/plans` exists.
- **Quotations module** — not implemented at all: no table, no routes, no UI.
- **Discounts** — table and read endpoint exist; no create/update UI or application logic.

This gap between plan and implementation is documented transparently in [`PROJECT_DOCUMENTATION.md`](./PROJECT_DOCUMENTATION.md) Section 14, rather than claimed as finished.

---

### STAGE 3 — Final Integration & Application Completion

Stage 3 focused on making the invoice → payment → dashboard loop actually work end-to-end, plus closing security gaps.

**Implemented:**
- **Subscription lifecycle routes** (`/api/subscriptions`): create (status `draft`), status transitions (`draft/confirmed/active/paused/cancelled/expired`), and `renew` (advances `renewal_date` by one billing-cycle interval based on the plan's `billing_cycle`).
- **Invoice generation** (`POST /api/invoices/generate-due`): iterates all `active` subscriptions, computes the current billing period, and inserts an invoice with a unique `invoice_number`.
- **Duplicate invoice prevention**: enforced at the database level with a `UNIQUE` index on `(subscription_id, billing_period_start, billing_period_end)`, combined with `ON CONFLICT DO NOTHING` inside a transaction — not just an application-level check.
- **Manual payments** (`POST /api/payments`): transactional, row-locks the invoice (`SELECT ... FOR UPDATE`), rejects any payment exceeding the outstanding balance, and supports multiple partial payments until the invoice is fully paid.
- **Outstanding balance calculation**: `amount - paid_amount`, recalculated and persisted on every payment.
- **Overdue invoice handling** (`POST /api/invoices/mark-overdue`): flips `draft`/`confirmed` invoices past their `due_date` to `overdue`.
- **Dashboard integration**: confirmed still reading live data; no changes needed since Stage 1 already queried real tables.
- **Security improvements**: removed a hardcoded `"dev_secret"` JWT fallback (the server now refuses to start/verify tokens without a real `JWT_SECRET`); confirmed role guards on all new write endpoints; confirmed customer-scoped `GET` queries filter by the authenticated user's own `customer_id`.
- **Testing**: a manual `curl`-based test checklist was produced covering bootstrap, registration, invoice generation (including duplicate-call verification), partial/over-limit/full payment, and unauthorized access — **these were written for the developer to run; they were not executed in an automated or live environment during development.**

**Known issue flagged, not hidden:** the `subscriptions` and `invoices` status `CHECK` constraints inherited from the Stage 1 schema do not yet include `'draft'`/`'confirmed'`, which the Stage 3 application code writes. This is called out explicitly in `PROJECT_DOCUMENTATION.md` Section 14 as a fix needed before the lifecycle routes can be trusted against a real database.

---

## 3. System Architecture

The frontend (React SPA) communicates with the backend (Express REST API) over HTTP, authenticated via a JWT bearer token stored client-side. The backend is the sole owner of the PostgreSQL connection; the frontend never talks to the database directly.

```mermaid
flowchart LR
    subgraph Client["Browser"]
        A["React + TypeScript (Vite)"]
    end
    subgraph Server["Backend"]
        B["Express + TypeScript API"]
        C["JWT Auth Middleware<br/>(requireAuth / requireRole)"]
    end
    subgraph Data["Database"]
        D[("PostgreSQL")]
    end

    A -- "axios HTTP requests\n(Authorization: Bearer <JWT>)" --> B
    B --> C
    C -- "role-checked queries" --> D
    D -- "rows" --> B
    B -- "JSON responses" --> A
```

- **Frontend → Backend**: all calls go through `frontend/src/api/client.ts` (an axios instance), which automatically attaches the stored JWT to every request.
- **Backend → Database**: all queries go through `backend/src/db.ts` (a `pg` connection pool); write operations touching money (payments, invoice generation) are wrapped in explicit transactions.
- **Auth boundary**: `requireAuth` validates the JWT on every protected route; `requireRole` further restricts write operations to `admin`/`staff` where applicable; customer-scoped `GET` routes filter results server-side by the requester's own `customer_id`.

---

## 4. Main Features

| Module | Description |
|---|---|
| **Authentication & Roles** | JWT-based login, customer self-registration, admin-gated staff creation, password reset, three roles (Admin/Staff/Customer) enforced on the backend |
| **Customers** | Customer records with linkage to user accounts; currently read-only via API |
| **Products** | Product catalog with name/description; variants modeled in schema, not yet exposed via API |
| **Subscription Plans** | Billing-cycle-aware plans (daily/weekly/monthly/yearly) with pricing; created via direct DB insert in this build |
| **Subscriptions** | Full lifecycle: create, confirm, activate, pause, cancel, renew — with automatic renewal-date calculation |
| **Invoices** | Generated from active subscriptions, one per billing period, duplicate-proof at the database level |
| **Payments** | Manual, transactional, partial/full support, balance-aware, rejects over-payment |
| **Discounts** | Table and read endpoint exist; application to invoices not yet implemented |
| **Dashboard** | Live KPIs (customers, active subscriptions, invoices, revenue, outstanding, overdue) plus monthly revenue and subscription-status charts |

---

## 5. Installation and Execution

### Prerequisites
- Node.js (LTS)
- PostgreSQL installed and running
- npm

### Database Configuration
```bash
createdb brightloop
psql -d brightloop -f backend/src/schema.sql
psql -d brightloop -f backend/src/migrations/001_stage2_auth.sql
psql -d brightloop -f backend/src/migrations/002_final_stage.sql
```

### Environment Setup
```bash
cd backend
cp .env.example .env
```
Fill in `backend/.env`:
```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/brightloop
JWT_SECRET=<your own long random secret>
ADMIN_SETUP_KEY=<your own one-time setup key>
NODE_ENV=development
```

### Backend Installation & Execution
```bash
cd backend
npm install
npm run dev
# → http://localhost:4000
```

### Frontend Installation & Execution
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Admin Account Setup
No admin account exists by default. Create one once, using the key you set in `.env`:
```bash
curl -X POST http://localhost:4000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@brightloop.com","password":"Admin@1234","setupKey":"<your ADMIN_SETUP_KEY>"}'
```
A second call to this endpoint will correctly return `409 Admin already exists`.

---

## 6. Project Status

### ✅ Completed Functionality
- JWT authentication, registration, password reset, admin bootstrap, admin-gated staff creation
- Role-based middleware applied to all subscription/invoice/payment write routes
- Subscription lifecycle (draft → active → paused/cancelled, renew)
- Invoice generation with database-enforced duplicate prevention
- Overdue invoice marking
- Manual, transactional, balance-aware payment recording (partial and full)
- Live dashboard metrics and charts
- Customer data ownership enforcement on GET endpoints

### ⚠️ Partially Implemented
- Customers, Products, Plans, Discounts — read-only; no create/update/delete API or UI
- Dashboard, Invoices, Payments, Subscriptions pages — frontend shows data but has no forms/buttons for the Stage 3 backend actions (generate invoices, record payment, change subscription status all currently require direct API calls)

### ❌ Known Limitations
- `subscriptions`/`invoices` status `CHECK` constraints need a migration to include `draft`/`confirmed` before lifecycle routes are safe to rely on
- No quotations module
- No product variant pricing logic
- Tax and discount amounts are not calculated or applied to invoices (columns exist, always 0)
- Password reset token is returned directly in the API response — no email delivery integrated
- No automated test suite; all verification is manual `curl` checklists, not executed in an automated pipeline
- No pagination on list endpoints (hard-capped at 50–100 rows)

### 🔭 Future Improvements
- Fix the status `CHECK` constraint gap
- Build full CRUD UI for Customers, Products (with variants), Plans, Discounts
- Implement the Quotations module end-to-end, including conversion to subscriptions
- Apply tax and discount calculations during invoice generation
- Integrate real email delivery for password resets
- Add automated backend (Jest/supertest) and frontend (Vitest) test coverage
- Add pagination and filtering across list endpoints
- Build frontend UI for the subscription/invoice/payment actions that currently only exist as API endpoints

---

## 7. Project Credits

**Project:** Brightloop Software — Subscription Management System
**Developed for:** _[Hackathon name — to be added]_
**Institution:** _[Institution name — to be added]_
**Team members:** _[Names to be added]_
**Development period:** _[Dates to be added]_

> This section is a placeholder for the team to complete with accurate names, affiliations, and event details.

---

For complete API documentation, database schema, and a line-by-line implementation audit, see [`PROJECT_DOCUMENTATION.md`](./PROJECT_DOCUMENTATION.md).
