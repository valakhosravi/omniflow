import React from "react";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { Calendar, Mobile, Moneys } from "iconsax-reactjs";
import LabeledSwitch from "./LabeledSwitch";

interface SwitchStates {
  isNeedJobPosition: boolean;
  isNeedPhone: boolean;
  isNeedStartDate: boolean;
  isNeedSalary: boolean;
}

interface InformationSelectionSectionProps {
  switchStates: SwitchStates;
  onSwitchChange: (field: keyof SwitchStates) => void;
}

export default function InformationSelectionSection({ 
  switchStates, 
  onSwitchChange 
}: InformationSelectionSectionProps) {
  return (
    <div className="border border-[#D8D9DF] p-[12px] rounded-[20px]">
      <div className="text-[14px] text-[#8F94A1] mb-[12px]">
        لطفا اطلاعات مورد نیاز در گواهی اشتغال به کار را انتخاب کنید.
      </div>
      <div className="grid grid-cols-2 gap-[16px]">
        <LabeledSwitch
          icon={<BriefcaseIcon className="w-[20px] h-[20px]" />}
          label="سمت شغلی"
          name="isNeedJobPosition"
          isSelected={switchStates.isNeedJobPosition}
          onValueChange={() => onSwitchChange('isNeedJobPosition')}
        />
        <LabeledSwitch
          icon={<Mobile className="w-[20px] h-[20px]" />}
          label="شماره تماس"
          name="isNeedPhone"
          isSelected={switchStates.isNeedPhone}
          onValueChange={() => onSwitchChange('isNeedPhone')}
        />
        <LabeledSwitch
          icon={<Calendar className="w-[20px] h-[20px]" />}
          label="تاریخ استخدام"
          name="isNeedStartDate"
          isSelected={switchStates.isNeedStartDate}
          onValueChange={() => onSwitchChange('isNeedStartDate')}
        />
        <LabeledSwitch
          icon={<Moneys className="w-[20px] h-[20px]" />}
          label="مقدار حقوق"
          name="isNeedSalary"
          isSelected={switchStates.isNeedSalary}
          onValueChange={() => onSwitchChange('isNeedSalary')}
          disabled
        />
      </div>
    </div>
  );
}