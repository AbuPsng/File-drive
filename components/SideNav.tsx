"use client";

import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const SideNav = () => {
  const pathName = usePathname();

  return (
    <div className="w-40 flex flex-col gap-8">
      <Link href={"/dashboard/files"}>
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathName.includes("/dashboard/files"),
          })}
        >
          <FileIcon className="w-4 h-5" /> All Files
        </Button>
      </Link>
      <Link href={"/dashboard/favorites"}>
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathName.includes("/dashboard/favorites"),
          })}
        >
          <StarIcon className="w-4 h-5" /> Favorites
        </Button>
      </Link>
      <Link href={"/dashboard/trash"}>
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathName.includes("/dashboard/favorites"),
          })}
        >
          <TrashIcon className="w-4 h-5" /> Trash
        </Button>
      </Link>
    </div>
  );
};

export default SideNav;
