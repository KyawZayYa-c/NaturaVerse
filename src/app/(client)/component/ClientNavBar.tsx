'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAuthRole } from "@/src/hooks/useAuthRole";
import { authApi, useLogoutUserMutation, useGetMeQuery } from "@/src/lib/api/authApi";
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Avatar,
    Menu,
    MenuItem
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import InfoIcon from "@mui/icons-material/Info";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function ClientNavBar() {
    const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
    const { isAdmin, isGuest } = useAuthRole();
    const dispatch = useDispatch();
    const router = useRouter();
    const currentPath = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const isAuthPage = currentPath.startsWith('/auth') || currentPath.startsWith('/authentication');
    const { data: errorOrUser } = useGetMeQuery(undefined, { skip: isAuthPage });
    const user = errorOrUser?.success ? errorOrUser.user : null;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logoutUser(undefined).unwrap();
            handleMenuClose();
            router.push("/");
            setTimeout(() => {
                dispatch(authApi.util.resetApiState());
            }, 100);
        } catch (err) {
            console.error("Logout failed from navbar", err);
        }
    };

    // 📱 Mobile Drawer Content
    const drawerContent = (
        <Box onClick={handleDrawerToggle} sx={{ width: 260, pt: 3, px: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#2D6A4F', fontWeight: 'bold', mb: 2, px: 2 }}>
                🌿 NaturaVerse
            </Typography>
            <Divider />

            {/* 🎯 Mobile  Login  User Profile  */}
            {!isGuest && user && (
                <Box sx={{ px: 2, py: 2, bgcolor: '#F8F9FA', borderRadius: '12px', mt: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#2D6A4F", color: "white", fontWeight: 'bold' }}>
                        {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                        <Typography variant="caption" noWrap color="text.secondary" sx={{ display: 'block' }}>{user.email}</Typography>
                    </Box>
                </Box>
            )}

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <ListItem disablePadding>
                    <Link href="/" style={{ width: '100%', textDecoration: 'none', color: '#333' }}>
                        <ListItemButton sx={{
                            borderRadius: '8px',
                            bgcolor: currentPath === "/" ? "rgba(45, 106, 79, 0.08)" : "transparent",
                            color: currentPath === "/" ? "#2D6A4F" : "#333",
                            '&:hover': { bgcolor: 'rgba(45, 106, 79, 0.04)' }
                        }}>
                            <ListItemIcon sx={{ color: currentPath === "/" ? "#2D6A4F" : "#555", minWidth: 40 }}><HomeIcon /></ListItemIcon>
                            <ListItemText primary={<Typography sx={{ fontWeight: currentPath === "/" ? '600' : '500' }}>Home</Typography>} />
                        </ListItemButton>
                    </Link>
                </ListItem>

                <ListItem disablePadding>
                    <Link href="/explore" style={{ width: '100%', textDecoration: 'none', color: '#333' }}>
                        <ListItemButton sx={{
                            borderRadius: '8px',
                            bgcolor: currentPath === "/explore" ? "rgba(45, 106, 79, 0.08)" : "transparent",
                            color: currentPath === "/explore" ? "#2D6A4F" : "#333",
                            '&:hover': { bgcolor: 'rgba(45, 106, 79, 0.04)' }
                        }}>
                            <ListItemIcon sx={{ color: currentPath === "/explore" ? "#2D6A4F" : "#555", minWidth: 40 }}><ExploreIcon /></ListItemIcon>
                            <ListItemText primary={<Typography sx={{ fontWeight: currentPath === "/explore" ? '600' : '500' }}>Explore</Typography>} />
                        </ListItemButton>
                    </Link>
                </ListItem>



                {isAdmin && (
                    <ListItem disablePadding>
                        <Link href="/dashboard" style={{ width: '100%', textDecoration: 'none' }}>
                            <ListItemButton sx={{ bgcolor: 'rgba(45,106,79,0.15)', color: '#2D6A4F', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(45, 106, 79, 0.25)' } }}>
                                <ListItemIcon sx={{ color: '#2D6A4F', minWidth: 40 }}><AdminPanelSettingsIcon /></ListItemIcon>
                                <ListItemText primary={<Typography sx={{ fontWeight: '600' }}>Go to Admin Box</Typography>} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                )}
            </List>

            <Box sx={{ mt: 'auto', mb: 4, px: 1 }}>
                {isGuest ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button component={Link} href="/auth/login" variant="outlined" startIcon={<LoginIcon />} fullWidth sx={{ borderRadius: '10px', color: '#2D6A4F', borderColor: '#2D6A4F', textTransform: 'none' }}>
                            Login
                        </Button>
                        <Button component={Link} href="/auth/register" variant="contained" startIcon={<PersonAddIcon />} fullWidth sx={{ borderRadius: '10px', bgcolor: '#2D6A4F', textTransform: 'none', '&:hover': { bgcolor: '#1B4332' } }}>
                            Register
                        </Button>
                    </Box>
                ) : (
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        startIcon={<Logout />}
                        sx={{
                            bgcolor: 'rgba(229, 2, 2, 0.05)',
                            color: 'rgb(229,2,2)',
                            border: 'none',
                            borderRadius: '12px',
                            py: 1.2,
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'rgba(229, 2, 2, 0.1)', border: 'none' }
                        }}
                    >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #F0F0F0',
                    top: 0,
                    zIndex: 1100
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', display: 'flex', width: '100%', maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3 } }}>

                    {/* Logo & Branding */}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Link href="/explore" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2D6A4F', letterSpacing: '0.5px' }}>
                                🌿 NaturaVerse
                            </Typography>
                        </Link>
                    </Box>

                    {/* 🖥️ DESKTOP MENU */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>

                        <Button
                            component={Link}
                            href="/"
                            startIcon={<HomeIcon fontSize="small" />}
                            sx={{
                                color: currentPath === "/" ? '#2D6A4F' : '#555',
                                fontWeight: currentPath === "/" ? '700' : '500',
                                bgcolor: currentPath === "/" ? 'rgba(45, 106, 79, 0.08)' : 'transparent',
                                borderRadius: '20px',
                                px: 2,
                                textTransform: 'none',
                                '&:hover': { color: '#2D6A4F', bgcolor: 'rgba(45, 106, 79, 0.12)' }
                            }}
                        >
                            Home
                        </Button>

                        <Button
                            component={Link}
                            href="/explore"
                            startIcon={<ExploreIcon fontSize="small" />}
                            sx={{
                                color: currentPath === "/explore" ? '#2D6A4F' : '#555',
                                fontWeight: currentPath === "/explore" ? '700' : '500',
                                bgcolor: currentPath === "/explore" ? 'rgba(45, 106, 79, 0.08)' : 'transparent',
                                borderRadius: '20px',
                                px: 2,
                                textTransform: 'none',
                                '&:hover': { color: '#2D6A4F', bgcolor: 'rgba(45, 106, 79, 0.12)' }
                            }}
                        >
                            Explore
                        </Button>



                        {isAdmin && (
                            <Button
                                component={Link}
                                href="/dashboard"
                                variant="contained"
                                startIcon={<AdminPanelSettingsIcon />}
                                sx={{
                                    bgcolor: '#2D6A4F',
                                    color: 'white',
                                    px: 2.5,
                                    py: 0.8,
                                    borderRadius: '20px',
                                    fontWeight: '600',
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#1B4332' }
                                }}
                            >
                                Admin Box
                            </Button>
                        )}

                         {isGuest ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                                <Button component={Link} href="/auth/login" variant="text" sx={{ color: '#555', fontWeight: '500', textTransform: 'none', '&:hover': { color: '#2D6A4F' } }}>
                                    Login
                                </Button>
                                <Button component={Link} href="/auth/register" variant="contained" sx={{ bgcolor: 'rgba(45, 106, 79, 0.1)', color: '#2D6A4F', px: 2.5, py: 0.8, borderRadius: '20px', fontWeight: '600', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'rgba(45, 106, 79, 0.2)', boxShadow: 'none' } }}>
                                    Register
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ ml: 1 }}>
                                <IconButton onClick={handleAvatarClick} sx={{ p: '2px', border: '2px solid #2D6A4F'}}>
                                    <Avatar sx={{
                                        width: "36px",
                                        height: "36px",
                                        bgcolor: "#2D6A4F",
                                        color: "#FFF",
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        {user ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
                                    </Avatar>
                                </IconButton>

                                {/* 🚀 User Profile Dropdown Menu (Admin အတိုင်း လှလှပပ ဖန်တီးပေးထားပါတယ်) */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                    onClick={handleMenuClose}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                                                mt: 1.5,
                                                minWidth: 220,
                                                borderRadius: '14px',
                                                p: 1,
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }
                                    }}
                                >
                                    {user && (
                                        <Box sx={{ px: 2, py: 1.5 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1A1C1E' }}>
                                                {user.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6C757D', wordBreak: 'break-all', display: 'block', mb: 1 }}>
                                                {user.email}
                                            </Typography>
                                            <Box sx={{
                                                display: 'inline-block',
                                                px: 1,
                                                py: 0.2,
                                                bgcolor: 'rgba(45, 106, 79, 0.1)',
                                                color: '#2D6A4F',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                {user.role.toUpperCase()}
                                            </Box>
                                        </Box>
                                    )}
                                    <Divider sx={{ my: 1 }} />
                                    <MenuItem
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        sx={{
                                            borderRadius: '8px',
                                            color: '#E63946',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            '&:hover': { bgcolor: 'rgba(230, 57, 70, 0.08)' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: '#E63946', minWidth: 30 }}>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        {isLoggingOut ? "Logging out..." : "Logout"}
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Box>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' }, color: '#2D6A4F', ml: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, borderRadius: '16px 0 0 16px' },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
}