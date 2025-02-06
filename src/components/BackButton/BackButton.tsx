"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ButtonHTMLAttributes } from "react";

type Props = {
  title: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
    | null
    | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BackButton({
  title,
  variant,
  className,
  ...props
}: Props) {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant={variant}
      className={className}
      {...props}
    >
      {title}
    </Button>
  );
}
