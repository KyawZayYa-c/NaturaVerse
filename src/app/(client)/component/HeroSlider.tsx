'use client';
import { useState, useEffect } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useGetSlidersQuery } from "@/src/lib/api/sliderApi"; // 🎯 ကျွန်တော်တို့ဆောက်ခဲ့တဲ့ Redux GET Hook

export default function HeroSlider() {
    const { data, isLoading, isError } = useGetSlidersQuery(undefined);

    const [currentIndex, setCurrentIndex] = useState(0);

    const sliders = data?.data || [];
    useEffect(() => {
        if (sliders.length <= 1) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, sliders]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === sliders.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sliders.length - 1 : prevIndex - 1
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: { xs: '250px', md: '450px' }, bgcolor: '#F8FAFC' }}>
                <CircularProgress sx={{ color: '#2D6A4F' }} />
            </Box>
        );
    }

    if (isError || sliders.length === 0) return null;

    const currentSlider = sliders[currentIndex];

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '300px', sm: '400px', md: '500px' },
                overflow: 'hidden',
                bgcolor: '#000000',
                borderRadius: { xs: '0px', md: '16px' },
                mb: 4
            }}
        >
            {/* 🖼️ BANNER BACKGROUND IMAGE WITH SMOOTH FADE ANIMATION */}
            <Box
                component="img"
                src={currentSlider.image_url}
                alt={currentSlider.title}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.85,
                    transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out', // Fade smooth ဖြစ်စေရန်
                    animation: 'fadeIn 0.8s ease-in-out',
                    '@keyframes fadeIn': {
                        '0%': { opacity: 0.3 },
                        '100%': { opacity: 0.85 }
                    }
                }}
            />

            {/* 📝 SLIDER TEXT OVERLAY (TITLE) */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: { xs: '40px', md: '60px' },
                    left: { xs: '20px', md: '60px' },
                    right: { xs: '20px', md: '60px' },
                    color: '#FFFFFF',
                    zIndex: 2,
                    textShadow: '0px 2px 8px rgba(0,0,0,0.6)'
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                        mb: 1,
                        maxWidth: '800px',
                        lineHeight: 1.2
                    }}
                >
                    {currentSlider.title}
                </Typography>
            </Box>

            {/* ⬅️ LEFT ARROW ICON BUTTON */}
            {sliders.length > 1 && (
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '16px',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        zIndex: 3,
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.4)' }
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="medium" />
                </IconButton>
            )}

            {/* ➡️ RIGHT ARROW ICON BUTTON */}
            {sliders.length > 1 && (
                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '16px',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        zIndex: 3,
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.4)' }
                    }}
                >
                    <ArrowForwardIosIcon fontSize="medium" />
                </IconButton>
            )}

             {sliders.length > 1 && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1,
                        zIndex: 3
                    }}
                >
                    {sliders.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            sx={{
                                width: index === currentIndex ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                bgcolor: index === currentIndex ? '#2D6A4F' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}