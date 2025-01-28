import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

const PostContainer = styled.article`
  max-width: 27rem;
  margin: 100px auto;
  padding: 1.5rem;
  border: 1px solid;
  border-radius: 1rem;
  border-color: #E1E0E9;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

  .text:last-of-type {
    font-weight: bold;
    padding-top: 1.25rem;
    display: inline-block;
  }
`;

const PostWrapper = styled.div`
display: flex;
flex-direction: column;
border-bottom: 1px solid;
padding-bottom: 1.25rem;
    `;

const UserContent = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    `;

const PostContent = styled.div`
display: flex;
flex-direction: column;
padding-top: 1.25rem;
gap: 0.5rem;
`;

const CommentsWrapper = styled.div`
display: flex;
flex-direction: column;
border-bottom: 1px solid;
padding-bottom: 1.25rem;
    `;

interface Post {
    _id: string;
    title: string;
    content: string;
    user: {
        email: string;
        username: string;
    };
    createdAt: string;
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
            {posts.map((post) => (
                <PostWrapper key={post._id}>
                    <UserContent>
                        <img width="40px" height="40px" src={process.env.PUBLIC_URL + "/user.png"} alt="user" />
                        <span>{post.user.username}</span>
                    </UserContent>
                    <PostContent>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                    </PostContent>
                    <span className="text">
                        {new Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }).format(new Date(post.createdAt))}
                    </span>
                </PostWrapper>
            ))}
        </PostContainer>
    );
};

export default PostList;
