import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

interface Photo {
    _id: string;
    description: string;
    filename: string;
    user: {
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

const PhotoContainer = styled.article`
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

const PhotoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem 1.5rem;
`;

const UserContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const PhotoContent = styled.div`
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

const PhotoGallery = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [commentsByPhoto, setCommentsByPhoto] = useState<Record<string, Comment[]>>({});
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

    const addComment = async (photoId: string, e: React.FormEvent) => {
        e.preventDefault();

        const content = commentInputs[photoId]?.trim();
        if (!content) return;

        try {
            await api.post(`/photos/${photoId}/comments`, { content });

            const { data: updatedComments } = await api.get(`/photos/${photoId}/comments`);
            setCommentsByPhoto((prev) => ({
                ...prev,
                [photoId]: updatedComments,
            }));

            setCommentInputs((prev) => ({
                ...prev,
                [photoId]: "",
            }));
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    useEffect(() => {
        const fetchPhotosAndComments = async () => {
            try {
                const { data: photos } = await api.get("/photos");
                setPhotos(photos);

                const commentsPromises = photos.map((photo: Photo) => api.get(`/photos/${photo._id}/comments`));
                const commentsResponses = await Promise.all(commentsPromises);

                const commentsData: Record<string, Comment[]> = {};
                commentsResponses.forEach((response, index) => {
                    commentsData[photos[index]._id] = response.data;
                });

                setCommentsByPhoto(commentsData);
            } catch (error) {
                console.error("Error fetching photos or comments:", error);
            }
        };
        fetchPhotosAndComments();
    }, []);

    return (
        <PhotoContainer>
            {photos.map((photo) => (
                <PhotoWrapper key={photo._id}>
                    <UserContent>
                        <img width="40px" height="40px" src={process.env.PUBLIC_URL + "/user.png"} alt="user" />
                        <strong>@{photo.user.username}</strong>
                    </UserContent>
                    <PhotoContent>
                        <h3>{photo.description}</h3>
                        <img src={`http://localhost:5000/uploads/${photo.filename}`} alt={photo.description} />
                    </PhotoContent>
                    <span className="text">
                        {new Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }).format(new Date(photo.createdAt))}
                    </span>

                    <CommentsWrapper>
                        <AddCommentForm onSubmit={(e) => addComment(photo._id, e)}>
                            <Input
                                type="text"
                                value={commentInputs[photo._id] || ""}
                                onChange={(e) =>
                                    setCommentInputs((prev) => ({
                                        ...prev,
                                        [photo._id]: e.target.value,
                                    }))
                                }
                                placeholder="Add a comment"
                            />
                            <Button type="submit">
                                <img className="invert" width="16px" height="16px" src={process.env.PUBLIC_URL + "/send.png"} alt="send" />
                            </Button>
                        </AddCommentForm>
                        {commentsByPhoto[photo._id]?.map((comment) => (
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
                                            }).format(new Date(photo.createdAt))}
                                        </span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </CommentsWrapper>
                </PhotoWrapper>
            ))}
        </PhotoContainer>
    );
};

export default PhotoGallery;
