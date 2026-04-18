# 🖋️ MERN Blog: A Premium Editorial Platform

![Platform Preview](https://img.shields.io/badge/Status-Deployment--Ready-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![UI Design](https://img.shields.io/badge/Design-Editorial--Aesthetic-indigo?style=for-the-badge)

A high-performance, responsive full-stack blogging platform built with a modern TypeScript architecture. This project features a premium editorial design inspired by platforms like Medium and Ghost, optimized for deep readability and professional content management.

---

## ✨ Key Features

- **Editorial Design**: Clean, typography-first UI with a focus on high-readability.
- **Dynamic Content Management**: Full CRUD operations for blog posts with rich text editing (React Quill).
- **Secure Authentication**: Robust JWT-based authentication with protected routes and cookie-based sessions.
- **My Blogs Dashboard**: Dedicated user profile views to manage and track personal publications.
- **Responsive Layout**: Fluid design that scales beautifully from mobile (iPhone/Android) to 4K desktops.
- **Image Processing**: Automatic image normalization and serving via a dedicated static asset pipeline.
- **Search & Filter**: Real-time post filtering by title, summary, and category.
- **Theme Switching**: Integrated Dark/Light mode optimized for different reading environments.

---

## 🛠️ Tech Stack: TypeScript & ESM

This project is built using a modern **TypeScript** architecture with **ES Modules (ESM)** for both the backend and frontend.

### Frontend
- **React.js**: Functional components and Hooks (`useContext`, `useEffect`, `useRef`).
- **React Router 6**: Client-side routing with nested layouts and protected navigation.
- **React Quill**: Rich text editor for content creation.
- **Vanilla CSS**: Custom design system using HSL color tokens and modern flex/grid layouts.
- **Date-fns**: Professional formatting for publication timestamps.

### Backend
- **Node.js & Express**: High-performance RESTful API.
- **MongoDB & Mongoose**: Schema-driven data modeling with authorship relationships.
- **JSON Web Tokens (JWT)**: Secure, stateless session management.
- **Bcrypt.js**: Industry-standard password hashing.
- **Multer**: Multi-part form data handling for image uploads.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/vins254/Blog_MERN.git

# Install backend dependencies
npm install

# Build/Run Backend (Development)
npm run dev # Uses tsx for instant execution

# Install frontend dependencies (TSX/React)
cd client
npm install
```

### 3. Environment Configuration
Create a `.env` file in the **root** and **client** directories:

**Root (.env)**
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
CLIENT_URL=http://localhost:3000
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:4000
```

---

## 🧪 Testing Suite

This project includes a comprehensive set of integration and component tests to ensure stability:

```powershell
# Run backend API tests (Jest + Supertest)
npm test

# Run frontend component tests (React Testing Library)
cd client
npm test
```

---

## 🌐 Deployment

### Backend (Render)
1. Set the root directory to `.`
2. Set Build Command: `npm install`
3. Set Start Command: `npm start` (Runs `node api/index.js` in ESM mode)
4. Add Environment Variables (`MONGO_URL`, `JWT_SECRET`, `CLIENT_URL`).

### Frontend (Vercel)
1. Add the project to Vercel.
2. Set the Framework Preset to **Create React App**.
3. Set the Root Directory to `client/`.
4. Add Environment Variable `REACT_APP_API_URL`.

---

## 📄 License
This project is open-source and available under the MIT License.
