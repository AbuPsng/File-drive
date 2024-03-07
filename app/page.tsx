"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { z } from "zod";
import UploadButton from "@/components/UploadButton";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  console.log(files);

  return (
    <main className="container mx-auto pt-12">
      {files === undefined || files === null ? (
        <div className="flex flex-col gap-8 justify-between items-center pt-40 mb-8 text-gray-500">
          <Loader2 className="w-32 h-32 animate-spin" />
          <div>Loading...</div>
        </div>
      ) : files?.length < 1 ? (
        <div className="flex flex-col gap-8 h-screen pt-28 w-full items-center mt-12">
          <Image src={"empty.svg"} alt="" width={300} height={300} />
          <div className="text-2xl ">
            You have no files, go ahead and upload one now.
          </div>
          <UploadButton />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
