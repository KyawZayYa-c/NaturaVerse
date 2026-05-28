'use client';
import { useState } from "react";
import { Box, Card, Typography, TextField, Button, Box as Stack } from "@mui/material";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import CloudinaryImageUpload from "@/src/components/CloudinaryImageUpload";
import { useAddSliderMutation } from "@/src/lib/api/sliderApi";

export default function AddSliderForm() {
    const [sliderTitle, setSliderTitle] = useState("");
    const [sliderLink, setSliderLink] = useState("");

    // 🎨 Cloudinary Component
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");

    // Redux Mutation Hook
    const [addSlider, { isLoading: isPublishing }] = useAddSliderMutation();

    const handleSliderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadedImageUrl) {
            return alert("Please wait for the image to finish uploading to Cloudinary! ⏳");
        }
        if (!sliderTitle) {
            return alert("Please fill the slider title!");
        }

        try {
            // Redux Hook /api/slider JSON
            await addSlider({
                title: sliderTitle,
                link: sliderLink || undefined,
                imageUrl: uploadedImageUrl
            }).unwrap();

            setSliderTitle("");
            setSliderLink("");
            setImageFile(null);
            setUploadedImageUrl("");
        } catch (error: any) {
            console.error("Failed to add slider:", error);
            alert(error?.data?.message || "Something went wrong while publishing.");
        }
    };

    return (
        <Card sx={{ boxShadow: "none", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px", p: 3, bgcolor: '#FFFFFF' }}>
            <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mb: 3 }}>
                <ViewCarouselIcon sx={{ color: '#2D6A4F' }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2D6A4F" }}>
                    Add Home Slider Photo
                </Typography>
            </Stack>

            <Box component="form" onSubmit={handleSliderSubmit}>
                <Stack sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Slider Title / Heading"
                        variant="outlined"
                        fullWidth
                        required
                        value={sliderTitle}
                        onChange={(e) => setSliderTitle(e.target.value)}
                        placeholder="e.g., Discover the Unseen Nature"
                    />

                    <TextField
                        label="Redirect Link (Optional)"
                        variant="outlined"
                        fullWidth
                        value={sliderLink}
                        onChange={(e) => setSliderLink(e.target.value)}
                        placeholder="e.g., /explore or external URL"
                    />

                    <CloudinaryImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        imageLoadingState={imageLoading}
                        setImageLoadingState={setImageLoading}
                        setUploadedImageUrl={setUploadedImageUrl}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={imageLoading || isPublishing}
                        sx={{ bgcolor: "#2D6A4F", py: 1.3, borderRadius: '8px', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#1B4332' } }}
                        fullWidth
                    >
                        {imageLoading ? "Uploading Image..." : isPublishing ? "Publishing to Database..." : "Publish to Homepage Slider"}
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
}