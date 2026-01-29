import WeeklyCheckout from "@/components/food/reservation/checkout/WeeklyCheckout";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import ContainerTop from "@/ui/ContainerTop";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو غذا", Href: "/food/reservation" },
  { Name: "تایید نهایی رزرو هفتگی", Href: "/food/reservation/checkout" },
];

export const metadata = {
  title: "PECCO | تایید نهایی رزرو هفتگی",
  description: "",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <ContainerTop>
      <BreadcrumbsTop items={breadcrumbs} />
      <WeeklyCheckout orderId={id} />
    </ContainerTop>
  );
}
