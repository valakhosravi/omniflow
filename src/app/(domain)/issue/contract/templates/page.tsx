"use client";

import { useEffect } from "react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";
import ContractTemplatesIndexPageComponent from "@/features/contract/components/page-components/ContractTemplatesIndexPageComponent";

export default function ContractTemplatesPage() {
  const { userDetail, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userDetail) {
      const groupKeys = userDetail?.UserDetail?.GroupKeys || [];
      const hasLMC = groupKeys.some((key) => key.toUpperCase().includes("LMC"));
      
      if (!hasLMC) {
        router.replace("/unauthorized");
      }
    }
  }, [userDetail, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  // Check access before rendering
  const groupKeys = userDetail?.UserDetail?.GroupKeys || [];
  const hasLMC = groupKeys.some((key) => key.toUpperCase().includes("LMC"));

  if (!hasLMC) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <ContractTemplatesIndexPageComponent />
    </>
  );
}

