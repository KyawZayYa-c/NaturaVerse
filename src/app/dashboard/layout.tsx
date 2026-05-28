'use client';
import SideBar from "@/src/app/dashboard/component/SideBar";
import NavBar from "@/src/app/dashboard/component/NavBar";
import { SidebarProvider } from "@/src/context/SiderBarContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/src/hooks/useAuthRole";
import {Box, CircularProgress} from "@mui/material";
export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const { isAdmin, isLoading } = useAuthRole();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAdmin) {
            router.push("/");
        }
    }, [isAdmin, isLoading, router]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
                <CircularProgress />
            </Box>
        );
    }
    if (!isAdmin) return null;
    return (
        <SidebarProvider>
            <div className="min-h-full h-screen overflow-hidden flex w-full">

                <div style={{ flexShrink: 0, height: '100%' }}>
                    <SideBar />
                </div>

                <div style={{ flexGrow: 1, height: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                    <NavBar />
                    <div style={{
                        backgroundColor: '#F4F6F9',
                        flexGrow: 1,
                        overflowY: "auto",
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}