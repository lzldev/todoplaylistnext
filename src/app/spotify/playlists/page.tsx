import { redirect } from "next/navigation";

export default function playlists() {
  return redirect("/spotify/playlists/0");
}
