import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrashIcon,
  MoreVertical,
  ImageIcon,
  FileIcon,
  GanttChartIcon,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "./ui/use-toast";
import Image from "next/image";

export const FileCardDropDown = ({ file }: { file: Doc<"files"> }) => {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteFile = useMutation(api.files.deleteFile);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                handleDeleteFile({ fileId: file._id });
                toast({
                  variant: "default",
                  title: "File deleted",
                  description: "Your file is now deleted from the system",
                });
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
          <DropdownMenuLabel
            onClick={() => setIsConfirmOpen((val) => !val)}
            className="flex gap-1 text-red-400 items-center cursor-pointer"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

const FileCard = ({ file }: { file: Doc<"files"> }) => {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardDropDown file={file} />
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
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            window.open(getFileUrl(file.fileId));
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
