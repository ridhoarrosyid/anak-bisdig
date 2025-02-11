import { z } from "zod";

export const feedbackFormScheme = z.object({
  feedback: z.string().min(1, { message: "Harus Masukkan Saran!!!" }),
});
