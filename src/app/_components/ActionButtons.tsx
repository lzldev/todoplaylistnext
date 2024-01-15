"use client";

import clsx from "clsx";
import { Icon } from "@iconify/react";

export type ActionButtonsProps = {
  vertical?: boolean;
};

export const ActionButtons = ({ vertical }: ActionButtonsProps) => {
  return (
    <div
      className={clsx(
        "flex gap-2 *-[svg]:size-8",
        vertical && "flex-col",
        !vertical && "flex-row",
      )}
    >
      <Icon icon={"fluent:settings-16-filled"} />
      <Icon icon={"fluent:arrow-sync-16-filled"} />
    </div>
  );
};
