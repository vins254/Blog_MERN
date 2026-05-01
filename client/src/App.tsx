/**
 * FILE: client/src/App.tsx
 * PURPOSE: The root component that defines the application structure and routing.
 * 
 * HOW IT WORKS:
 * 1. State Management: Wraps everything in UserContextProvider to provide user session 
 *    and theme data globally.
 * 2. Routing: Uses React Router to map URLs to specific page components.
 * 3. Layouts: Separates 'public' content (Layout) from 'auth' content (Login/Register). 
 *    This allows auth pages to have a cleaner, distraction-free UI without the header.
 */
import React from 'react';
import './App.css';
import Layout from "./Layout";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Route, Routes } from "react-router-dom";
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from "./pages/PostPage";
import EditPost from './pages/EditPost';
import UserPostsPage from "./pages/UserPostsPage";

function App() {
  return (
    <UserContextProvider>
        <Routes>
          {/* Main Layout wrapper provides Header for shared routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/posts/user/:id" element={<UserPostsPage />} />
          </Route>

          {/* Auth routes on their own without the global Header */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes> 
    </UserContextProvider>
    
  );
}

export default App;
