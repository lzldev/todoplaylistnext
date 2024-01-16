"use client";

import { useState, type PropsWithChildren, type ReactNode } from "react";

import clsx from "clsx";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/components/ui/dialog";
import { Input } from "./ui/components/ui/input";
import { Button } from "./ui/components/ui/button";
import { useConfigStore } from "../_stores/ConfigStore";
import { api } from "~/trpc/react";
import Image from "next/image";

export type ActionButtonsProps = {
  vertical?: boolean;
};

export const ActionButtons = ({ vertical }: ActionButtonsProps) => {
  return (
    <div
      className={clsx(
        "flex gap-2",
        vertical && "flex-col",
        !vertical && "flex-row",
      )}
    >
      <OptionsDialog>
        <Button variant={"ghost"}>
          <Icon
            className="size-8 fill-foreground"
            icon={"fluent:settings-16-filled"}
          />
        </Button>
      </OptionsDialog>
      <Button variant={"ghost"}>
        <Icon
          className="size-8 fill-foreground"
          icon={"fluent:arrow-sync-16-filled"}
        />
      </Button>
      <Button variant={"ghost"}>
        <Icon
          className="size-8 fill-foreground"
          icon={"material-symbols:delete"}
        />
      </Button>
    </div>
  );
};

type OptionsDialogProps = PropsWithChildren;

const OptionsDialog = (props: OptionsDialogProps) => {
  const { user, setUser } = useConfigStore();

  const [localUsername, setLocalUsername] = useState(user?.name ?? "");

  const uquery = api.user.check.useMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        {!user && (
          <div className="flex gap-x-2">
            <Input
              placeholder="last.fm username"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.currentTarget.value)}
            />
            <Button
              variant={"outline"}
              onClick={async () => {
                const user = await uquery
                  .mutateAsync({
                    username: localUsername,
                  })
                  .catch((e) => {
                    throw e;
                  });

                setUser(user);
              }}
            >
              Search
            </Button>
          </div>
        )}
        {user && (
          <>
            <div className="flex min-h-[4rem] items-center gap-x-2 rounded-md p-2 ring-1 ring-muted">
              <Image
                className="size-12"
                src={user.image.at(0)?.["#text"] ?? ""}
                alt={`${user.name} Profile picture`}
                width={400}
                height={400}
              />
              <div>{user.name}</div>
            </div>
            <Button
              variant={"outline"}
              onClick={() => {
                setUser(null);
              }}
            >
              Clear
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
