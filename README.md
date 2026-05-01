# 🖋️ MERN Blog: A Premium Editorial Platform

![Platform Preview](https://img.shields.io/badge/Status-Deployment--Ready-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript&logoColor=white&style=for-the-badge)

A high-performance, responsive full-stack blogging platform built with a modern TypeScript architecture. This project features a premium editorial design inspired by platforms like Medium and Ghost, optimized for readability and professional content management.

> [!TIP]
> ### 🚀 Quick Access (Demo Credentials)
> Explore the platform immediately without registration:
> - **Username:** `demo`
> - **Password:** `demo123`
>
> To initialize these credentials in your own database, run: `npm run seed`

---

## ✨ Key Features

- **Premium 2-Column Card Grid**: A human-centric design that organizes posts into a clean, modern grid that adapts perfectly to any screen size.
- **Editorial UI/UX**: typography-first design using the **Lora serif font** for headlines and **Inter** for body text.
- **Dynamic Content**: Full CRUD operations for blog posts with category tagging.
- **Rich Text Editing**: Integrated **React-Quill** for beautiful article formatting.
- **Responsive Navigation**: A smart 'hamburger' menu for mobile that presents flat, accessible links for all account actions.
- **Smart Asset Handling**: Posts without images gracefully hide their media containers, maintaining a polished look.
- **Robust Auth**: JWT-based authentication with secure HttpOnly cookies and centralized profile management.

---

## 🛠️ Architecture & Tech Stack

### Frontend (Client)
- **Framework**: React 18 with TypeScript.
- **State Management**: Centralized `UserContext` for session persistence.
- **Styling**: **Tailwind CSS** with a custom "Paper & Ink" design system (extended tokens for fonts, colors, and shadows).
- **Navigation**: React Router 6 with isolated Auth pages for a distraction-free experience.

### Backend (API)
- **Server**: Node.js & Express.
- **Database**: MongoDB Atlas with Mongoose modeling.
- **Seeding**: Includes a `seed.ts` utility to quickly initialize demo accounts.
- **Security**: Bcrypt.js for hashing, JWT for tokenized sessions.
- **File System**: Multer for high-performance image uploads and automated cleanup on deletion.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** account (Ensure your IP is whitelisted: use `0.0.0.0/0` for cloud deployments).

### 2. Installation & Running
```bash
# 1. Clone and Install dependencies
npm install

# 2. Seed the database (Initializes the demo account)
npm run seed

# 3. Start the application
# Start Backend
npm run dev

# Start Frontend (in a new terminal)
cd client && npm start
```

---

## 🌐 Deployment & Stability Fixes

- **MongoDB Timeout**: The backend is configured to "Fail-Fast" if it cannot reach Atlas within 5 seconds, preventing long server hangs on Render.
- **CORS & Cookies**: Pre-configured for cross-site cookie support (`SameSite: None`, `Secure: True`) to ensure authentication works seamlessly in production environments.
- **Error Handling**: Standardized JSON error responses across all endpoints.

---

## 📄 License
MIT License - Developed by Vins (@vins254)
