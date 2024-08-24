import { z } from "zod";

export const chapterSchema = z.array(
  z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  })
);

export const oneChapterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});
