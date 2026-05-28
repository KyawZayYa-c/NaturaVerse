'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
    Avatar,
    Tooltip,
    Box,
    Typography,
    Card
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Image } from "@/src/lib/types";

type GalleryTableProps = {
    data: Image[];
    selectedIds: string[];
    onSelectRow: (id: string) => void;
    onSelectAllRows: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sortField: string;
    sortOrder: "asc" | "desc";
    onSort: (field: "likesCount" | "commentsCount" | "createdAt") => void;
    onEdit: (img: Image) => void;
    onDelete: (id: string, title: string) => void;
};

export default function ManageTable({
                                        data,
                                        selectedIds,
                                        onSelectRow,
                                        onSelectAllRows,
                                        sortField,
                                        sortOrder,
                                        onSort,
                                        onEdit,
                                        onDelete
                                    }: GalleryTableProps) {

    const renderSortIcon = (field: "likesCount" | "commentsCount" | "createdAt") => {
        if (sortField !== field) return null;
        return sortOrder === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    };

    if (data.length === 0) {
        return (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: "14px", border: "1px solid #F0F0F0", boxShadow: "none" }}>
                <Typography color="text.secondary">No wonders found matching your criteria.</Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>

            <Box sx={{ display: { xs: "flex", lg: "none" }, flexDirection: "column", gap: 2, width: "100%" }}>
                {data.map((row) => {
                    const isItemSelected = selectedIds.includes(row.id || "");

                    const isLiked = row.isLikedByUser === true;
                    const likesCount = row.likesCount || 0;
                    const commentsCount = row.commentsCount || 0;

                    return (
                        <Card
                            key={row.id}
                            sx={{
                                p: 2,
                                borderRadius: "12px",
                                border: isItemSelected ? "1px solid #2D6A4F" : "1px solid #E2E8F0",
                                bgcolor: isItemSelected ? "rgba(45, 106, 79, 0.01)" : "#FFF",
                                boxShadow: "0px 2px 8px rgba(0,0,0,0.02)",
                                position: "relative"
                            }}
                        >
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                <Checkbox
                                    checked={isItemSelected}
                                    onChange={() => onSelectRow(row.id || "")}
                                    sx={{ p: 0, color: "#2D6A4F", "&.Mui-checked": { color: "#2D6A4F" } }}
                                />
                                <Avatar src={row.imageUrl} variant="rounded" sx={{ width: 50, height: 50, border: "1px solid #E2E8F0" }} />

                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: "700", color: "#1A1C1E", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {row.title}
                                    </Typography>
                                    <Box sx={{ mt: 0.5, px: 1, py: 0.2, bgcolor: "#F1F5F9", color: "#475569", borderRadius: "4px", display: "inline-block", fontSize: "11px", fontWeight: "600" }}>
                                        {row.category}
                                    </Box>
                                </Box>
                            </Box>

                            <hr style={{ border: "0", borderTop: "1px solid #F1F5F9", margin: "12px 0" }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                     <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: likesCount > 0 ? "#1A1C1E" : "#6C757D", fontSize: "12px", fontWeight: "600" }}>
                                        {isLiked ? (
                                            <FavoriteIcon sx={{ color: "#E63946", fontSize: "16px" }} />
                                        ) : (
                                            <FavoriteBorderIcon sx={{ color: "#6C757D", fontSize: "16px" }} />
                                        )}
                                        {likesCount}
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: commentsCount > 0 ? "#1A1C1E" : "#6C757D", fontSize: "12px", fontWeight: "600" }}>
                                        <CommentIcon sx={{ color: "#6C757D", fontSize: "16px" }} /> {commentsCount}
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", fontSize: "11px" }}>
                                        <CalendarMonthIcon sx={{ fontSize: "15px" }} /> {row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                    <IconButton size="small" sx={{ color: "#2D6A4F", bgcolor: "rgba(45, 106, 79, 0.05)" }} onClick={() => onEdit(row)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" sx={{ color: "#E63946", bgcolor: "rgba(230, 57, 70, 0.05)" }} onClick={() => onDelete(row.id || "", row.title)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Card>
                    );
                })}
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    display: { xs: "none", lg: "block" },
                    borderRadius: "14px",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
                    border: "1px solid #F0F0F0",
                    width: "100%",
                    overflowX: "auto"
                }}
            >
                <Table sx={{ minWidth: 750 }}>
                    <TableHead sx={{ bgcolor: "rgba(45, 106, 79, 0.05)" }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    onChange={onSelectAllRows}
                                    sx={{ color: "#2D6A4F", "&.Mui-checked": { color: "#2D6A4F" } }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: "700", color: "#2D6A4F" }}>Preview</TableCell>
                            <TableCell sx={{ fontWeight: "700", color: "#2D6A4F" }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: "700", color: "#2D6A4F" }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: "700", color: "#2D6A4F", cursor: "pointer" }} onClick={() => onSort("likesCount")}>Total Likes {renderSortIcon("likesCount")}</TableCell>
                            <TableCell sx={{ fontWeight: "700", color: "#2D6A4F", cursor: "pointer" }} onClick={() => onSort("commentsCount")}>Total Comments {renderSortIcon("commentsCount")}</TableCell>
                            <TableCell sx={{ fontWeight: "700", color: "#2D6A4F", cursor: "pointer" }} onClick={() => onSort("createdAt")}>Date Added {renderSortIcon("createdAt")}</TableCell>
                            <TableCell sx={{ fontWeight: "700", color: "#2D6A4F", textAlign: "center" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                            const isItemSelected = selectedIds.includes(row.id || "");
                            return (
                                <TableRow key={row.id} hover selected={isItemSelected}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isItemSelected} onChange={() => onSelectRow(row.id || "")} />
                                    </TableCell>
                                    <TableCell><Avatar src={row.imageUrl} variant="rounded" sx={{ width: 45, height: 45 }} /></TableCell>
                                    <TableCell sx={{ fontWeight: "600", color: "#1A1C1E" }}>{row.title}</TableCell>
                                    <TableCell>
                                        <Box sx={{ px: 1.5, py: 0.4, bgcolor: "#F1F5F9", color: "#475569", borderRadius: "6px", display: "inline-block", fontSize: "12px", fontWeight: "600" }}>
                                            {row.category}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "700" }}>{row.likesCount || 0}</TableCell>
                                    <TableCell sx={{ fontWeight: "700" }}>{row.commentsCount || 0}</TableCell>
                                    <TableCell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                                            <IconButton size="small" sx={{ color: "#2D6A4F" }} onClick={() => onEdit(row)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" sx={{ color: "#E63946" }} onClick={() => onDelete(row.id || "", row.title)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}