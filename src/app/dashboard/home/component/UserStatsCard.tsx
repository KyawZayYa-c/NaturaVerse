'use client';
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useGetAllUsersCountQuery } from "@/src/lib/api/authApi";

export default function UserStatsCard() {
    const { data, isLoading, error } = useGetAllUsersCountQuery(undefined);

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
                        Total Users
                    </Typography>

                    {isLoading ? (
                        <CircularProgress size={24} sx={{ mt: 1, color: '#1A73E8' }} />
                    ) : error ? (
                        <Typography variant="h4" sx={{ fontWeight: "700", mt: 1, color: "#1A1C1E" }}>0</Typography>
                    ) : (
                        <Typography variant="h4" sx={{ fontWeight: "700", mt: 1, color: "#1A1C1E" }}>
                            {data?.totalUsers.toLocaleString()}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ p: 1.5, bgcolor: 'rgba(26, 115, 232, 0.08)', borderRadius: "12px", display: "flex", alignItems: "center" }}>
                    <PeopleIcon sx={{ fontSize: 40, color: '#1A73E8' }} />
                </Box>
            </CardContent>
        </Card>
    );
}