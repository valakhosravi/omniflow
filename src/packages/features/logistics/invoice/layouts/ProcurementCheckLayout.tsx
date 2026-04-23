"use client";

import Sidebar from "@/packages/features/task-inbox/components/Sidebar";

export default function ProcurementCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full relative">
      <aside className="w-64 overflow-y-auto border-l border-neutral-100">
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">{children}</main>
    </div>
  );
}
