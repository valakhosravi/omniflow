import CustomButton from "@/ui/Button";
import Description from "./Description";
import Materials from "./Materials";

const strap = [
  {
    id: 1,
    title: "بند ۱.۱",
    description:
      "طرفین متعهد می‌شوند کلیه اطلاعات محرمانه مرتبط با موضوع قرارداد را بدون رضایت کتبی طرف دیگر افشا ننمایند و به قرارداد پایبند باشند و به مفاد پایبند باشند و در صورت مواردی خارج از قرارداد باید به تبصره و ... مراجعه شود.",
  },
];
const note = [
  {
    id: 1,
    title: "تبصره ۱.۱",
    description:
      "طرفین متعهد می‌شوند کلیه اطلاعات محرمانه مرتبط با موضوع قرارداد را بدون رضایت کتبی طرف دیگر افشا ننمایند و به قرارداد پایبند باشند و به مفاد پایبند باشند و در صورت مواردی خارج از قرارداد باید به تبصره و ... مراجعه شود.",
  },
];
const materials = [
  {
    id: 1,
    title: "محرمانگی",
    description:
      "طرفین متعهد می‌شوند کلیه اطلاعات محرمانه مرتبط با موضوع قرارداد را بدون رضایت کتبی طرف دیگر افشا ننمایند و به قرارداد پایبند باشند و به مفاد پایبند باشند و در صورت مواردی خارج از قرارداد باید به تبصره و ... مراجعه شود.",
    Straps: strap,
    notes: note,
  },
  {
    id: 1,
    title: "محرمانگی",
    description:
      "طرفین متعهد می‌شوند کلیه اطلاعات محرمانه مرتبط با موضوع قرارداد را بدون رضایت کتبی طرف دیگر افشا ننمایند و به قرارداد پایبند باشند و به مفاد پایبند باشند و در صورت مواردی خارج از قرارداد باید به تبصره و ... مراجعه شود.",
    Straps: [],
    notes: [],
  },
];

const buttons = [
  <CustomButton key={0} buttonSize="sm" buttonVariant="outline">
    نیازمند اقدام درخواست‌دهنده
  </CustomButton>,
  <CustomButton
    key={1}
    buttonSize="sm"
    buttonVariant="outline"
    className="!text-trash"
  >
    رد درخواست
  </CustomButton>,
  <CustomButton key={2} buttonSize="sm" buttonVariant="primary">
    تایید درخواست
  </CustomButton>,
];

export default function RequestDescription() {
  return (
    <div className="col-span-8 border border-primary-950/[.1] rounded-[20px] p-4">
      <h2 className="font-medium text-[16px]/[30px] text-primary-950">
        شرح درخواست
      </h2>
      <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
      <div className="space-y-[24px]">
        <p className="font-semibold text-[16px]/[30px] text-primary-950">
          لطفاً پیش‌نویس قرارداد پیوست را بررسی و نتیجه (تأیید/عدم‌تأیید) را
          اعلام فرمایید.
        </p>
        {materials && <Materials materials={materials} />}
        <div className="h-[1px] w-full bg-secondary-100" />
        <Description buttons={buttons} title="اطلاعات تکمیلی" />
      </div>
    </div>
  );
}
