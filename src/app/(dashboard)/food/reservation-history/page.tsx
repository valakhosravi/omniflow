import ReservationList from "@/components/food/reservation-history/ReservationList";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import ContainerTop from "@/ui/ContainerTop";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو های هفتگی", Href: "/food/reservation-history" },
];

export default function Page() {
  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <ContainerTop>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-bold text-2xl text-logo-1">رزرو های هفتگی</h1>
        </div>
        <ReservationList />
      </ContainerTop>
    </>
  );
}
