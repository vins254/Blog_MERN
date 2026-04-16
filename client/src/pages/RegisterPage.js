import {useState} from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    async function register(ev) {
        ev.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({username, email, password, confirmPassword}),
            headers: {'Content-Type':'application/json'},
        });

        if (response.status === 200) {
            alert("Registration successful");
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
            <input type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={ev => setConfirmPassword(ev.target.value)} />
            <button>Sign Up</button>
        </form>
    );
}