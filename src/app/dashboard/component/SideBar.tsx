'use client';
import { Logout, Dashboard, AddPhotoAlternate, Collections, AccountCircle } from "@mui/icons-material";
import { Button, Drawer, Box, Stack, Typography } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSideBar } from "@/src/context/SiderBarContext";
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import { authApi, useGetMeQuery, useLogoutUserMutation } from "@/src/lib/api/authApi";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface SideBarProps {
    pathName: string;
    isOpen: boolean;
    toggleSidebar: () => void;
    router: AppRouterInstance;
    user: UserProfile | null;
    handleLogout: () => Promise<void>;
    isLoggingOut: boolean;
    isSuccess: boolean;
}


const menuItems = [
    { text: 'Dashboard Overview', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Upload New Wonder', path: '/dashboard/posts', icon: <AddPhotoAlternate /> },
    { text: 'Manage Gallery', path: '/dashboard/manage', icon: <Collections /> },
    { text: 'Client View', path: '/', icon: <PreviewIcon /> },// လမ်းကြောင်းအမှန် ပြောင်းထားပါတယ်
    { text: 'Login', path: '/auth/login', icon: <AccountCircle /> },
    { text: 'Register', path: '/auth/register', icon: <PivotTableChartIcon /> }
];

const SideBarInnerContent = ({ pathName, isOpen, toggleSidebar, user, handleLogout, isLoggingOut }: SideBarProps) => (
    <Box sx={{
        width: '260px',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        color: '#1A1C1E',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 3,
        borderRight: '1px solid rgba(0,0,0,0.06)'
    }}>
        <Stack spacing={2}>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#2D6A4F',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    pb: 2,
                    letterSpacing: '0.5px'
                }}>
                🌿 NaturaVerse Admin
            </Typography>

            <Stack spacing={1} sx={{ mt: 2 }}>
                {menuItems
                    .filter((item) => !(user && item.path.startsWith('/auth')))
                    .map((item) => {
                        const isActive = pathName === item.path;
                        return (
                            <Button key={item.path}
                                    component={Link}
                                    href={item.path}
                                    variant="text"
                                    onClick={() => {
                                        if (isOpen) toggleSidebar();
                                    }}
                                    sx={{
                                         bgcolor: isActive ? 'rgba(45, 106, 79, 0.08)' : 'transparent',
                                        color: isActive ? '#2D6A4F' : '#495057',
                                        fontWeight: isActive ? '700' : '500',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        px: 2,
                                        py: 1.2,
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: isActive ? 'rgba(45, 106, 79, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                                        }
                                    }}
                                    startIcon={item.icon}
                            >
                                {item.text}
                            </Button>
                        );
                    })}
            </Stack>
        </Stack>

        {user && (
            <Button
                variant="outlined"
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={{
                    bgcolor: 'rgba(229, 2, 2, 0.03)',
                    color: 'rgb(229,2,2)',
                    borderColor: 'rgba(229, 2, 2, 0.2)',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1.2,
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': {
                        bgcolor: 'rgba(229, 2, 2, 0.08)',
                        borderColor: 'rgb(229,2,2)',
                    }
                }}
                startIcon={<Logout />}>
                {isLoggingOut ? "Logging out..." : "Logout Account"}
            </Button>
        )}
    </Box>
);

export default function SideBar() {
    const router = useRouter();
    const pathName = usePathname();
    const { isOpen, toggleSidebar } = useSideBar();
    const dispatch = useDispatch();

    const isAuthPage = pathName.startsWith('/auth') || pathName.startsWith('/authentication');

    const { data: errorOrUser } = useGetMeQuery(undefined, {
        skip: isAuthPage,
    });

    const [logoutUser, { isLoading: isLoggingOut, isSuccess }] = useLogoutUserMutation();
    const user = errorOrUser?.success ? (errorOrUser.user as UserProfile) : null;

    const handleLogout = async () => {
        try {
            if (isOpen) toggleSidebar();
            await logoutUser(undefined).unwrap();
            router.push("/");
            setTimeout(() => {
                dispatch(authApi.util.resetApiState());
            }, 100);
        } catch (err) {
            console.error("Logout failed from sidebar", err);
        }
    };

    return (
        <>
            <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%', flexShrink: 0 }}>
                <SideBarInnerContent
                    router={router}
                    pathName={pathName}
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                    user={user}
                    handleLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                    isSuccess={isSuccess}
                />
            </Box>

            <Drawer
                anchor="left"
                open={isOpen}
                onClose={toggleSidebar}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <SideBarInnerContent
                    router={router}
                    pathName={pathName}
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                    user={user}
                    handleLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                    isSuccess={isSuccess}
                />
            </Drawer>
        </>
    );
}