# Brightloop Subscription Management System — Stage 1

## Stack
React + TypeScript + Vite + Tailwind (frontend) · Node + Express + PostgreSQL + JWT (backend)

## Setup

### 1. Database
createdb brightloop
psql -d brightloop -f backend/src/schema.sql

Manually insert one admin user (bcrypt-hash a password first, e.g. via node -e):
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@brightloop.com', '<bcrypt_hash>', 'admin');

### 2. Backend
cd backend
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npm install
npm run dev            # http://localhost:4000

### 3. Frontend
cd frontend
npm install
npm run dev             # http://localhost:5173