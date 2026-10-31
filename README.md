# Brightloop Software — Subscription Management System
## Project Documentation

> **Status note:** This document describes what has actually been implemented across Stages 1–3 of this build, as generated in the assistant conversation. It has **not** been verified against a running database or live codebase (no execution environment was available) — treat items under "Completed Features" as implemented-but-manually-tested-by-you-only, not verified end-to-end by the author of this doc.

---

## 1. Project Overview

**Purpose:** An admin-facing subscription management system for Brightloop Software, allowing staff/admins to manage customers, products, subscription plans, subscriptions, invoices and manual payments, with a basic customer-facing data model (customers can view their own records via role-scoped APIs).

**Objectives:**
- Provide a working hackathon MVP demonstrating subscription lifecycle management.
- Support role-based access (Admin, Staff, Customer).
- Generate invoices from active subscriptions without duplication.
- Record manual payments (partial/full) against invoices with balance tracking.
- Present real database-backed KPIs on an admin dashboard.

**Main features implemented:**
- JWT authentication, customer self-registration, admin bootstrap, password reset.
- Customer/product read endpoints (CRUD partially planned, not fully implemented — see Section 13/14).
- Subscription lifecycle: draft → active → paused/cancelled, renew.
- Invoice generation from active subscriptions with duplicate prevention.
- Manual payments with partial-payment and outstanding-balance logic.
- Admin dashboard with live KPIs and charts.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Frontend routing | react-router-dom v6 |
| Frontend HTTP | axios |
| Frontend charts | recharts |
| Backend | Node.js, Express 4, TypeScript |
| Backend auth | jsonwebtoken, bcryptjs |
| Database | PostgreSQL (via `pg` driver) |
| Dev tooling | tsx (backend dev server), tsc |

---

## 3. Project Structure

```
Subscription_Management_System/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types/index.ts
│       ├── api/client.ts
│       ├── context/AuthContext.tsx
│       ├── components/
│       │   ├── ui/Card.tsx
│       │   ├── ui/Button.tsx
│       │   ├── ui/Table.tsx
│       │   ├── layout/Sidebar.tsx
│       │   ├── layout/Header.tsx
│       │   ├── layout/DashboardLayout.tsx
│       │   └── ProtectedRoute.tsx
│       └── pages/
│           ├── Login.tsx
│           ├── Dashboard.tsx
│           ├── Customers.tsx
│           ├── Products.tsx
│           ├── Plans.tsx
│           ├── Subscriptions.tsx
│           ├── Invoices.tsx
│           ├── Payments.tsx
│           ├── Discounts.tsx
│           └── Settings.tsx
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── index.ts
│       ├── db.ts
│       ├── schema.sql
│       ├── migrations/
│       │   ├── 001_stage2_auth.sql
│       │   └── 002_final_stage.sql
│       ├── utils/password.ts
│       ├── middleware/auth.ts
│       └── routes/
│           ├── auth.routes.ts
│           ├── dashboard.routes.ts
│           ├── subscription.routes.ts
│           ├── invoice.routes.ts
│           ├── payment.routes.ts
│           └── stub.routes.ts   (customers, products, plans, discounts — GET only)
├── .gitignore
├── README.md
└── PROJECT_DOCUMENTATION.md
```

**Known structural gap:** `stub.routes.ts` still serves `customers`, `products`, `plans`, and `discounts` as **read-only** (`GET` only). Only `subscriptions`, `invoices`, and `payments` have dedicated routers with full logic.

---

## 4. Database Documentation

### Tables (as created across `schema.sql` + migrations)

**`users`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | CHECK IN ('admin','staff','customer'), default 'customer' |
| created_at | TIMESTAMP | default NOW() |

**`customers`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| phone | VARCHAR(50) | |
| user_id | INTEGER | FK → users(id), added in migration 001, nullable |
| created_at | TIMESTAMP | default NOW() |

**`products`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| created_at | TIMESTAMP | default NOW() |

