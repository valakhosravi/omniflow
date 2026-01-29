"use client";
import { Reserve, TickCircle, User } from "iconsax-reactjs";
import {
  ActionsConfig,
  BugFixPagesTypes,
  DevelopmentExpertEnum,
  SelectInputConfig,
  SelectOption,
} from "../BugFix.types";
import BugFixIndex from "./BugFixIndex";
import { refToManager } from "../BugFix.const";
import { useGetAllBugReasonsQuery } from "../api/BugFixApi";

function BugFixDevelopmentExpert({
  requestId,
  unit,
}: {
  requestId: string;
  unit: "infra" | "payment";
}) {
  const { data: bugReasons } = useGetAllBugReasonsQuery();

  const requestBugFixActions: ActionsConfig<DevelopmentExpertEnum> = {
    actions: [
      {
        value: DevelopmentExpertEnum.FIXED,
        label: "باگ برطرف شد (ثبت در جیرا)",
        icon: <TickCircle size={20} color="green" />,
        borderColor:
          "data-[selected=true]:bg-success-100 data-[selected=true]:border-accent-100",
      },
      {
        value: DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST,
        label: "درخواست فرآیند توسعه",
        icon: <Reserve size={20} className="text-primary-950" />,
        borderColor:
          "data-[selected=true]:bg-secondary-50 data-[selected=true]:border-secondary-200",
      },
      {
        value: DevelopmentExpertEnum.REFERRAL_TO_DEVELOPMENT_MANAGER,
        label: `ارجاع به مدیر ${refToManager[unit]}`,
        icon: <User size={20} className="text-primary-950" />,
        borderColor:
          "data-[selected=true]:bg-secondary-50 data-[selected=true]:border-secondary-200",
      },
    ],
  };

  const developmentExpertSelectOptions: SelectOption[] | undefined =
    bugReasons?.Data
      ? bugReasons.Data.map((item) => ({
          label: item.Title ?? "",
          value: item.ReasonId.toString(),
        }))
      : undefined;

  const selectInputConfig: SelectInputConfig[] = [
    {
      type: DevelopmentExpertEnum.REFERRAL_TO_DEVELOPMENT_MANAGER,
      label: ` دلیل ارجاع به مدیر ${refToManager[unit]}`,
      options: developmentExpertSelectOptions ?? [],
    },
  ];
  return (
    <BugFixIndex<DevelopmentExpertEnum>
      unit={unit}
      requestId={requestId}
      pageType={BugFixPagesTypes.DEVELOPMENT_EXPERT}
      selectInputConfig={selectInputConfig}
      hasAcceptRequestButton={true}
      requestBugFixActions={requestBugFixActions}
    />
  );
}

export default BugFixDevelopmentExpert;
