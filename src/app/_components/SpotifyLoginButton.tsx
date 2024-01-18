"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/components/ui/button";

export const SpotifyLogginButton = () => {
  return (
    <div
      className="bg-spotify-green text-spotify-white ring-spotify-white flex w-fit cursor-pointer select-none flex-row items-center rounded-full px-4 py-1 font-bold transition-all duration-150 hover:ring-2"
      onClick={() =>
        signIn("spotify", {
          redirect: false,
        })
      }
    >
      <Icon icon="mdi:spotify" className="mr-1 size-8" />
      <span>Continue with Spotify</span>
    </div>
  );
};

export const SpotifyLogoutButton = () => {
  return <Button onClick={() => signOut()}>Logout</Button>;
};