> Note: Stage 2 planning called for `type` and `cost_price` columns on products — **this migration was never actually generated/applied** in this conversation. Products table only has `name`/`description` currently.

**`product_variants`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| product_id | INTEGER | FK → products(id) ON DELETE CASCADE |
| name | VARCHAR(255) | NOT NULL |
| price | NUMERIC(12,2) | default 0 |

**`plans`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| name | VARCHAR(255) | NOT NULL |
| variant_id | INTEGER | FK → product_variants(id) |
| billing_cycle | VARCHAR(20) | default 'monthly' |
| price | NUMERIC(12,2) | default 0 |
| min_quantity | INTEGER | default 1 (migration 002) |
| available_from | DATE | default CURRENT_DATE (migration 002) |
| available_to | DATE | nullable (migration 002) |
| created_at | TIMESTAMP | default NOW() |

**`subscriptions`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| customer_id | INTEGER | FK → customers(id) |
| plan_id | INTEGER | FK → plans(id) |
| status | VARCHAR(20) | CHECK IN ('active','paused','cancelled','expired'); app also uses 'draft'/'confirmed' in route logic — **CHECK constraint was never updated to include these**, see Section 14 |
| start_date | DATE | default CURRENT_DATE |
| renewal_date | DATE | |
| quantity | INTEGER | default 1 (migration 002) |
| paused_at | TIMESTAMP | nullable (migration 002) |
| closed_at | TIMESTAMP | nullable (migration 002) |
| created_at | TIMESTAMP | default NOW() |

**`invoices`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| subscription_id | INTEGER | FK → subscriptions(id) |
| customer_id | INTEGER | FK → customers(id) |
| amount | NUMERIC(12,2) | default 0 |
| status | VARCHAR(20) | CHECK IN ('pending','paid','overdue','cancelled'); app logic also uses 'draft'/'confirmed' — same constraint mismatch as subscriptions |
| due_date | DATE | |
| billing_period_start | DATE | migration 002 |
| billing_period_end | DATE | migration 002 |
| invoice_number | VARCHAR(50) | UNIQUE, migration 002 |
| tax_amount | NUMERIC(12,2) | default 0, migration 002 — **not populated by any route logic yet** |
| discount_amount | NUMERIC(12,2) | default 0, migration 002 — **not populated by any route logic yet** |
| paid_amount | NUMERIC(12,2) | default 0, migration 002 |
| created_at | TIMESTAMP | default NOW() |

**`payments`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| invoice_id | INTEGER | FK → invoices(id) |
| amount | NUMERIC(12,2) | default 0 |
| method | VARCHAR(50) | |
| status | VARCHAR(20) | default 'pending' |
| paid_at | TIMESTAMP | |
| reference | VARCHAR(100) | migration 002 |
| notes | TEXT | migration 002 |

**`discounts`**
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| code | VARCHAR(50) | UNIQUE, NOT NULL |
| percent_off | NUMERIC(5,2) | |
| active | BOOLEAN | default TRUE |
| created_at | TIMESTAMP | default NOW() |

**`password_reset_tokens`** (migration 001)
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PK |
| user_id | INTEGER | FK → users(id) ON DELETE CASCADE |
| token | VARCHAR(255) | UNIQUE, NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| used | BOOLEAN | default FALSE |
| created_at | TIMESTAMP | default NOW() |

### Indexes
- `idx_customers_user_id` on `customers(user_id)`
- `idx_reset_tokens_token` on `password_reset_tokens(token)`
- `idx_unique_sub_period` — **UNIQUE** on `invoices(subscription_id, billing_period_start, billing_period_end)` where `subscription_id IS NOT NULL` — enforces no duplicate invoice per subscription per billing period
- `idx_invoices_status`, `idx_invoices_due_date`, `idx_subscriptions_status`

