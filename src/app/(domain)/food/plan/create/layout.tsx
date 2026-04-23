"use client";

import Loading from "@/ui/Loading";
import { Suspense } from "react";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
