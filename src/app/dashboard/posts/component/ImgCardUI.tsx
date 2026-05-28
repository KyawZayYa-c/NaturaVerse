'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Card, Grid, CardContent, Typography, Checkbox, TextField, Collapse, CircularProgress } from "@mui/material";
import { CardMedia } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { Image } from "@/src/lib/types";
import { useAuthRole } from "@/src/hooks/useAuthRole";
import {
    useToggleLikeMutation,
    useAddCommentMutation,
    useGetCommentsQuery
} from "@/src/lib/api/postApi";

type ImageCardUIProps = {
    img: Image;
    user?: { id: string; name: string };
}

export default function ImageCardUI({ img }: ImageCardUIProps) {
    const router = useRouter();
    const [toggleLike] = useToggleLikeMutation();
    const [addComment] = useAddCommentMutation();
    const [commentText, setCommentText] = useState("");
    const [expanded, setExpanded] = useState(false);

    const { user, isGuest } = useAuthRole();

    const currentUserId = user?.id || "guest";
    const currentUserName = user?.name || "Guest";

     const { data: commentData, isLoading: isCommentsLoading } = useGetCommentsQuery(
        img.id || "",
        { skip: !img.id || !expanded }
    );

    const activeComments = commentData?.comments || [];

    const isLiked = img.isLikedByUser || false;
    const likesCount = img.likesCount || 0;

    const handleLikeToggle = async () => {
        if (!img.id) return;

        if (isGuest) {
            alert("can you give a like please login 🔒");
            router.push("/auth/login");
            return;
        }

        try {
            await toggleLike({
                imageId: img.id,
                userId: currentUserId,
                userName: currentUserName
            }).unwrap();
        } catch (err) {
            alert("Something went wrong with the connection!");
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!img.id || !commentText.trim()) return;

        if (isGuest) {
            router.push("/auth/login");
            return;
        }

        try {
            await addComment({
                imageId: img.id,
                userName: currentUserName,
                text: commentText
            }).unwrap();
            setCommentText("");
            setExpanded(true);
        } catch (err) {
            console.error("Comment error:", err);
        }
    };

    return (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
            <Card sx={{ borderRadius: '16px', position: 'relative', overflow: 'hidden', backgroundColor: '#FFFFFF', boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}>

                <CardMedia
                    component="img"
                    image={img.imageUrl}
                    alt={img.title}
                    sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover', backgroundColor: '#F8F9FA' }}
                />

                <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" sx={{ color: '#2D6A4F', fontWeight: 'bold' }}>
                        {img.category}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5, color: '#000' }}>
                        {img.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                        {img.description}
                    </Typography>

                    <hr style={{ border: '0.5px solid #F0F0F0', margin: '8px 0' }} />

                    {/* 💖 LIKE & 💬 COMMENT COUNTER SECTION */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Checkbox
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                checked={Boolean(isLiked)}
                                onChange={handleLikeToggle}
                                sx={{
                                    color: '#6C757D',
                                    '&.Mui-checked': { color: '#E63946' },
                                    '& .MuiSvgIcon-root': { fontSize: 28 }
                                }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: '600', color: '#000' }}>
                                {likesCount} likes
                            </Typography>
                        </Box>

                       <IconButton
                            onClick={() => setExpanded(!expanded)}
                            size="small"
                            sx={{ display: 'flex', gap: 0.5, borderRadius: '8px', px: 1, color: '#6C757D' }}
                        >
                            <SmsOutlinedIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: '600' }}>
                                {expanded ? (activeComments.length || 0) : (img.commentsCount || 0)} Comments
                            </Typography>
                        </IconButton>
                    </Box>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ maxHeight: '150px', overflowY: 'auto', mb: 2, bgcolor: '#F8F9FA', p: 1.5, borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                            {isCommentsLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={20} /></Box>
                            ) : activeComments.length > 0 ? (
                                activeComments.map((cmt: any, idx: number) => (
                                    <Box key={cmt.id || idx} sx={{ mb: 1, fontSize: '13px', borderBottom: '1px dashed #F0F0F0', pb: 0.5 }}>
                                        <strong style={{ color: '#2D6A4F' }}>{cmt.user_name || cmt.userName || "User"}: </strong>
                                        <span style={{ color: '#333' }}>{cmt.text}</span>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    No comments yet...
                                </Typography>
                            )}
                        </Box>
                    </Collapse>

                    {/* ✍️ COMMENT INPUT BOX */}
                    <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder={isGuest ? "Login inside NaturaVerse to comment...🔒" : "Write a comment..."}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    backgroundColor: '#FFF'
                                }
                            }}
                        />
                        <IconButton
                            type="submit"
                            color="primary"
                            sx={{
                                bgcolor: '#2D6A4F',
                                color: '#FFF',
                                '&:hover': { bgcolor: '#1B4332' }
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>

                </CardContent>
            </Card>
        </Grid>
    );
}