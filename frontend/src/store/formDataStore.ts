import { storyFormSchema } from "@/lib/form-schema";
import { z } from "zod";
import create from "zustand";

interface StoryFormState {
  formData: Partial<z.infer<typeof storyFormSchema>>;
  tags: string[];
  setFormData: (data: Partial<z.infer<typeof storyFormSchema>>) => void;
  setTags: (tags: string[]) => void;
  clearFormData: () => void;
}

export const useStoryFormStore = create<StoryFormState>((set) => ({
  formData: {},
  tags: [],
  setFormData: (data) => set({ formData: data }),
  setTags: (tags) => set({ tags }),
  clearFormData: () => set({ formData: {}, tags: [] }),
}));
