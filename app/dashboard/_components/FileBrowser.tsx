"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadButton from "@/app/dashboard/_components/UploadButton";
import FileCard from "@/app/dashboard/_components/FileCard";
import SearchBar from "@/app/dashboard/_components/SearchBar";
import { useState } from "react";
import EmptyState from "@/app/dashboard/_components/EmptyState";
import { Grid2X2Icon, GridIcon, Loader2, RowsIcon } from "lucide-react";
import { DataTable } from "./FileTable";
import { columns } from "./Columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

export default function FileBrowser({
  title,
  filterForFavorite,
  deleteOnly,
}: {
  title: string;
  filterForFavorite?: boolean;
  deleteOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          filterForFavorite,
          deleteOnly,
        }
      : "skip"
  );
  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold ">{title}</h1>
          <SearchBar setQuery={setQuery} query={query} />
          <UploadButton />
        </div>
        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center">
            <TabsList className=" mb-4">
              <TabsTrigger value="grid" className="flex gap-2 items-center">
                <Grid2X2Icon className="w-4 h-4" /> Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex gap-2 items-center">
                <RowsIcon className="w-4 h-4" /> table
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2 items-center">
              <Label htmlFor="type-select">Type Filter</Label>
              <Select
                value={type}
                onValueChange={(newType) => {
                  setType(newType as any);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {files === undefined || files === null ? (
            <div className="flex flex-col gap-8 justify-between items-center pt-40 mb-8 text-gray-500">
              <Loader2 className="w-32 h-32 animate-spin" />
              <div>Loading...</div>
            </div>
          ) : files?.length < 1 ? (
            <EmptyState page={title} />
          ) : (
            <>
              <TabsContent value="grid">
                <div className="grid grid-cols-3 gap-4">
                  {modifiedFiles?.map((file) => (
                    <FileCard key={file._id} file={file} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="table">
                <DataTable columns={columns} data={modifiedFiles} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
