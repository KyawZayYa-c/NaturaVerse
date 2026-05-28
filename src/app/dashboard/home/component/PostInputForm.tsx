'use client';
import '../../../globals.css';
import { Drawer, Button, Box, Typography, TextField, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput, ImageSchema } from "@/src/lib/schema/ImageSchema";
import { useUpdateImageMutation, useUploadImageMutation } from "@/src/lib/api/postApi";
import { useState, useEffect } from "react";
import CloudinaryImageUpload from "@/src/components/CloudinaryImageUpload";
import CategorySelect from "@/src/components/CategorySelect";
import { Image } from "@/src/lib/types";

type MovieInputProps = {
    open: boolean;
    onClose: () => void;
    editData?: Image | null;
}

export default function PostInputForm({ open, onClose, editData }: MovieInputProps) {
    const [uploadImage, { isLoading }] = useUploadImageMutation();
    const [updateImage, { isLoading: isUpdating }] = useUpdateImageMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<FormInput>({
        resolver: zodResolver(ImageSchema),
        defaultValues: {
            title: editData ? editData.title : "",
            category: editData ? editData.category : "",
            description: editData ? editData.description || "" : "",
            imageUrl: editData ? editData.imageUrl : "",
        }
    });

    const currentCategory = watch("category");

    useEffect(() => {
        if (editData) {
            reset({
                title: editData.title,
                category: editData.category,
                description: editData.description || "",
                imageUrl: editData.imageUrl,
            });
            setUploadedImageUrl(editData.imageUrl);
        } else {
            reset({ title: "", category: "", description: "", imageUrl: "" });
            setUploadedImageUrl('');
        }
    }, [editData, reset]);

    useEffect(() => {
        if (uploadedImageUrl) {
            setValue("imageUrl", uploadedImageUrl, { shouldValidate: true });
        }
    }, [uploadedImageUrl, setValue]);

    const onSubmit = async (data: FormInput) => {
        try {
            if (editData && editData.id) {
                await updateImage({ ...editData, ...data }).unwrap();
            } else {
                await uploadImage(data).unwrap();
            }
            reset();
            setImageFile(null);
            setUploadedImageUrl('');
            onClose();
        } catch (err) {
            console.error("Save failed:", err);
            alert("Error saving data");
        }
    };

    return (
        <Drawer
            anchor={"right"}
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: '270px', sm: '340px' },
                        backgroundColor: 'rgba(255,255,255,0.98)',
                        color: 'white',
                        p: 0,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    },
                }
            }}
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>

                <Typography variant='h5' sx={{ borderBottom: '1px solid #AAA2A2FF', color: 'black', pb: 1, fontWeight: 'bold' }}>
                    {editData ? "Edit Post" : "Add New Post"}
                </Typography>

                <Stack spacing={2.5} sx={{ my: 3, flexGrow: 1 }}>

                    <TextField
                        {...register("title")}
                        label="Title" variant="filled" fullWidth
                        error={!!errors.title} helperText={errors.title?.message}
                        sx={{ bgcolor: '#FFFFFF', borderRadius: '4px' }}
                    />

                     <CategorySelect
                        value={currentCategory}
                        onChange={(val) => setValue("category", val, { shouldValidate: true })}
                        error={!!errors.category}
                        helperText={errors.category?.message}
                    />

                    <Box sx={{ bgcolor: '#FFFFFF', p: 1, borderRadius: '4px', color: '#000000' }}>
                        <CloudinaryImageUpload
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            imageLoadingState={imageLoadingState}
                            setImageLoadingState={setImageLoadingState}
                            setUploadedImageUrl={setUploadedImageUrl}
                        />
                        {errors.imageUrl && (
                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, px: 1, fontWeight: 'bold' }}>
                                {errors.imageUrl.message}
                            </Typography>
                        )}
                    </Box>

                    <TextField
                        {...register("description")}
                        label="Description" variant="filled" multiline rows={3} fullWidth
                        error={!!errors.description} helperText={errors.description?.message}
                        sx={{ bgcolor: '#FFFFFF', borderRadius: '4px' }}
                    />

                </Stack>

                <Button
                    type="submit"
                    variant='contained'
                    disabled={isLoading || isUpdating || imageLoadingState}
                    sx={{
                        bgcolor: '#2D6A4F',
                        color: 'white',
                        fontWeight: 'bold',
                        py: 1.5,
                        '&:hover': { bgcolor: '#1B4332' }
                    }}
                    fullWidth
                >
                    {isLoading || isUpdating ? "Saving..." : (editData ? "Update" : "Save")}
                </Button>
            </Box>
        </Drawer>
    );
}