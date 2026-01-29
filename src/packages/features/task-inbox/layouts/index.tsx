"use client";

import Header from "@/components/Header";
import { useDisclosure } from "@/ui/NextUi";
import React from "react";
import Sidebar from "../components/Sidebar";

export default function TaskInboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex h-screen w-full relative">
      <aside className="w-64 overflow-y-auto border-l border-color-neutral-100">
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <div className="h-[105px] px-4 py-7 flex items-center gap-x-2 border-b border-color-neutral-100">
          <Header onOpen={onOpen} className="w-full" />
        </div>
        {children}
      </main>
    </div>
  );
}
