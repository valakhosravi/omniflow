import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import Image from "next/image";

export default function HelpFile() {
  return (
    <div className="relative flex gap-x-3 bg-pagination-dropdown border border-primary-950/[.2] rounded-[20px] p-3">
      <div
        className="border border-primary-950/[.1] bg-white px-[30px] py-[28px] size-[100px] xl:size-[118px] 
      rounded-[20px] shrink-0"
      >
        <Image
          src={"/pictures/helpfile.png"}
          alt="help file"
          width={59}
          height={63}
        />
      </div>
      <div className="flex flex-col space-y-[7px]">
        <div className="space-y-1.5">
          <h4 className="font-semibold text-[16px]/[24px] text-primary-950">
            دریافت فایل راهنما تیکت توسعه
          </h4>
          <p className="font-medium text-[14px]/[27px] text-secondary-400">
            برای تسهیل کار شما، یک فایل نمونه آماده شده است. لطفاً این فایل را
            از طریق دکمه
            <span className="text-secondary-900"> «دریافت فایل راهنما» </span>
            دانلود کرده و بر اساس ساختار و بخش‌های مشخص‌شده در آن، فایل Word
            مربوط به پروژه خود را تهیه کنید. پس از تکمیل، فایل Word خود را از
            طریق بخش
            <span className="text-secondary-900">
              {" "}
              «بارگذاری فایل یا تصویر»{" "}
            </span>
            در همین صفحه آپلود نمایید.
          </p>
        </div>
        <div className="flex gap-x-2">
          <AppIcon name="Flash" size={24} className="text-secondary-400" />
          <p
            className="relative pr-3 font-medium text-[14px]/[27px] text-secondary-950
            before:content-['•'] before:absolute before:right-0"
          >
            شامل: شرح پروژه، ویژگی‌ها، گزارش‌ها، معیارهای ارزیابی، نمونه مشابه،
            نتایج و توضیحات تکمیلی.
          </p>
        </div>
      </div>
      <a
        href="/files/guide.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4"
      >
        <AppButton
          label="دریافت فایل راهنما"
          variant="outline"
        />
      </a>
    </div>
  );
}
