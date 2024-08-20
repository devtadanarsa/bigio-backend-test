import { z } from "zod";

export const storySchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  synopsis: z.string().min(1, "Synopsis is required"),
  storyCover: z.string().url(),
});
