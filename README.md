# ✨ Modern MERN Blog: Editorial Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech: MERN](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)

A premium, typography-centric blog platform built for high-readability and robust security. Inspired by modern digital publications like Ghost and Medium, this suite offers a seamless transition from registration to content creation.

![Desktop Preview](https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000)

## 🌟 Key Highlights

- **Modern Editorial UI**: Typography-first design using the **Inter** font family, a warm cream palette to reduce eye strain, and a sophisticated Dark Mode.
- **Advanced Security**: 
    - Generic error messages to prevent **User Enumeration**.
    - Tiered **Password Strength Meter** (Weak/Strong/Very Strong) with real-time feedback.
    - JWT-based authentication stored in **HttpOnly Secure Cookies** to mitigate XSS attacks.
- **Intuitive Content Management**: Fully-featured Rich Text Editor (React-Quill) with support for cover image uploads and 20+ creative categories.
- **Smart UX**: 
    - Automated **Password Manager** handoff (Autofill support).
    - Context-aware UI elements (Search bar hides on Auth pages).
    - Author-only moderation (Only the original author can edit or delete their posts).

## 🚀 Tech Stack

- **Frontend**: React.js, Context API, Vanilla CSS (Variables & Tokens)
- **Backend**: Node.js, Express.js (Modular Architecture)
- **Database**: MongoDB (Atlas) via Mongoose
- **Auth**: JWT, Bcrypt.js, Cookie-Parser
- **Media**: Multer (File management)

## 📂 Project Structure

```text
├── api/
│   ├── controllers/    # Domain-specific logic (Auth, Post)
│   ├── models/         # Mongoose Schemas (User, Post)
│   ├── routes/         # Express Router definitions
│   ├── middleware/     # Security & Auth filters
│   ├── uploads/        # Local storage for post covers
│   └── index.js        # Main server entry point
├── client/
│   ├── src/
│   │   ├── pages/      # View components (Login, Register, Dashboard)
│   │   ├── Post.js     # Post card component
│   │   ├── Header.js   # Navigation & Theme Control
│   │   └── App.css     # Design System & Token definitions
└── ...
```

## 🛠️ Installation & Quick Start

### 1. Requirements
Ensure you have **Node.js** and a **MongoDB Atlas** cluster ready.

### 2. Environment Setup
Create a `.env` in the root directory:
```env
MONGO_URL=your_mongodb_atlas_uri
JWT_SECRET=a_long_random_secure_string
CLIENT_URL=http://localhost:3000
```

Create a `.env` in the `client/` directory:
```env
REACT_APP_API_URL=http://localhost:4000
```

### 3. Launch
```bash
# Terminal 1: Backend
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm start
```

## 📖 Extended Documentation
For a deep dive into the architecture, security principles, and design philosophy, see the [**DOCUMENTATION.md**](./DOCUMENTATION.md) file.

---
Developed by **Antigravity** | [MIT License](./LICENSE)
