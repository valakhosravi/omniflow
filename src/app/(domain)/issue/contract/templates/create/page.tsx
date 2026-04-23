"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";
import NonTypeCompleteContractIndexPageComponent from "@/features/contract/components/page-components/NonTypeCompleteContractIndexPageComponent";
import { useDispatch } from "react-redux";
import { resetContractData } from "@/features/contract/contract.slices";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "قالب‌های قرارداد", Href: "/issue/contract/templates" },
  { Name: "ایجاد قرارداد تیپ", Href: "/issue/contract/templates/create" },
];

export default function Template() {
  const { userDetail, isLoading } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  // Clear any existing contract data when creating a new contract
  useEffect(() => {
    dispatch(resetContractData());
    // Also clear localStorage to ensure a clean slate
    try {
      localStorage.removeItem("contract_draft_data");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }, [dispatch]);

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
    <NonTypeCompleteContractIndexPageComponent
      showStepper={false}
      showSubmitAndExport={false}
      isTemplatePage={true}
      breadcrumbs={<AppBreadcrumb items={breadcrumbs} />}
    />
  );
}
