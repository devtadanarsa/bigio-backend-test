import { z } from "zod";

export const storyFormSchema = z.object({
  title: z.string().min(5).max(100),
  author: z.string().min(5).max(100),
  synopsis: z.string().min(20).max(500),
  category: z.string().min(5).max(50),
  storyCover: z.string().url(),
  status: z.enum(["Draft", "Published"]),
});

export const chapterFormSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20),
});
