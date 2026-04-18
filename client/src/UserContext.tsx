import React, { createContext, useEffect, useState, ReactNode } from "react";

interface UserInfo {
    id?: string;
    username?: string;
}

interface UserContextType {
    userInfo: UserInfo;
    setUserInfo: (info: UserInfo) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

interface UserContextProviderProps {
    children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
    const [userInfo, setUserInfo] = useState<UserInfo>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');

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
