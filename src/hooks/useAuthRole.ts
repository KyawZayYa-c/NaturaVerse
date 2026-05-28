import { useGetMeQuery } from "@/src/lib/api/authApi";

export type UserRole = "ADMIN" | "USER" | "GUEST";

export function useAuthRole() {
    const { data, isLoading, isFetching } = useGetMeQuery(undefined);
    const serverUser = data?.user; // 👈 🎯 ဒီကောင်ကမှ တကယ့် User Object အစစ်ပါ

    if (isLoading || isFetching) {
        return { user: null, role: "GUEST" as UserRole, isAdmin: false, isUser: false, isGuest: true, isLoading: true };
    }

    // Server return no users object is  Guest
    if (!serverUser) {
        return { user: null, role: "GUEST" as UserRole, isAdmin: false, isUser: false, isGuest: true, isLoading: false };
    }

    // 🌟 serverUser role
    const currentRole: UserRole = serverUser.role === "admin" ? "ADMIN" : "USER";

    return {
        user: serverUser,
        role: currentRole,
        isAdmin: currentRole === "ADMIN",
        isUser: currentRole === "USER",
        isGuest: false,
        isLoading: false,
    };
}