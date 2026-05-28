import {z} from "zod";

export const RegisterSchema = z.object({
    name : z.string().min(3, {message : "Name must be at least 3 characters"}),
    email : z.string().email( {message : "Invalid email address"} ),
    password : z.string().min(6, {message : "Password must be at least 6 characters"}),
})

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;