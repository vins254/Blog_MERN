import React, { createContext, useState, useEffect, ReactNode } from "react";
import { API_URL } from "./config";

/**
 * Interface representing the current user session.
 */
interface UserInfo {
    id?: string;
    username?: string;
    _id?: string; // Support for both id and _id formats
}

/**
 * Interface for the global user context state.
 */
interface UserContextType {
    userInfo: UserInfo;
    setUserInfo: (info: UserInfo) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with default values
export const UserContext = createContext<UserContextType>({} as UserContextType);

interface UserContextProviderProps {
    children: ReactNode;
}

/**
 * Global provider for User information, Search query, and Theme settings.
 */
export function UserContextProvider({ children }: UserContextProviderProps) {
    const [userInfo, setUserInfo] = useState<UserInfo>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');

    // On mount, check if the user is already logged in by fetching the profile
    useEffect(() => {
        fetch(`${API_URL}/profile`, {
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                response.json().then(info => {
                    setUserInfo(info);
                });
            }
        }).catch(() => {
            // Silently fail if not logged in
            setUserInfo({});
        });
    }, []);

    // Sync theme with HTML data-theme attribute for CSS targeting
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, searchQuery, setSearchQuery, theme, setTheme }}>
            {children}
        </UserContext.Provider>
    );
}
