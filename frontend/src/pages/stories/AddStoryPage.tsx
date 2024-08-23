import MainLayout from "@/components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { storyFormSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useChapterStore } from "@/store/chapterStore";
import { FaPlus } from "react-icons/fa";
import { useStoryFormStore } from "@/store/formDataStore";
import ChapterList from "@/components/organisms/ChapterList";
import FormFieldWrapper from "@/components/molecules/FormFieldWrapper";
import TagInputField from "@/components/molecules/TagInputField";

const AddStoryPage = () => {
  // React router hook to navigate between pages
  const navigate = useNavigate();

  // Shadcnui hook to display toast messages
  const { toast } = useToast();

  // Custom hooks to manage the state of the story form
  const { chapters, clearChapters } = useChapterStore();
  const { formData, setFormData, clearFormData, tags, setTags } =
    useStoryFormStore();

  // Local state to manage tags input
  const [inputValue, setInputValue] = useState<string>("");

  // React hook form hook to manage form state
  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: formData,
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof storyFormSchema>) {
    try {
      await apiClient.post("/stories", {
        story: {
          ...values,
          storyCover: "https://example.com/image.jpg",
          tags,
        },
        chapters,
      });

      toast({
        title: "Story added successfully",
        description: "The story has been added successfully.",
      });

      clearFormData();
      clearChapters();

      navigate("/stories");
    } catch (error) {
      console.log(error);
      console.error(error);
      toast({
        title: "Fatal error has occurred",
        description:
          "The action could not be completed. Please try again later.",
        variant: "destructive",
      });
    }
  }

  // Handle adding new tag when Enter key is pressed
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  // Handle removing a tag
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Reset the form when the formData changes
  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Story Management", href: "/stories" },
        { label: "Add New Story", href: "/stories/add" },
      ]}
    >
      <h1 className="text-3xl font-semibold">Add New Story</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8 px-8 py-6 shadow-md border mt-6">
            {/* Title and Writer Name Input */}
            <div className="flex gap-8">
              <FormFieldWrapper
                name="title"
                label="Story Title"
                placeholder="Enter the title"
                control={form.control}
                className="w-1/2"
              />

              <FormFieldWrapper
                name="author"
                label="Writer Name"
                placeholder="Enter the author name"
                control={form.control}
                className="w-1/2"
              />
            </div>

            {/* Synopsis Textarea */}
            <FormFieldWrapper
              name="synopsis"
              label="Synopsis of the Story"
              placeholder="Enter story synopsis..."
              control={form.control}
              componentType="textarea"
            />

            {/* Category and Tags Input */}
            <div className="flex gap-8">
              <FormFieldWrapper
                name="category"
                label="Category"
                placeholder="Select category"
                control={form.control}
                componentType="select"
                className="w-1/2"
                selectOptions={["Financial", "Technology", "Health"]}
              />

              <TagInputField
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleKeyDown={handleKeyDown}
                tags={tags}
                removeTag={removeTag}
                className="w-1/2 space-y-2"
              />
            </div>

            {/* Title and Writer Name Input */}
            <div className="flex gap-8">
              <FormFieldWrapper
                name="storyCover"
                label="Cover Image"
                control={form.control}
                placeholder="Select cover image"
                componentType="file"
                className="w-1/2"
              />

              <FormFieldWrapper
                name="status"
                label="Status"
                placeholder="Enter the status"
                componentType="select"
                selectOptions={["Published", "Draft"]}
                control={form.control}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Story Chapters */}
          <div className="mt-8 border px-8 py-6">
            <h3 className="text-2xl font-medium">Story Chapters</h3>
            <Link
              to="/chapters/add"
              onClick={() => {
                const { storyCover, ...rest } = form.getValues();
                setFormData(rest);
              }}
            >
              <Button
                className="mt-8 flex items-center gap-3"
                variant="outline"
              >
                Add Chapter <FaPlus />
              </Button>
            </Link>

            <ChapterList chapters={chapters} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8">
            <Link to="/stories">
              <Button className="px-8 py-2" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="px-8 py-2">
              Save Story
            </Button>
          </div>
        </form>
      </Form>
    </MainLayout>
  );
};

export default AddStoryPage;
