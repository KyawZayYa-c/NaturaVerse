import z from "zod";

export const ImageSchema = z.object({
    title : z.string().min(1, {message: "Title is required"}),
    category : z.string().min(1, {message: "Category is required"}),
    imageUrl : z.string().min(1, {message: "Image Url is required"}),
    description : z.string().min(1, {message: "Description is required"}),
});

export type FormInput = z.infer<typeof ImageSchema>;