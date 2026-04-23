"use client";
import Toolbar from "../components/Toolbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TaskInboxIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to My Tasks as default
    router.replace("/task-inbox/my-tasks");
  }, [router]);

  return (
    <>
      <Toolbar title={`صندوق وظایف`} />
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    </>
  );
}
