import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Post {
    _id: string;
    title: string;
    content: string;
    user: {
        _id: string | undefined;
        username: string;
    };
    createdAt: string;
}

interface Photo {
    _id: string;
    description: string;
    filename: string;
    user: {
        _id: string | undefined;
        email: string;
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

interface User {
    _id: string;
    username: string;
    email: string;
}

interface Data {
    user: User;
    posts: Post[];
    photos: Photo[];
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

  img {
    max-width: 450px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
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
  padding: 0 0.5rem;
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

const UserProfile = () => {
    const { username } = useParams<{ username: string }>();
    const [profileUser, setProfileUser] = useState<Data | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
    const [commentInputsPost, setCommentInputsPost] = useState<Record<string, string>>({});
    const [commentsByPhoto, setCommentsByPhoto] = useState<Record<string, Comment[]>>({});
    const [commentInputsPhoto, setCommentInputsPhoto] = useState<Record<string, string>>({});
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Fetch user data once
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: user } = await api.get(`/user/${username}`);
                setProfileUser(user);
            } catch (error) {} // Fetch profile data
        };

        fetchUserData();
    }, [username]);

    const handleAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token); // Decode the token
                const tokenId = decoded?.userId;
                const userId = profileUser?.user?._id;
                setIsAuthenticated(tokenId === userId); // Compare token username with URL username
            } catch (error) {
                console.error("Invalid token", error);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        if (profileUser) {
            handleAuthentication();
        }
    }, [profileUser]);

    useEffect(() => {
        const fetchPostsPhotosAndComments = async () => {
            if (!profileUser) return;

            try {
                // Fetch all posts

                const userPosts = profileUser?.posts || [];
                const userPhotos = profileUser?.photos || [];
                setPosts(userPosts);
                setPhotos(userPhotos);

                // Fetch comments for all posts
                const commentsPromisesPosts = posts.map((post: Post) => api.get(`/posts/${post._id}/comments`));
                const commentsResponsesPosts = await Promise.all(commentsPromisesPosts);

                const commentsPromisesPhotos = photos.map((photo: Photo) => api.get(`/photos/${photo._id}/comments`));
                const commentsResponsesPhotos = await Promise.all(commentsPromisesPhotos);

                // Map comments to their corresponding post
                const commentsDataPosts: Record<string, Comment[]> = {};
                commentsResponsesPosts.forEach((response, index) => {
                    commentsDataPosts[posts[index]._id] = response.data;
                });

                const commentsDataPhotos: Record<string, Comment[]> = {};
                commentsResponsesPhotos.forEach((response, index) => {
                    commentsDataPhotos[photos[index]._id] = response.data;
                });

                setCommentsByPost(commentsDataPosts);
                setCommentsByPhoto(commentsDataPhotos);
            } catch (error) {
                console.error("Error fetching posts or comments:", error);
            }
        };

        fetchPostsPhotosAndComments();
    }, [photos, posts, profileUser]);

    const addCommentPost = async (postId: string, e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        const content = commentInputsPost[postId]?.trim();
        if (!content) return;

        try {
            await api.post(`/posts/${postId}/comments`, { content });

            // Fetch updated comments for the specific post
            const { data: updatedComments } = await api.get(`/posts/${postId}/comments`);
            setCommentsByPost((prev) => ({
                ...prev,
                [postId]: updatedComments,
            }));

            setCommentInputsPost((prev) => ({
                ...prev,
                [postId]: "",
            })); // Clear input field after submission
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    const addCommentPhoto = async (photoId: string, e: React.FormEvent) => {
        e.preventDefault();

        const content = commentInputsPhoto[photoId]?.trim();
        if (!content) return;

        try {
            await api.post(`/photos/${photoId}/comments`, { content });

            const { data: updatedComments } = await api.get(`/photos/${photoId}/comments`);
            setCommentsByPhoto((prev) => ({
                ...prev,
                [photoId]: updatedComments,
            }));

            setCommentInputsPhoto((prev) => ({
                ...prev,
                [photoId]: "",
            }));
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    const deleteCommentPost = async (postId: string, commentId: string) => {
        try {
            // Make the API request to delete the comment
            await api.delete(`/posts/${postId}/comments/${commentId}`);

            // After successful deletion, filter out the deleted comment from the state
            setCommentsByPost((prev) => {
                const updatedComments = prev[postId]?.filter((comment) => comment._id !== commentId);
                return {
                    ...prev,
                    [postId]: updatedComments || [],
                };
            });
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const deleteCommentPhoto = async (photoId: string, commentId: string) => {
        try {
            // Make the API request to delete the comment
            await api.delete(`/photos/${photoId}/comments/${commentId}`);

            // After successful deletion, filter out the deleted comment from the state
            setCommentsByPhoto((prev) => {
                const updatedComments = prev[photoId]?.filter((comment) => comment._id !== commentId);
                return {
                    ...prev,
                    [photoId]: updatedComments || [],
                };
            });
            console.log(photoId, commentId);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const mergedData = [...posts, ...photos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <PostContainer>
            {mergedData.map((item) =>
                "title" in item ? (
                    // Render post
                    <PostWrapper key={item._id}>
                        <UserContent>
                            <Link to={`/${profileUser?.user.username}`}>
                                <img width="40px" height="40px" src={process.env.PUBLIC_URL + "/user.png"} alt="user" />
                            </Link>
                            <Link to={`/${profileUser?.user.username}`}>
                                <strong>@{profileUser?.user.username}</strong>
                            </Link>
                        </UserContent>
                        <PostContent>
                            <h3>{item.title}</h3>
                            <p>{item.content}</p>
                        </PostContent>
                        <span className="text">
                            {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }).format(new Date(item.createdAt))}
                        </span>
                        <CommentsWrapper>
                            <AddCommentForm onSubmit={(e) => addCommentPost(item._id, e)}>
                                <Input
                                    type="text"
                                    value={commentInputsPost[item._id] || ""}
                                    onChange={(e) =>
                                        setCommentInputsPost((prev) => ({
                                            ...prev,
                                            [item._id]: e.target.value,
                                        }))
                                    }
                                    placeholder="Add a comment"
                                />
                                <Button type="submit">
                                    <img className="invert" width="16px" height="16px" src={process.env.PUBLIC_URL + "/send.png"} alt="send" />
                                </Button>
                            </AddCommentForm>
                            {commentsByPost[item._id]?.map((comment) => (
                                <div className="comment" key={comment._id}>
                                    <Link to={`/${item.user.username}`}>
                                        <img width="40px" height="40px" src={process.env.PUBLIC_URL + "/03.png"} alt="user" />
                                    </Link>
                                    <div className="comment-content">
                                        <div>
                                            <Link to={`/${item.user.username}`}>
                                                <strong>@{comment.user.username} </strong>{" "}
                                            </Link>
                                            <span>· </span>
                                            <span className="text-muted">
                                                {new Intl.DateTimeFormat("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                }).format(new Date(item.createdAt))}
                                            </span>
                                        </div>
                                        <p>{comment.content}</p>
                                        {isAuthenticated && comment.user.username === profileUser?.user.username && <Button onClick={() => deleteCommentPost(item._id, comment._id)}>Delete</Button>}
                                    </div>
                                </div>
                            ))}
                        </CommentsWrapper>
                    </PostWrapper>
                ) : (
                    // Render photo
                    <PostWrapper key={item._id}>
                        <UserContent>
                            <Link to={`/${profileUser?.user.username}`}>
                                <img width="40px" height="40px" src={process.env.PUBLIC_URL + "/user.png"} alt="user" />
                            </Link>
                            <Link to={`/${profileUser?.user.username}`}>
                                <strong>@{profileUser?.user.username}</strong>
                            </Link>
                        </UserContent>
                        <PostContent>
                            <h3>{item.description}</h3>
                            <img src={`http://localhost:5000/uploads/${item.filename}`} alt={item.description} />
                        </PostContent>
                        <span className="text">
                            {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }).format(new Date(item.createdAt))}
                        </span>

                        <CommentsWrapper>
                            <AddCommentForm onSubmit={(e) => addCommentPhoto(item._id, e)}>
                                <Input
                                    type="text"
                                    value={commentInputsPhoto[item._id] || ""}
                                    onChange={(e) =>
                                        setCommentInputsPhoto((prev) => ({
                                            ...prev,
                                            [item._id]: e.target.value,
                                        }))
                                    }
                                    placeholder="Add a comment"
                                />
                                <Button type="submit">
                                    <img className="invert" width="16px" height="16px" src={process.env.PUBLIC_URL + "/send.png"} alt="send" />
                                </Button>
                            </AddCommentForm>
                            {commentsByPhoto[item._id]?.map((comment) => (
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
                                                }).format(new Date(item.createdAt))}
                                            </span>
                                        </div>
                                        <p>{comment.content}</p>
                                        {isAuthenticated && comment.user.username === profileUser?.user.username && <Button onClick={() => deleteCommentPhoto(item._id, comment._id)}>Delete</Button>}
                                    </div>
                                </div>
                            ))}
                        </CommentsWrapper>
                    </PostWrapper>
                )
            )}
        </PostContainer>
    );
};

export default UserProfile;
