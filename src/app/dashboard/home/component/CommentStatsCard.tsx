'use client';
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { useGetCommentsCountQuery } from "@/src/lib/api/postApi";

export default function CommentStatsCard() {
    const { data, isLoading, error } = useGetCommentsCountQuery(undefined);

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
                        Total Comments
                    </Typography>

                    {isLoading ? (
                        <CircularProgress size={24} sx={{ mt: 1, color: '#FBBC05' }} />
                    ) : error ? (
                        <Typography variant="h4" sx={{ fontWeight: "700", mt: 1, color: "#1A1C1E" }}>0</Typography>
                    ) : (
                        <Typography variant="h4" sx={{ fontWeight: "700", mt: 1, color: "#1A1C1E" }}>
                            {data?.totalComments.toLocaleString() ?? 0}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(251, 188, 5, 0.08)', borderRadius: "12px", display: "flex", alignItems: "center" }}>
                    <CommentIcon sx={{ fontSize: 40, color: '#FBBC05' }} />
                </Box>
            </CardContent>
        </Card>
    );
}