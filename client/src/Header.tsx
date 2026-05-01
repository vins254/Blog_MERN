/**
 * FILE: client/src/Header.tsx
 * PURPOSE: Global navigation with professional layout and theme-aware actions.
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

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (navRef.current && !navRef.current.contains(event.target as Node) && !(event.target as Element).closest('.hamburger-menu')) {
                setIsNavOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
    const showSearch = !['/login', '/register'].includes(location.pathname);

    return (
        <header className="sticky top-0 z-[100] h-[64px] bg-paper/90 backdrop-blur-md border-b border-border-custom flex items-center justify-between px-4 sm:px-8">
            
            {/* 1. BRAND (Left) */}
            <div className="flex-1 flex items-center">
                <Link to="/" className="font-serif italic text-2xl font-bold text-ink hover:text-accent tracking-tighter transition-colors no-underline">
                    MyBlog
                </Link>
            </div>

            {/* 2. SEARCH (Center - hidden on XS mobile) */}
            {showSearch && (
                <div className="hidden sm:flex flex-[2] max-w-[400px] items-center justify-center px-4">
                    <div className="w-full flex items-center gap-2 bg-paper-warm border border-border-custom rounded-full px-4 py-1.5 transition-all focus-within:border-ink-light focus-within:bg-surface focus-within:shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-ink-faint">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search stories..."
                            className="bg-transparent border-none w-full font-sans text-sm text-ink outline-none placeholder:text-ink-faint"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* 3. ACTIONS (Right) */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
                
                {/* Theme Toggle - Desktop & Mobile */}
                <button 
                    onClick={toggleTheme}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-ink-light hover:text-ink hover:bg-paper-warm border border-transparent hover:border-border-custom transition-all"
                    title="Toggle Mode"
                >
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25M4.242 12.75h-2.25m13.357-8.107l-1.591 1.591M5.909 18.091l-1.591 1.591m12.728 0l-1.591-1.591M5.909 5.909L4.318 4.318M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
                        </svg>
                    )}
                </button>

                {/* User Dropdown - Desktop */}
                <div className="hidden md:block relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 border border-border-custom rounded-full p-[3px_12px_3px_3px] text-ink-light hover:text-ink hover:border-border-dark transition-all bg-surface/50"
                    >
                        <div className="w-7 h-7 bg-ink text-paper rounded-full flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.622 1.037 5.003 2.716 6.747l.15.156c.394.394.58.907.436 1.453l-.407 1.545c-.073.277.21.503.456.347l1.393-.889a1.071 1.071 0 011.106-.015c1.411.75 3.039 1.177 4.76 1.177 1.442 0 2.8-.297 4.03-.833a1.069 1.069 0 011.056.094l1.393.889c.245.156.529-.07.456-.347l-.407-1.545c-.144-.546.042-1.059.436-1.453l.15-.156zM12 6a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium">{username || 'Account'}</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-surface border border-border-custom rounded-xl shadow-lg p-1.5 flex flex-col">
                            {username ? (
                                <>
                                    <Link to={`/posts/user/${userInfo.id}`} className="p-2.5 rounded-lg text-sm text-ink hover:bg-paper-warm hover:text-accent no-underline">My Blogs</Link>
                                    <Link to="/create" className="p-2.5 rounded-lg text-sm text-ink hover:bg-paper-warm hover:text-accent no-underline">Create Post</Link>
                                    <button onClick={logout} className="w-full text-left p-2.5 mt-1 border-t border-border-custom text-sm font-medium text-accent hover:bg-red-50 rounded-b-lg">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="p-2.5 rounded-lg text-sm text-ink hover:bg-paper-warm hover:text-accent no-underline">Login</Link>
                                    <Link to="/register" className="p-2.5 rounded-lg text-sm text-ink hover:bg-paper-warm hover:text-accent no-underline">Register</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Hamburger - Mobile Only */}
                <button 
                    className="hamburger-menu md:hidden w-10 h-10 flex items-center justify-center text-ink hover:bg-paper-warm rounded-full transition-colors"
                    onClick={() => setIsNavOpen(!isNavOpen)}
                >
                    {isNavOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Drawer */}
            <nav ref={navRef} className={`fixed top-0 right-0 w-72 h-screen bg-surface border-l border-border-custom flex flex-col p-8 z-[200] shadow-2xl transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col gap-4 mt-8">
                    {username ? (
                        <>
                            <div className="flex items-center gap-3 pb-6 border-b border-border-custom mb-4">
                                <div className="w-10 h-10 bg-ink text-paper rounded-full flex items-center justify-center text-lg font-bold">
                                    {username[0].toUpperCase()}
                                </div>
                                <span className="font-bold text-ink">{username}</span>
                            </div>
                            <Link to={`/posts/user/${userInfo.id}`} className="text-lg font-medium text-ink hover:text-accent no-underline py-2">My Blogs</Link>
                            <Link to="/create" className="text-lg font-medium text-ink hover:text-accent no-underline py-2">Create Post</Link>
                            <button onClick={logout} className="w-full text-left text-lg font-bold text-accent py-2 mt-4 border-t border-border-custom">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-lg font-medium text-ink py-2 no-underline border-b border-border-custom">Login</Link>
                            <Link to="/register" className="mt-4 bg-ink text-paper text-center py-4 rounded-lg font-bold no-underline hover:bg-accent transition-colors">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
