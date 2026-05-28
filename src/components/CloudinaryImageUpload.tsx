'use client';
import axios from 'axios';
import { InputLabel, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { useRef } from 'react';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import ClearIcon from '@mui/icons-material/Clear';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';

export interface CloudinaryImageUploadProps {
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    imageLoadingState: boolean;
    setImageLoadingState: (loading: boolean) => void;
    setUploadedImageUrl: (url: string) => void;
}

export default function CloudinaryImageUpload({
                                                  imageFile,
                                                  setImageFile,
                                                  imageLoadingState,
                                                  setImageLoadingState,
                                                  setUploadedImageUrl
                                              }: CloudinaryImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setImageFile(selectedFile);
            await uploadImageToCloudinary(selectedFile);
        }
    };

    async function uploadImageToCloudinary(file: File) {
        setImageLoadingState(true);
        try {
            const signResponse = await axios.post('/api/cloudinary-sign');
            const { signature, timestamp } = signResponse.data;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!); // 👈 .env မှ ယူသုံးခြင်း
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );

            if (response?.data?.secure_url) {
                console.log('cloudinary : => ', response.data.secure_url)
                setUploadedImageUrl(response.data.secure_url);
            }
        } catch (err) {
            console.log("CloudinaryImageUpload failed:", err);
            alert("Error uploading image on cloudinary");
        } finally {
            setImageLoadingState(false);
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null);
        setUploadedImageUrl("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <Box sx={{ width: '100%' }}>
            <InputLabel sx={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Upload Image
            </InputLabel>

            <Box sx={{ border: '2px dashed #CBD5E1', borderRadius: '8px', padding: '16px', textAlign: 'center', bgcolor: '#F8FAFC' }}>
                <input
                    type="file"
                    id="image-upload"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                />

                {!imageFile ? (
                    <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <CloudCircleIcon sx={{ fontSize: 48, color: '#64748B' }} />
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                            Click to upload image
                        </Typography>
                    </label>
                ) : (
                    imageLoadingState ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 1 }}>
                            <CircularProgress size={20} sx={{ color: '#64748B' }} />
                            <Typography variant="body2" sx={{ color: '#64748B' }}>Uploading to Cloudinary... ⏳</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                            <AddToPhotosIcon sx={{ fontSize: 24, color: '#2D6A4F' }} />
                            <Typography variant="body2" sx={{ flexGrow: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'left', px: 1, color: '#334155' }}>
                                {imageFile.name}
                            </Typography>
                            <IconButton onClick={handleRemoveImage} size="small" sx={{ color: '#EF4444' }}>
                                <ClearIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Box>
                    )
                )}
            </Box>
        </Box>
    );
}