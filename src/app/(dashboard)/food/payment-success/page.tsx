import { Icon } from "@/ui/Icon";
import CustomButton from "@/ui/Button";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import ContainerTop from "@/ui/ContainerTop";
import Link from "next/link";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو غذا", Href: "/food/reservation" },
  { Name: "پرداخت موفق", Href: "/food/payment-success" },
];

export const metadata = {
  title: "PECCO | پرداخت موفق",
  description: "پرداخت شما با موفقیت انجام شد",
};

export default function PaymentSuccessPage() {
  return (
    <ContainerTop>
      <BreadcrumbsTop items={breadcrumbs} />

      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-8 max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="tickCircle" className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-secondary-950 mb-4">
            پرداخت موفق
          </h1>

          <p className="text-secondary-600 mb-8 leading-relaxed">
            سفارش شما با موفقیت ثبت و تایید شد.
            {/* <br /> */}
            {/* لطفاً منتظر تایید نهایی باشید. */}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* <CustomButton
              buttonVariant="primary"
              buttonSize="lg"
              className="w-full"
              onPress={handleGoToHistory}
            >
              مشاهده تاریخچه رزروها
            </CustomButton> */}

            <Link href="/">
              <CustomButton
                buttonVariant="outline"
                buttonSize="lg"
                className="w-full"
              >
                بازگشت به خانه
              </CustomButton>
            </Link>
          </div>
        </div>
      </div>
    </ContainerTop>
  );
}
