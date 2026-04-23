import WeeklyCheckout from "@/components/food/reservation/checkout/WeeklyCheckout";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import ContainerTop from "@/ui/ContainerTop";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو غذا", Href: "/food/reservation" },
  { Name: "تایید نهایی رزرو هفتگی", Href: "/food/reservation/checkout" },
];

export const metadata = {
  title: "TIKA | تایید نهایی رزرو هفتگی",
  description: "",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ContainerTop>
      <AppBreadcrumb items={breadcrumbs} />
      <WeeklyCheckout orderId={id} />
    </ContainerTop>
  );
}
