"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);

  return (
    <div>
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>

      {files?.map((file) => (
        <div key={file._id}>{file.name}</div>
      ))}

      <Button
        onClick={() => {
          createFile({ name: "hello world" });
        }}
      >
        Click Me
      </Button>
    </div>
  );
}
