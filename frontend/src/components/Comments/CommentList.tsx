import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

const CommentSection = styled.div`
  margin-top: 2rem;
`;

const CommentStyle = styled.div`
  background-color: #f1f1f1;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
`;

interface Comment {
    _id: string;
    text: string;
    author: string;
}

interface Props {
    postId: string;
}

const CommentList: React.FC<Props> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await api.get(`/posts/${postId}/comments`);
                setComments(data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };

        fetchComments();
    }, [postId]);

    return (
        <CommentSection>
            <h3>Comments</h3>
            {comments.map((comment) => (
                <CommentStyle key={comment._id}>
                    <p>{comment.text}</p>
                    <small>By: {comment.author}</small>
                </CommentStyle>
            ))}
        </CommentSection>
    );
};

export default CommentList;
