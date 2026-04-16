import {createContext, useEffect, useState} from "react";
export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [userInfo,setUserInfo] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <UserContext.Provider value={{userInfo,setUserInfo, searchQuery, setSearchQuery, theme, setTheme}}>
            {children}
        </UserContext.Provider>
    );
}