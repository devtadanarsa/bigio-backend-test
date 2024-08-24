import { FC } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
} from "../ui/alert-dialog";
import { BsTrash } from "react-icons/bs";
import { useChapterStore } from "@/store/chapterStore";
import { Chapter } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/utils";

interface ChapterListProps {
  chapters:
    | {
        title: string;
        content: string;
      }[]
    | Chapter[];
  isEditPage?: boolean;
}

const ChapterList: FC<ChapterListProps> = ({
  chapters,
  isEditPage = false,
}) => {
  const { deleteChapter } = useChapterStore();

  const { toast } = useToast();

  const handleDeleteChapter = async (chapter: Chapter) => {
    try {
      await apiClient.delete(
        `/stories/${chapter.storyId}/chapters/${chapter.id}`
      );
      toast({
        title: "Chapter deleted successfully",
        description: "The chapter has been deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "An error occurred while deleting the chapter.",
        variant: "destructive",
      });
    }
  };

  return (
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
              {isEditPage
                ? dayjs((chapter as Chapter).updatedAt).format("DD MMMM YYYY")
                : dayjs(Date.now()).format("DD MMMM YYYY")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-1">
                    Choose Action <RiArrowDropDownLine className="text-xl" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="space-y-2 py-3">
                  <Link
                    to={`/stories/${(chapter as Chapter).storyId}/chapters/${
                      (chapter as Chapter).id
                    }/edit`}
                    className="flex mx-1 items-center text-sm hover:underline"
                  >
                    <FiEdit3 />
                    <span className="ml-2">Edit Chapter</span>
                  </Link>

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
                          This action cannot be undone. This will permanently
                          delete your chapter and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {isEditPage ? (
                          <AlertDialogAction
                            className="bg-red-500"
                            onClick={() =>
                              handleDeleteChapter(chapter as Chapter)
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        ) : (
                          <AlertDialogAction
                            className="bg-red-500"
                            onClick={() => deleteChapter(index)}
                          >
                            Delete
                          </AlertDialogAction>
                        )}
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
  );
};

export default ChapterList;
