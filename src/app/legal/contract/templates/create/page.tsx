"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/packages/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Loading from '@/ui/Loading';
import NonTypeCompleteContractIndex from '@/packages/features/contract/pages/NonTypeCompleteContractIndex';
import { useDispatch } from 'react-redux';
import { resetContractData } from '@/packages/features/contract/slice/NonTypeContractDataSlice';
import BreadcrumbsTop from '@/ui/BreadcrumbTop';
import { BreadcrumbsItem } from '@/models/ui/breadcrumbs';

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "قالب‌های قرارداد", Href: "/legal/contract/templates" },
  { Name: "ایجاد قرارداد تیپ", Href: "/legal/contract/templates/create" },
];

export default function template() {
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
    <NonTypeCompleteContractIndex 
      showStepper={false} 
      showSubmitAndExport={false} 
      isTemplatePage={true}
      breadcrumbs={<BreadcrumbsTop items={breadcrumbs} />}
    />
  );
}
