'use client';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { NatureCategories } from "@/src/components/NatureCategories";

type GalleryToolbarProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedCount: number;
    onBulkDelete: () => void;
};

export default function ManageToolbar({
                                          searchQuery,
                                          setSearchQuery,
                                          selectedCategory,
                                          setSelectedCategory,
                                          selectedCount,
                                          onBulkDelete
                                      }: GalleryToolbarProps) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", lg: "center" },
            mb: 3,
            gap: 2,
            bgcolor: "#FFF",
            p: 2,
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.03)",
            width: "100%"
        }}>
            {/* 🔍 Filter Area */}
            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 2,
                flexGrow: 1,
                maxWidth: { xs: "100%", lg: 600 },
                width: "100%"
            }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Search wonder title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
                        },
                    }}
                />

                <FormControl size="small" sx={{ width: "100%", minWidth: { xs: "100%", sm: 180 } }}>
                    <InputLabel id="toolbar-category-select-label">Category</InputLabel>
                    <Select
                        labelId="toolbar-category-select-label"
                        value={selectedCategory}
                        label="Category"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="All">All Categories</MenuItem>
                        {NatureCategories.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {selectedCount > 0 && (
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={onBulkDelete}
                    sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "8px",
                        width: { xs: "100%", lg: "auto" },
                        py: 1,
                        boxShadow: "0px 4px 12px rgba(230, 57, 70, 0.2)"
                    }}
                >
                    Delete Selected ({selectedCount})
                </Button>
            )}
        </Box>
    );
}