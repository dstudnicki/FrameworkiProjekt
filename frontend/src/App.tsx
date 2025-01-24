import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import PostsPage from "./routes/PostsPage";
import PhotosPage from "./routes/PhotosPage";
import PhotoUploadPage from "./routes/PhotoUploadPage";
import UserProfilePage from "./routes/UserProfilePage";
import AddPostPage from "./routes/AddPostPage";

function App() {
    return (
        <>
            <GlobalStyles />
            <Router>
                <nav style={{ padding: "16px", backgroundColor: "#f0f0f0" }}>
                    <a href="/login" style={{ margin: "0 8px" }}>
                        Login
                    </a>
                    <a href="/register" style={{ margin: "0 8px" }}>
                        Register
                    </a>
                    <a href="/posts" style={{ margin: "0 8px" }}>
                        Posts
                    </a>
                    <a href="/post/add" style={{ margin: "0 8px" }}>
                        Add Post
                    </a>
                    <a href="/photos" style={{ margin: "0 8px" }}>
                        Photos
                    </a>
                    <a href="/photos/upload" style={{ margin: "0 8px" }}>
                        Upload Photo
                    </a>
                    <a href="/profile" style={{ margin: "0 8px" }}>
                        Profile
                    </a>
                </nav>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/photos" element={<PhotosPage />} />
                    <Route path="/photos/upload" element={<PhotoUploadPage />} />
                    <Route path="/post/add" element={<AddPostPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
