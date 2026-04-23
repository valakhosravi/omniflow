import type { EmploymentCertificateData } from "../employment-certificate.types";

const badgeItems: { key: keyof EmploymentCertificateData; label: string }[] = [
  { key: "isNeedJobPosition", label: "سمت شغلی" },
  { key: "isNeedPhone", label: "شماره تماس" },
  { key: "isNeedStartDate", label: "تاریخ استخدام" },
  { key: "isNeedSalary", label: "مقدار حقوق" },
];

export default function EmploymentCertificateVisibleItemsBadges({
  data,
}: {
  data: EmploymentCertificateData;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {badgeItems.map(
        ({ key, label }) =>
          data[key] && (
            <div
              key={key}
              className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]"
            >
              {label}
            </div>
          ),
      )}
    </div>
  );
}
