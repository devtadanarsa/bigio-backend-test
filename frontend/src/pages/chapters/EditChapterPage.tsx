import MainLayout from "@/components/layouts/MainLayout";
import FormFieldWrapper from "@/components/molecules/FormFieldWrapper";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { chapterFormSchema } from "@/lib/form-schema";
import { apiClient } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const EditChapterPage = () => {
  const { id: storyId, chapterId } = useParams();
  const isEditPage = Boolean(chapterId);

  const navigate = useNavigate();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof chapterFormSchema>>({
    resolver: zodResolver(chapterFormSchema),
  });

  const onSubmit = (values: z.infer<typeof chapterFormSchema>) => {
    if (isEditPage) {
      try {
        apiClient.put(`/stories/${storyId}/chapters/${chapterId}`, values);
        toast({
          title: "Chapter updated successfully",
          description: "The chapter has been updated successfully.",
        });
        navigate(`/stories/${storyId}/edit`);
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred",
          description: "An error occurred while updating the chapter.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    apiClient
      .get(`/stories/${storyId}/chapters/${chapterId}`)
      .then((response) => {
        form.reset({
          title: response.data.title,
          content: response.data.content,
        });
      });
  }, [chapterId, storyId, form]);

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Story Management", href: "/chapters" },
        { label: "Add Stories", href: "/stories/add" },
        { label: "Edit Chapter", href: "/chapters/add" },
      ]}
    >
      <div className="flex items-center gap-3">
        <Link
          to={`${isEditPage ? `/stories/${storyId}/edit` : "/stories/add"}`}
        >
          <IoMdArrowRoundBack className="text-3xl" />
        </Link>
        <h1 className="text-3xl font-semibold">Edit Chapter</h1>
      </div>

      <div className="border shadow-lg px-8 py-6 mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <FormFieldWrapper
                name="title"
                label="Title"
                placeholder="Enter the title"
                control={form.control}
              />

              <FormFieldWrapper
                name="content"
                label="Chapter Content"
                placeholder="Enter the content"
                control={form.control}
                componentType="richText"
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

export default EditChapterPage;
