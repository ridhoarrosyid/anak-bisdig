import { z } from "zod";

export const feedbackFormScheme = z.object({
  feedback: z.string().min(1, { message: "Harus Masukkan Saran!!!" }),
});

export const loginFormScheme = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupFormScheme = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });
