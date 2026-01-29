import {
  ActionsConfig,
  BugFixPagesTypes,
  SelectInputConfig,
  SelectOption,
  SupportExpertEnum,
} from "../BugFix.types";
import { CloseCircle, TickCircle } from "iconsax-reactjs";
import BugFixIndex from "./BugFixIndex";
import { useGetAllBugReasonsQuery } from "../api/BugFixApi";

export default function BugFixSupportExpert({
  requestId,
}: {
  requestId: string;
}) {
  const { data: bugReasons } = useGetAllBugReasonsQuery();

  const requestBugFixActions: ActionsConfig<SupportExpertEnum> = {
    actions: [
      {
        value: SupportExpertEnum.FIXED,
        label: "باگ برطرف شد",
        icon: <TickCircle size={20} color="green" />,
        borderColor:
          "data-[selected=true]:bg-success-100 data-[selected=true]:border-accent-100",
      },
      {
        value: SupportExpertEnum.NOT_FIXED,
        label: "باگ برطرف نشد",
        icon: <CloseCircle size={20} color="red" />,
        borderColor:
          "data-[selected=true]:bg-error-200 data-[selected=true]:border-error-100",
      },
    ],
  };

  const supportExpertSelectOptions: SelectOption[] | undefined =
    bugReasons?.Data
      ? bugReasons.Data.map((item) => ({
          label: item.Title ?? "",
          value: item.ReasonId.toString(),
        }))
      : undefined;

  const selectInputConfig: SelectInputConfig[] = [
    {
      type: SupportExpertEnum.NOT_FIXED,
      label: "دلیل رفع نشدن باگ",
      options: supportExpertSelectOptions ?? [],
    },
  ];

  return (
    <BugFixIndex<SupportExpertEnum>
      pageType={BugFixPagesTypes.SUPPORT_EXPERT}
      requestId={requestId}
      selectInputConfig={selectInputConfig}
      hasAcceptRequestButton={true}
      requestBugFixActions={requestBugFixActions}
    />
  );
}
