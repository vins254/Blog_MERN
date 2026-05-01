import React, { useContext, useState, FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { API_URL } from "../config";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function login(ev: FormEvent) {
        ev.preventDefault();
        setError('');
        
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`${API_URL}/login`, {
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
        } finally {
            setIsSubmitting(false);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-4">
            <form className="w-full max-w-[440px] bg-surface p-10 sm:p-12 rounded-xl shadow-lg border border-border-custom" onSubmit={login}>
                <h1 className="text-3xl font-bold font-serif text-center mb-8 text-ink">Welcome Back</h1>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-lg text-[0.875rem] font-medium text-center mb-6 animate-in fade-in duration-200">
                        {error}
                    </div>
                )}
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        name="username"
                        autoComplete="username"
                        placeholder="Username" 
                        className="w-full p-3.5 bg-paper-warm border border-border-custom rounded-lg font-sans text-base text-ink outline-none transition-all focus:border-ink-light focus:bg-surface focus:shadow-xs"
                        value={username}
                        onChange={ev => setUsername(ev.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        name="password"
                        autoComplete="current-password"
                        placeholder="Password" 
                        className="w-full p-3.5 bg-paper-warm border border-border-custom rounded-lg font-sans text-base text-ink outline-none transition-all focus:border-ink-light focus:bg-surface focus:shadow-xs"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-8 p-3.5 bg-ink text-paper rounded-lg font-sans text-base font-semibold border-none cursor-pointer transition-all hover:bg-accent disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="mt-8 text-center font-sans text-[0.875rem] text-ink-light">
                    Don't have an account? <Link to="/register" className="text-accent font-semibold no-underline hover:underline">Sign up here</Link>
                </div>
            </form>
        </div>
    );
}
