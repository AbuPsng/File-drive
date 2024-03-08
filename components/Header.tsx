import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="border-b relative z-10 py-4 bg-gray-50">
      <div className="items-center container flex mx-auto justify-between">
        <Link href={"/"} className="flex gap-2 items-center">
          <Image
            src={"/logo.png"}
            alt="file-drive logo-image text-xl"
            width={50}
            height={50}
          />
          FileDrive
        </Link>
        <SignedIn>
          <Button variant={"outline"}>
            <Link href={"/dashboard/files"}>Your Files</Link>
          </Button>
        </SignedIn>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Header;
