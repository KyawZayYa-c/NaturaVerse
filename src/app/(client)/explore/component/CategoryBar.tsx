'use client';
import { Box, Chip } from "@mui/material";
export const NatureCategories = [
    { value: "", label: "All" },
    { value: "Sky", label: "Sky" },
    { value: "Sea", label: "Sea" },
    { value: "Mountain", label: "Mountain" },
    { value: "Rain", label: "Raining" },
    { value: "Cold", label: "Cold & Snow" },
    { value: "Hot", label: "Hot & Sunny" },
    { value: "Fire", label: "Fire & Volcano" },
    { value: "Tree", label: "Tree & Forest" },
    { value: "Night", label: "Night & Stars" },
    { value: "Sunset", label: "Sunset" },
    { value: "Cloud", label: "Cloudy" },
];

type CategoryBarProps = {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
};

export default function CategoryBar({ selectedCategory, onCategoryChange }: CategoryBarProps) {
    return (
        <Box sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            py: 1.5,
            px: 2,
            borderRadius: 10,
            width: '100%',
            rounded : '20',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #EDEDED',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
        }}>
            {NatureCategories.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                return (
                    <Chip
                        key={cat.value}
                        label={cat.label}
                        clickable
                        onClick={() => onCategoryChange(cat.value)}
                        sx={{
                            fontWeight: '600',
                            fontSize: '14px',
                            px: 1,
                            py: 2,
                            transition: 'all 0.2s ease-in-out',
                            backgroundColor: isSelected ? '#2D6A4F' : '#F5F5F5',
                            color: isSelected ? '#FFFFFF' : '#555555',
                            '&:hover': {
                                backgroundColor: isSelected ? '#1B4332' : '#EAEAEA',
                            }
                        }}
                    />
                );
            })}
        </Box>
    );
}