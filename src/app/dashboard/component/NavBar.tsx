'use client';
import {AppBar, Avatar, Typography , Box, IconButton, Toolbar} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useSideBar} from "@/src/context/SiderBarContext";
import { LocalActivity, AccountCircle } from "@mui/icons-material";
import { useState } from "react";
import { Menu, MenuItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import { useGetMeQuery } from "@/src/lib/api/authApi";
import { usePathname } from "next/navigation";

export default function NavBar(){
    const {toggleSidebar} = useSideBar();
    const pathName = usePathname();
    const isAuthPage = pathName.startsWith('/auth') || pathName.startsWith('/authentication');

    const { data: errorOrUser } = useGetMeQuery(undefined, { skip: isAuthPage });
    const user = errorOrUser?.success ? errorOrUser.user : null;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    return(
        <AppBar elevation={0} position="static" sx={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',backgroundColor: "#FFFFFF", zIndex: 10, height: '60px' , display: 'flex',}}>
            <Toolbar sx={{flexGrow: 1, display: "flex", justifyContent: "space-between"}}>
                <Box sx={{display: "flex", justifyContent: "center" , gap: '1.5'}} >
                    <IconButton sx={{display:{ md: 'none', xs: 'inline-flex'}}}
                                onClick={toggleSidebar}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Box>
                    <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                        <Avatar sx={{
                            width: "46px",
                            height: "46px",
                            bgcolor: "wheat",
                            color: "rgba(20,21,20,0.73)",
                            fontSize: '15px',
                            fontWeight: 'bold'
                        }}>
                            {user ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
                        </Avatar>
                    </IconButton>

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
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: '12px',
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
                        {user ? (
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1A1C1E' }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6C757D', wordBreak: 'break-all' }}>
                                    {user.email}
                                </Typography>
                                <Box sx={{
                                    display: 'inline-block',
                                    mt: 1,
                                    px: 1,
                                    py: 0.2,
                                    bgcolor: 'rgba(45, 106, 79, 0.1)',
                                    color: '#2D6A4F',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                }}>
                                    {user.role.toUpperCase()}
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="body2" sx={{ color: '#6C757D', textAlign: 'center' }}>
                                    Please Log In
                                </Typography>
                            </Box>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}