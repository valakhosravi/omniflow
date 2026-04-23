"use client";
import CustomButton from "@/ui/Button";
import { Checkbox, CheckboxGroup } from "@heroui/react";
import { Edit2 } from "iconsax-reactjs";
import { useState } from "react";
import ReferralAutoComplete from "./ReferralAutoComplete";

type article = {
  id: number;
  title: string;
  description: string;
  clauses: clause[];
  notes: note[];
};

type clause = {
  id: number;
  title: string;
  description: string;
};

type note = {
  id: number;
  title: string;
  description: string;
};

interface TabArticleProps {
  articles: article[];
}

export default function TabArticle({ articles }: TabArticleProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <CheckboxGroup
      value={selectedKeys}
      onChange={setSelectedKeys}
      className="space-y-[24px]"
      classNames={{ wrapper: `space-y-[24px]` }}
    >
      {articles.map((article) => (
        <div
          key={article.id}
          className="border border-primary-950/[.1] px-4 py-3 rounded-[16px] 
          bg-primary-950/[.03] relative"
        >
          <Checkbox
            value={String(article.id)}
            classNames={{
              wrapper: "absolute top-[14px] right-2 after:bg-primary-950",
              base: "absolute",
              hiddenInput: `hidden`,
            }}
          />

          <div className="flex items-center justify-between mr-7">
            <span className="font-semibold text-[16px]/[30px] text-primary-950">
              {article.title}
            </span>

            <CustomButton
              buttonSize="xs"
              buttonVariant="outline"
              startContent={<Edit2 size={16} className="text-primary-950" />}
              className="font-medium text-[14px]/[23px]"
            >
              ویرایش بند
            </CustomButton>
          </div>

          <p className="mt-[12px] mb-[24px] font-medium text-[14px]/[23px] text-primary-950/[.5]">
            {article.description}
          </p>

          <ReferralAutoComplete />
        </div>
      ))}
    </CheckboxGroup>
  );
}
