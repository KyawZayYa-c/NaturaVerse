'use client';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, LoginSchema } from "@/src/lib/schema/AuthSchema";
import { useLoginUserMutation } from "@/src/lib/api/authApi";
import { useAuthRole } from "@/src/hooks/useAuthRole";
import { useEffect } from "react";
import { TextField, Button, Box, Typography, Stack, Card, IconButton } from "@mui/material";

export default function LoginPage() {
    const router = useRouter();
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const { role, isLoading: isRoleLoading } = useAuthRole();

    useEffect(() => {
        if (!isRoleLoading) {
            if (role === "ADMIN") {
                router.push("/dashboard");
            } else if (role === "USER") {
                router.push("/");
            }
        }
    }, [role, isRoleLoading, router]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: "", password: "" }
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            const result = await loginUser(data).unwrap();
            if (!result.success) {
                alert("Login matching failed!");
            }
        } catch (err) {
            alert("Invalid Email or Password! Please try again.");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)", // 🌿 သဘာဝဆန်သော Gradient နောက်ခံ
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
                    backdropFilter: "blur(10px)", // Glassmorphism
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    position: "relative",
                    bgcolor: "rgba(255, 255, 255, 0.9)"
                }}
            >
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 800, color: "#1B4332", mb: 1 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}>
                        Login to access your NaturaVerse account
                    </Typography>

                    <Stack spacing={2.5} sx={{ mb: 3 }}>
                        <TextField
                            {...register("email")}
                            label="Email Address"
                            type="email"
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
                            disabled={isLoading || isRoleLoading}
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
                            {isLoading ? "Logging in..." : "Sign In"}
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
                            Don't have an account?{" "}
                            <span
                                onClick={() => router.push("/auth/register")}
                                style={{ color: "#2D6A4F", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
                            >
                                Sign Up
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}