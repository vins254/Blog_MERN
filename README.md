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

## 🧪 Automated Testing

The project includes a full testing suite:
- **Backend (Jest & Supertest)**: 20+ integration tests for Auth and Posts.
- **Frontend (React Testing Library)**: Rendering and Routing verification.

Run all backend tests:
```bash
npm test
```

---

## 🚀 Deployment

The project is pre-configured for modern hosting platforms:
- **Backend**: Tested on **Render**.
- **Frontend**: Tested on **Vercel**.
- **Database**: **MongoDB Atlas**.

Detailed deployment checklists and commands can be found in [**DOCUMENTATION.md**](./DOCUMENTATION.md#deployment-guide).

---

## 📂 Project Structure

```text
├── api/                # Node/Express API
│   ├── controllers/    # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   └── __tests__/      # Backend test suite
├── client/             # React Frontend
│   ├── src/            # UI Components & Logic
│   └── public/         # Static assets & Manifest
└── DOCUMENTATION.md    # Detailed technical guide
```

---
Developed by **Antigravity** | [MIT License](./LICENSE)
