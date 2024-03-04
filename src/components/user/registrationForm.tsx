import React from "react";

interface RegistrationFormProps {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    setIsRegistering: (value: boolean) => void;
    handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
}
export default function RegistrationForm({ username, setUsername, password, setPassword, setIsRegistering, handleRegister }: RegistrationFormProps) {

    return (
        <form onSubmit={handleRegister}>
            <div>
                <label htmlFor="register-username">Username</label>
                <input
                    type="text"
                    id="register-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="register-password">Password</label>
                <input
                    type="password"
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Register</button>
            <button type="button" onClick={() => setIsRegistering(false)}>Back to Login</button>
        </form>
    );
}