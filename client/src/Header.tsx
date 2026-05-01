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
        <header className="sticky top-0 z-[100] flex items-center justify-between px-8 h-[60px] bg-paper/90 backdrop-blur-xl border-b border-border-custom transition-all duration-300">
            <Link to="/" className="font-serif italic text-2xl font-semibold text-ink hover:text-accent tracking-tight leading-none transition-colors">
                <em>MyBlog</em>
            </Link>

            {showSearch && (
                <div className="hidden sm:flex items-center gap-2 bg-surface border border-border-custom rounded-lg px-3 py-1 w-[185px] transition-all focus-within:border-ink-light focus-within:shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-ink-faint">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="bg-transparent border-none w-full font-sans text-[0.82rem] text-ink outline-none placeholder:text-ink-faint m-0 p-0"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {/* Hamburger — mobile only */}
            <button
                className="hamburger-menu md:hidden flex items-center justify-center bg-transparent border-none text-ink cursor-pointer p-1.5 ml-auto rounded-sm hover:bg-paper-warm transition-colors"
                onClick={() => setIsNavOpen(!isNavOpen)}
                title="Toggle Navigation"
                aria-label="Toggle Navigation"
            >
                {isNavOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5.5 h-5.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5.5 h-5.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>

            <nav ref={navRef} className={`flex items-center transition-all duration-300 ${isNavOpen ? 'fixed top-0 right-0 w-[270px] h-screen bg-surface border-l border-border-custom flex-col p-[72px_24px_40px] z-[150] shadow-lg overflow-y-auto' : 'md:relative md:flex md:flex-row md:p-0 md:bg-transparent md:h-auto md:w-auto md:border-none md:shadow-none fixed right-[-100%]'}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-1.5">

                    {/* Theme toggle */}
                    <span className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer text-ink-light border border-transparent hover:border-border-dark hover:text-ink hover:bg-paper-warm transition-all" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[17px] h-[17px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[17px] h-[17px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25M4.242 12.75h-2.25m13.357-8.107l-1.591 1.591M5.909 18.091l-1.591 1.591m12.728 0l-1.591-1.591M5.909 5.909L4.318 4.318M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
                            </svg>
                        )}
                    </span>

                    {/* ── Desktop: user dropdown ── */}
                    <div className="hidden md:flex relative items-center" ref={dropdownRef}>
                        <button className="flex items-center gap-[7px] bg-none border border-border-custom rounded-[20px] p-[4px_10px_4px_4px] cursor-pointer text-ink-light font-sans text-[0.82rem] font-medium transition-all hover:bg-paper-warm hover:border-border-dark hover:text-ink" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <div className="w-[26px] h-[26px] bg-ink dark:bg-ink-light text-paper rounded-full flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.622 1.037 5.003 2.716 6.747l.15.156c.394.394.58.907.436 1.453l-.407 1.545c-.073.277.21.503.456.347l1.393-.889a1.071 1.071 0 011.106-.015c1.411.75 3.039 1.177 4.76 1.177 1.442 0 2.8-.297 4.03-.833a1.069 1.069 0 011.056.094l1.393.889c.245.156.529-.07.456-.347l-.407-1.545c-.144-.546.042-1.059.436-1.453l.15-.156zM12 6a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="max-w-[90px] overflow-hidden text-ellipsis whitespace-nowrap">{username || 'Account'}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 text-ink-faint transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 bg-surface min-w-[160px] rounded-lg shadow-lg p-1.5 flex flex-col z-[200] border border-border-custom animate-in fade-in slide-in-from-top-2 duration-150">
                                {username ? (
                                    <>
                                        <Link to={`/posts/user/${userInfo.id}`} className="block p-[8px_12px] rounded-sm font-sans text-[0.875rem] text-ink no-underline text-left hover:bg-paper-warm hover:text-accent transition-colors">My Blogs</Link>
                                        <Link to="/create" className="block p-[8px_12px] rounded-sm font-sans text-[0.875rem] text-ink no-underline text-left hover:bg-paper-warm hover:text-accent transition-colors">Create Post</Link>
                                        <button type="button" onClick={logout} className="block w-full p-[8px_12px] mt-1 border-t border-border-custom rounded-none bg-none font-sans text-[0.875rem] font-medium text-accent no-underline text-left cursor-pointer hover:bg-red-50 transition-colors">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block p-[8px_12px] rounded-sm font-sans text-[0.875rem] text-ink no-underline text-left hover:bg-paper-warm hover:text-accent transition-colors">Login</Link>
                                        <Link to="/register" className="block p-[8px_12px] rounded-sm font-sans text-[0.875rem] text-ink no-underline text-left hover:bg-paper-warm hover:text-accent transition-colors">Register</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Mobile: flat links shown directly ── */}
                    <div className="md:hidden flex flex-col w-full">
                        {username ? (
                            <>
                                <div className="flex items-center gap-[10px] p-[12px_0] border-b border-border-custom mb-2">
                                    <div className="w-[28px] h-[28px] bg-ink dark:bg-ink-light text-paper rounded-full flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.622 1.037 5.003 2.716 6.747l.15.156c.394.394.58.907.436 1.453l-.407 1.545c-.073.277.21.503.456.347l1.393-.889a1.071 1.071 0 011.106-.015c1.411.75 3.039 1.177 4.76 1.177 1.442 0 2.8-.297 4.03-.833a1.069 1.069 0 011.056.094l1.393.889c.245.156.529-.07.456-.347l-.407-1.545c-.144-.546.042-1.059.436-1.453l.15-.156zM12 6a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-sans text-[0.875rem] font-semibold text-ink">{username}</span>
                                </div>
                                <Link to={`/posts/user/${userInfo.id}`} className="block w-full p-[12px_0] font-sans text-base font-medium text-ink no-underline border-b border-border-custom hover:text-accent transition-colors">My Blogs</Link>
                                <Link to="/create" className="block w-full p-[12px_0] font-sans text-base font-medium text-ink no-underline border-b border-border-custom hover:text-accent transition-colors">Create Post</Link>
                                <button type="button" onClick={logout} className="block w-full p-[12px_0] font-sans text-base font-semibold text-accent no-underline border-b border-border-custom bg-none text-left cursor-pointer hover:text-red-500 transition-colors">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block w-full p-[12px_0] font-sans text-base font-medium text-ink no-underline border-b border-border-custom hover:text-accent transition-colors">Login</Link>
                                <Link to="/register" className="mt-2 bg-ink text-paper text-center p-[11px_0] rounded-sm font-sans text-base font-medium hover:bg-accent transition-all">Register</Link>
                            </>
                        )}
                    </div>

                </div>
            </nav>
        </header>
    );
}
