"use client";
import { useGetOrderById } from "@/hooks/food/useOrderAction";
import { useParams } from "next/navigation";
import ContainerTop from "@/ui/ContainerTop";
import PreviewTable from "@/components/food/reservation-history/preview/PreviewTable";
import Loading from "@/ui/Loading";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو های هفتگی", Href: "/food/reservation-history" },
  { Name: "پیش نمایش رزرو", Href: "/food/reservation-history/preview" },
];

export default function PreviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const numericId = id ? parseInt(id, 10) : null;
  const { orderDataById, isGettingById } = useGetOrderById(numericId);

  if (!numericId) {
    return <div>Invalid reservation ID.</div>;
  }

  if (isGettingById) {
    return <Loading />;
  }

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <ContainerTop>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-bold text-2xl text-logo-1">
            پیش نمایش رزرو {orderDataById?.Data?.PlanName}
          </h1>
        </div>
        <PreviewTable orderDataById={orderDataById?.Data} />
      </ContainerTop>
    </>
  );
}
