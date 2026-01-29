"use client";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  useGetCommitmentLetterQuery,
  useSaveCommitmentLetterMutation,
} from "../../task-inbox/api/CommitmentApi";
import CustomButton from "@/ui/Button";
import { useState } from "react";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "تعهدنامه", Href: "/commitmentletter" },
];

export default function CommitmentLetterIndex() {
  const { data: commitment, refetch } = useGetCommitmentLetterQuery();
  const [saveCommitment, { isLoading: isSaving }] =
    useSaveCommitmentLetterMutation();
  const [loadingBtn, setLoadingBtn] = useState<"agree" | "disagree" | null>(
    null
  );
  const handleSaveCommitment = async (value: boolean) => {
    if (commitment?.Data?.IsApprove) return;

    setLoadingBtn(value ? "agree" : "disagree");
    try {
      await saveCommitment({ IsApprove: value }).unwrap();
      await refetch();
    } finally {
      setLoadingBtn(null);
    }
  };

  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />

      <div className="space-y-20">
        <div className="space-y-6 mt-5 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary-950/[.8]">
              تعهدنامه استفاده از مساعده در راستای خرید اعتباری پرسنل از طریق
              اپلیکیشن <span className="text-accent-300">«تاپ»</span>
            </h2>
          </div>

          <Card className="shadow-none border border-gray-200 rounded-2xl">
            <CardHeader className="flex justify-between items-center bg-primary-50 border-b border-gray-200 p-4 rounded-t-2xl">
              <h3 className="text-[20px]/[30px] font-semibold text-primary-950/[.8]">
                متن تعهدنامه
              </h3>
            </CardHeader>
            <CardBody>
              <div
                dir="rtl"
                className="text-right text-secondary-900 font-medium text-[16px]/[30px] space-y-4 p-4"
              >
                <p>
                  <strong className="text-primary-950 text-[18px]/[30px]">
                    موضوع تعهد:
                  </strong>
                  <br /> متعهد با اطلاع و پذیرش کامل شرایط، درخواست مساعده جهت
                  خرید اعتباری از طریق اپلیکیشن تاپ (تابان آتی پرداز) را دارد که
                  شرکت تجارت الکترونیک پارسیان آن را برای پرسنل خود فراهم نموده
                  است.
                </p>
                <p>
                  <strong className="text-primary-950 text-[18px]/[30px]">
                    تعهدات متعهد:
                  </strong>
                  <br />
                  ۱) کلیه خریدهای اعتباری از طریق مساعده مذکور صرفاً توسط متعهد
                  و از طریق اپلیکیشن تاپ (تابان آتی پرداز) انجام خواهد شد.
                  <br />
                  ۲) بازپرداخت اقساط مساعده ناشی از خرید اعتباری در سررسید مقرر
                  به‌ طور کامل بر عهده متعهد است.
                  <br />
                  ۳) در صورت عدم پرداخت اقساط مساعده در موعد مقرر، شرکت تجارت
                  الکترونیک پارسیان (متعهدله) اختیار کامل خواهد داشت که بدون
                  نیاز به هیچگونه تشریفاتی، نسبت به کسر تمام یا بخشی از بدهی‌های
                  معوقه (شامل اصل یا جریمه) از حقوق، مزایا، پاداش، اضافه‌کار و
                  سایر مطالبات متعهد اقدام نماید.
                  <br />
                  ۴) در صورت خاتمه همکاری متعهد با شرکت (اعم از بازنشستگی،
                  استعفا، اخراج، یا هر علت دیگر)، کلیه بدهی‌های باقی‌مانده اعم
                  از معوق و غیرمعوق به دفعتاً یکجا از محل مطالبات و تسویه حساب
                  نهایی متعهد برداشت خواهد شد.
                  <br />
                  ۵) بدهی قطعی متعهد همان مبلغی است که توسط اپلیکیشن تاپ (تابان
                  آتی پرداز) یا بنگاه اقتصادی طرف قرارداد اعلام می‌شود و این
                  اعلامیه برای متعهد قطعی و غیرقابل اعتراض خواهد بود.
                  <br />
                  ۶) متعهد اقرار می‌نماید که شرکت تجارت الکترونیک پارسیان و شرکت
                  تابان آتی پرداز هیچ‌گونه مسئولیتی در قبال کیفیت، کمیت، ضمانت،
                  خدمات پس از فروش، یا هرگونه اختلاف احتمالی بین متعهد و بنگاه
                  اقتصادی نخواهد داشت.
                </p>

                <p>
                  <strong className="text-primary-950 text-[18px]/[30px]">
                    اعتبار:
                  </strong>
                  <br />
                  مبلغ مساعده درخواستی متعهد جهت خرید اعتباری از طریق اپلیکیشن
                  تاپ (تابان آتی پرداز)، معادل ................ ریال می‌باشد که
                  پس از بررسی و موافقت مدیریت منابع انسانی، مبلغ
                  ................ ریال به عنوان سقف اعتبار تخصیصی تصویب و ملاک
                  عمل خواهد بود.
                </p>
                <p>
                  <strong className="text-primary-950 text-[18px]/[30px]">
                    اعتبار و قابلیت استناد:
                  </strong>
                  <br /> این تعهدنامه از تاریخ امضاء لازم‌الاجرا بوده و در حکم
                  سند معتبر و لازم‌الاجرا میان طرفین تلقی می‌گردد.
                </p>
                <p>
                  <strong className="text-primary-950 text-[18px]/[30px]">
                    نسخ و امضاء:
                  </strong>
                  <br /> این تعهدنامه در یک نسخه اصلی تنظیم و امضاء گردیده و
                  نسخه مذکور منحصراً نزد شرکت تجارت الکترونیک پارسیان (متعهدله)
                  نگهداری خواهد شد. هیچ‌گونه تصویر، رونوشت یا کپی از این
                  تعهدنامه به متعهد ارائه نخواهد شد و نسخه موجود نزد شرکت، تنها
                  نسخه معتبر و ملاک عمل خواهد بود.
                </p>
                {commitment?.Data ? (
                  commitment.Data.IsApprove ? (
                    <p
                      className="text-accent-100 border border-accent-100 text-[14px] bg-accent-S-C 
                      px-3 py-1 rounded-[10px] font-semibold mt-6"
                    >
                      این تعهدنامه قبلاً توسط شما تأیید شده است.
                    </p>
                  ) : (
                    <p
                      className="text-accent-500 border border-accent-500 text-[14px] bg-accent-400 
                      px-3 py-1 rounded-[10px] font-semibold mt-6"
                    >
                      این تعهدنامه قبلاً توسط شما رد شده است.
                    </p>
                  )
                ) : null}
              </div>
              {!commitment?.Data && (
                <div className="self-end flex items-center gap-x-2">
                  <CustomButton
                    buttonSize="md"
                    buttonVariant="outline"
                    onPress={() => handleSaveCommitment(false)}
                    isLoading={loadingBtn === "disagree"}
                  >
                    موافق نیستم
                  </CustomButton>
                  <CustomButton
                    buttonSize="md"
                    onPress={() => handleSaveCommitment(true)}
                    isLoading={loadingBtn === "agree"}
                  >
                    موافق هستم
                  </CustomButton>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
