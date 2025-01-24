import React, { useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

const FormContainer = styled.div`
  margin-top: 1rem;
`;

interface Props {
    postId: string;
}

const CommentForm: React.FC<Props> = ({ postId }) => {
    const [text, setText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/posts/${postId}/comments`, { text });
            setText("");
            alert("Comment added successfully!");
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <label>Write a comment:</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} required></textarea>
                <button type="submit">Post Comment</button>
            </form>
        </FormContainer>
    );
};

export default CommentForm;