### Migrations (run in order)
1. `backend/src/schema.sql` — base schema
2. `backend/src/migrations/001_stage2_auth.sql` — `customers.user_id`, `password_reset_tokens` table
3. `backend/src/migrations/002_final_stage.sql` — plan availability fields, subscription quantity/pause/close timestamps, invoice billing-period/number/tax/discount/paid fields, payment reference/notes, indexes

**No seed data exists.** No admin user is auto-created — must be created via `/api/auth/setup-admin`.

---

## 5. Authentication & Security

**Flow:**
- `POST /api/auth/setup-admin` — one-time bootstrap, requires `setupKey` matching `ADMIN_SETUP_KEY` env var; fails with 409 if an admin already exists.
- `POST /api/auth/register` — customer self-registration; creates a `users` row (role=customer) and a linked `customers` row in one transaction.
- `POST /api/auth/login` — verifies bcrypt hash, issues JWT (8h expiry) containing `{id, role, email}`.
- `POST /api/auth/create-staff` — **admin-only** (guarded by `requireAuth, requireRole('admin')`), creates staff/admin accounts.
- `POST /api/auth/request-password-reset` — issues a random token (30-min expiry), returned directly in the response (no email service integrated — see limitations).
- `POST /api/auth/reset-password` — consumes token, updates password hash.

**Password policy** (`backend/src/utils/password.ts`): more than 8 characters, at least one uppercase, one lowercase, one special character. Enforced on register, create-staff, setup-admin, and reset-password.

**JWT handling:**
- Secret read from `process.env.JWT_SECRET` — **no hardcoded fallback** (removed in final stage; previously had `"dev_secret"` fallback, now the middleware returns 500 if unset).
- `requireAuth` middleware verifies the Bearer token and attaches `req.user`.
- `requireRole(...roles)` middleware checks `req.user.role` against an allow-list.

**Role model:** `admin`, `staff`, `customer`. Enforced per-route:
- `create-staff`: admin only
- `subscriptions` POST/PATCH/renew: admin, staff
- `invoices generate-due`, `mark-overdue`, status PATCH: admin, staff
- `payments` POST: admin, staff
- Customer-scoped GETs (subscriptions, invoices, payments) filter by `customer_id` derived from the authenticated user's linked `customers.user_id` row — **ownership enforced server-side, not just hidden in UI**.

**Known security gap:** Customer/product/plan/discount routes (`stub.routes.ts`) currently have **no role guard at all** — any authenticated user can GET them, and there is no POST/PUT/DELETE on them yet, so no write-access risk, but this should be tightened (see Section 14).

---

## 6. Backend Documentation

Base URL: `/api`

### Auth (`/api/auth`)
| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/login` | none | `{email, password}` | `{token, user}` |
| POST | `/register` | none | `{name, email, password, phone?}` | `201 {id,name,email,role}` |
| POST | `/setup-admin` | setupKey in body | `{name, email, password, setupKey}` | `201 user` or `409` if admin exists |
| POST | `/create-staff` | Bearer + admin role | `{name, email, password, role?}` | `201 user` |
| POST | `/request-password-reset` | none | `{email}` | `{message, token}` (token returned directly, no email) |
| POST | `/reset-password` | none | `{token, newPassword}` | `{message}` |

### Dashboard (`/api/dashboard`)
| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/summary` | Bearer | `{totalCustomers, activeSubscriptions, totalInvoices, revenueCollected, outstandingPayments, overdueInvoices}` |
| GET | `/monthly-revenue` | Bearer | `[{month, total}]` — from paid invoices, grouped by month |
| GET | `/recent-invoices` | Bearer | last 5 invoices |

### Subscriptions (`/api/subscriptions`)
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| GET | `/` | Bearer | — | Customers see only their own (via `customers.user_id`) |
| POST | `/` | admin/staff | `{customer_id, plan_id, quantity?}` | Creates with status `draft`, computes `renewal_date` from plan's billing cycle |
| PATCH | `/:id/status` | admin/staff | `{status}` | status ∈ draft/confirmed/active/paused/cancelled/expired |
| POST | `/:id/renew` | admin/staff | — | Advances `renewal_date` by one billing cycle, sets status `active` |

