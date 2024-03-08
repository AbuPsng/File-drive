import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrashIcon,
  MoreVertical,
  FileIcon,
  UndoIcon,
  StarIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "../../../components/ui/use-toast";
import { useState } from "react";
import { Protect, UserProfile } from "@clerk/nextjs";

export const FileActions = ({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) => {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteFile = useMutation(api.files.deleteFile);
  const handleToggleFavorite = useMutation(api.files.toggleFavorite);
  const handleRestoreFile = useMutation(api.files.restoreFile);

  function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
  }

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for deletion process. Your files
              will be removed in 30 days
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (file.shouldDelete) {
                  await handleRestoreFile({ fileId: file._id });
                  toast({
                    variant: "default",
                    title: "File restored",
                    description: "Your file has been restore ",
                  });
                } else {
                  await handleDeleteFile({ fileId: file._id });
                  toast({
                    variant: "default",
                    title: "File been moved",
                    description: "Your file has been moved to trash",
                  });
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open(getFileUrl(file.fileId));
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <FileIcon className="h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleToggleFavorite({ fileId: file._id })}
            className="flex gap-1 items-center cursor-pointer"
          >
            {isFavorited ? (
              <>
                <StarIcon className="h-4 w-4 text-yellow-500 font-bold" />
                Unfavorite
              </>
            ) : (
              <>
                <StarIcon className="h-4 w-4" />
                Favorite
              </>
            )}
          </DropdownMenuItem>

          <Protect role={"org:admin"} fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsConfirmOpen((val) => !val)}
              className="flex gap-1  items-center cursor-pointer"
            >
              {file.shouldDelete ? (
                <div className="flex gap-1  items-center cursor-pointe">
                  <UndoIcon className="h-4 w-4 text-green-600" />
                  Restore
                </div>
              ) : (
                <div className="flex gap-1 items-center cursor-pointe">
                  <TrashIcon className="h-4 w-4 text-red-600 " />
                  Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
