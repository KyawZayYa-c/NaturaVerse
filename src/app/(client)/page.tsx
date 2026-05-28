'use client';
import dynamic from "next/dynamic";
import { Box, CircularProgress } from "@mui/material";
const HeroSlider = dynamic(
    () => import("@/src/app/(client)/component/HeroSlider"),
    { ssr: false }
);

const ImageListWithInfiniteScroll = dynamic(
    () => import("@/src/app/(client)/component/ImageList"),
    {
        ssr: false,
        loading: () => (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, width: '100%' }}>
                <CircularProgress sx={{ color: '#2D6A4F' }} />
            </Box>
        )
    }
);

export default function ClientHomePage() {
    return (
        <Box sx={{ width: '100%' }}>
            <HeroSlider />
             <ImageListWithInfiniteScroll />
        </Box>
    );
}