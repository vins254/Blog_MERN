# 📖 Project Documentation

This document provides a comprehensive guide to the **Modern MERN Blog** application, covering its architecture, tech stack, features, and the history of its development and fixes.

---

## 🌟 Project Overview
The **Modern MERN Blog** is a premium, typography-first editorial platform inspired by modern publications like Medium and Ghost. It allows users to create, read, and manage blog posts with rich text formatting and image support.

## 🏗️ How It Works
The application follows a standard Full-Stack MERN architecture:
1.  **Frontend**: A React SPA (Single Page Application) that communicates with a RESTful API.
2.  **Backend**: An Express server handling authentication, business logic, and file storage.
3.  **Database**: MongoDB (via Mongoose) stores user data and post metadata.
4.  **Session Management**: JWT-based authentication stored in cookies for secure, persistent sessions.
5.  **File Management**: Images are uploaded via Multer and served as static assets from the backend server.

---

## 🛠️ Tech Stack & Features

### Core Stack
-   **Frontend**: React (with Hooks & Context API), TypeScript, React Router.
-   **Backend**: Node.js, Express.js, TypeScript.
-   **Database**: MongoDB Atlas.
-   **Auth**: JSON Web Tokens (JWT), BcryptJS for password hashing.
-   **Media**: Multer (File uploads), Quill (Rich Text Editor).

### Key Features
-   **User Authentication**: Secure registration, login, and logout.
-   **Rich Content Creation**: Quill-powered editor for beautiful blog posts.
-   **Image Uploads**: Support for cover images with automatic fallbacks.
-   **Dashboard & Search**: A central feed of all posts with real-time filtering.
-   **Ownership Controls**: Robust checks ensuring only authors can edit or delete their own posts.
-   **Responsive Design**: Mobile-optimized layout with a clean navigation system.
-   **Dark Mode**: Native support for light and dark themes based on user preference.
-   **Demo Mode**: Quick-login functionality for guest exploration.

---

## 🛠️ Problems Encountered & Fixes

### 1. Image Persistence & "Not Reflecting" Issues
**Problem**: Images sometimes failed to load on production platforms because local file storage is ephemeral (wiped on redeploy). Additionally, path mismatches between Windows and Linux/Production caused broken links.
**Fix**: 
-   Implemented a **Robust Image Loader**: The `getImageUrl` utility now detects if a path is a filename or a full URL and prepends the correct base path.
-   Added **Editorial Fallbacks**: Integrated high-quality placeholders from Unsplash that automatically show up via `onError` handlers if a specific post image fails to load.

### 2. CORS & Connectivity
**Problem**: Deployment on Render (Backend) and Vercel (Frontend) often lead to "Server Connection Errors" due to mismatched origin headers.
**Fix**: 
-   Normalized the `CLIENT_URL` configuration to strip trailing slashes.
-   Explicitly bound the server to `0.0.0.0` in `index.ts` to ensure compatibility with Render's port scanning.

### 3. State Management in Header
**Problem**: User session state sometimes appeared out of sync after login/logout or page refreshes.
**Fix**: 
-   Consolidated session fetching into a centralized `UserContext.tsx` that runs on mount, ensuring the UI always reflects the current server-side cookie state.

---

## 📝 Implementation Plans Used

### Phase 1: TypeScript Migration
-   Converted the entire codebase from JavaScript to TypeScript for better type safety and developer experience.
-   Separated `app.ts` from `index.ts` to enable robust integration testing.

### Phase 2: UI/UX Polish & Editorial Design
-   Implemented a modern design system using CSS variables and Google Fonts (Inter).
-   Added Glassmorphism effects to the header and interactive animations for post hover states.

### Phase 3: Auth & Navigation Enhancements (Recent)
-   **Auth Switch Links**: Added "Login" links on Register and vice-versa.
-   **User Menu Dropdown**: Consolidated Login/Register/Logout into a unified user icon dropdown.
-   **Demo Credentials**: Added a "Fill Demo" button on the Login page to facilitate easier testing by stakeholders.

---

## 🧪 Testing Strategy
The project maintains a healthy test suite using **Jest** and **Supertest** for the backend, and **React Testing Library** for the frontend.
-   **Backend**: `npm test` runs integration tests for Auth and Post routes.
-   **Frontend**: `npm test` inside the `client` folder validates core component rendering.

---

## 🚀 Deployment Checklist
1.  **Backend (Render)**: Set `MONGO_URL`, `JWT_SECRET`, and `CLIENT_URL`.
2.  **Frontend (Vercel)**: Set `REACT_APP_API_URL`.
3.  **Static Serving**: Ensure `api/uploads` folder exists on the server or use a cloud provider like Cloudinary for production persistence.
