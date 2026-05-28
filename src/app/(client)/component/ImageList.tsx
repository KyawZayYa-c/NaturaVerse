'use client';
import { Box, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useGetImagesQuery } from "@/src/lib/api/postApi";
import ImageCardUI from "@/src/app/dashboard/posts/component/ImgCardUI";
import InfiniteScroll from "react-infinite-scroll-component";
import { Image } from "@/src/lib/types";
import { useGetMeQuery } from "@/src/lib/api/authApi";

export default function ImageList() {
    const [page, setPage] = useState(1);
    const limit = 8;

    const { data: userData } = useGetMeQuery(undefined);
    const currentUser = userData?.user || { id: "guest", name: "Guest" };

    const { data, isLoading, isSuccess } = useGetImagesQuery({
        page,
        limit,
        userId: currentUser.id
    });

    const images = data?.data || [];
    const meta = data?.meta;
    const hasMore = images.length < (meta?.totalCount || 0);

    const fetchNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <Box sx={{ width: '100%', p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {isLoading && page === 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, width: '100%' }}>
                    <CircularProgress />
                </Box>
            )}

            {/* 🎯 Infinite Scroll Component */}
            {isSuccess && (
                <InfiniteScroll
                    dataLength={images.length}
                    next={fetchNextPage}
                    hasMore={hasMore}
                    scrollThreshold={0.9}
                    loader={
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, width: '100%' }}>
                            <CircularProgress size={30} sx={{ color: '#2D6A4F' }} />
                        </Box>
                    }
                    endMessage={
                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'gray', my: 4, fontWeight: '500' }}>
                            No more images to show. You have reached the end! 🏁
                        </Typography>
                    }
                >

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        py: 3,
                        width: '100%'
                    }}>
                        {images.map((img: Image) => (
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
                                    user={{ id: currentUser.id, name: currentUser.name }}
                                />
                            </Box>
                        ))}
                    </Box>
                </InfiniteScroll>
            )}
        </Box>
    );
}