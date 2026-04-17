import {Link, useLocation} from "react-router-dom";
import { useContext, useEffect, useState, useRef} from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const {setUserInfo,userInfo, searchQuery, setSearchQuery, theme, setTheme} = useContext(UserContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/profile`, {
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                response.json().then(userInfo => {
                    setUserInfo(userInfo);
                });
            }
        });
    }, [setUserInfo]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location]);

    function logout() {
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
        setIsDropdownOpen(false);
    }

    function toggleTheme() {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }

    const username = userInfo?.username;
    const hideSearchOn = ['/login', '/register'];
    const showSearch = !hideSearchOn.includes(location.pathname);

    return(
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            
            {showSearch && (
                <div className="search-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
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

            <nav>
                <div className="nav-controls">
                    <span className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25M4.242 12.75h-2.25m13.357-8.107l-1.591 1.591M5.909 18.091l-1.591 1.591m12.728 0l-1.591-1.591M5.909 5.909L4.318 4.318M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
                            </svg>
                        )}
                    </span>

                    {username ? (
                        <>
                            <Link to="/create" className="create-post-link">Create Post</Link>
                            <div className="user-menu-container" ref={dropdownRef}>
                                <button className="user-menu-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <div className="user-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.622 1.037 5.003 2.716 6.747l.15.156c.394.394.58.907.436 1.453l-.407 1.545c-.073.277.21.503.456.347l1.393-.889a1.071 1.071 0 011.106-.015c1.411.75 3.039 1.177 4.76 1.177 1.442 0 2.8-.297 4.03-.833a1.069 1.069 0 011.056.094l1.393.889c.245.156.529-.07.456-.347l-.407-1.545c-.144-.546.042-1.059.436-1.453l.15-.156zM12 6a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="username-display">{username}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} style={{width:'12px', height:'12px', transition: 'transform 0.2s'}}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="user-dropdown">
                                        <button type="button" onClick={logout} className="logout-btn">Logout</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="register-btn">Register</Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}