### Invoices (`/api/invoices`)
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| GET | `/` | Bearer | — | Customer-scoped for role=customer |
| POST | `/generate-due` | admin/staff | — | Iterates all `active` subscriptions, generates one invoice per current month if not already present (DB unique index + `ON CONFLICT DO NOTHING` prevents duplicates) |
| POST | `/mark-overdue` | admin/staff | — | Flips draft/confirmed invoices past `due_date` to `overdue` |
| PATCH | `/:id/status` | admin/staff | `{status}` | status ∈ draft/confirmed/paid/overdue/cancelled |

### Payments (`/api/payments`)
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| GET | `/` | Bearer | — | Customer-scoped via invoice→customer join |
| POST | `/` | admin/staff | `{invoice_id, amount, method?, reference?, notes?}` | Transactional: locks invoice row (`FOR UPDATE`), rejects if `amount > outstanding`, updates `paid_amount` and flips status to `paid` once fully covered |

### Stubs — read-only (`/api/customers`, `/api/products`, `/api/plans`, `/api/discounts`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | Bearer (any role — **no role restriction applied**) | Returns up to 50 rows, `ORDER BY id DESC` |

No POST/PUT/DELETE exists for these four resources. Plans must currently be inserted directly via SQL.

### Middleware
- `requireAuth` (`backend/src/middleware/auth.ts`) — verifies JWT, attaches `req.user = {id, role, email}`
- `requireRole(...roles)` — 403 if `req.user.role` not in list
- Global error handler in `index.ts` catches uncaught route errors → `500 {error: "Unexpected server error"}`

---

## 7. Frontend Documentation

### Pages (`frontend/src/pages/`)
| Page | Route | Function |
|---|---|---|
| Login.tsx | `/login` | Email/password form, calls `AuthContext.login` |
| Dashboard.tsx | `/` | KPI cards, monthly revenue line chart, subscription status pie chart, recent invoices table — all from `/api/dashboard/*` |
| Customers.tsx | `/customers` | Read-only table from `GET /api/customers` |
| Products.tsx | `/products` | Read-only table from `GET /api/products` |
| Plans.tsx | `/plans` | Read-only table from `GET /api/plans` |
| Subscriptions.tsx | `/subscriptions` | Read-only table — **not updated to use the new POST/PATCH subscription routes**; still only lists |
| Invoices.tsx | `/invoices` | Read-only table — **not updated to call `generate-due` or status PATCH** |
| Payments.tsx | `/payments` | Read-only table — **no payment-recording form built** |
| Discounts.tsx | `/discounts` | Read-only table, shows admin-only notice for non-admins |
| Settings.tsx | `/settings` | Shows account info, admin-only notice placeholder for tax config |

**Important gap:** the backend logic built in the final stage (subscription lifecycle actions, invoice generation, payment recording) has **no corresponding frontend UI**. These can currently only be exercised via direct API calls (curl/Postman), not through the dashboard.

### Components
- `components/ui/Card.tsx` — KPI card (title/value/sub)
- `components/ui/Button.tsx` — styled button wrapper
- `components/ui/Table.tsx` — generic table with loading/empty states
- `components/layout/Sidebar.tsx` — nav links to all 9 pages
- `components/layout/Header.tsx` — user menu + logout
- `components/layout/DashboardLayout.tsx` — wraps Sidebar+Header+content
- `components/ProtectedRoute.tsx` — redirects to `/login` if no authenticated user

### State/Context
- `context/AuthContext.tsx` — holds `user`, exposes `login()`/`logout()`, persists token+user to `localStorage`
- `api/client.ts` — axios instance, attaches `Authorization: Bearer <token>` from localStorage automatically

### Navigation
Sidebar links map 1:1 to the 9 admin pages listed above; no customer-portal-specific frontend views exist (customer-scoped API filtering exists on the backend only).

