import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

interface Post {
    _id: string;
    title: string;
    content: string;
    user: {
        username: string;
    };
    createdAt: string;
}

interface Comment {
    _id: string;
    content: string;
    user: {
        username: string;
    };
    createdAt: string;
}

const PostContainer = styled.article`
  max-width: 30rem;
  margin: 40px auto;
  border: 1px solid;
  border-radius: 1rem;
  border-color: #E1E0E9;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;

  .text:last-of-type {
    font-weight: bold;
    padding-top: 0.75rem;
    display: inline-block;
    font-size: 0.85rem;

  }
`;

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem 1.5rem;
`;

const UserContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  gap: 0.5rem;
`;

const CommentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.25rem;

  .comment {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid #ccc;
    padding: 1rem 0;
  }

  .comment-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

    .text-muted {
        color: #696969;
    }

`;

const AddCommentForm = styled.form`
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    `;

const Input = styled.input`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border: 1px solid #E1E0E9;
  border-radius: 0.375rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Button = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0 1.25rem;
  font-size: medium;
  background-color: #1D1C24;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

    .invert {
        filter: invert(1);
    }
`;

const PostList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

    const addComment = async (postId: string, e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        const content = commentInputs[postId]?.trim();
        if (!content) return;

        try {
            await api.post(`/posts/${postId}/comments`, { content });

            // Fetch updated comments for the specific post
            const { data: updatedComments } = await api.get(`/posts/${postId}/comments`);
            setCommentsByPost((prev) => ({
                ...prev,
                [postId]: updatedComments,
            }));

            setCommentInputs((prev) => ({
                ...prev,
                [postId]: "",
            })); // Clear input field after submission
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    useEffect(() => {
        const fetchPostsAndComments = async () => {
            try {
                // Fetch all posts
                const { data: posts } = await api.get("/posts");
                setPosts(posts);

                // Fetch comments for all posts
                const commentsPromises = posts.map((post: Post) => api.get(`/posts/${post._id}/comments`));
                const commentsResponses = await Promise.all(commentsPromises);

                // Map comments to their corresponding post
                const commentsData: Record<string, Comment[]> = {};
                commentsResponses.forEach((response, index) => {
                    commentsData[posts[index]._id] = response.data;
                });

                setCommentsByPost(commentsData);
            } catch (error) {
                console.error("Error fetching posts or comments:", error);
            }
        };

        fetchPostsAndComments();
    }, []);

    return (
        <PostContainer>
            {posts.map((post) => (
                <PostWrapper key={post._id}>
                    <UserContent>
                        <img width="40px" height="40px" src={process.env.PUBLIC_URL + "/user.png"} alt="user" />
                        <strong>@{post.user.username}</strong>
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

                    {/* Display all comments for the post */}
                    <CommentsWrapper>
                        <AddCommentForm onSubmit={(e) => addComment(post._id, e)}>
                            <Input
                                type="text"
                                value={commentInputs[post._id] || ""}
                                onChange={(e) =>
                                    setCommentInputs((prev) => ({
                                        ...prev,
                                        [post._id]: e.target.value,
                                    }))
                                }
                                placeholder="Add a comment"
                            />
                            <Button type="submit">
                                <img className="invert" width="16px" height="16px" src={process.env.PUBLIC_URL + "/send.png"} alt="send" />
                            </Button>
                        </AddCommentForm>
                        {commentsByPost[post._id]?.map((comment) => (
                            <div className="comment" key={comment._id}>
                                <img width="40px" height="40px" src={process.env.PUBLIC_URL + "/03.png"} alt="user" />
                                <div className="comment-content">
                                    <div>
                                        <strong>@{comment.user.username} </strong>
                                        <span>· </span>
                                        <span className="text-muted">
                                            {new Intl.DateTimeFormat("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            }).format(new Date(post.createdAt))}
                                        </span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </CommentsWrapper>
                </PostWrapper>
            ))}
        </PostContainer>
    );
};

export default PostList;
