import React, { useEffect, useState } from "react";

import Navbar from '../components/common/Navbar';
import LoginForm from "../components/user/loginForm";
import RegistrationForm from "../components/user/registrationForm";
import PermissionsForm from "@/components/user/permissionsForm";

interface PermissionsState {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

export default function User() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [permissions, setPermissions] = useState({
        read: false,
        create: false,
        update: false,
        delete: false,
    });

    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === 'true';
        setIsLoggedIn(loggedIn);

        const savedPermissions = localStorage.getItem("permissions");
        if (savedPermissions) {
            setPermissions(JSON.parse(savedPermissions));
        }
    }, []);

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
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("isLoggedIn", String(true));
        } else {
            alert("Login failed. Please check your credentials.");
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPermissions((prev: PermissionsState) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handlePermissionChange = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = Number(localStorage.getItem('userId'));
        const selectedPermissions = Object.entries(permissions).filter(([key, value]) => value).map(([key]) => key);

        const response = await fetch('/api/user/updatePermissions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ userId, newPermissions: selectedPermissions }),
        });

        if (response.ok) {
            alert("Permissions updated successfully");
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("permissions", JSON.stringify(permissions));
        } else {
            alert("Failed to update permissions");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("permissions");
    };

    return (
        <div>
            <Navbar />
            <h1>User</h1>
            {isLoggedIn ? (
                <PermissionsForm
                    handlePermissionChange={handlePermissionChange}
                    permissions={permissions}
                    handleCheckboxChange={handleCheckboxChange}
                    handleLogout={handleLogout}
                />
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