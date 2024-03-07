"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadButton from "@/app/dashboard/_components/UploadButton";
import FileCard from "@/app/dashboard/_components/FileCard";
import SearchBar from "@/app/dashboard/_components/SearchBar";
import { useState } from "react";
import EmptyState from "@/app/dashboard/_components/EmptyState";
import { Loader2 } from "lucide-react";

export default function FileBrowser({
  title,
  favorites,
}: {
  title: string;
  favorites?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();

  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites } : "skip"
  );

  return (
    <div>
      <div className="w-full">
        {files === undefined || files === null ? (
          <div className="flex flex-col gap-8 justify-between items-center pt-40 mb-8 text-gray-500">
            <Loader2 className="w-32 h-32 animate-spin" />
            <div>Loading...</div>
          </div>
        ) : files?.length < 1 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold ">{title}</h1>
              <SearchBar setQuery={setQuery} query={query} />
              <UploadButton />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {files?.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
