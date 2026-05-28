import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { Image } from "@/src/lib/types";
import { FormInput } from "@/src/lib/schema/ImageSchema";

export const imageApi = createApi({
    reducerPath : "imageApi",
    baseQuery : fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes : ["Images", "Comments"],

    endpoints : (builder) => ({

        getImages : builder.query<{ data: Image[], meta: any }, { page: number, limit: number; userId?: string }>({
            query : ({ page, limit, userId }) => `images?page=${page}&limit=${limit}&userId=${userId || ""}`,

             serializeQueryArgs: ({ queryArgs }) => {
                return `getImages_${queryArgs.userId || "guest"}`;
            },

            merge: (currentCache, newItems, { arg }) => {
                 if (arg.page === 1) {
                    currentCache.data = [...newItems.data];
                } else {
                    if (newItems.data && newItems.data.length > 0) {
                        const existingIds = new Set(currentCache.data.map(item => item.id));
                        const uniqueNewItems = newItems.data.filter(item => !existingIds.has(item.id));
                        currentCache.data.push(...uniqueNewItems);
                    }
                }
                currentCache.meta = newItems.meta;
            },

            forceRefetch({ currentArg, previousArg }) { return currentArg !== previousArg; },
            providesTags : ["Images"],
        }),
        getAdminImages: builder.query<{ data: Image[], meta: any }, string>({
            query: (userId) => `images?userId=${userId}`,
            providesTags : ["Images"],
        }),

        getComments: builder.query<{ success: boolean; comments: any[] }, string>({
            query: (imageId) => `images/${imageId}/comment`,
            providesTags: (result, error, imageId) => [{ type: "Comments", id: imageId }],
        }),

        uploadImage : builder.mutation<Image , FormInput>({
            query: (body) => ({ url : 'images', method: "POST", body }),
            invalidatesTags : ["Images"],
        }),

        updateImage: builder.mutation<Image, Image>({
            query: (image: Image) => ({
                url: `images/${image.id}`,
                method: "PUT",
                body: image,
            }),
            async onQueryStarted(image, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    imageApi.util.updateQueryData("getAdminImages", "", (draft) => {
                        if (draft && draft.data) {
                            const index = draft.data.findIndex((img) => img.id === image.id);
                            if (index !== -1) {
                                draft.data[index] = { ...draft.data[index], ...image };
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error("Optimistic Update Failed ->", err);
                    patchResult.undo();
                }
            }
        }),

        deleteImage: builder.mutation<any, { id: string; userId: string }>({
            query: ({ id }) => ({
                url: `images/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted({ id, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    imageApi.util.updateQueryData("getAdminImages", userId, (draft) => {
                        if (draft && draft.data) {
                            draft.data = draft.data.filter((img) => img.id !== id);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        toggleLike: builder.mutation<
            { success: boolean; isLiked: boolean; likesCount: number },
            { imageId: string; userId: string; userName: string }
        >({
            query: ({ imageId, userId, userName }) => ({
                url: `images/${imageId}/like`,
                method: "POST",
                body: { userId, userName },
            }),

            invalidatesTags: ["Images"],

            async onQueryStarted({ imageId, userId, userName }, { dispatch, queryFulfilled }) {

                // 1️⃣ [ADMIN PAGE  Cache ]
                const adminPatch = dispatch(
                    imageApi.util.updateQueryData("getAdminImages", userId, (draft) => {
                        const targetImage = draft?.data?.find((img: any) => img.id === imageId);
                        if (targetImage) {
                            const wasLiked = targetImage.isLikedByUser;
                            targetImage.isLikedByUser = !wasLiked;
                            const currentCount = targetImage.likesCount || 0;
                            targetImage.likesCount = wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
                        }
                    })
                );
                     const clientPatch = dispatch(
                    imageApi.util.updateQueryData("getImages" as any, { page: 1, limit: 6, userId } as any, (draft: any) => {
                        const targetImage = draft?.data?.find((img: any) => img.id === imageId);
                        if (targetImage) {
                            const wasLiked = targetImage.isLikedByUser;
                            targetImage.isLikedByUser = !wasLiked;
                            const currentCount = targetImage.likesCount || 0;
                            targetImage.likesCount = wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error("❌ Error, Rollback entries...");
                    adminPatch.undo();
                    clientPatch.undo();
                }
            },
        }),
    addComment: builder.mutation<{ success: boolean; comment: any }, { imageId: string; userName: string; text: string }>({
            query: ({ imageId, userName, text }) => ({
                url: `images/${imageId}/comment`,
                method: "POST",
                body: { userName, text },
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Comments", id: arg.imageId }],
        }),
        getWondersCount: builder.query<{ success: boolean; totalWonders: number }, undefined>({
            query: () => "images/count",
            providesTags: ["Images"],
        }),

        getLikesCount: builder.query<{ success: boolean; totalLikes: number }, undefined>({
            query: () => "images/likes-count",
            providesTags: ["Images"],
        }),
        getCommentsCount: builder.query<{ success: boolean; totalComments: number }, undefined>({
            query: () => "images/comments-count",
            providesTags: ["Comments"],
        }),
    })
});

export const {
    useGetImagesQuery,
    useGetAdminImagesQuery,
    useGetCommentsQuery,
    useUploadImageMutation,
    useUpdateImageMutation,
    useDeleteImageMutation,
    useToggleLikeMutation,
    useAddCommentMutation,
    useGetWondersCountQuery,
    useGetLikesCountQuery,
    useGetCommentsCountQuery,
} = imageApi;