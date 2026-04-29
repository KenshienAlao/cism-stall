import z from "zod";

export const MealSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  price: z.number().min(-1, "Price must be atleast 0"),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  stocks: z.number().min(-1, "Stocks must be atleast 0"),
});
