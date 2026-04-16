import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;
    const isPasswordLongEnough = password.length >= 6;
    const isPasswordComplex = passwordRegex.test(password);
    const showPasswordError = password.length > 0 && (!isPasswordLongEnough || !isPasswordComplex);

    async function register(ev) {
        ev.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isPasswordLongEnough || !isPasswordComplex) {
            setError('Password does not meet requirements');
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({username, email, password, confirmPassword}),
            headers: {'Content-Type':'application/json'},
        });

        if (response.status === 200) {
            alert("Registration successful! Redirecting to login...");
            navigate('/login', { 
                state: { 
                    registeredUsername: username, 
                    registeredPassword: password 
                } 
            });
        } else {
            const data = await response.json();
            setError(data.message || 'Registration failed');
        }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Create Account</h1>
            {error && <div className="error-message">{error}</div>}
            
            <input type="text" 
                placeholder="Username"
                value={username}
                onChange={ev => setUsername(ev.target.value)} />
            
            <input type="email" 
                placeholder="Email Address"
                value={email}
                onChange={ev => setEmail(ev.target.value)} />
            
            <input type="password"
                placeholder="Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />
            <span className={`input-hint ${showPasswordError ? 'error' : ''}`}>
                Min. 6 characters with mixed Case, Numbers & Symbols
            </span>

            <input type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={ev => setConfirmPassword(ev.target.value)} />
            
            <button>Sign Up</button>
        </form>
    );
}