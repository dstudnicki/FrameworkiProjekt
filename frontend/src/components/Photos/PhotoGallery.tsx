import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";

const GalleryContainer = styled.div`
  padding: 2rem;
`;

interface Photo {
    _id: string;
    description: string;
    filename: string;
    user: {
        email: string;
        username: string;
    };
}

const PhotoGrid = styled.div`
  display: flex;
  flex-direction: column;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;

  img {
    max-width: 450px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const PhotoGallery = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    console.log(photos);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const { data } = await api.get("/photos");
                setPhotos(data);
            } catch (error) {
                console.error("Failed to fetch photos:", error);
            }
        };
        fetchPhotos();
    }, []);

    return (
        <GalleryContainer>
            <h2>Photo Gallery</h2>
            <PhotoGrid>
                {photos.map((photo) => (
                    <>
                        <h1>Created by:{photo.user.username}</h1>
                        <p>Photo description: {photo.description}</p>
                        <img key={photo._id} src={`http://localhost:5000/uploads/${photo.filename}`} alt={photo.description} />
                    </>
                ))}
            </PhotoGrid>
        </GalleryContainer>
    );
};

export default PhotoGallery;
