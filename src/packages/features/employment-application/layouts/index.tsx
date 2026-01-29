import React from "react";

import AppHeader from "@/components/common/AppHeader";

export default function EmploymentApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <AppHeader />
        {children}
      </main>
    </div>
  );
}
