/**
 * FILE: client/src/Header.tsx
 * PURPOSE: The global navigation bar for the application.
 * 
 * HOW IT WORKS:
 * 1. Responsive Design: Uses a 'hamburger' menu on small screens and a traditional 
 *    dropdown on desktops to manage user accounts.
 * 2. Search Integration: Provides a real-time search input that updates the 
 *    global search query via UserContext.
 * 3. Theme Toggle: Allows users to switch between light and dark modes, persisting 
 *    the choice in the application state.
 * 4. Conditional Rendering: Shows different links (Login/Register vs My Blogs/Create) 
 *    depending on whether the user is authenticated.
 */
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { API_URL } from "./config";

export default function Header() {
    const { setUserInfo, userInfo, searchQuery, setSearchQuery, theme, setTheme } = useContext(UserContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Close dropdown when clicking outside to ensure a clean UI
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if the click was outside the desktop profile dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            // Logic for mobile: Close mobile nav if clicking outside it and outside the hamburger button
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('.hamburger-menu')
            ) {
                setIsNavOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close nav and dropdown on route change
    useEffect(() => {
        setIsDropdownOpen(false);
        setIsNavOpen(false);
    }, [location]);

    function logout() {
        fetch(`${API_URL}/logout`, { credentials: 'include', method: 'POST' });
        setUserInfo({});
        setIsDropdownOpen(false);
        navigate('/');
    }

    function toggleTheme() {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }

    const username = userInfo?.username;
    const hideSearchOn = ['/login', '/register'];
    const showSearch = !hideSearchOn.includes(location.pathname);

    return (
        <header>
            <Link to="/" className="logo"><em>MyBlog</em></Link>

            {showSearch && (
                <div className="search-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {/* Hamburger — mobile only */}
            <button
                className="hamburger-menu"
                onClick={() => setIsNavOpen(!isNavOpen)}
                title="Toggle Navigation"
                aria-label="Toggle Navigation"
            >
                {isNavOpen ? (
                    /* X icon when open */
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    /* Hamburger icon */
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>

            <nav ref={navRef} className={isNavOpen ? 'open' : ''}>
                <div className="nav-controls">

                    {/* Theme toggle */}
                    <span className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25M4.242 12.75h-2.25m13.357-8.107l-1.591 1.591M5.909 18.091l-1.591 1.591m12.728 0l-1.591-1.591M5.909 5.909L4.318 4.318M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
                            </svg>
                        )}
                    </span>

                    {/* ── Desktop: user dropdown ── */}
                    <div className="nav-desktop-only" ref={dropdownRef} style={{ position: 'relative' }}>
                        <button className="user-menu-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <div className="user-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.622 1.037 5.003 2.716 6.747l.15.156c.394.394.58.907.436 1.453l-.407 1.545c-.073.277.21.503.456.347l1.393-.889a1.071 1.071 0 011.106-.015c1.411.75 3.039 1.177 4.76 1.177 1.442 0 2.8-.297 4.03-.833a1.069 1.069 0 011.056.094l1.393.889c.245.156.529-.07.456-.347l-.407-1.545c-.144-.546.042-1.059.436-1.453l.15-.156zM12 6a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="username-display">{username || 'Account'}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} style={{ width: '12px', height: '12px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="user-dropdown">
                                {username ? (
                                    <>
                                        <Link to={`/posts/user/${userInfo.id}`} className="dropdown-item">My Blogs</Link>
                                        <Link to="/create" className="dropdown-item">Create Post</Link>
                                        <button type="button" onClick={logout} className="logout-btn">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="dropdown-item">Login</Link>
                                        <Link to="/register" className="dropdown-item">Register</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Mobile: flat links shown directly ── */}
                    <div className="nav-mobile-links">
                        {username ? (
                            <>
                                <div className="mobile-nav-user">
                                    <div className="user-icon" style={{ width: 28, height: 28 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.622 1.037 5.003 2.716 6.747l.15.156c.394.394.58.907.436 1.453l-.407 1.545c-.073.277.21.503.456.347l1.393-.889a1.071 1.071 0 011.106-.015c1.411.75 3.039 1.177 4.76 1.177 1.442 0 2.8-.297 4.03-.833a1.069 1.069 0 011.056.094l1.393.889c.245.156.529-.07.456-.347l-.407-1.545c-.144-.546.042-1.059.436-1.453l.15-.156zM12 6a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="mobile-username">{username}</span>
                                </div>
                                <Link to={`/posts/user/${userInfo.id}`} className="mobile-nav-link">My Blogs</Link>
                                <Link to="/create" className="mobile-nav-link">Create Post</Link>
                                <button type="button" onClick={logout} className="mobile-nav-link mobile-logout">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mobile-nav-link">Login</Link>
                                <Link to="/register" className="mobile-nav-link mobile-nav-register">Register</Link>
                            </>
                        )}
                    </div>

                </div>
            </nav>
        </header>
    );
}
