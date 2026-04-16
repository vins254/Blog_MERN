import {Link} from "react-router-dom";
import { useContext, useEffect} from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const {setUserInfo,userInfo, searchQuery, setSearchQuery} = useContext(UserContext);
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

    function logout() {
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return(
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            
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

            <nav>
                {username && (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a> 
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}