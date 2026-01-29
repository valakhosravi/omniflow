import BugFixIndex from "./BugFixIndex";
import {
  ActionsConfig,
  BugFixPagesTypes,
  UserReviewEnum,
} from "../BugFix.types";
import { CloseCircle, TickCircle } from "iconsax-reactjs";

const BugFixUserVerify = ({ requestId }: { requestId: string }) => {
  const requestBugFixActions: ActionsConfig<UserReviewEnum> = {
    actions: [
      {
        value: UserReviewEnum.FIXED,
        label: "باگ برطرف شد ",
        icon: <TickCircle size={20} color="green" />,
        borderColor:
          "data-[selected=true]:bg-success-100 data-[selected=true]:border-accent-100",
      },
      {
        value: UserReviewEnum.NOT_FIXED,
        label: "باگ برطرف نشد",
        icon: <CloseCircle size={20} color="red" />,
        borderColor:
          "data-[selected=true]:bg-error-200 data-[selected=true]:border-error-100",
      },
    ],
  };

  return (
    <BugFixIndex<UserReviewEnum>
      pageType={BugFixPagesTypes.USER_VERIFY}
      requestId={requestId}
      hasAcceptRequestButton={false}
      requestBugFixActions={requestBugFixActions}
    />
  );
};

export default BugFixUserVerify;
