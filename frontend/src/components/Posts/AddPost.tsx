import React, { useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

const FormContainer = styled.div`
  padding: 2rem;
  background-color: #fff;
  max-width: 400px;
  margin: 1rem auto;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const AddPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return alert("Please write a content.");

        const postData = {
            title,
            content,
        };

        try {
            await api.post("/posts", postData, {
                headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                },
            });
            alert("Post uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload post:", error);
        }
    };

    return (
        <FormContainer>
            <h2>Upload Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Content:</label>
                    <input type="text" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <button type="submit">Upload</button>
            </form>
        </FormContainer>
    );
};

export default AddPost;
