import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

const PostContainer = styled.div`
  max-width: 27rem;
  margin: 100px auto;
  padding: 1.5rem;
  border: 1px solid;
  border-radius: 1rem;
  border-color: #E1E0E9;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

interface Post {
    _id: string;
    title: string;
    content: string;
    user: {
        email: string;
        username: string;
    };
}

const PostList = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await api.get("/posts");
            setPosts(data);
        };
        fetchPosts();
    }, []);

    return (
        <PostContainer>
            <h2>Posts</h2>
            {posts.map((post) => (
                <div key={post._id}>
                    <h1>Created by:{post.user.username}</h1>
                    <p>Title: {post.title}</p>
                    <p>Content: {post.content}</p>
                </div>
            ))}
        </PostContainer>
    );
};

export default PostList;
