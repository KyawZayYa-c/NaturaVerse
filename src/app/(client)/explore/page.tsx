'use client';
import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetAdminImagesQuery } from "@/src/lib/api/postApi";
import ImageCardUI from "@/src/app/dashboard/posts/component/ImgCardUI";
import CategoryBar from "./component/CategoryBar"
import { Image } from "@/src/lib/types";

export default function ExplorePage() {
    const [selectedCategory, setSelectedCategory] = useState("");

    const { data, isLoading, isSuccess } = useGetAdminImagesQuery("");

    const allImages = data?.data || [];
    const imagesGroupByCategoryCount = allImages.reduce((acc: Record<string, number>, img: Image) => {
        if (img.category) {
            acc[img.category] = (acc[img.category] || 0) + 1;
        }
        return acc;
    }, {});

    const filteredImages = selectedCategory
        ? allImages.filter((img: Image) => img.category === selectedCategory)
        : allImages;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ position: 'sticky', top: '69px', zIndex: 40, mb: 2 }}>
                <CategoryBar
                    selectedCategory={selectedCategory}
                    onCategoryChange={(cat) => setSelectedCategory(cat)}
                />
            </Box>

            <Box sx={{ p: 2 }}>
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, width: '100%' }}>
                        <CircularProgress sx={{ color: '#2D6A4F' }} />
                    </Box>
                )}

                {isSuccess && (
                    <>
                        <Typography variant="body2" sx={{ color: 'gray', mb: 2, fontWeight: '500', px: 1 }}>
                            {selectedCategory
                                ? `Found ${filteredImages.length} images in "${selectedCategory}" 🌿`
                                : `Showing all ${allImages.length} nature wonders ✨`
                            }
                        </Typography>
                        {filteredImages.length === 0 && (
                            <Typography variant="body1" sx={{ textAlign: 'center', color: 'gray', my: 10, fontWeight: '500' }}>
                                No images found in this category yet. 🏜/
                            </Typography>
                        )}
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            py: 3,
                            width: '100%'
                        }}>
                            {filteredImages.map((img: Image) => (
                                <Box
                                    key={img.id}
                                    sx={{

                                        width: {
                                            xs: '100%',
                                            sm: 'calc(50% - 16px)',
                                            md: 'calc(33.33% - 16px)',
                                            lg: 'calc(25% - 16px)'
                                        },
                                        '& > div': { width: '100% !important', maxWidth: '100% !important', flexBasis: '100% !important' }
                                    }}
                                >
                                    <ImageCardUI
                                        img={img}
                                        user={{ id: "guest", name: "Guest" }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}