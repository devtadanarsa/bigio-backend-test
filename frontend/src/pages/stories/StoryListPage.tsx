import MainLayout from "@/components/layouts/MainLayout";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Story } from "@/lib/types";
import { apiClient } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiEdit3, FiPlus } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IoFilterSharp } from "react-icons/io5";

/**
 * StoryListPage Component
 *
 * This component is designed to display and manage a list of stories.
 * It provides features such as filtering, searching, and performing actions on individual stories.
 */
const StoryListPage = () => {
  // Component state to store stories, selected category, and selected status
  const [stories, setStories] = useState<Story[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);

  // Custom hook for displaying toast notifications
  const { toast } = useToast();

  /**
   * Fetches the list of stories when the component is mounted.
   * If the API request fails, a toast notification is displayed with an error message.
   */
  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (title) queryParams.append("title", title);
    if (category) queryParams.append("category", category);
    if (status) queryParams.append("status", status);

    apiClient
      .get(`/stories?${queryParams.toString()}`)
      .then((response) => setStories(response.data.stories))
      .catch((error) => {
        console.error(error);
        toast({
          title: "Fatal error has occurred",
          description: "The application has failed to fetch the data",
          variant: "destructive",
        });
      });
  }, [toast, title, category, status]);

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Story Management", href: "/stories" },
      ]}
    >
      <h1 className="text-3xl font-semibold">List of Stories</h1>

      {/* Top Section */}
      <div className="flex justify-between items-center mt-10">
        {/* Search Input */}
        <div className="relative w-fit">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="text-gray-500" />
          </span>
          <Input
            placeholder="Search by Writers/Title"
            className="pl-10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* End Search Input */}

        {/* Start : Filter Dropdown */}
        <div className="flex gap-4 mr-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-3">
                <IoFilterSharp />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter Result</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply filter to take spesific result
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label htmlFor="width">Category</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline" className="flex gap-2">
                          {category ? category : "Choose Category"}
                          <RiArrowDropDownLine className="text-xl" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setCategory("Financial")}
                        >
                          Financial
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setCategory("Technology")}
                        >
                          Technology
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategory("Health")}>
                          Health
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategory(null)}>
                          All Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label htmlFor="width">Status</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline" className="flex gap-2">
                          {status ? status : "Choose Status"}
                          <RiArrowDropDownLine className="text-xl" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setStatus("Published")}
                        >
                          Published
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("Draft")}>
                          Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(null)}>
                          All Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* End Filter Dropdown */}

          {/* Add Story Button */}
          <Link
            to="/stories/add"
            className="bg-primary px-8 py-2 rounded-lg flex items-center gap-3 text-white"
          >
            <FiPlus className="text-xl" />
            <p>Add Story</p>
          </Link>
          {/* End Add Story Button */}
        </div>
      </div>

      <Table className="mt-2">
        {stories.length === 0 && (
          <TableCaption>You have no stories.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Writers</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Keyword</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {stories.map((story, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{story.title}</TableCell>
              <TableCell>{story.author}</TableCell>
              <TableCell>{story.category}</TableCell>
              <TableCell className="space-x-1">
                {story.tags.map((tag, index) => (
                  <Badge className="rounded-sm" key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <Badge
                  className={`rounded-sm hover:bg-orange-200 ${
                    story.status === "Draft"
                      ? "bg-orange-200 text-orange-500"
                      : "bg-green-200 text-green-500"
                  }`}
                >
                  {story.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div className="flex items-center gap-1">
                      Choose Action <RiArrowDropDownLine className="text-xl" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <FiEdit3 />
                      <span className="ml-2">Edit Story</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BsTrash />
                      <span className="ml-2">Delete Story</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default StoryListPage;
