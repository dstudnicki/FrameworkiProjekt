import { useState } from "react";
import { api } from "../services/api";

export const useAuth = () => {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token); // Store token
            await fetchMyProfile(); // Fetch your profile after login
            console.log("Login successful!", data);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // Register function
    const register = async (username: string, email: string, password: string) => {
        try {
            await api.post("/auth/register", { username, email, password });
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    // Fetch your profile from the token
    const fetchMyProfile = async () => {
        try {
            const { data } = await api.get("/user/profile/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token in the header
                },
            });
            setUser(data.user);
        } catch (error) {
            console.error("Failed to fetch your profile:", error);
        }
    };

    // Fetch another user's profile by username
    const fetchUserByUsername = async (username: string) => {
        try {
            const { data } = await api.get(`/profile/${username}`);
            return data; // Return fetched user profile
        } catch (error) {
            console.error("Failed to fetch user by username:", error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token"); // Remove token
        setUser(null);
    };

    return { user, login, register, logout, fetchMyProfile, fetchUserByUsername };
};
