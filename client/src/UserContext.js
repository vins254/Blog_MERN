import {createContext, useState} from "react";
export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [userInfo,setUserInfo] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <UserContext.Provider value={{userInfo,setUserInfo, searchQuery, setSearchQuery}}>
            {children}
        </UserContext.Provider>
    );
}