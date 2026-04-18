import React, { useContext, useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const { setUserInfo } = useContext(UserContext);

    async function login(ev: FormEvent) {
        ev.preventDefault();
        setError('');
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const userInfo = await response.json();
                setUserInfo(userInfo);
                setRedirect(true);
            } else {
                const data = await response.json();
                setError(data.message || 'Invalid username or password');
            }
        } catch (e) {
            setError('Server connection error. Please try again.');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Welcome Back</h1>
            {error && <div className="error-message">{error}</div>}
            
            <input type="text" 
                    name="username"
                    autoComplete="username"
                    placeholder="Username" 
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" 
                    name="password"
                    autoComplete="current-password"
                    placeholder="Password" 
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}/>
            <button type="submit">Sign In</button>
        </form>
    );
}
