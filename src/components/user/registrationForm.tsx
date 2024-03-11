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
        <div className={"flex items-center justify-center pt-5"}>
            <form className={"bg-white shadow-md rounded px-10 pt-6 pb-8 mb-4"} onSubmit={handleRegister}>
                <div className={"mb-4"}>
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="register-username">Username</label>
                    <input
                        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        type="text"
                        id="register-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="register-password">Password</label>
                    <input
                        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"}
                        type="password"
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} type="submit">Register</button>
                <button className={"inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 rounded-full px-5 py-2.5 text-center me-2 mb-2"} type="button" onClick={() => setIsRegistering(false)}>Cancel</button>
            </form>
        </div>

    );
}