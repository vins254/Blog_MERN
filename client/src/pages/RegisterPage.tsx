import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

/**
 * RegisterPage Component
 */
export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    function getPasswordStrength(pass: string) {
        if (!pass) return { level: '', class: '' };
        
        const length = pass.length;
        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass);
        
        let score = 0;
        if (length >= 6) score++;
        if (length >= 10) score++;
        if (hasUpper && hasLower) score++;
        if (hasNumber) score++;
        if (hasSymbol) score++;

        if (length < 6 || score <= 1) return { level: 'Weak', class: 'weak' };
        if (score <= 3) return { level: 'Strong', class: 'strong' };
        return { level: 'Very Strong', class: 'very-strong' };
    }

    const strength = getPasswordStrength(password);

    async function register(ev: FormEvent) {
        ev.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (strength.level === 'Weak') {
            setError('Password is too weak. Please use a stronger password.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                body: JSON.stringify({ username, email, password, confirmPassword }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                alert("Registration successful! Redirecting to login...");
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed');
            }
        } catch (e) {
            setError('Server connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Create Account</h1>
            {error && <div className="error-message">{error}</div>}
            
            <input type="text" 
                name="username"
                autoComplete="username"
                placeholder="Username"
                value={username}
                onChange={ev => setUsername(ev.target.value)} />
            
            <input type="email" 
                name="email"
                autoComplete="email"
                placeholder="Email Address"
                value={email}
                onChange={ev => setEmail(ev.target.value)} />
            
            <div className="input-wrapper">
                <input type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
                <span className={`input-hint ${strength.class} ${password.length > 0 ? 'visible' : ''}`}>
                    Strength: {strength.level} | Aa | 123 | #$% | 📏6+
                </span>
            </div>

            <div className="input-wrapper">
                <input type={showConfirmPassword ? "text" : "password"}
                    name="confirm-password"
                    autoComplete="new-password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={ev => setConfirmPassword(ev.target.value)} />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            </div>
            
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
            <div className="auth-switch">
                Already have an account? <Link to="/login">Login here</Link>
            </div>
        </form>
    );
}
