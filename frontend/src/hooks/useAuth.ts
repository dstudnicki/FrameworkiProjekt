import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const [user, setUser] = useState<{ _id: string; username: string; email: string } | null>(null);
    const navigate = useNavigate();

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            const token = data.token;
            const expirationTime = Date.now() + 3600 * 1000; // 1 hour from now
            localStorage.setItem("token", token); // Store token
            localStorage.setItem("tokenExpiration", expirationTime.toString()); // Store expiration timestamp
            setTokenExpiry(); // Set up the token expiration timeout
            await fetchMyProfile(); // Fetch your profile after login
            navigate("/", { replace: true }); // Navigate to posts or any other page
            window.location.reload(); // Reload the page to reflect the logged-in state
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

    const setTokenExpiry = () => {
        const expirationTime = parseInt(localStorage.getItem("tokenExpiration") || "0", 10);
        if (expirationTime) {
            const remainingTime = expirationTime - Date.now();
            if (remainingTime > 0) {
                setTimeout(() => {
                    logout(); // Automatically log out the user
                    console.log("Token expired. User logged out.");
                }, remainingTime);
            } else {
                logout(); // Token already expired
            }
        }
    };

    // Initialize token expiration on app load
    useEffect(() => {
        setTokenExpiry();
    }, []);

    return { user, login, register, logout, fetchMyProfile, fetchUserByUsername };
};
