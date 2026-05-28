import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/auth/"
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        registerUser: builder.mutation<{ success: boolean; message: string }, { name: string; email: string; password: string }>({
            query: (body) => ({
                url: "register",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        loginUser: builder.mutation<{ success: boolean; message: string }, { email: string; password: string }>({
            query: (body) => ({
                url: "login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        logoutUser: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        getMe: builder.query<{ success: boolean; user: { id: string; name: string; email: string; role: string } }, undefined>({
            query: () => "me",
            providesTags: ["User"],
        }),
        getAllUsersCount: builder.query<{ success: boolean; totalUsers: number }, undefined>({
            query: () => "users",
            providesTags: ["User"],
        })
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetAllUsersCountQuery,
    useGetMeQuery
} = authApi;