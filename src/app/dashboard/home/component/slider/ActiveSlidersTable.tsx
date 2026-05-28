'use client';
import { useState } from "react";
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useGetSlidersQuery, useDeleteSliderMutation, useUpdateSliderMutation } from "@/src/lib/api/sliderApi"; // 🎯 useUpdateSliderMutation ပါဝင်လာပါပြီ

export default function ActiveSlidersTable() {
    const { data, isLoading, isError } = useGetSlidersQuery(undefined);
    const [deleteSlider] = useDeleteSliderMutation();
    const [updateSlider, { isLoading: isUpdating }] = useUpdateSliderMutation();

    const [editId, setEditId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const handleDeleteSlider = async (id: number) => {
        if (confirm("Are you sure you want to delete this slider image completely? 🗑️")) {
            try {
                await deleteSlider(id).unwrap();
                alert("Slider Banner Deleted Successfully!");
            } catch (error: any) {
                alert(error?.data?.message || "Error deleting slider");
            }
        }
    };

    const handleUpdateSlider = async (id: number) => {
        if (!editTitle.trim()) return alert("Title cannot be empty!");
        try {
            await updateSlider({ id, title: editTitle }).unwrap();
            setEditId(null);
        } catch (error: any) {
            alert(error?.data?.message || "Error updating slider");
        }
    };

    const carouselImages = data?.data || [];

    if (isLoading) {
        return (
            <Card sx={{ boxShadow: "none", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px", p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={30} sx={{ color: '#2D6A4F', mr: 2 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Loading active banners...</Typography>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card sx={{ boxShadow: "none", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px", p: 3, bgcolor: '#FFF5F5' }}>
                <Typography variant="body2" sx={{ color: '#E50202', textAlign: 'center' }}>Error loading sliders data from server.</Typography>
            </Card>
        );
    }

    return (
        <Card sx={{ boxShadow: "none", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px", p: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, color: "#1A1C1E" }}>
                Active Home Banners ({carouselImages.length})
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #F0F0F0', borderRadius: '12px' }}>
                <Table aria-label="carousel table">
                    <TableHead sx={{ bgcolor: '#F8F9FA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Preview</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date Added</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {carouselImages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    No active sliders found. Create one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            carouselImages.map((row: any) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box
                                            component="img"
                                            src={row.image_url}
                                            alt={row.title}
                                            sx={{ width: 70, height: 45, borderRadius: '6px', objectFit: 'cover' }}
                                        />
                                    </TableCell>

                                     <TableCell sx={{ fontWeight: '500' }}>
                                        {editId === row.id ? (
                                            <TextField
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                size="small"
                                                fullWidth
                                                variant="standard"
                                                autoFocus
                                            />
                                        ) : (
                                            row.title
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ color: 'text.secondary', width:"30%", fontSize: '13px' }}>
                                        {new Date(row.created_at).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {editId === row.id ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                <IconButton onClick={() => handleUpdateSlider(row.id)} disabled={isUpdating} size="small" sx={{ color: '#2D6A4F' }}>
                                                    <CheckIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => setEditId(null)} size="small" sx={{ color: 'text.secondary' }}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                               <IconButton
                                                    onClick={() => { setEditId(row.id); setEditTitle(row.title); }}
                                                    size="small"
                                                    sx={{ color: '#1A73E8', '&:hover': { bgcolor: 'rgba(26,115,232,0.08)' } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteSlider(row.id)}
                                                    size="small"
                                                    sx={{ color: '#E50202', '&:hover': { bgcolor: 'rgba(229,2,2,0.08)' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}