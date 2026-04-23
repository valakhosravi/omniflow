import AppRequestDetail from "@/components/common/AppRequestDetails";
import RequestDescription from "./RequestDescription";
import {
  Building4,
  Calendar,
  CopySuccess,
  DocumentText,
  LampCharge,
  Mobile,
  Profile2User,
  Refresh,
  Timer1,
  User,
} from "iconsax-reactjs";
import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";

const detailRows = [
  {
    title: "وضعیت درخواست",

    value: (
      <div
        className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${STATUS_STYLES[100]}`}
      >
        {"نیاز به اقدام شما"}
      </div>
    ),
    icon: <Refresh size={16} />,
  },
  {
    title: "مهلت انجام ",
    value: "۱۵ خرداد ۱۴۰۴",
    icon: <Timer1 size={16} />,
  },
  {
    title: "اولویت",
    value: "متوسط",
    icon: <LampCharge size={16} />,
  },
  {
    title: "درخواست‌دهنده",
    value: "بهاره دریابک - 01952",
    icon: <User size={16} />,
  },
  {
    title: "تاریخ استخدام",
    value: "۱۴۰۴ / ۰۲ / ۱۰ ",
    icon: <Calendar size={16} />,
  },
  {
    title: "دپارتمان",
    value: "معاونت طرح و برنامه‌ریزی محصول",
    icon: <Building4 size={16} />,
  },
  {
    title: "سمت",
    value: "طراح محصول",
    icon: <CopySuccess size={16} />,
  },
  {
    title: "شماره تماس",
    value: "۰۹۱۲-۲۹۵-۸۷۶۵ - داخلی ۰۱۹۵۲",
    icon: <Mobile size={16} />,
  },
  {
    title: "نوع درخواست",
    value: "گواهی اشتغال به کار",
    icon: <DocumentText size={16} />,
  },
  {
    title: "تیم",
    value: "تیم طراحی محصول",
    icon: <Profile2User size={16} />,
  },
];

export default function DCheckForm() {
  return (
    <div className="grid grid-cols-12 items-start gap-4">
      <RequestDescription />
      <AppRequestDetail formData={detailRows} CreatedDate={" "} />
    </div>
  );
}
