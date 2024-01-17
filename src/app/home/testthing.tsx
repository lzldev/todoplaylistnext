"use client";

import { api } from "~/trpc/react";
import { Button } from "../_components/ui/components/ui/button";

export const TestThing = () => {
  const test = api.spotify.check.useMutation(undefined);
  return (
    <>
      <Button
        onClick={async () => {
          const d = await test.mutateAsync();
          console.log(d);
        }}
      ></Button>
    </>
  );
};
