import z from "zod";

export const loginStallSchema = z.object({
  licence: z.string().min(1, "Licence is required").trim(),
  password: z.string().min(1, "Password is required").trim(),
});

