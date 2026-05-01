# 🖋️ MERN Blog: A Premium Editorial Platform

![Platform Preview](https://img.shields.io/badge/Status-Deployment--Ready-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript&logoColor=white&style=for-the-badge)

A high-performance, responsive full-stack blogging platform built with a modern TypeScript architecture. This project features a premium editorial design optimized for readability and professional content management.

> [!TIP]
> ### 🚀 Quick Access (Demo Credentials)
> Explore the platform immediately without registration:
> - **Username:** `demo`
> - **Password:** `demo123`

---

## ✨ Key Features

- **Editorial UI/UX**: typography-first design using custom CSS variables (HSL) and modern flex/grid layouts.
- **Dynamic Content**: Full CRUD operations for blog posts with category tagging.
- **Rich Text Editing**: Integrated **React-Quill** for beautiful article formatting.
- **Robust Auth**: JWT-based authentication with secure HttpOnly cookies and centralized profile management.
- **Smart Logic**: Ownership-based controls (Delete/Edit buttons only appear for the original author).
- **Responsive & Accessible**: Fully optimized for mobile, tablet, and desktop viewports.
- **Full-Stack Search**: Real-time filtering by title, summary, or category.

---

## 🛠️ Architecture & Tech Stack

### Frontend (Client)
- **Framework**: React 18 with TypeScript.
- **State Management**: Centralized `UserContext` for session persistence.
- **Styling**: Vanilla CSS with a custom design system for maximum performance.
- **Navigation**: React Router 6.

### Backend (API)
- **Server**: Node.js & Express.
- **Database**: MongoDB Atlas with Mongoose modeling.
- **Security**: Bcrypt.js for hashing, JWT for tokenized sessions.
- **File System**: Multer for high-performance image uploads and storage.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **NPM** or **Yarn**
- **MongoDB Atlas** connection string

### 2. Environment Setup
Create a `.env` file in the `/api` directory:
```env
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_random_secret_string
CLIENT_URL=http://localhost:3000
PORT=4000
```

### 3. Installation & Running
```bash
# Install root/backend dependencies
npm install

# Install client dependencies
cd client && npm install

# Start both services (Local Dev)
# Run root terminal
npm run dev
# Run client terminal
npm start
```

---

## 🌐 Deployment Instructions

### Backend (Render / Heroku)
- **Root Directory**: `api` (or project root if using monorepo style).
- **Build Command**: `npm install`
- **Start Command**: `node index.js` (Note: In production, compile TS or use `tsx`).
- **Critical**: Set `CLIENT_URL` to your production frontend URL and bind host to `0.0.0.0`.

### Frontend (Vercel / Netlify)
- **Root Directory**: `client`
- **Environment**: Set `REACT_APP_API_URL` to your production backend URL.
- **Framework**: Create React App.

---

## 📄 License
MIT License - Developed by Vins (@vins254)
