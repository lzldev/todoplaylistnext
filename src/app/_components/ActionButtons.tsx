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
import { useConfigStore } from "../_stores/ConfigStore";
import { Input } from "./ui/components/ui/input";
import { Button } from "./ui/components/ui/button";
import { toast } from "sonner";

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
        <Icon className="size-8" icon={"fluent:settings-16-filled"} />
      </OptionsDialog>
      <Icon className="size-8" icon={"fluent:arrow-sync-16-filled"} />
      <Icon className="size-8" icon={"material-symbols:delete"} />
    </div>
  );
};

type OptionsDialogProps = PropsWithChildren;
const OptionsDialog = (props: OptionsDialogProps) => {
  const { setUsername, username } = useConfigStore();

  const [localUsername, setLocalUsername] = useState(username);
  const [checkState, setCheckState] = useState<"none" | "checked" | "error">(
    "error",
  );

  return (
    <Dialog>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex gap-x-2">
          <Input
            placeholder="last.fm"
            value={localUsername}
            onChange={(e) => setLocalUsername(e.currentTarget.value)}
          />
          <Button
            variant={
              (checkState === "none" && "ghost") ||
              (checkState === "error" && "destructive") ||
              "ghost"
            }
            onClick={() => {
              toast(":3 YIPPIE!!!!");
              setUsername(localUsername);
            }}
          >
            {
              {
                checked: (
                  <Icon
                    icon={"fluent:checkmark-16-filled"}
                    className="size-6"
                  />
                ),
                error: (
                  <Icon
                    icon={"fluent:add-16-filled"}
                    className="size-6 rotate-45"
                  />
                ),
                none: "Check",
              }[checkState]
            }
            {/* <Icon icon={"material-symbols:delete"} /> */}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
