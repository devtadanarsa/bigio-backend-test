import MainLayout from "@/components/layouts/MainLayout";
import FormFieldWrapper from "@/components/molecules/FormFieldWrapper";
import TagInputField from "@/components/molecules/TagInputField";
import ChapterList from "@/components/organisms/ChapterList";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { storyFormSchema } from "@/lib/form-schema";
import { Chapter, Story } from "@/lib/types";
import { apiClient } from "@/lib/utils";
import { useStoryFormStore } from "@/store/formDataStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { z } from "zod";

const EditStoryPage = () => {
  const storyId = useLocation().pathname.split("/")[2];

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

  const { formData, setFormData, clearFormData, tags, setTags } =
    useStoryFormStore();

  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
  });

  const onSubmit = (values: z.infer<typeof storyFormSchema>) => {
    console.log(values);
  };

  useEffect(() => {
    const fetchData = async () => {
      const promises = [
        apiClient.get(`/stories/${storyId}`),
        apiClient.get(`/stories/${storyId}/chapters`),
      ];

      Promise.all(promises).then((response) => {
        const fetchedStory = response[0].data;
        const fetchedChapters = response[1].data.chapters;

        setStory(fetchedStory);
        setChapters(fetchedChapters);

        form.reset({
          title: fetchedStory.title,
          author: fetchedStory.author,
          synopsis: fetchedStory.synopsis,
          category: fetchedStory.category,
          status: fetchedStory.status,
          // storyCover: response[0].data.storyCover,
        });

        setTags(fetchedStory.tags);
      });
    };

    fetchData();
  }, [storyId, form, setTags]);

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Story Management", href: "/stories" },
        { label: "Edit Story", href: `/stories/${storyId}/add` },
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
                defaultValue={story?.category}
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
                defaultValue={story?.status}
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

            {chapters && <ChapterList chapters={chapters} />}
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

export default EditStoryPage;
