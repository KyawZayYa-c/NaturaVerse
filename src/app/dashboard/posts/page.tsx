'use client';
import { Box, Typography, Grid, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useGetAdminImagesQuery } from "@/src/lib/api/postApi";
import { useGetMeQuery } from "@/src/lib/api/authApi";
import ImageCardUI from "@/src/app/dashboard/posts/component/ImgCardUI";
import PostInputForm from "@/src/app/dashboard/home/component/PostInputForm";
import { Image } from "@/src/lib/types";
import { useAuthRole } from "@/src/hooks/useAuthRole";

export default function AdminImagePage(){
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    const { data: userData } = useGetMeQuery(undefined);
    const currentUser = userData?.user || { id: "guest", name: "Guest" };

    const { user, isAdmin, isLoading: isUserLoading } = useAuthRole();

    const currentUserId = user?.id || "guest";

    const { data, isLoading: isImagesLoading, isSuccess } = useGetAdminImagesQuery(currentUserId, {
        skip: !isAdmin // 👑No Admin API skip
    });

    const images = data?.data || [];

    const handleOpenAddForm = () => {
        setSelectedImage(null);
        setDrawerOpen(true);
    };



    if (!isAdmin) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                    Access Denied: Admin Only 👑
                </Typography>
            </Box>
        );
    }

    return(
        <Box sx={{ width: '100%', p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button variant='contained'
                        sx={{ bgcolor: '#2D6A4F', color: 'white', fontWeight: 'bold', px: 3, py: 1 }}
                        onClick={handleOpenAddForm}>
                    New
                </Button>
            </Box>

            {isImagesLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, width: '100%' }}>
                    <CircularProgress />
                </Box>
            )}

            {isSuccess && userData?.user && (
                <Grid container spacing={2} sx={{ py: 3, width: '100%', m: 0 }}>
                    {images.map((img: Image) => (
                        <ImageCardUI
                            key={img.id}
                            img={img}
                            user={{ id: currentUser.id, name: currentUser.name }}
                        />
                    ))}
                </Grid>
            )}

            <PostInputForm
                key={selectedImage ? selectedImage.id : "add-new"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                editData={selectedImage}
            />
        </Box>
    );
}