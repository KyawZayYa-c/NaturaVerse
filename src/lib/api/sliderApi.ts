import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sliderApi = createApi({
    reducerPath: "sliderApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Sliders"],
    endpoints: (builder) => ({

        getSliders: builder.query<{ success: boolean; data: any[] }, undefined>({
            query: () => "slider",
            providesTags: ["Sliders"],
        }),

        addSlider: builder.mutation<{ success: boolean; message: string; data: any }, { title: string; link?: string; imageUrl: string }>({
            query: (newSlider) => ({
                url: "slider",
                method: "POST",
                body: newSlider,
            }),
            invalidatesTags: ["Sliders"],
        }),
        deleteSlider: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `/slider/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Sliders"],
        }),
        updateSlider: builder.mutation<{ success: boolean; message: string; data: any }, { id: number; title: string }>({
            query: ({ id, title }) => ({
                url: `/slider/${id}`,
                method: "PUT",
                body: { title },
            }),
            invalidatesTags: ["Sliders"],
        }),

    }),
});


export const {
    useGetSlidersQuery,
    useAddSliderMutation,
    useDeleteSliderMutation,
    useUpdateSliderMutation,
} = sliderApi;