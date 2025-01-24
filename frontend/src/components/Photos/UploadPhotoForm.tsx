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

const UploadPhotoForm = () => {
    const [description, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select a file.");

        const formData = new FormData();
        formData.append("description", description);
        formData.append("photo", file);

        try {
            await api.post("/photos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Photo uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload photo:", error);
        }
    };

    return (
        <FormContainer>
            <h2>Upload Photo</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Photo:</label>
                    <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                </div>
                <button type="submit">Upload</button>
            </form>
        </FormContainer>
    );
};

export default UploadPhotoForm;
