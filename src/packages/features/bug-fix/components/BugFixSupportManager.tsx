import { Profile2User, TickCircle, User } from "iconsax-reactjs";
import BugFixIndex from "./BugFixIndex";
import {
  ActionsConfig,
  BugFixPagesTypes,
  SelectInputConfig,
  SelectOption,
  SupportManagerEnum,
} from "../BugFix.types";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { developmentUnits } from "../BugFix.const";
import { useGetDeputyUsersQuery } from "@/services/commonApi/commonApi";

function BugFixSupportManager({ requestId }: { requestId: string }) {
  const { userDetail } = useAuth();

  const requestBugFixActions: ActionsConfig<SupportManagerEnum> = {
    actions: [
      {
        value: SupportManagerEnum.REFERRAL_TO_EXPERT,
        label: "ارجاع به کارشناس پشتیبانی",
        icon: <User size={20} className="text-primary-950" />,
        borderColor:
          "data-[selected=true]:bg-secondary-50 data-[selected=true]:border-secondary-200",
      },
      {
        value: SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
        label: "ارجاع به واحد توسعه",
        icon: <Profile2User size={20} className="text-primary-950" />,
        borderColor:
          "data-[selected=true]:bg-secondary-50 data-[selected=true]:border-secondary-200",
      },
      {
        value: SupportManagerEnum.FIXED,
        label: "باگ برطرف شد",
        icon: <TickCircle size={20} color="green" />,
        borderColor:
          "data-[selected=true]:bg-success-100 data-[selected=true]:border-accent-100",
      },
    ],
  };

  const { data: deputyUsers } = useGetDeputyUsersQuery(
    Number(userDetail?.UserDetail.PersonnelId)
  );

  const supportExpertSelectOptions: SelectOption[] | [] =
    deputyUsers?.Data?.map((user) => {
      return {
        label: user.FullName,
        value: String(user.PersonnelId),
      };
    }) ?? [];

  const selectInputConfig: SelectInputConfig[] = [
    {
      type: SupportManagerEnum.REFERRAL_TO_EXPERT,
      label: "انتخاب کارشناس ",
      options: supportExpertSelectOptions,
    },
    {
      type: SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
      label: "انتخاب واحد توسعه ",
      options: developmentUnits,
    },
  ];
  return (
    <BugFixIndex<SupportManagerEnum>
      requestId={requestId}
      pageType={BugFixPagesTypes.SUPPORT_MANAGER}
      selectInputConfig={selectInputConfig}
      hasAcceptRequestButton={false}
      requestBugFixActions={requestBugFixActions}
    />
  );
}

export default BugFixSupportManager;
