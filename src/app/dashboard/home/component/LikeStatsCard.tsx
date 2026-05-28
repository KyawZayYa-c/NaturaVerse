'use client';
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useGetLikesCountQuery } from "@/src/lib/api/postApi";

export default function LikeStatsCard() {
    const { data, isLoading, error } = useGetLikesCountQuery(undefined);

    return (
        <Card sx={{
            boxShadow: "none",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "16px",
            transition: "transform 0.2s",
            '&:hover': { transform: "translateY(-4px)" }
        }}>
            <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Total Likes
                    </Typography>

                    {isLoading ? (
                        <CircularProgress size={24} sx={{ mt: 1, color: '#E50202' }} />
                    ) : error ? (
                        <Typography variant="h4" sx={{ fontWeight: "700", mt: 1, color: "#1A1C1E" }}>0</Typography>
                    ) : (
                        <Typography variant="h4" sx={{ fontWeight: "700", mt: 1, color: "#1A1C1E" }}>
                            {data?.totalLikes.toLocaleString() ?? 0}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(229, 2, 2, 0.06)', borderRadius: "12px", display: "flex", alignItems: "center" }}>
                    <FavoriteIcon sx={{ fontSize: 40, color: '#E50202' }} />
                </Box>
            </CardContent>
        </Card>
    );
}