---

## 8. Core Modules

| Module | Backend | Frontend | Status |
|---|---|---|---|
| Customers | Read-only route | Read-only table | Partial |
| Products | Read-only route | Read-only table | Partial |
| Product variants | Table exists, no routes | None | Not implemented |
| Plans | Read-only route | Read-only table | Partial (no create UI/route) |
| Quotations | Not implemented | Not implemented | Not implemented |
| Subscriptions | Full lifecycle routes | Read-only table only | Backend ahead of frontend |
| Invoices | Generation + status routes | Read-only table only | Backend ahead of frontend |
| Payments | Full transactional route | Read-only table only | Backend ahead of frontend |
| Discounts | Read-only route | Read-only table | Partial |

---

## 9. Business Logic

**Subscription lifecycle:** `draft → confirmed → active → paused/cancelled/expired`, with `renew` advancing `renewal_date` by one billing-cycle interval (`daily`+1d, `weekly`+7d, `yearly`+1y, else monthly+1mo) and setting status back to `active`.

**Billing calculation:** `amount = plan.price × subscription.quantity`. Tax and discount columns exist on `invoices` but are **not computed or applied anywhere** — always 0.

**Invoice generation (`generate-due`):** For every `active` subscription, computes the current calendar month as the billing period, builds an invoice number `INV-{subscriptionId}-{year}{month}`, and inserts with `ON CONFLICT (subscription_id, billing_period_start, billing_period_end) DO NOTHING` backed by a unique index — guarantees no duplicate invoice for the same subscription+period even under concurrent calls.

**Payment handling:** Each payment is processed in a DB transaction that row-locks the invoice (`SELECT ... FOR UPDATE`), rejects amounts exceeding `amount - paid_amount`, and atomically updates `paid_amount` and flips `status` to `paid` once fully covered. Supports multiple partial payments.

**Dashboard calculations:** All KPIs (`totalCustomers`, `activeSubscriptions`, `totalInvoices`, `revenueCollected`, `outstandingPayments`, `overdueInvoices`) are computed with live aggregate SQL queries (`COUNT`, `SUM`) against the actual tables — no fabricated/mocked numbers.

---

## 10. Environment Configuration

**`backend/.env.example`**
```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/brightloop
JWT_SECRET=change_this_secret
ADMIN_SETUP_KEY=change_this_setup_key
NODE_ENV=development
```

