import React from "react";

interface LoginFormProps {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    setIsRegistering: (value: boolean) => void;
    handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}
export default function LoginForm({ username, setUsername, password, setPassword, setIsRegistering, handleLogin } : LoginFormProps) {

    return (
        <div className={"flex items-center justify-center pt-5"}>
            <form className={"bg-white shadow-md rounded px-10 pt-6 pb-8 mb-4"} onSubmit={handleLogin}>
                <div className={"mb-4"}>
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="username">Username</label>
                    <input
                        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="password">Password</label>
                    <input
                        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className={"flex items-center justify-between"}>
                    <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} type="submit">Log In</button>
                    <button className={"inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 rounded-full px-5 py-2.5 text-center me-2 mb-2"} type="button" onClick={() => setIsRegistering(true)}>Register</button>
                </div>

            </form>
        </div>

    );
}