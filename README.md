# Buyer Management Portal

A premium, full-stack application for managing buyer records with high-performance data import and secure authentication. Built as a technical assignment.

## 🚀 Live Demo & Links
- **GitHub Repository**: [https://github.com/Ayush27pandit/Assignment-recordent.git](https://github.com/Ayush27pandit/Assignment-recordent.git)

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Engine: Oxide)
- **State Management**: React Context API + TanStack Query (React Query)
- **Forms**: React Hook Form + Zod Validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Clash Grotesk (Custom Display Font)

### **Backend**
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MySQL (Optimized for **TiDB Cloud**)
- **Authentication**: JWT (Access & Refresh Token System)
- **File Processing**: `csv-parser` & `exceljs` (Stream-based for memory efficiency)
- **Security**: `bcrypt` (Salt Rounds: 12) + CORS + Cookie Parser

---

## ✨ Key Features

### **1. Secure Authentication**
- **Dual-Token System**: Short-lived Access Tokens (10m) and persistent Refresh Tokens (7 days).
- **Flexible Login**: Support for both Email and Mobile identifiers.
- **Secure Persistence**: User data is persisted via local storage, while session integrity is handled through HttpOnly cookies.

### **2. Advanced Data Import**
- **Multi-Format Support**: Upload CSV, XLS, and XLSX files up to 5MB.
- **Smart Mapping**: Automatically normalizes headers (e.g., "Total Invoice" → `total_invoice`) to prevent import errors.
- **Real-time Feedback**: Beautiful drag-and-drop interface with instant validation and error toast notifications.

### **3. Buyer Management Dashboard**
- **Paginated Grid**: Efficiently browse thousands of records with server-side pagination.
- **Instant Search**: Optimized `LIKE` queries for filtering by Name, Email, or Mobile.
- **Responsive Layout**: Premium sidebar navigation with active state tracking and mobile compatibility.

---

## 📁 Project Structure

```text
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/            # Axios instance with interceptors
│   │   ├── components/     # Reusable UI & Dashboard components
│   │   ├── contexts/       # Auth state management
│   │   ├── layouts/        # Sidebar & Auth designs
│   │   └── pages/          # Home, Login, Register, Dashboard
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # DB & Environment config
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & Upload guards
│   │   ├── models/         # SQL Schema & TS Types
│   │   └── routes/         # API Endpoints
│
└── sample_buyers.csv       # Test dataset
```

---

## ⚙️ Getting Started

### **Prerequisites**
- Node.js (v18+)
- MySQL or TiDB Cloud Account

### **1. Database Setup**
Log into your MySQL/TiDB console and run the commands in:
`server/src/models/schema.sql`

### **2. Backend Configuration**
Navigate to `server/`, create a `.env` file:
```env
PORT=5000
DB_HOST=your_host
DB_PORT=4000
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=buyer_portal
DB_SSL=true
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
```
Run: `npm install && npm run dev`

### **3. Frontend Configuration**
Navigate to `client/`:
Run: `npm install && npm run dev`

---

## 📄 License
This project is developed for assignment purposes. Use it freely for evaluation.
