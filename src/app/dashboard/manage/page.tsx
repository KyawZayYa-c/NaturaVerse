'use client';
import { useState, useMemo } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useGetAdminImagesQuery, useDeleteImageMutation } from "@/src/lib/api/postApi";
import { useAuthRole } from "@/src/hooks/useAuthRole";
import { Image } from "@/src/lib/types";

import PostInputForm from "@/src/app/dashboard/home/component/PostInputForm";
import ManageTable from "@/src/app/dashboard/manage/component/ManageTable";
import ManageToolbar from "@/src/app/dashboard/manage/component/ManageToobar"; // အစ်ကိုကြီးရဲ့ Form Drawer

export default function ManageGalleryPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortField, setSortField] = useState<"likesCount" | "commentsCount" | "createdAt" | "">("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { user, isAdmin } = useAuthRole();
    const currentUserId = user?.id || "guest";
    const [deleteImage] = useDeleteImageMutation();

    const { data, isLoading: isImagesLoading, isSuccess } = useGetAdminImagesQuery(currentUserId, {
        skip: !isAdmin
    });

    const rawImages = data?.data || [];

     const filteredAndSortedData = useMemo(() => {
        let result = [...rawImages];

        result = result.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        if (sortField) {
            result.sort((a: any, b: any) => {
                let valA = a[sortField] || 0;
                let valB = b[sortField] || 0;

                if (sortField === "createdAt") {
                    return sortOrder === "asc"
                        ? new Date(valA).getTime() - new Date(valB).getTime()
                        : new Date(valB).getTime() - new Date(valA).getTime();
                }
                return sortOrder === "asc" ? valA - valB : valB - valA;
            });
        }
        return result;
    }, [rawImages, searchQuery, selectedCategory, sortField, sortOrder]);

    // 🔲 Row Table Selection Logic
    const handleSelectRow = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSelectAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredAndSortedData.map((item) => item.id || ""));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSort = (field: "likesCount" | "commentsCount" | "createdAt") => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
            try {
                for (const id of selectedIds) {
                    await deleteImage({ id, userId: currentUserId }).unwrap();
                }
                setSelectedIds([]);
                alert("Bulk delete executed successfully!");
            } catch (err) {
                console.error("Bulk Delete Error:", err);
            }
        }
    };

    const handleDeleteSingle = async (id: string, title: string) => {
        if (window.confirm(`Delete "${title}" permanently?`)) {
            try {
                await deleteImage({ id, userId: currentUserId }).unwrap();
                setSelectedIds(prev => prev.filter(item => item !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    // 📝 Open Drawer Form Functions
    const handleOpenAddForm = () => {
        setSelectedImage(null);
        setDrawerOpen(true);
    };

    const handleOpenEditForm = (img: Image) => {
        setSelectedImage(img);
        setDrawerOpen(true);
    };

    if (!isAdmin) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                    Access Denied: Admin Only
                </Typography>
            </Box>
        );
    }


    return (
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 4 }, bgcolor: "#FAFAFA", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>

            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", lg: "center" },
                mb: 4,
                gap: 2,
                width: "100%"
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: "800", color: "#2D6A4F", fontSize: { xs: "20px", sm: "24px" } }}>
                        Manage Gallery (Advanced Data Grid)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                        Perform real-time data filtering, batch operations, and layout optimizations.
                    </Typography>
                </Box>
                <Button
                    variant='contained'
                    sx={{
                        bgcolor: '#2D6A4F',
                        color: 'white',
                        fontWeight: 'bold',
                        px: 4,
                        py: 1,
                        width: { xs: "100%", lg: "auto" }, // 🚀 lg အောက်မှာ screen အပြည့်ဆွဲဆန့်ပေးမယ်
                        '&:hover': { bgcolor: '#1B4332' }
                    }}
                    onClick={handleOpenAddForm}
                >
                    New Post
                </Button>
            </Box>

            {/* 🔍 Toolbar Component */}
            <ManageToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedCount={selectedIds.length}
                onBulkDelete={handleBulkDelete}
            />

            {/* 🔄 Loading Indicator */}
            {isImagesLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <CircularProgress sx={{ color: '#2D6A4F' }} />
                </Box>
            )}

            {/* 📊 Data Grid Table Component (Responsive ဖြစ်အောင် ပြင်ဆင်ပြီး) */}
            {isSuccess && (
                <ManageTable
                    data={filteredAndSortedData}
                    selectedIds={selectedIds}
                    onSelectRow={handleSelectRow}
                    onSelectAllRows={handleSelectAllRows}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    onEdit={handleOpenEditForm}
                    onDelete={handleDeleteSingle}
                />
            )}

            {/* ✍️ Adding / Editing Post Input Drawer Form Component */}
            <PostInputForm
                key={selectedImage ? selectedImage.id : "add-new-table"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                editData={selectedImage}
            />
        </Box>
    );
}