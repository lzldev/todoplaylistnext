"use client";
import type { ErrorProps } from "next/error";
import Image from "next/image";

export default function Error(props: ErrorProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center ">
      <span className="font-mono text-6xl tracking-tight">error</span>
      <Image src={"/error.png"} width={600} height={600} alt="error image" />
      <p>{props.statusCode}</p>
    </div>
  );
}
