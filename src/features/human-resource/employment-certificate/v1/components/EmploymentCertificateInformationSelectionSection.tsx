import React from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { Calendar, Mobile } from "iconsax-reactjs";
import LabeledSwitch from "./EmploymentCertificateLabeledSwitch";
import type { SwitchField, SwitchStates } from "../employment-certificate.types";

interface InformationSelectionSectionProps {
  switchStates: SwitchStates;
  onSwitchChange: (field: SwitchField) => void;
}

export default function InformationSelectionSection({
  switchStates,
  onSwitchChange,
}: InformationSelectionSectionProps) {
  return (
    <div className="border border-neutral-200 p-4 rounded-[20px]">
      <div className="mb-3 text-sm text-color-neutral-500">
        لطفا اطلاعات مورد نیاز در گواهی اشتغال به کار را انتخاب کنید.
      </div>
      <div className="grid grid-cols-3 gap-4">
        <LabeledSwitch
          icon={<HiOutlineBriefcase size={20} />}
          label="سمت شغلی"
          name="isNeedJobPosition"
          isSelected={switchStates.isNeedJobPosition}
          onValueChange={() => onSwitchChange("isNeedJobPosition")}
        />
        <LabeledSwitch
          icon={<Mobile className="size-5" />}
          label="شماره تماس"
          name="isNeedPhone"
          isSelected={switchStates.isNeedPhone}
          onValueChange={() => onSwitchChange("isNeedPhone")}
        />
        <LabeledSwitch
          icon={<Calendar className="size-5" />}
          label="تاریخ استخدام"
          name="isNeedStartDate"
          isSelected={switchStates.isNeedStartDate}
          onValueChange={() => onSwitchChange("isNeedStartDate")}
        />
      </div>
    </div>
  );
}