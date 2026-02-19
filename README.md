# Buyer Management Portal

A production-ready, full-stack web application for managing buyer records with enterprise-grade security, high-performance data import, and a premium user experience.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-TiDB%20Cloud-4479A1?style=flat-square&logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Security Implementation](#security-implementation)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Bonus Features](#bonus-features)

---

## Overview

This application was built as a technical assignment demonstrating proficiency in modern web development practices. It features a decoupled architecture with a React frontend and Node.js backend, implementing industry-standard security practices and a polished user interface.

### Key Highlights

- **Enterprise Security**: JWT with refresh token rotation, rate limiting, input sanitization, and secure password handling
- **Performance Optimized**: Stream-based file processing for memory-efficient uploads
- **Clean Architecture**: MVC pattern with clear separation of concerns
- **Type-Safe**: End-to-end TypeScript for reliability and maintainability
- **Premium UI**: Custom animations, responsive design, and attention to detail

---

## Features

### Authentication & Authorization

| Feature          | Implementation                                                                  |
| ---------------- | ------------------------------------------------------------------------------- |
| Registration     | Email/Mobile uniqueness validation, secure password hashing (bcrypt, 12 rounds) |
| Login            | Flexible login via Email or Mobile                                              |
| Password Policy  | 8+ characters, uppercase, lowercase, and number required                        |
| JWT Sessions     | Access token (10 min) + Refresh token (7 days)                                  |
| Auto Refresh     | Seamless token refresh with request queuing                                     |
| Protected Routes | Middleware-based route protection                                               |

### Data Management

| Feature        | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| File Upload    | CSV, XLS, XLSX support (max 5MB)                                         |
| Smart Mapping  | Auto-normalizes column headers (e.g., "Total Invoice" → `total_invoice`) |
| Upload History | Track all uploads with metadata and summary statistics                   |
| Pagination     | Server-side pagination with configurable page size                       |
| Search         | Real-time search by Name, Email, or Mobile                               |
| Filters        | Filter by payment status (Has Due/No Due) and invoice range              |

### Security Features

- **Rate Limiting**: 5 req/15min for auth, 50 req/15min for refresh, 100 req/15min general
- **Helmet**: Security headers (XSS protection, CSP, etc.)
- **Input Sanitization**: XSS protection on all user inputs
- **SQL Injection Prevention**: Parameterized queries throughout
- **Error Handling**: No sensitive information leakage in production
- **File Upload Security**: MIME type validation, filename sanitization, size limits

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
├─────────────────────────────────────────────────────────────────┤
│  Pages          │  Components    │  Contexts    │  Services    │
│  - Home         │  - BuyerTable  │  - Auth      │  - Axios     │
│  - Login        │  - UploadZone  │              │  - Interceptors│
│  - Register     │  - UploadHistory│             │              │
│  - Dashboard    │                │              │              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│  Middleware                     │  Routes                       │
│  - Authentication               │  - /api/v1/auth/*             │
│  - Rate Limiting                │  - /api/v1/buyers/*           │
│  - Error Handling               │                               │
├─────────────────────────────────┼───────────────────────────────┤
│  Controllers                    │  Models                       │
│  - AuthController               │  - User                       │
│  - BuyerController              │  - Buyer                      │
│  - UploadController             │  - Upload                     │
│                                 │  - RefreshToken               │
└───────────────────────────┬─────────────────────────────────────┘
                            │ MySQL Protocol
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL / TiDB Cloud)                │
│  - users          - buyers                                     │
│  - uploads        - refresh_tokens                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| React 19        | UI Framework            |
| TypeScript      | Type Safety             |
| Vite            | Build Tool              |
| Tailwind CSS 4  | Styling (Oxide Engine)  |
| TanStack Query  | Server State Management |
| React Hook Form | Form Handling           |
| Zod             | Schema Validation       |
| Framer Motion   | Animations              |
| Axios           | HTTP Client             |

### Backend

| Technology         | Purpose             |
| ------------------ | ------------------- |
| Node.js            | Runtime Environment |
| Express.js         | Web Framework       |
| TypeScript         | Type Safety         |
| MySQL2             | Database Driver     |
| bcrypt             | Password Hashing    |
| jsonwebtoken       | JWT Implementation  |
| Helmet             | Security Headers    |
| express-rate-limit | Rate Limiting       |
| csv-parser         | CSV Processing      |
| ExcelJS            | Excel Processing    |
| Multer             | File Uploads        |

---

## Security Implementation

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│ Generate │────▶│  Return  │
│ Request  │     │  Tokens  │     │ Response │
└──────────┘     └──────────┘     └──────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────┐          ┌────────────────┐
│ Access Token  │          │ Refresh Token  │
│  (10 min)     │          │   (7 days)     │
│               │          │                │
│ In Memory     │          │ HttpOnly Cookie│
│ Authorization │          │ Secure, SameSite│
│     Header    │          │    Strict      │
└───────────────┘          └────────────────┘
```

### Token Refresh Strategy

1. Client makes request with expired access token
2. Server returns 401 with `TOKEN_EXPIRED` code
3. Client automatically calls `/auth/refresh`
4. New access token issued, original request retried
5. If refresh fails, redirect to login

### Password Security

```typescript
// Password Requirements (enforced client & server)
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

// Storage
bcrypt.hash(password, 12) // 12 salt rounds
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │ refresh_tokens  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ name            │   │   │ token           │
│ email (UNIQUE)  │   │   │ user_id (FK)────│───┐
│ mobile (UNIQUE) │   │   │ expires_at      │   │
│ password        │   │   └─────────────────┘   │
│ created_at      │   │                         │
└────────┬────────┘   │                         │
         │            │                         │
         │ 1:N        │                         │
         ▼            │                         │
┌─────────────────┐   │                         │
│    uploads      │   │                         │
├─────────────────┤   │                         │
│ id (PK)         │   │                         │
│ user_id (FK)────│───┘                         │
│ filename        │                             │
│ original_name   │                             │
│ file_type       │                             │
│ row_count       │                             │
│ created_at      │                             │
└────────┬────────┘                             │
         │                                      │
         │ 1:N                                  │
         ▼                                      │
┌─────────────────┐                             │
│    buyers       │                             │
├─────────────────┤                             │
│ id (PK)         │                             │
│ user_id (FK)────│─────────────────────────────┘
│ upload_id (FK)  │
│ name            │
│ email           │
│ mobile          │
│ address         │
│ total_invoice   │
│ amount_paid     │
│ amount_due      │
│ created_at      │
└─────────────────┘
```

### SQL Schema

Located in `server/src/models/schema.sql`

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    row_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE buyers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    upload_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    address TEXT,
    total_invoice DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) NOT NULL,
    amount_due DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (upload_id) REFERENCES uploads(id) ON DELETE SET NULL
);

CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(512) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MySQL 8.0+ or TiDB Cloud account
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Ayush27pandit/Assignment-recordent.git
cd Assignment-recordent
```

### 2. Database Setup

Create a MySQL database and run the schema:

```bash
# Using MySQL CLI
mysql -u root -p < server/src/models/schema.sql

# Or run manually in your MySQL client
```

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure `.env` with your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=buyer_portal
DB_SSL=false

# JWT Secrets (use strong random strings in production!)
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters-long

# Client
CLIENT_URL=http://localhost:5173

# Rate Limiting (optional, defaults shown)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

Start the server:

```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_BASE_URL=http://localhost:5000/api/v1" > .env

# Start development server
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint                | Description             | Rate Limit |
| ------ | ----------------------- | ----------------------- | ---------- |
| POST   | `/api/v1/auth/register` | Register new user       | 5/15min    |
| POST   | `/api/v1/auth/login`    | Login with email/mobile | 5/15min    |
| POST   | `/api/v1/auth/refresh`  | Refresh access token    | 50/15min   |
| POST   | `/api/v1/auth/logout`   | Logout user             | None       |

### Buyer Endpoints

| Method | Endpoint                     | Description           | Auth     |
| ------ | ---------------------------- | --------------------- | -------- |
| POST   | `/api/v1/buyers/upload`      | Upload CSV/Excel file | Required |
| GET    | `/api/v1/buyers`             | Get paginated buyers  | Required |
| GET    | `/api/v1/buyers/uploads`     | Get upload history    | Required |
| GET    | `/api/v1/buyers/uploads/:id` | Get upload details    | Required |
| DELETE | `/api/v1/buyers/uploads/:id` | Delete upload         | Required |

### Query Parameters

**GET /api/v1/buyers**

| Parameter  | Type   | Description                            |
| ---------- | ------ | -------------------------------------- |
| page       | number | Page number (default: 1)               |
| limit      | number | Items per page (default: 10, max: 100) |
| search     | string | Search by name, email, or mobile       |
| uploadId   | number | Filter by upload ID                    |
| dueStatus  | string | `all`, `has_due`, `no_due`             |
| minInvoice | number | Minimum invoice amount                 |
| maxInvoice | number | Maximum invoice amount                 |

### Example Requests

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","mobile":"1234567890","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"john@example.com","password":"SecurePass123"}'

# Get Buyers with Filters
curl http://localhost:5000/api/v1/buyers?page=1&limit=10&dueStatus=has_due&minInvoice=1000 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Project Structure

```
recordent-assignment/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts             # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── BuyerTable.tsx   # Buyer data table with filters
│   │   │   │   ├── UploadZone.tsx   # Drag-drop file upload
│   │   │   │   ├── UploadHistory.tsx# Upload history list
│   │   │   │   └── UploadBuyers.tsx # Buyers for specific upload
│   │   │   └── ui/
│   │   │       ├── Button.tsx       # Reusable button component
│   │   │       ├── Input.tsx        # Input with validation
│   │   │       └── Hero.tsx         # Landing page hero
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx      # Authentication state
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx       # Login/Register layout
│   │   │   └── DashboardLayout.tsx  # Dashboard sidebar layout
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Register.tsx         # Registration page
│   │   │   └── Dashboard.tsx        # Dashboard pages
│   │   ├── App.tsx                  # Main app with routes
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                # MySQL connection pool
│   │   │   └── env.ts               # Environment validation
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Auth business logic
│   │   │   ├── buyerController.ts   # Buyer CRUD operations
│   │   │   └── uploadController.ts  # Upload management
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts    # JWT verification
│   │   │   └── rateLimiters.ts      # Rate limiting configs
│   │   ├── models/
│   │   │   ├── schema.sql           # Database schema
│   │   │   └── types.ts             # TypeScript types
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # Auth endpoints
│   │   │   └── buyerRoutes.ts       # Buyer endpoints
│   │   ├── utils/
│   │   │   └── jwt.ts               # JWT utilities
│   │   └── index.ts                 # Server entry point
│   └── package.json
│
├── plan/                            # Assignment documentation
│   ├── assignment.txt               # Original requirements
│   └── IMPLEMENTATION_PLAN.md       # Implementation roadmap
│
├── sample_buyers_1.csv              # Sample data (25 rows)
├── sample_buyers_2.csv              # Sample data (25 rows)
└── README.md
```

---

## Bonus Features Implemented

| Feature                  | Status | Description                                        |
| ------------------------ | ------ | -------------------------------------------------- |
| Refresh Token            | ✅     | Dual-token system with automatic refresh           |
| Clean Architecture (MVC) | ✅     | Controllers, routes, models, middleware separation |
| Proper Error Handling    | ✅     | Centralized error handling, no info leakage        |
| Security Best Practices  | ✅     | Helmet, rate limiting, input sanitization          |
| Upload History           | ✅     | Track and manage uploaded files                    |
| Advanced Filters         | ✅     | Payment status and invoice range filters           |
| Real-time Validation     | ✅     | Password requirements with visual feedback         |

---

## Evaluation Criteria Coverage

| Criteria                       | Implementation                                        |
| ------------------------------ | ----------------------------------------------------- |
| Code Structure & Cleanliness   | MVC architecture, TypeScript, clear separation        |
| JWT Implementation Correctness | Access + Refresh tokens, auto-refresh, secure storage |
| Security Practices             | Helmet, rate limiting, bcrypt, input sanitization     |
| Database Design                | Normalized tables, proper FKs, indexes                |
| Validation Implementation      | Zod on client & server, detailed error messages       |
| Pagination & Search            | Server-side with configurable limits                  |
| UI Responsiveness              | Mobile-first Tailwind design                          |
| Documentation Quality          | Comprehensive README with diagrams                    |

---

## Sample Data

Two sample CSV files are included for testing:

- `sample_buyers_1.csv` - 25 individual/small business buyers
- `sample_buyers_2.csv` - 25 enterprise/business buyers

Both files include various payment statuses for testing filters.

---

## Deployment

This application is configured for deployment on free tier hosting platforms:

**Note**: Free tier services spin down after 15 minutes of inactivity. First requests may take 30-60 seconds.

### Environment Variables for Production

**Backend (Render)**:

```env
NODE_ENV=production
DB_HOST=your-tidb-host
DB_PORT=4000
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=buyer_portal
DB_SSL=true
JWT_SECRET=<auto-generated>
JWT_REFRESH_SECRET=<auto-generated>
CLIENT_URL=https://your-frontend.vercel.app
```

**Frontend (Vercel)**:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

---

## License

This project was developed as a technical assignment for Recordent. Feel free to use it for evaluation purposes.
