import Image from "next/image";
import React from "react";
import UploadButton from "./UploadButton";

const EmptyState = ({ page }: { page: string }) => {
  const para =
    page === "Favorites"
      ? "Your favorites  is empty. "
      : "You have no files, go ahead and upload one now.";
  return (
    <div className="flex flex-col gap-8 h-[calc(100vh - 100px)] pt-28 w-full items-center mt-12">
      <Image src={"/empty.svg"} alt="" width={300} height={300} />
      <div className="text-2xl ">{para}</div>
      <UploadButton />
    </div>
  );
};

export default EmptyState;
