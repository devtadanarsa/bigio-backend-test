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
import { useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useChapterStore } from "@/store/chapterStore";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaPlus } from "react-icons/fa";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BsTrash } from "react-icons/bs";
import { useStoryFormStore } from "@/store/formDataStore";

const AddStoryPage = () => {
  const navigate = useNavigate();

  const { toast } = useToast();

  const { chapters, deleteChapter } = useChapterStore();
  const { formData, setFormData, clearFormData, tags, setTags } =
    useStoryFormStore();

  const [inputValue, setInputValue] = useState<string>("");

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: formData,
  });

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
                          className="cursor-pointer"
                          {...field}
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
          </div>

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
            <Table className="mt-2">
              {chapters.length === 0 && (
                <TableCaption>You have no chapters.</TableCaption>
              )}
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {chapters.map((chapter, index) => (
                  <TableRow key={index}>
                    <TableCell>{chapter.title}</TableCell>
                    <TableCell>
                      {dayjs(Date.now()).format("DD MMMM YYYY")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                          <div className="flex items-center gap-1">
                            Choose Action{" "}
                            <RiArrowDropDownLine className="text-xl" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="space-y-2 py-3">
                          <div className="flex mx-1 items-center text-sm hover:underline">
                            <FiEdit3 />
                            <span className="ml-2">Edit Chapter</span>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger className="flex mx-1 items-center text-sm text-red-500 hover:underline">
                              <BsTrash />
                              <span className="ml-2">Delete Chapter</span>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your chapter and remove
                                  your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500"
                                  onClick={() => deleteChapter(index)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
