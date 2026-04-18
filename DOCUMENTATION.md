# 📖 Project Documentation

This document provides a comprehensive guide to the **Modern MERN Blog** architecture, testing suite, and development lifecycle.

---

## 🏗️ Architecture Design

### Core Principles
- **Separation of Concerns**: Business logic is isolated in `controllers`, while HTTP routing is handled in `routes`.
- **TypeScript Support**: Full static typing across the entire stack for increased reliability and developer productivity.
- **Testability**: The Express `app` is separated from the server `index.ts` to allow `supertest` to run without a live port.
- **RESTful API**: Clean, predictable endpoints for all CRUD operations.

### Backend Structure (`api/`) - TypeScript ESM
- `app.ts`: Express configuration, middleware setup, and DB connection.
- `index.ts`: Server entry point.
- `controllers/`: Typed request handlers.
- `models/`: Mongoose schemas with TypeScript interfaces.
- `routes/`: Endpoint definitions.

### Frontend Structure (`client/src/`) - React TSX
- `App.tsx`: Routing and main layout logic.
- `Editor.tsx`, `Header.tsx`, `Post.tsx`: Typed UI components.
- `pages/`: Typed page-level components (.tsx).
- `constants/`: Shared constants (.ts).
- `UserContext.tsx`: Typed Global Context for user sessions and theme.

---

## 🧪 Testing Strategy

The project uses a dual-layer testing strategy to ensure reliability.

### Backend: Jest + Supertest
- **Scope**: API integration and unit logic.
- **Key Suites**:
    - `auth.test.js`: Validates registration rules, password hashing, and login sessions.
    - `post.test.js`: Validates CRUD operations, authentication guards, and author-only permissions.
- **How to Run**:
  ```bash
  # Root directory
  npm test
  ```

### Frontend: React Testing Library
- **Scope**: Component rendering, routing, and form presence.
- **How to Run**:
  ```bash
  # Client directory
  npm test
  ```

---

## 🚀 Deployment Guide

### Backend: Render
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set **Root Directory** to `api`.
4. **Environment Variables**:
    - `MONGO_URL`: Your Atlas connection string.
    - `JWT_SECRET`: Random secure string.
    - `CLIENT_URL`: Your Vercel frontend URL.
5. **Build Command**: `npm install` (Backend runs directly from `.ts` using `tsx` in dev or standard `.js` entry in prod via ESM).
6. **Start Command**: `npm start`

### Frontend: Vercel
1. Create a new Project on Vercel.
2. Set **Root Directory** to `client`.
3. **Environment Variables**:
    - `REACT_APP_API_URL`: Your Render backend URL.
4. Vercel automatically detects React and handles the build (`npm run build`).
5. **Critical**: Ensure `vercel.json` is present for client-side routing support (SPAs).

---

## 🛠️ Troubleshooting CORS & Connectivity

If you encounter "Server Connection Error" during login or post creation when deployed:

1. **Verify Render (Backend) Environment Variables**:
   - `CLIENT_URL` must match your Vercel production URL (e.g., `https://blog-mern-roan.vercel.app`).
   - Ensure there is **no trailing slash** at the end of the URL.
2. **Verify Vercel (Frontend) Environment Variables**:
   - `REACT_APP_API_URL` must match your Render backend URL (e.g., `https://blog-api.onrender.com`).
3. **CORS Policy**: The backend is configured to accept requests only from `CLIENT_URL` and `localhost:3000`. If you use a custom domain, ensure it's added to `api/app.js` or set as the `CLIENT_URL`.

## 🛠️ Contributor Follow-up
If you are taking over this project:
1. **Cleanup**: create an `api/uploads/` folder if it doesn't exist.
2. **Category Management**: To add new categories, update `client/src/constants/categories.ts`.
3. **Password Rules**: Adjust registration validation in `client/src/pages/RegisterPage.tsx`.
