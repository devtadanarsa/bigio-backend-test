import MainLayout from "@/components/layouts/MainLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { chapterFormSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Bold, Essentials, Italic, Paragraph } from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import { useChapterStore } from "@/store/chapterStore";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const AddChapterPage = () => {
  const form = useForm<z.infer<typeof chapterFormSchema>>({
    resolver: zodResolver(chapterFormSchema),
  });

  const addChapter = useChapterStore((state) => state.addChapter);
  const navigate = useNavigate();

  function onSubmit(values: z.infer<typeof chapterFormSchema>) {
    addChapter(values);
    navigate("/stories/add");
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Story Management", href: "/chapters" },
        { label: "Add Stories", href: "/stories/add" },
        { label: "Add Chapter", href: "/chapters/add" },
      ]}
    >
      <div className="flex items-center gap-3">
        <Link to="/stories/add">
          <IoMdArrowRoundBack className="text-3xl" />
        </Link>
        <h1 className="text-3xl font-semibold">Add Chapter</h1>
      </div>

      <div className="border shadow-lg px-8 py-6 mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Content</FormLabel>
                    <FormControl>
                      <CKEditor
                        editor={ClassicEditor}
                        config={{
                          plugins: [Essentials, Bold, Italic, Paragraph],
                          toolbar: ["undo", "redo", "|", "bold", "italic"],
                        }}
                        data={field.value}
                        onChange={(_, editor) => {
                          const data = editor.getData();
                          field.onChange(data);
                        }}
                        onBlur={() => {
                          form.trigger("content");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <button
              type="submit"
              className="mt-8 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Chapter
            </button>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
};

export default AddChapterPage;
