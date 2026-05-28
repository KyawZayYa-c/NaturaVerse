'use client';
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterUserMutation } from "@/src/lib/api/authApi";
import { TextField, Button, Box, Typography, Stack, Card, IconButton } from "@mui/material";
import { RegisterInput, RegisterSchema } from "@/src/lib/schema/AuthSchema";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

export default function RegisterPage() {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { name: "", email: "", password: "" }
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            const result = await registerUser(data).unwrap();
            if (result?.success) {
                router.push("/");
            }
        } catch (e) {
            console.error("Register failed? Email might already exist!", e);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
                p: 2
            }}
        >
            <Card
                sx={{
                    maxWidth: 420,
                    width: "100%",
                    p: { xs: 3, sm: 4 },
                    borderRadius: "24px",
                    boxShadow: "0 8px 32px 0 rgba(45, 106, 79, 0.08)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    position: "relative",
                    bgcolor: "rgba(255, 255, 255, 0.9)"
                }}
            >
                {/* 🎯 ညာဘက်အပေါ်ထောင့်က Cancel Icon ခလုတ် */}
                <IconButton
                    onClick={() => router.push("/")}
                    sx={{ position: "absolute", top: 16, right: 16, color: "text.secondary" }}
                >
                    <CloseIcon />
                </IconButton>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 800, color: "#1B4332", mb: 1 }}>
                        Create Account
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}>
                        Join NaturaVerse to explore the hidden wonders
                    </Typography>

                    <Stack spacing={2.5} sx={{ mb: 3 }}>
                        <TextField
                            {...register("name")}
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            slotProps={{
                                input: { sx: { borderRadius: '12px' } }
                            }}
                        />
                        <TextField
                            {...register("email")}
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            slotProps={{
                                input: { sx: { borderRadius: '12px' } }
                            }}
                        />
                        <TextField
                            {...register("password")}
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            slotProps={{
                                input: { sx: { borderRadius: '12px' } }
                            }}
                        />
                    </Stack>

                    <Stack spacing={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                bgcolor: "#2D6A4F",
                                py: 1.4,
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: "0 4px 12px rgba(45,106,79,0.2)",
                                '&:hover': { bgcolor: '#1B4332', boxShadow: "0 6px 16px rgba(45,106,79,0.3)" }
                            }}
                            fullWidth
                        >
                            {isLoading ? "Registering..." : "Sign Up"}
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => router.push("/")}
                            sx={{
                                color: "text.secondary",
                                borderColor: "#E0E0E0",
                                py: 1.2,
                                borderRadius: '12px',
                                fontWeight: '600',
                                textTransform: 'none',
                                '&:hover': { borderColor: '#BDBDBD', bgcolor: '#F5F5F5' }
                            }}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </Stack>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Already have an account?{" "}
                            <span
                                onClick={() => router.push("/auth/login")}
                                style={{ color: "#2D6A4F", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
                            >
                                Sign In
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}