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

/**
 * Main Application Component
 * Handles client-side routing and global context initialization.
 * All pages are wrapped in UserContextProvider for global state management.
 */
function App() {
  return (
    <UserContextProvider>
        <Routes>
          {/* Main Layout wrapper provides Header/Footer for all child routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/posts/user/:id" element={<UserPostsPage />} />
          </Route>
        </Routes> 
    </UserContextProvider>
    
  );
}

export default App;
