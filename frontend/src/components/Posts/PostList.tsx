import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

const PostContainer = styled.div`
  padding: 2rem;
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
