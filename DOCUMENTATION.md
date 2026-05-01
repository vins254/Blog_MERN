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
-   **Premium 2-Column Card Grid**: A human-centric design that organizes posts into a clean, modern grid that adapts perfectly to any screen size.
-   **Editorial UI/UX**: Typography-first design using the **Lora serif font** for headlines and **Inter** for body text.
-   **User Authentication**: Secure registration, login, and logout with JWT stored in cookies.
-   **Rich Content Creation**: Quill-powered editor for beautiful blog posts.
-   **Image Uploads**: Support for cover images with automated cleanup on post deletion.
-   **Responsive Navigation**: A smart 'hamburger' menu for mobile that presents flat, accessible links for all account actions.
-   **Smart Asset Handling**: Posts without images gracefully hide their media containers, maintaining a polished look.
-   **Dark Mode**: Native support for light and dark themes based on user preference.
-   **Demo Mode**: Quick-login functionality and a `npm run seed` command for rapid testing.

---

## 🛠️ Problems Encountered & Fixes

### 1. Image Persistence & "Not Reflecting" Issues
**Problem**: Images sometimes failed to load because local file storage is ephemeral on platforms like Render.
**Fix**: 
-   Implemented a **Robust Image Loader**: Detects filename vs URL and prepends the correct base path.
-   **Conditional Rendering**: The UI now detects missing images and removes the empty space entirely rather than showing broken icons or empty boxes.

### 2. MongoDB Connectivity (ECONNREFUSED)
**Problem**: Users on some networks encountered `querySrv ECONNREFUSED` errors when connecting to Atlas using the `+srv` format.
**Fix**: 
-   Provided instructions on using the **Standard Connection String** (Node.js 2.2.12 format) and whitelisting `0.0.0.0/0`.
-   Implemented a 5-second `serverSelectionTimeoutMS` to prevent the server from hanging indefinitely.

### 3. Button Visibility & Global Styles
**Problem**: Global CSS for buttons was overriding specific icon buttons (like Edit/Delete), making them invisible or incorrectly sized.
**Fix**: 
-   Used CSS specificity and `!important` flags for action icons to ensure they remain as small, circular overlays even when global button styles change.

---

## 📝 Implementation Phases

### Phase 1: TypeScript Migration
-   Converted the entire codebase from JavaScript to TypeScript for better type safety.
-   Separated `app.ts` from `index.ts` to enable robust integration testing.

### Phase 2: UI/UX Overhaul
-   Switched from a left-to-right grid to a **2-column card grid** for better content flow.
-   Implemented a "Paper & Ink" color palette for a warmer, human-built feel.

### Phase 3: Auth & Navigation Enhancements
-   **Auth Switch Links**: Added "Login" links on Register and vice-versa.
-   **Responsive Nav**: Built a dedicated mobile slide-out menu with flat links for easier accessibility.

### Phase 4: Tailwind CSS Migration (Utility-First)
-   **Architecture**: Replaced the monolith `App.css` file with a **Tailwind CSS** configuration.
-   **Design Tokens**: Extended the Tailwind theme with custom "Paper & Ink" colors, "Lora/Inter" typography, and custom shadows.
-   **Code Quality**: Migrated all React components to use functional utility classes, reducing the overall CSS bundle size and improving maintainability.
-   **Dark Mode**: Integrated Tailwind's `dark:` variant with the existing theme toggler via the `document.documentElement` class list.

---

## 🧪 Testing & Seeding

### Seeding the Database
To ensure the demo credentials (`demo` / `demo123`) work immediately:
1.  Whitelist your IP in MongoDB Atlas.
2.  Run: `npm run seed`

### Automated Testing
-   **Backend**: `npm test` runs integration tests for Auth and Post routes.
-   **Frontend**: `npm test` inside the `client` folder validates core component rendering.

---

## 🚀 Deployment Checklist
1.  **Backend (Render)**: Set `MONGO_URL`, `JWT_SECRET`, and `CLIENT_URL`.
2.  **Frontend (Vercel)**: Set `REACT_APP_API_URL`.
3.  **Static Serving**: Ensure `api/uploads` folder exists on the server or use a cloud provider like Cloudinary for production persistence.
