import React from "react";

type UserProfileProps = {
    username: string | undefined;
    email: string | undefined;
};

const UserProfile: React.FC<UserProfileProps> = ({ username, email }) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
            <h2>User Profile</h2>
            <p>
                <strong>Name:</strong> {username}
            </p>
            <p>
                <strong>Email:</strong> {email}
            </p>
        </div>
    );
};

export default UserProfile;
