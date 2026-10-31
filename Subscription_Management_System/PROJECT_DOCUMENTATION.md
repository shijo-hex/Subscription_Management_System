# Brightloop Software — Subscription Management System

## Complete Technical Project Documentation

> **Project:** Brightloop Software — Subscription Management System  
> **Hackathon:** Odoo Hackathon  
> **Development:** Three-stage development process  
> **Project Type:** Full-stack web application  
> **Documentation Status:** Updated against the source files visible on the repository main branch. Live database state, migration application, and runtime/test results remain unverified.

---

# Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Technology Stack](#4-technology-stack)
5. [Project Structure](#5-project-structure)
6. [System Architecture](#6-system-architecture)
7. [Database Design](#7-database-design)
8. [Authentication and Authorization](#8-authentication-and-authorization)
9. [Application Modules](#9-application-modules)
10. [API Documentation](#10-api-documentation)
11. [Business Logic and Workflows](#11-business-logic-and-workflows)
12. [Three-Stage Development Journey](#12-three-stage-development-journey)
13. [Installation and Configuration](#13-installation-and-configuration)
14. [Testing and Validation](#14-testing-and-validation)
15. [Implementation Status](#15-implementation-status)
16. [Known Issues and Limitations](#16-known-issues-and-limitations)
17. [Security and Production Readiness](#17-security-and-production-readiness)
18. [Future Development Roadmap](#18-future-development-roadmap)
19. [Project Credits](#19-project-credits)

---

# 1. Project Overview

**Brightloop Software — Subscription Management System** is a full-stack web application designed to simplify subscription-based business operations.

The application provides a centralized platform for managing customers, products, subscription plans, subscriptions, invoices, and manual payments.

It uses role-based access control to distinguish between administrators, staff members, and customers.

The system also includes recurring invoice generation, duplicate invoice prevention, partial and full payment recording, outstanding balance tracking, and a dashboard with database-backed financial information.

### Project Purpose

The primary purpose is to reduce the complexity of managing subscription-based services through a centralized digital platform.

Instead of handling subscription information, billing schedules, invoices, and payments separately, the application brings these operations into one management system.

### Project Scope

The inspected repository currently contains these implemented or partially implemented areas:

- User authentication and role management.
- Customer registration and customer records.
- Product and subscription plan information.
- Subscription lifecycle management.
- Invoice generation.
- Duplicate invoice prevention.
- Manual payment recording.
- Partial and full payment handling.
- Outstanding balance calculations.
- Overdue invoice handling.
- Dashboard analytics.

Some modules remain partially implemented or incomplete. Their actual status is explained in the implementation section.

---

# 2. Problem Statement

Subscription-based businesses must regularly manage customers, products, billing cycles, renewals, invoices, and payments.

Handling these operations manually can create several problems:

- Difficulty tracking active and inactive subscriptions.
- Errors in recurring billing.
- Duplicate invoice generation.
- Difficulty tracking partial payments.
- Incorrect outstanding balance calculations.
- Poor visibility into overdue invoices.
- Lack of centralized customer and subscription information.
- Limited financial reporting.

These problems can increase administrative effort and make subscription management less reliable.

### Proposed Solution

Brightloop Software provides a centralized subscription management application that connects customer records, subscription plans, billing, invoices, payments, and dashboard analytics.

The system aims to make subscription operations easier to manage while maintaining consistent financial records through backend validation and PostgreSQL database constraints.

---

# 3. Project Objectives

The main objectives are:

1. Provide centralized customer information management.
2. Support product and subscription plan management.
3. Manage subscription lifecycle operations.
4. Support different billing cycles.
5. Generate invoices from active subscriptions.
6. Prevent duplicate invoices for the same billing period.
7. Record manual payments.
8. Support partial and full payments.
9. Calculate outstanding balances.
10. Track overdue invoices.
11. Implement role-based access control.
12. Display database-backed business KPIs through a dashboard.

---

# 4. Technology Stack

The following technologies are documented as part of the project.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | User interface |
| Frontend language | TypeScript | Static typing |
| Build tool | Vite | Development server and build tooling |
| Styling | Tailwind CSS | UI styling |
| Routing | React Router v6 | Frontend navigation |
| HTTP client | Axios | API communication |
| Charts | Recharts | Dashboard visualizations |
| Backend | Node.js | Server runtime |
| Backend framework | Express 4 | REST API development |
| Backend language | TypeScript | Server-side typing |
| Authentication | JSON Web Token | Token-based authentication |
| Password security | bcryptjs | Password hashing |
| Database | PostgreSQL | Persistent data storage |
| Database driver | pg | PostgreSQL connectivity |
| Development tool | tsx | Backend TypeScript execution |
| Compiler | TypeScript compiler | Type checking and compilation |

---

# 5. Project Structure

The application source is nested under `Subscription_Management_System/` in the Git repository. The following tree describes the application directory:

```text
Subscription_Management_System/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   │
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       │
│       ├── types/
│       │   └── index.ts
│       │
│       ├── api/
│       │   └── client.ts
│       │
│       ├── context/
│       │   └── AuthContext.tsx
│       │
│       ├── components/
│       │   ├── ui/
│       │   │   ├── Card.tsx
│       │   │   ├── Button.tsx
│       │   │   └── Table.tsx
│       │   │
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   └── DashboardLayout.tsx
│       │   │
│       │   └── ProtectedRoute.tsx
│       │
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
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   │
│   └── src/
│       ├── index.ts
│       ├── db.ts
│       ├── schema.sql
│       │
│       ├── migration/
│       │   ├── 001_stage2_auth.sql
│       │   └── 002_final_stage.sql
│       │
│       ├── utils/
│       │   └── password.ts
│       │
│       ├── middleware/
│       │   └── auth.ts
│       │
│       └── routes/
│           ├── auth.routes.ts
│           ├── dashboard.routes.ts
│           ├── subscription.routes.ts
│           ├── invoice.routes.ts
│           ├── payment.routes.ts
│           └── stub.routes.ts
│
├── README.md
└── PROJECT_DOCUMENTATION.md
```

### Frontend Organization

| Directory | Responsibility |
|---|---|
| `pages/` | Application pages |
| `components/ui/` | Reusable UI components |
| `components/layout/` | Dashboard layout components |
| `context/` | Authentication state |
| `api/` | HTTP client configuration |
| `types/` | TypeScript definitions |

### Backend Organization

| Directory/File | Responsibility |
|---|---|
| `routes/` | REST API endpoints |
| `middleware/` | Authentication and authorization |
| `utils/` | Utility functions |
| `db.ts` | Database connection |
| `schema.sql` | Base database schema |
| `migration/` | Database schema updates |
| `index.ts` | Express application entry point |

**Documented structural limitation:** Customer, product, plan, and discount endpoints are handled through read-only stub routes. Dedicated business logic for these resources is not documented as implemented.

---

# 6. System Architecture

The application follows a frontend-backend-database architecture.

### Architecture Overview

```mermaid
flowchart TD
    U[User] --> F[React Frontend]
    F -->|HTTP REST API / Axios| B[Express Backend]
    B --> A[Authentication Middleware]
    A --> R[API Routes and Business Logic]
    R --> D[(PostgreSQL Database)]
    D --> R
    R --> B
    B --> F
    F --> U
```

### Frontend

The React frontend provides the user interface.

It includes:
- Login page.
- Dashboard.
- Customer page.
- Product page.
- Subscription plan page.
- Subscription page.
- Invoice page.
- Payment page.
- Discount page.
- Settings page.

Axios is used to communicate with the backend.

### Backend

The Express backend is intended to handle:
- API requests.
- Authentication.
- Authorization.
- Subscription operations.
- Invoice generation.
- Payment processing.
- Dashboard calculations.
- Database queries.

### Database

PostgreSQL stores user information, customer records, products, plans, subscriptions, invoices, payments, discounts, and password reset tokens.

### Request Flow

1. The user interacts with the React frontend.
2. Axios sends an HTTP request to the Express API.
3. Authentication middleware verifies the JWT when required.
4. Route handlers validate and process the request.
5. The backend communicates with PostgreSQL.
6. The backend returns a response.
7. The frontend displays the returned information.

---

# 7. Database Design

The documented database uses PostgreSQL.

## 7.1 Database Tables

### users

Stores user authentication and role information.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | User name |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Hashed password |
| role | VARCHAR(20) | User role |
| created_at | TIMESTAMP | Creation date |

Supported roles:
- admin
- staff
- customer

### customers

Stores customer information.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Customer name |
| email | VARCHAR(255) | Unique email |
| phone | VARCHAR(50) | Phone number |
| user_id | INTEGER | Linked user ID |
| created_at | TIMESTAMP | Creation date |

`user_id` references `users(id)`.

### products

Stores product information.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| created_at | TIMESTAMP | Creation date |

**Limitation:** The documented schema does not include the planned `type` and `cost_price` fields.

### product_variants

Stores product variants.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| product_id | INTEGER | Product reference |
| name | VARCHAR(255) | Variant name |
| price | NUMERIC(12,2) | Variant price |

`product_id` references `products(id)`.

### plans

Stores subscription plan information.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Plan name |
| variant_id | INTEGER | Product variant reference |
| billing_cycle | VARCHAR(20) | Billing frequency |
| price | NUMERIC(12,2) | Plan price |
| min_quantity | INTEGER | Minimum quantity |
| available_from | DATE | Availability start |
| available_to | DATE | Availability end |
| created_at | TIMESTAMP | Creation date |

The `variant_id` references `product_variants(id)`.

### subscriptions

Stores customer subscriptions.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| customer_id | INTEGER | Customer reference |
| plan_id | INTEGER | Plan reference |
| status | VARCHAR(20) | Subscription status |
| start_date | DATE | Start date |
| renewal_date | DATE | Renewal date |
| quantity | INTEGER | Subscription quantity |
| paused_at | TIMESTAMP | Pause timestamp |
| closed_at | TIMESTAMP | Closure timestamp |
| created_at | TIMESTAMP | Creation date |

Documented status values include:
- active
- paused
- cancelled
- expired

Application routes also use `draft` and `confirmed`, but the documented database CHECK constraint does not include these values. This is a known potential runtime issue.

### invoices

Stores generated invoices.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| subscription_id | INTEGER | Subscription reference |
| customer_id | INTEGER | Customer reference |
| amount | NUMERIC(12,2) | Invoice amount |
| status | VARCHAR(20) | Invoice status |
| due_date | DATE | Payment due date |
| billing_period_start | DATE | Billing period start |
| billing_period_end | DATE | Billing period end |
| invoice_number | VARCHAR(50) | Unique invoice number |
| tax_amount | NUMERIC(12,2) | Tax amount |
| discount_amount | NUMERIC(12,2) | Discount amount |
| paid_amount | NUMERIC(12,2) | Amount paid |
| created_at | TIMESTAMP | Creation date |

Tax and discount fields exist in the documented schema, but their calculations are not implemented in the documented invoice logic.

### payments

Stores manual payment records.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| invoice_id | INTEGER | Invoice reference |
| amount | NUMERIC(12,2) | Payment amount |
| method | VARCHAR(50) | Payment method |
| status | VARCHAR(20) | Payment status |
| paid_at | TIMESTAMP | Payment timestamp |
| reference | VARCHAR(100) | Payment reference |
| notes | TEXT | Additional notes |

### discounts

Stores discount information.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| code | VARCHAR(50) | Unique discount code |
| percent_off | NUMERIC(5,2) | Percentage discount |
| active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation date |

The documented implementation does not apply discounts to invoices.

### password_reset_tokens

Stores password reset tokens.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| user_id | INTEGER | User reference |
| token | VARCHAR(255) | Unique reset token |
| expires_at | TIMESTAMP | Expiration time |
| used | BOOLEAN | Token usage status |
| created_at | TIMESTAMP | Creation date |

## 7.2 Database Relationships

```mermaid
erDiagram
    users ||--o| customers : linked_to
    customers ||--o{ subscriptions : owns
    product_variants ||--o{ plans : belongs_to
    plans ||--o{ subscriptions : selected_for
    subscriptions ||--o{ invoices : generates
    customers ||--o{ invoices : receives
    invoices ||--o{ payments : receives
    users ||--o{ password_reset_tokens : requests
```

## 7.3 Database Indexes

The documented database includes:

- `idx_customers_user_id`
- `idx_reset_tokens_token`
- `idx_unique_sub_period`
- `idx_invoices_status`
- `idx_invoices_due_date`
- `idx_subscriptions_status`

The unique billing-period index prevents duplicate invoices for the same subscription and billing period.

## 7.4 Database Migrations

The repository migration order is:

| Migration | Purpose |
|---|---|
| `schema.sql` | Base database schema |
| `001_stage2_auth.sql` | Customer-user relationship and password reset tokens |
| `002_final_stage.sql` | Plan availability, subscription fields, invoice fields, payment fields, and indexes |

The documentation does not establish whether these migrations have been applied to a live database.

---

# 8. Authentication and Authorization

The application uses JWT-based authentication and bcrypt password hashing.

## 8.1 User Roles

| Role | Documented Access |
|---|---|
| Admin | Full system access and staff account creation |
| Staff | Management operations allowed by route permissions |
| Customer | Access to their own subscription, invoice, and payment records through scoped APIs |

## 8.2 Authentication Endpoints

- `POST /api/auth/setup-admin`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/create-staff`
- `POST /api/auth/request-password-reset`
- `POST /api/auth/reset-password`

## 8.3 Authentication Process

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter email and password
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Retrieve user
    Database-->>Backend: User record
    Backend->>Backend: Verify password hash
    Backend->>Backend: Generate JWT
    Backend-->>Frontend: Token and user details
    Frontend-->>User: Authenticated interface
```

## 8.4 Password Security

The documented password policy requires:
- More than eight characters.
- At least one uppercase letter.
- At least one lowercase letter.
- At least one special character.

Passwords are hashed using bcryptjs.

## 8.5 JWT Security

- JWT secret is read from `JWT_SECRET`.
- The documented token expiration is eight hours.
- `requireAuth` verifies bearer tokens.
- `requireRole` checks allowed roles.

## 8.6 Security Limitations

The documented limitations include:

1. Password reset tokens are returned directly by the API instead of being delivered through email.
2. Customer, product, plan, and discount read-only routes lack role restrictions.
3. No customer-specific frontend portal is documented.
4. Database status constraints may conflict with application status values.

---

# 9. Application Modules

## 9.1 Authentication

Provides login, registration, JWT authentication, admin setup, staff creation, and password reset.

**Status:** Implemented according to the supplied documentation; not independently verified.

## 9.2 Customer Management

Provides customer information through read-only API endpoints and frontend tables.

**Limitation:** Full customer CRUD is not documented as implemented.

## 9.3 Product Management

Provides product information through read-only endpoints.

**Limitation:** Product creation, editing, deletion, and complete pricing management are not implemented in the documented API.

## 9.4 Product Variants

The database contains a product variants table.

**Limitation:** Variant CRUD endpoints and frontend management are not documented.

## 9.5 Subscription Plans

Provides plan information through read-only endpoints.

The documented plan fields include:
- Billing cycle.
- Price.
- Minimum quantity.
- Availability dates.
- Product variant reference.

**Limitation:** Plan creation and management interfaces are incomplete.

## 9.6 Subscription Management

The backend provides:
- Subscription creation.
- Status updates.
- Renewal.

The documented lifecycle is:

`Draft → Confirmed → Active → Paused / Cancelled / Expired`

The frontend subscription page remains read-only according to the supplied documentation.

## 9.7 Quotations

The quotation module is not implemented.

Missing components:
- Quotation database tables.
- Quotation API routes.
- Quotation frontend.
- Quotation-to-subscription conversion.

## 9.8 Invoice Management

The backend supports:
- Invoice generation.
- Billing period tracking.
- Unique invoice numbers.
- Duplicate prevention.
- Overdue marking.
- Invoice status updates.

The frontend invoice page is documented as read-only.

## 9.9 Payment Management

The backend supports:
- Manual payments.
- Partial payments.
- Full payments.
- Outstanding balance validation.
- Overpayment prevention.

The payment route uses database transactions and row locking.

**Limitation:** The frontend payment page does not contain a payment-recording form in the supplied documentation.

## 9.10 Discount Management

A discount table and read-only API are documented.

**Limitation:** Discount creation, editing, deletion, and application to invoices are not implemented.

## 9.11 Dashboard

The dashboard displays database-backed information.

Documented KPIs include:
- Total customers.
- Active subscriptions.
- Total invoices.
- Revenue collected.
- Outstanding payments.
- Overdue invoices.

It also includes monthly revenue charts and recent invoices.

## 9.12 Settings

The settings page displays account information and an admin-only tax configuration placeholder.

Tax configuration is not documented as fully implemented.

---

# 10. API Documentation

The documented API base path is:

`/api`

## 10.1 Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | Customer registration |
| POST | `/auth/setup-admin` | Initial administrator setup |
| POST | `/auth/create-staff` | Create staff account |
| POST | `/auth/request-password-reset` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

## 10.2 Dashboard APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard/summary` | Dashboard KPIs |
| GET | `/dashboard/monthly-revenue` | Monthly revenue |
| GET | `/dashboard/recent-invoices` | Recent invoices |

## 10.3 Subscription APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/subscriptions` | List subscriptions |
| POST | `/subscriptions` | Create subscription |
| PATCH | `/subscriptions/:id/status` | Update subscription status |
| POST | `/subscriptions/:id/renew` | Renew subscription |

Documented creation body:

```json
{
  "customer_id": 1,
  "plan_id": 1,
  "quantity": 1
}
```

## 10.4 Invoice APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/invoices` | List invoices |
| POST | `/invoices/generate-due` | Generate due invoices |
| PATCH | `/invoices/:id/status` | Update invoice status |

## 10.5 Payment APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/payments` | List payments |
| POST | `/payments` | Record manual payment |

Documented payment body:

```json
{
  "invoice_id": 1,
  "amount": 500,
  "method": "bank_transfer",
  "reference": "PAY-001",
  "notes": "Manual payment"
}
```

## 10.6 Read-Only Resource APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/customers` | List customers |
| GET | `/products` | List products |
| GET | `/plans` | List plans |
| GET | `/discounts` | List discounts |

The inspected stub router does not provide POST, PUT, PATCH, or DELETE endpoints for these resources.

---

# 11. Business Logic and Workflows

## 11.1 Subscription Lifecycle

The subscription workflow is:

```mermaid
flowchart TD
    A[Create Subscription] --> B[Draft]
    B --> C[Confirmed]
    C --> D[Active]
    D --> E[Paused]
    D --> F[Cancelled]
    D --> G[Expired]
    E --> D
```

The backend is documented as supporting subscription creation, status changes, and renewal.

Renewal advances the renewal date according to the plan billing cycle:

| Billing Cycle | Documented Renewal Interval |
|---|---|
| Daily | 1 day |
| Weekly | 7 days |
| Monthly | 1 month |
| Yearly | 1 year |

## 11.2 Invoice Generation

The inspected invoice generation route:

1. Retrieves active subscriptions.
2. Determines the current calendar month as the billing period.
3. Calculates the invoice amount using plan price multiplied by subscription quantity.
4. Generates an invoice number.
5. Inserts the invoice if the billing period has not already been invoiced.
6. Uses a database unique index and `ON CONFLICT DO NOTHING` to prevent duplicates.

Documented amount calculation:

`Invoice Amount = Plan Price × Subscription Quantity`

Tax and discount calculations are not implemented in the documented logic.

## 11.3 Duplicate Invoice Prevention

The database uses a unique index on:

`(subscription_id, billing_period_start, billing_period_end)`

This prevents duplicate invoices for the same subscription and billing period.

## 11.4 Payment Processing

The documented payment workflow:

1. Receives the invoice ID and payment amount.
2. Starts a database transaction.
3. Locks the invoice row using `SELECT ... FOR UPDATE`.
4. Calculates the outstanding balance.
5. Rejects a payment exceeding the outstanding amount.
6. Records the payment.
7. Updates the invoice's paid amount.
8. Marks the invoice as paid when the balance reaches zero.

Documented calculation:

`Outstanding Balance = Invoice Amount − Paid Amount`

Multiple partial payments are supported by the described backend logic.

## 11.5 Dashboard Calculations

The dashboard uses SQL aggregate queries such as `COUNT` and `SUM`. The inspected source has important metric-definition limitations: outstanding totals include only invoices with status `pending`, revenue sums full amounts of invoices marked `paid`, and monthly revenue is grouped by invoice creation date.

The dashboard response includes:

- `totalCustomers`
- `activeSubscriptions`
- `totalInvoices`
- `revenueCollected`
- `outstandingPayments`
- `overdueInvoices`

---

# 12. Three-Stage Development Journey

The project was organized into three development stages.

## STAGE 1 — Foundation & Initial Setup

### Objective

Establish the initial full-stack application architecture and development foundation.

### Development Work

**1. Project Structure**
- Organized the frontend and backend into separate directories.
- Established the React application structure.
- Established the Express backend structure.

**2. Frontend Setup**
- Configured React and TypeScript.
- Set up Vite.
- Integrated Tailwind CSS.
- Created initial page and layout components.

**3. Backend Setup**
- Configured Node.js and Express.
- Established TypeScript configuration.
- Created the backend entry point.
- Configured database connectivity.

**4. Database Foundation**
- Created the initial PostgreSQL schema.
- Established the main data entities.
- Defined relationships between users, customers, products, subscriptions, invoices, and payments.

**5. Authentication Foundation**
- Introduced user authentication.
- Integrated password hashing.
- Established JWT-based authentication.

**6. Initial Dashboard**
- Created the dashboard interface.
- Added reusable UI components.
- Established the initial management pages.

### Stage 1 Outcome

The documented Stage 1 outcome was the foundational application structure, database setup, authentication foundation, and initial dashboard interface.

---

## STAGE 2 — Core Application Development

### Objective

Expand the foundation into a subscription management application with customer, product, plan, and subscription functionality.

### Development Work

**1. Authentication Improvements**
- Customer registration.
- Password reset functionality.
- Admin bootstrap.
- Staff account creation.
- Role-based middleware.

**2. Customer Management**
- Customer database records.
- Customer-user relationships.
- Customer list endpoint.
- Customer frontend page.

**3. Product Management**
- Product database structure.
- Product listing endpoint.
- Product frontend page.

**4. Product Variants**
- Product variant database table.
- Product-to-variant relationship.

**5. Subscription Plans**
- Billing cycles.
- Plan prices.
- Minimum quantities.
- Availability dates.

**6. Subscription Management**
- Subscription creation.
- Subscription status changes.
- Renewal logic.
- Quantity handling.
- Pause and closure timestamps.

**7. Discounts**
- Discount database structure.
- Discount listing endpoint.
- Discount frontend page.

**8. Frontend and Backend Integration**
- Axios API client.
- Authentication context.
- Protected routes.
- Management pages connected to backend data.

### Stage 2 Implementation Status

| Feature | Documented Status |
|---|---|
| Authentication improvements | Implemented |
| Customer listing | Partial |
| Customer CRUD | Not implemented |
| Product listing | Partial |
| Product CRUD | Not implemented |
| Product variant CRUD | Not implemented |
| Plan listing | Partial |
| Plan CRUD | Not implemented |
| Quotations | Not implemented |
| Subscription backend | Implemented |
| Subscription frontend actions | Incomplete |
| Discount listing | Partial |
| Discount application | Not implemented |

### Stage 2 Outcome

The application gained its core data structures, authentication improvements, subscription-related backend operations, and management interfaces.

However, several modules remained read-only or incomplete.

---

## STAGE 3 — Final Integration & Application Completion

### Objective

Introduce financial workflows, recurring invoice generation, payment processing, dashboard integration, and security improvements.

### Development Work

**1. Invoice Generation**
- Generated invoices from active subscriptions.
- Added billing period tracking.
- Added invoice numbers.
- Implemented duplicate invoice prevention.

**2. Invoice Status Handling**
- Added invoice status update support.
- The inspected `invoice.routes.ts` does not contain a `mark-overdue` endpoint.

**3. Manual Payment Processing**
- Added manual payment recording.
- Supported partial payments.
- Supported full payments.
- Validated outstanding balances.
- Prevented overpayments.

**4. Database Consistency**
- Added payment and invoice fields.
- Added database indexes.
- Used transactions and row locking for payment operations.

**5. Dashboard Integration**
- Added database-backed KPI queries.
- Added monthly revenue information.
- Added recent invoice information.

**6. Security and Access Control Work**
- Added JWT authentication middleware and role checks to selected write routes.
- Added customer ownership filtering to subscription, invoice, and payment list APIs.
- A hardcoded `dev_secret` fallback remains in login and authentication middleware.

**7. Testing and Bug Identification**
- Prepared manual API testing procedures.
- Identified database constraint inconsistencies.
- Identified missing frontend integrations.

### Stage 3 Implementation Status

| Feature | Documented Status |
|---|---|
| Invoice generation | Backend implemented |
| Duplicate prevention | Backend/database implemented |
| Overdue marking | Backend implemented |
| Manual payments | Backend implemented |
| Partial payments | Backend implemented |
| Full payments | Backend implemented |
| Outstanding balance logic | Backend implemented |
| Dashboard KPIs | Implemented |
| Subscription action UI | Incomplete |
| Invoice action UI | Incomplete |
| Payment entry UI | Incomplete |
| Automated tests | Not implemented |

### Stage 3 Outcome

The documented final stage introduced the main backend financial workflows and dashboard calculations.

However, the frontend was not fully integrated with the subscription, invoice, and payment operations.

The application should therefore be described as a partially integrated hackathon MVP rather than a fully completed production system.

---

# 13. Installation and Configuration

> The following instructions are based on the supplied project documentation. Confirm the actual package scripts and configuration before running them.

## 13.1 Prerequisites

- Node.js and npm.
- PostgreSQL.
- A code editor.
- Terminal or command prompt.

## 13.2 Database Setup

Create the database:

```bash
createdb brightloop
```

Run the base schema (the actual migration directory is singular: `migration`):

```bash
psql -d brightloop -f backend/src/schema.sql
```

Run migrations in order:

```bash
psql -d brightloop -f backend/src/migration/001_stage2_auth.sql
```

```bash
psql -d brightloop -f backend/src/migration/002_final_stage.sql
```

## 13.3 Environment Configuration

Navigate to the backend:

```bash
cd backend
```

Copy the environment example:

```bash
cp .env.example .env
```

Documented environment variables:

```env
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/brightloop
JWT_SECRET=change_this_secret
ADMIN_SETUP_KEY=change_this_setup_key
NODE_ENV=development
```

Replace the example values with secure local configuration.

Never commit real secrets.

## 13.4 Backend Installation

```bash
cd backend
npm install
npm run dev
```

Documented backend development URL:

`http://localhost:4000`

## 13.5 Frontend Installation

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Documented frontend development URL:

`http://localhost:5173`

## 13.6 Initial Administrator Setup

The documented system does not automatically create an administrator account.

Use the setup endpoint:

```bash
curl -X POST localhost:4000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@brightloop.com",
    "password": "Admin@1234",
    "setupKey": "<your ADMIN_SETUP_KEY>"
  }'
```

Use a secure password and your configured setup key. Do not use example credentials in production.

---

# 14. Testing and Validation

The supplied documentation states that no automated test suite is configured.

Manual testing procedures have been described, but their execution results are not independently verified.

### Recommended Manual Tests

| Test | Expected Result |
|---|---|
| Admin bootstrap | Creates the first admin |
| Duplicate admin bootstrap | Rejects the second attempt |
| Customer registration | Creates customer and user records |
| Duplicate email | Rejects duplicate email |
| Weak password | Rejects invalid password |
| Password reset | Validates and consumes reset token |
| Subscription creation | Creates a subscription |
| Subscription status update | Updates the subscription |
| Subscription renewal | Advances renewal date |
| Invoice generation | Creates due invoices |
| Duplicate invoice generation | Does not create duplicate invoices |
| Partial payment | Updates paid amount |
| Overpayment | Rejects excessive payment |
| Full payment | Marks invoice as paid |
| Unauthorized request | Returns an authentication error |

### Testing Limitations

- Automated tests are not documented as configured.
- Manual curl checklists have not been verified as executed.
- Live database behavior has not been independently confirmed.
- Runtime behavior of subscription and invoice status transitions requires particular attention because of the documented CHECK constraint mismatch.

---

# 15. Implementation Status

The following matrix summarizes the supplied implementation documentation.

| Module | Backend | Frontend | Overall Status |
|---|---|---|---|
| Authentication | Implemented | Implemented | Completed in documented scope |
| Customers | Read-only | Read-only | Partial |
| Products | Read-only | Read-only | Partial |
| Product variants | Database only | Missing | Not implemented |
| Subscription plans | Read-only | Read-only | Partial |
| Subscriptions | Lifecycle APIs | Read-only | Partially integrated |
| Quotations | Missing | Missing | Not implemented |
| Invoices | Generation and status APIs | Read-only | Partially integrated |
| Payments | Manual payment API | Read-only | Partially integrated |
| Discounts | Read-only | Read-only | Partial |
| Dashboard | KPI APIs | Dashboard UI | Implemented in documented scope |
| Settings | Not fully documented | Placeholder | Partial |

### Completed Functionality According to Existing Documentation

- JWT authentication.
- Customer registration.
- Admin bootstrap.
- Staff creation is intended, but the inspected route block is malformed and is not verified as working.
- Password strength validation.
- Role-based middleware on selected routes.
- Subscription lifecycle APIs.
- Invoice generation.
- Duplicate invoice prevention.
- Manual payment recording.
- Partial and full payment logic.
- Outstanding balance validation.
- Database-backed dashboard KPIs.
- Customer ownership filtering on selected APIs.

These are documented implementation claims, not independently verified end-to-end test results.

---

# 16. Known Issues and Limitations

## 16.1 Missing CRUD Operations

Customer, product, plan, and discount routes are documented as GET-only.

**Impact:** Administrators cannot fully manage these records through the application.

**Recommended improvement:** Implement validated create, update, and delete endpoints with appropriate authorization.

## 16.2 Quotations Not Implemented

There is no documented quotation database, backend API, or frontend interface.

**Impact:** The quotation-to-subscription workflow is unavailable.

**Recommended improvement:** Design quotation tables, APIs, templates, and subscription conversion logic.

## 16.3 Product Variant Management Missing

The database includes a product variants table, but management routes and UI are not documented.

**Impact:** Variants cannot be managed through the application.

**Recommended improvement:** Implement product variant CRUD and integrate variants with subscription plans.

## 16.4 Missing Frontend Integration

Subscription lifecycle actions, invoice generation, invoice status updates, and payment recording do not have corresponding frontend controls in the supplied documentation.

**Impact:** Backend workflows must be exercised through direct API requests.

**Recommended improvement:** Build frontend forms, action controls, validation, and success/error handling.

## 16.5 Database Status Constraint Mismatch

The documented database constraints do not include `draft` and `confirmed` for subscriptions and invoices, while the application logic uses these values.

**Impact:** Database constraint violations may prevent the related operations from succeeding.

**Recommended improvement:** Create and apply a migration that aligns the database CHECK constraints with the actual supported status values.

## 16.6 Missing Tax Calculation

Tax fields exist in the invoice table but are not populated by the documented business logic.

**Recommended improvement:** Implement configurable tax rules and invoice calculations.

## 16.7 Discounts Not Applied

Discount records exist, but discount calculations are not documented as implemented.

**Recommended improvement:** Implement discount eligibility, validation, and invoice application logic.

## 16.8 Password Reset Email Missing

The reset token is returned directly through the API response.

**Impact:** This is unsuitable for a production password reset workflow.

**Recommended improvement:** Integrate an email service and deliver reset links through email.

## 16.9 Missing Role Restrictions on Read-Only Routes

The inspected customer, product, plan, and discount routes require authentication but do not enforce role restrictions or customer-specific filtering.

**Impact:** Any authenticated user may be able to retrieve records beyond their intended permissions.

**Recommended improvement:** Apply explicit authorization middleware and data-scoping rules.

## 16.10 Missing Pagination

List endpoints use fixed limits rather than complete pagination.

**Impact:** Large datasets may become difficult to navigate and manage.

**Recommended improvement:** Add page, limit, filtering, and sorting support.

## 16.11 Automated Testing Missing

No automated test suite is documented.

**Recommended improvement:** Add backend API tests and frontend component tests.

---

# 17. Security and Production Readiness

The inspected repository currently contains these implemented or partially implemented areas:

- bcrypt password hashing.
- JWT-based authentication.
- JWT secret environment configuration.
- Role-based middleware.
- Customer ownership checks on selected APIs.
- Transactional payment processing.
- Invoice duplicate prevention.

However, several gaps remain:

- Password reset email integration is missing.
- Some read-only endpoints lack role restrictions.
- Database status constraints require correction.
- Automated security tests are not documented.
- Input validation requires further verification.
- Production API configuration requires additional work.

### Production Readiness Assessment

The application should be treated as a hackathon MVP and development-stage project.

It should not be considered production-ready until the database issues, authorization gaps, incomplete workflows, frontend integration, testing, and deployment configuration have been addressed.

---

# 18. Future Development Roadmap

## Priority 1 — Critical Fixes

- Fix subscription and invoice status CHECK constraints.
- Add role restrictions to remaining APIs.
- Improve password reset security.
- Review input validation and error handling.

## Priority 2 — Core Application Functionality

- Implement customer CRUD.
- Implement product CRUD.
- Implement product variant management.
- Implement subscription plan CRUD.
- Implement discount CRUD.
- Develop the quotation module.
- Implement tax calculations.
- Implement discount calculations.

## Priority 3 — Frontend Integration

- Add subscription creation and lifecycle controls.
- Add invoice generation and status controls.
- Add payment recording forms.
- Add customer-facing subscription and invoice views.
- Improve validation and error feedback.

## Priority 4 — Reliability and Scalability

- Add automated backend tests.
- Add frontend tests.
- Implement pagination.
- Improve database query performance.
- Add structured logging.
- Add background invoice generation and overdue checks.

## Priority 5 — Production Readiness

- Integrate email delivery.
- Configure production API URLs.
- Improve deployment configuration.
- Add monitoring and error tracking.
- Perform security testing.
- Review backup and recovery procedures.

---

# 19. Project Credits

## Brightloop Software — Subscription Management System

**Hackathon:** Odoo Hackathon

### Team Leader

**Shijo Sylan**

### Team Members

- Anusha S J
- Shan V Sayaras

### Hackathon Registration

[Odoo Hackathon — Registration Details](https://hackathon.odoo.com/hackathon/details/83114)

This project was developed as part of the Odoo Hackathon.


---

# Repository Audit — Source-Level Corrections

The following points were checked against files on the repository's `main` branch on 31 October 2026. They take precedence over any conflicting narrative earlier in this draft.

| Area | Verified repository finding |
|---|---|
| Repository layout | Application resides in `Subscription_Management_System/` beneath the Git repository root. |
| Migrations | Actual directory is `backend/src/migration/` (singular). |
| JWT | Both login and `requireAuth` use `process.env.JWT_SECRET || "dev_secret"`; this fallback remains. |
| Staff creation | `auth.routes.ts` has a malformed block referencing `req`/`res` outside a route callback; no valid `router.post("/create-staff", ...)` definition is present in the inspected file. |
| Invoice overdue | No `POST /invoices/mark-overdue` route is present in the inspected `invoice.routes.ts`. |
| Subscription states | `schema.sql` CHECK permits `active`, `paused`, `cancelled`, `expired`; route code also writes `draft` and `confirmed`. |
| Invoice states | `schema.sql` CHECK permits `pending`, `paid`, `overdue`, `cancelled`; invoice route writes `draft` and accepts `confirmed`. |
| Stub resources | Customer, product, plan, discount GET routes require authentication but have no role or owner filter and are read-only. |
| Frontend actions | Subscription, invoice, and payment pages render read-only tables; no forms for the corresponding backend actions were found. |
| Financial KPIs | Outstanding sums only invoices marked `pending`; revenue sums invoice amounts for `paid` invoices; monthly revenue groups on invoice `created_at`; the pie chart's “Other” value is not a real status breakdown. |
| Tests | No automated test scripts or test files were found in the inspected repository tree/package files. No runtime or live-database tests were executed. |
| Frontend package | The retrieved `frontend/package.json` contents were not valid JSON package metadata; verify this file before documenting install/build commands as working. |

### Priority fixes before demo or deployment

1. Repair the malformed staff-creation route and run the backend TypeScript build.
2. Remove the `dev_secret` fallback and fail closed when `JWT_SECRET` is missing.
3. Add and apply a migration aligning subscription and invoice status CHECK constraints with the values used by route handlers.
4. Either implement the overdue endpoint or remove any UI/documentation references to it.
5. Correct dashboard KPI queries and chart data to reflect payments and subscription statuses accurately.
6. Restrict stub resource APIs to intended roles and scope any customer-visible data.
7. Repair/verify `frontend/package.json`, then run frontend and backend builds and integration tests.

---

# Documentation Notes

This document is based on the project information and implementation summary supplied for Brightloop Software.

The following details require verification against the actual project environment:

- Current source-code implementation.
- Applied database migrations.
- Live database constraints.
- Runtime API behavior.
- Frontend and backend integration.
- Installation commands and package scripts.
- Manual and automated test results.

Features described as implemented should not be interpreted as independently verified or production-ready.

The implementation status should be updated whenever the application changes.

**Document:** `PROJECT_DOCUMENTATION.md`  
**Project:** Brightloop Software — Subscription Management System  
**Documentation Scope:** Architecture, database, APIs, modules, business logic, development stages, setup, testing, limitations, and roadmap.
