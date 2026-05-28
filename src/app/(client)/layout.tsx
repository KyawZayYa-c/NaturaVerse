'use client';
import { useAuthRole } from "@/src/hooks/useAuthRole";
import {authApi, useLogoutUserMutation} from "@/src/lib/api/authApi";
import {useDispatch} from "react-redux";
import { useRouter } from "next/navigation";
import ClientNavBar from "@/src/app/(client)/component/ClientNavBar";
export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    const [logoutUser, { isLoading: isLoggingOut, isSuccess }] = useLogoutUserMutation();
    const { isAdmin, isGuest } = useAuthRole();
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await logoutUser(undefined).unwrap();
            router.push("/auth/login");
            setTimeout(() => {
                dispatch(authApi.util.resetApiState());
            }, 100);
        } catch (err) {
            console.error("Logout failed from sidebar", err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

               <ClientNavBar />


            <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6">
                {children}
            </main>
        </div>
    );
}