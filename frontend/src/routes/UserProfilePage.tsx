import React, { use } from "react";
import UserProfile from "../components/User/UserProfile";
import { api } from "../services/api";
import { useState, useEffect } from "react";

const UserProfilePage = () => {
    const [user, setUser] = useState({ user: { username: "", email: "" } });

    const fetchUserProfile = async () => {
        try {
            const { data } = await api.get("/user/profile/me");
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <div>
            <h1>Welcome to the User Profile Page</h1>
            <UserProfile username={user.user.username} email={user.user.email} />
        </div>
    );
};

export default UserProfilePage;
