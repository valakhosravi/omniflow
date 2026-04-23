import { Skeleton } from "@/ui/NextUi";
import React from "react";

export default function SidebarSkeleton() {
  return (
    <nav>
      <ul className="space-y-3 px-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="rounded-lg h-8 w-full" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
