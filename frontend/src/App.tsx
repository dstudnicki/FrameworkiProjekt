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
import Navbar from "./components/Navbar/Navbar";
import UserEditProfilePage from "./routes/UserEditProfilePage";
import HomePage from "./routes/HomePage";

function App() {
    return (
        <>
            <GlobalStyles />
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/photos" element={<PhotosPage />} />
                    <Route path="/photo/upload" element={<PhotoUploadPage />} />
                    <Route path="/post/add" element={<AddPostPage />} />
                    <Route path="/:username" element={<UserProfilePage />} />
                    <Route path="/:username/edit" element={<UserEditProfilePage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
