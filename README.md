# Modern MERN Blog Application

A sleek, professional, and scalable blog platform built with the MERN stack (MongoDB, Express, React, Node.js). This project features a clean typography-first design, robust authentication, and intuitive content management.

![Header Image](https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **Responsive Design**: optimized for desktop, tablet, and mobile devices.
- **Full Authentication**: Secure login and registration with JWT and HTTP-only cookies.
- **Content Management**: Create, edit, and manage blog posts with rich text support.
- **Search & Filtering**: Real-time client-side search filtering by title and summary.
- **Categories**: Predefined categories (Tech, Lifestyle, Travel, Finance) for better organization.
- **Image Uploads**: Support for cover images for every post.
- **Professional UI**: Clean, minimal interface inspired by Medium and Ghost.

## 🚀 Tech Stack

- **Frontend**: React.js, React Router, Date-fns
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js
- **Styling**: Vanilla CSS (Modern CSS variables & Grid)
- **File Handling**: Multer

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/vins254/Blog_MERN.git
cd Blog_MERN
```

### 2. Backend Configuration
Create a `.env` file in the root directory:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
CLIENT_URL=http://localhost:3000
```

### 3. Frontend Configuration
Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:4000
```

### 4. Install Dependencies
```bash
# Install root (backend) dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

### 5. Run the Application
```bash
# From the root directory, start the backend
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

## 📂 Project Structure

```text
├── api/
│   ├── controllers/    # Request logic
│   ├── models/         # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & error handlers
│   └── index.js         # Entry point
├── client/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── Post.js      # List item component
│   │   └── App.css      # Modern styles
└── ...
```

## 📝 License
This project is licensed under the MIT License.
