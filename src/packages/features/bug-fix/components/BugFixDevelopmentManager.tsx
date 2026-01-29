import { CloseCircle, Profile2User, User } from "iconsax-reactjs";
import {
  ActionsConfig,
  BugFixPagesTypes,
  DevelopmentManagerEnum,
  SelectInputConfig,
  SelectOption,
  SupportManagerEnum,
} from "../BugFix.types";
import BugFixIndex from "./BugFixIndex";
import { refToAnotherUnit } from "../BugFix.const";
import { useGetAllBugReasonsQuery } from "../api/BugFixApi";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useGetDeputyUsersQuery } from "@/services/commonApi/commonApi";

function BugFixDevelopmentManager({
  requestId,
  unit,
}: {
  requestId: string;
  unit: "infra" | "payment";
}) {
  const { userDetail } = useAuth();
  const { data: bugReasons } = useGetAllBugReasonsQuery();
  const { data: deputyUsers } = useGetDeputyUsersQuery(
    Number(userDetail?.UserDetail.PersonnelId)
  );

  const requestBugFixActions: ActionsConfig<DevelopmentManagerEnum> = {
    actions: [
      {
        value: DevelopmentManagerEnum.REFERRAL_TO_EXPERT,
        label: "ارجاع به کارشناس",
        icon: <User size={20} className="text-primary-950" />,
        borderColor:
          "data-[selected=true]:bg-secondary-50 data-[selected=true]:border-secondary-200",
      },
      {
        value: DevelopmentManagerEnum.REFERRAL_TO_SUPPORT_EXPERT,
        label: "ارجاع به واحد پشتیبانی نرم‌افزار",
        icon: <Profile2User size={20} className="text-primary-950" />,
        borderColor:
          "data-[selected=true]:bg-secondary-50 data-[selected=true]:border-secondary-200",
      },
      {
        value: DevelopmentManagerEnum.NOT_VALID,
        label: "باگ معتبر نیست",
        icon: <CloseCircle size={20} color="red" />,
        borderColor:
          "data-[selected=true]:bg-error-200 data-[selected=true]:border-error-100",
      },
      {
        value: DevelopmentManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
        label: `ارجاع به واحد ${refToAnotherUnit[unit]}`,
        icon: <Profile2User size={20} className="text-primary-950" />,
        borderColor:
          "data-[selected=true]:bg-secondary-50 data-[selected=true]:border-secondary-200",
      },
    ],
  };

  const supportExpertSelectOptions: SelectOption[] | [] =
    deputyUsers?.Data?.map((user) => {
      return {
        label: user.FullName,
        value: String(user.PersonnelId),
      };
    }) ?? [];

  const developmentManagerSelectOptions: SelectOption[] | undefined =
    bugReasons?.Data
      ? bugReasons.Data.map((item) => ({
          label: item.Title ?? "",
          value: item.ReasonId.toString(),
        }))
      : undefined;

  const selectInputConfig: SelectInputConfig[] = [
    {
      type: SupportManagerEnum.REFERRAL_TO_EXPERT,
      label: "انتخاب کارشناس ",
      options: supportExpertSelectOptions,
    },
    {
      type: SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
      label: "دلیل ارجاع به واحد توسعه نرم‌افزار",
      options: developmentManagerSelectOptions ?? [],
    },
  ];
  return (
    <BugFixIndex<DevelopmentManagerEnum>
      unit={unit}
      pageType={BugFixPagesTypes.DEVELOPMENT_MANAGER}
      requestId={requestId}
      selectInputConfig={selectInputConfig}
      hasAcceptRequestButton={false}
      requestBugFixActions={requestBugFixActions}
    />
  );
}

export default BugFixDevelopmentManager;
