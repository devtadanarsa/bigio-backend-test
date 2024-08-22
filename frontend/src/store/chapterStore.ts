import { Chapter } from "@/lib/types";
import { create } from "zustand";

interface ChapterState {
  chapters:
    | {
        title: string;
        content: string;
      }[]
    | Chapter[];
  addChapter: (chapter: { title: string; content: string }) => void;
  deleteChapter: (index: number) => void;
}

export const useChapterStore = create<ChapterState>((set) => ({
  chapters: [],
  addChapter: (chapter) =>
    set((state) => ({ chapters: [...state.chapters, chapter] })),
  deleteChapter: (index) => {
    set((state) => ({
      chapters: state.chapters.filter((_, chapterIdx) => chapterIdx !== index),
    }));
  },
}));
