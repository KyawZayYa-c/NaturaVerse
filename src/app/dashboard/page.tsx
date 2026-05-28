'use client';
import { Box, Grid, Typography } from "@mui/material";

import UserStatsCard from "@/src/app/dashboard/home/component/UserStatsCard";
import WonderStatsCard from "@/src/app/dashboard/home/component/WonderStatsCard";
import LikeStatsCard from "@/src/app/dashboard/home/component/LikeStatsCard";
import CommentStatsCard from "@/src/app/dashboard/home/component/CommentStatsCard";
import SliderSection from "@/src/app/dashboard/home/component/slider/SliderSection";

export default function DashboardOverview() {
    return (
        <Box sx={{
            p: { xs: 2, md: 4 },
            maxWidth: "100vw",
            mx: "auto",
            overflowX: "hidden"
        }}>

            {/* 📋 WELCOME & TITLES */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D6A4F" }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    Welcome back, Admin! Here is what's happening on NaturaVerse today.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 5, display: "flex", justifyContent: "space-between" }}>
                {/* 👥 Real User Card */}
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <UserStatsCard />
                </Grid>

                {/* 🖼️ Real Wonder Card */}
                <Grid size={{  xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <WonderStatsCard />
                </Grid>

                {/* ❤️ Real Like Card */}
                <Grid size={{  xs: 12, sm: 6, md: 6, lg: 3}}>
                    <LikeStatsCard />
                </Grid>

                {/* 💬 Real Comment Count Card */}
                <Grid size={{ xs: 12, sm: 6, md:6, lg: 3}}>
                    <CommentStatsCard />
                </Grid>
            </Grid>

            <SliderSection />

        </Box>
    );
}