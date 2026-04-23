"use client";

import React from "react";
import Sidebar from "@/packages/features/task-inbox/components/Sidebar";

export function AppWithTaskInboxSidebar<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  const ComponentWithSidebar = (props: P) => (
    <div className="flex h-screen w-full relative">
      <aside className="w-64 overflow-y-auto border-l border-neutral-100">
        <Sidebar />
      </aside>
      <main className="flex-1">
        <WrappedComponent {...props} />
      </main>
    </div>
  );

  ComponentWithSidebar.displayName = `AppWithTaskInboxSidebar(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithSidebar;
}