No frontend environment variables are required (API calls proxy through Vite's dev server config to `http://localhost:4000`).

**No real secrets are present anywhere in the codebase or this document.**

---

## 11. Installation & Setup

```bash
# Database
createdb brightloop
psql -d brightloop -f backend/src/schema.sql
psql -d brightloop -f backend/src/migrations/001_stage2_auth.sql
psql -d brightloop -f backend/src/migrations/002_final_stage.sql

# Backend
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, ADMIN_SETUP_KEY
npm install
npm run dev             # http://localhost:4000

# Frontend
cd frontend
npm install
npm run dev              # http://localhost:5173

# Bootstrap first admin (one-time)
curl -X POST localhost:4000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@brightloop.com","password":"Admin@1234","setupKey":"<your ADMIN_SETUP_KEY>"}'
```

---

## 12. Testing

**No automated test suite exists** (no Jest/Vitest/supertest configured). All verification to date has been via manual `curl` commands, provided as checklists during development but **not executed by the assistant** (no live DB/runtime available in this chat).

Manual test commands provided (to be run by the developer):
- Admin bootstrap + duplicate-bootstrap rejection
- Customer registration + duplicate-email rejection + weak-password rejection
- Password reset request/consume flow
- Subscription create → status transitions → renew
- Invoice `generate-due` called twice (second call should create 0 new invoices)
- Payment: partial payment, then over-limit payment (expect 400), then full payment (expect status `paid`)
- Unauthorized access (no token → 401)

**Results:** Not verified by the assistant. Status of each test is unknown until you run them against a real database.

---

## 13. Completed Features

- JWT auth: login, registration, admin bootstrap, password reset, staff creation (admin-gated)
- Password strength validation
- Role-based middleware (`requireAuth`, `requireRole`) applied to subscriptions, invoices, payments, create-staff
- Subscription lifecycle routes: create, status transitions, renew
- Invoice generation with duplicate prevention (DB-level unique constraint + transaction)
- Overdue invoice marking
- Manual payment recording with partial/full payment logic and outstanding-balance validation (transactional, row-locked)
- Dashboard with live PostgreSQL-backed KPIs and two charts
- Customer-level data ownership enforcement on GET endpoints for subscriptions/invoices/payments
- Removed hardcoded JWT secret fallback

---

## 14. Incomplete Features, Known Bugs & Limitations

**Not implemented at all:**
- Quotations module (no table, no routes, no UI)
- Product variant CRUD (table exists, unused)
- Customer/Product/Plan/Discount create/update/delete (read-only stubs only)
- Tax calculation and application on invoices (column exists, always 0)
- Discount application on invoices/subscriptions (column exists, always 0)
- Email delivery for password reset (token is returned directly in the API response instead — **not production-safe**, should go through an email service)
- Customer self-service portal UI (backend ownership filtering exists, no frontend views)
- Any frontend UI for subscription actions, invoice generation, or payment recording (these only work via direct API calls right now)

**Known bugs / inconsistencies:**
- `subscriptions.status` and `invoices.status` CHECK constraints (from `schema.sql`) do not include `'draft'` and `'confirmed'`, which the application code actively writes — **this will likely cause a constraint violation at runtime** and needs a migration to widen the CHECK constraints before these flows will work. This was not caught/fixed during generation and should be treated as a high-priority bug.
- `stub.routes.ts` (customers/products/plans/discounts) has no `requireAuth`/`requireRole` guard applied — any valid JWT (including customer role) can read all customers' data, not just their own. Should be restricted to admin/staff for these list endpoints.
- No pagination on any list endpoint beyond a hard `LIMIT 50/100` — will not scale and has no `page`/`offset` support.
- No automated tests exist; all listed "tests" are manual curl checklists, unexecuted by the assistant.

---

## 15. Deployment Guide

Not yet production-hardened. Minimum steps for a basic deployment:
1. Provision a managed PostgreSQL instance; run `schema.sql` then both migrations in order.
2. Set real values for `DATABASE_URL`, `JWT_SECRET` (long random string), `ADMIN_SETUP_KEY` (random, used once then can be rotated/removed), `NODE_ENV=production`.
3. `cd backend && npm install && npm run build && npm start` (serves compiled JS from `dist/`).
4. `cd frontend && npm install && npm run build` — deploy the `dist/` output to a static host (Vercel, Netlify, S3+CloudFront) and point API calls at the deployed backend URL (current `vite.config.ts` proxy only works in local dev — **a production API base URL needs to be configured**, e.g. via a frontend env variable, before deployment).
5. Fix the CHECK-constraint bug (Section 14) before relying on subscription/invoice status transitions in any real deployment.

---

## 16. Future Improvements

- Widen/fix `subscriptions`/`invoices` status CHECK constraints
- Build full CRUD + forms for customers, products (with variants), plans, discounts
- Implement quotations end-to-end, including conversion to subscriptions
- Apply tax and discount calculations to invoice generation
- Replace direct-token password reset response with real email delivery
- Add role guards to the remaining read-only stub routes
- Add pagination/filtering to all list endpoints
- Build frontend UI for subscription lifecycle actions, invoice generation trigger, and payment entry forms
- Add an automated test suite (e.g., Jest + supertest for backend, Vitest for frontend)
- Add a background scheduler for invoice generation and overdue marking (currently admin-triggered only, by design for this stage)
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/32501c47-48f1-4ad2-923a-f1cfa0ecb360" />
