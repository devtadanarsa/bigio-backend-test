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
import { FiEdit3 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";

const DashboardPage = () => {
  const [stories, setStories] = useState<Story[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    apiClient
      .get("/stories")
      .then((response) => setStories(response.data.stories))
      .catch((error) => {
        console.error(error);
        toast({
          title: "Fatal error has occurred",
          description: "The application has failed to fetch the data",
          variant: "destructive",
        });
      });
  }, [toast]);

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/" },
      ]}
    >
      <h1 className="text-3xl font-semibold">List of Stories</h1>

      <Table className="mt-6">
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
                  <Badge className="rounded-sm" key={index}>
                    {tag}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>{story.status}</TableCell>
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

export default DashboardPage;
