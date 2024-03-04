import React from "react";

interface LoginFormProps {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    setIsRegistering: (value: boolean) => void;
    handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}
export default function LoginForm({ username, setUsername, password, setPassword, setIsRegistering, handleLogin }: LoginFormProps) {

    return (
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Log In</button>
            <button type="button" onClick={() => setIsRegistering(true)}>Register</button>
        </form>
    );
}