import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import LoginForm from "../components/user/loginForm";
import RegistrationForm from "../components/user/registrationForm";

export default function User() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/user/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("Registration successful. You can now log in.");
            setIsRegistering(false);
        } else {
            alert("Registration failed. Please try again.");
        }
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/user/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            setIsLoggedIn(true);
            const data = await response.json();
            localStorage.setItem("token", data.token);
        } else {
            alert("Login failed. Please check your credentials.");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    return (
        <div>
            <Navbar />
            <h1>User</h1>
            {isLoggedIn ? (
                <div>
                    <p>You are logged in!</p>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            ) : isRegistering ? (
                <RegistrationForm
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    handleRegister={handleRegister}
                    setIsRegistering={setIsRegistering}
                />
            ) : (
                <LoginForm
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                    setIsRegistering={setIsRegistering}
                />
            )}
        </div>
    );
}