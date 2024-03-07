import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "../../../components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

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
  ImageIcon,
  FileIcon,
  GanttChartIcon,
  StarIcon,
  UndoIcon,
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
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "../../../components/ui/use-toast";
import Image from "next/image";
import { Protect, UserProfile } from "@clerk/nextjs";

export const FileCardDropDown = ({
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

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

const FileCard = ({
  file,
  favorites,
}: {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
}) => {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );

  const handleUserProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardDropDown isFavorited={isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[100px] flex justify-center">
        {file.type === "image" && (
          <Image
            src={getFileUrl(file.fileId)}
            alt={file.name}
            width={200}
            height={100}
            className="object-cover"
          />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-sm text-gray-700 w-40 items-center">
          <Avatar className="w-8 h-8">
            <AvatarImage src={handleUserProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {handleUserProfile?.name}
        </div>
        <div className="text-sm text-gray-700">
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
