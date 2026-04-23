"use client";
import { Spinner } from "@/ui/NextUi";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg" color="primary" variant="wave" />
    </div>
  );
}
