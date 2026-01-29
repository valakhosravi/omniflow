import CustomButton from "@/ui/Button";
import { Tab, Tabs } from "@heroui/react";
import { Send } from "iconsax-reactjs";
import React from "react";
import TabArticle from "./TabArticle";

const clause = [
  {
    id: 1,
    title: "محرمانگی",
    description:
      "طرفین متعهد می‌شوند کلیه اطلاعات محرمانه مرتبط با موضوع قرارداد را بدون رضایت کتبی طرف دیگر افشا ننمایند و به قرارداد پایبند باشند و به مفاد پایبند باشند و در صورت مواردی خارج ",
  },
  {
    id: 2,
    title: "محرمانگی",
    description: "kjnknknknknkn",
  },
];

const note = [
  {
    id: 1,
    title: "محرمانگی",
    description: "kjnknknknknkn",
  },
  {
    id: 2,
    title: "محرمانگی",
    description: "kjnknknknknkn",
  },
];

const articles = [
  {
    id: 1,
    title: "محرمانگی",
    description:
      "طرفین متعهد می‌شوند کلیه اطلاعات محرمانه مرتبط با موضوع قرارداد را بدون رضایت کتبی طرف دیگر افشا ننمایند و به قرارداد پایبند باشند و به مفاد پایبند باشند و در صورت مواردی خارج از قرارداد باید به تبصره و ... مراجعه شود.",
    clauses: clause,
    notes: note,
  },
  {
    id: 2,
    title: "محرمانگی",
    description:
      "طرفین متعهد می‌شوند کلیه اطلاعات محرمانه مرتبط با موضوع قرارداد را بدون رضایت کتبی طرف دیگر افشا ننمایند و به قرارداد پایبند باشند و به مفاد پایبند باشند و در صورت مواردی خارج از قرارداد باید به تبصره و ... مراجعه شود.",
    clauses: clause,
    notes: note,
  },
];

export default function RequestDescriptionL() {
  return (
    <div className="col-span-8 border border-primary-950/[.1] rounded-[20px] p-4">
      <h2 className="font-medium text-[16px]/[30px] text-primary-950">
        شرح درخواست
      </h2>
      <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
      <div className="flex flex-col border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px]">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[20px]/[28px] text-primary-950">
            خلاصه درخواست قرارداد فروش
          </h1>
          <CustomButton
            buttonVariant="outline"
            buttonSize="md"
            startContent={<Send size={20} />}
            className="font-semibold text-[14px]/[23px]"
          >
            ارجاع گروهی
          </CustomButton>
        </div>
        {/* <Tabs
          aria-label="Options"
          fullWidth
          className="self-center mt-[32px] mb-[16px]"
          classNames={{
            base: `max-w-[538px]`,
            tabList: `bg-transparent border border-primary-950/[.1] p-[4px]`,
            tab: `leading-none`,
            cursor: `shadow-none group-data-[selected=true]:bg-primary-950/[.05] group-data-[selected=true]:border group-data-[selected=true]:border-primary-950/[.1]`,
            tabContent: `group-data-[selected=true]:text-primary-950 text-primary-950/[.5] font-medium text-[14px]/[23px]`,
          }}
        >
          <Tab key="all" title="همه">
          </Tab>
            <TabArticle articles={articles} />
          <Tab key="needAdvance" title="نیازمند اقدام">
            ll,mlm,l
          </Tab>
          <Tab key="confirmed" title="تایید شده ها">
            iiihihi
          </Tab>
          <Tab key="rejected" title="رد شده ها">
            dkfoekfp[]
          </Tab>
        </Tabs> */}
      </div>
    </div>
  );
}
