import MainLayout from "@/components/layouts/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { storyFormSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/utils";

const AddStoryPage = () => {
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>("");

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
  });

  async function onSubmit(values: z.infer<typeof storyFormSchema>) {
    try {
      await apiClient.post("/stories", {
        ...values,
        storyCover: "https://example.com/image.jpg",
        tags,
      });
      navigate("/stories");
    } catch (error) {
      console.error(error);
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-1/2">
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
                name="author"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Writer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the writer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Synopsis Textarea */}
            <FormField
              control={form.control}
              name="synopsis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Synopsis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter story synopsis..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Tags Input */}
            <div className="flex gap-8">
              <div className="w-1/2 space-y-1">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Financial">
                                Financial
                              </SelectItem>
                              <SelectItem value="Technology">
                                Technology
                              </SelectItem>
                              <SelectItem value="Health">Health</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2 space-y-1">
                <Label htmlFor="tags">
                  Tags -{" "}
                  <span className="text-muted-foreground">
                    Press Enter to add tags
                  </span>
                </Label>
                <Input
                  type="text"
                  id="author"
                  placeholder="Enter the tags"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex items-center gap-3">
                  {/* <p>Required</p> */}
                  {tags.map((tag, index) => (
                    <Badge
                      key={`Tag - ${index}`}
                      className="rounded-sm flex items-center gap-1 w-fit mt-2"
                    >
                      {tag}{" "}
                      <IoIosClose
                        className="text-lg cursor-pointer"
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Title and Writer Name Input */}
            <div className="flex gap-8">
              <div className="w-1/2 space-y-1">
                <FormField
                  control={form.control}
                  name="storyCover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...field}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Published">Publised</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 justify-end">
              <Link to="/stories">
                <Button className="px-8 py-2" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="px-8 py-2">
                Save Story
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </MainLayout>
  );
};

export default AddStoryPage;
