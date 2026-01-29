import DevelopmentManager from "../bug-fix/components/BugFixDevelopmentManager";
import {
  defaultDescription,
  developmentExpertBugStatuses,
  supportManagerBugStatuses,
} from "./BugFix.const";
import {
  BugFixActionType,
  BugFixPagesTypes,
  DevelopmenrUnitsEnum,
  DevelopmentExpertEnum,
  DevelopmentManagerEnum,
  Payload_Types,
  SupportExpertEnum,
  SupportManagerEnum,
  BugFixFormData,
  UserReviewEnum,
} from "./BugFix.types";

export const createPayload = <K extends BugFixPagesTypes>({
  pageType,
  userId,
  personnelId,
  data,
  unit,
}: {
  pageType: K;
  userId: number;
  personnelId: string;
  data: BugFixFormData<BugFixActionType>;
  unit?: "payment" | "infra";
}): Payload_Types[K] => {
  let isPaymentUnit;
  let isValid;
  switch (pageType) {
    case BugFixPagesTypes.SUPPORT_EXPERT:
      return {
        SueBugApprove: data.bugFixAction === SupportExpertEnum.FIXED,
        SueEdit: data.bugFixAction === SupportExpertEnum.NEED_USER_ACTION,
        SueDescription: data.additionalDescription,
        SuePersonnelId: personnelId,
        SueUserId: userId,
      } as Payload_Types[K];

    case BugFixPagesTypes.SUPPORT_MANAGER:
      const SupportManagerBugApprove =
        data.bugFixAction === SupportManagerEnum.FIXED;
      const HasSueAssignee =
        data.bugFixAction === SupportManagerEnum.REFERRAL_TO_EXPERT;
      const hasAssigneToDevelopmentUnit =
        data.bugFixAction === SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT;

      return {
        SupportManagerBugApprove: SupportManagerBugApprove,
        HasSueAssignee: HasSueAssignee,
        SueAssigneePersonnelId: HasSueAssignee ? data.selectValue : null,
        ReferToPaymentDev: hasAssigneToDevelopmentUnit
          ? data.selectValue == DevelopmenrUnitsEnum.PAYMENT
          : false,
        ReferToInfraDev: hasAssigneToDevelopmentUnit
          ? data.selectValue == DevelopmenrUnitsEnum.DEVELOPMENT
          : false,
        SupportManagerDescription: data.additionalDescription,
        SupportManagerBugStatus:
          supportManagerBugStatuses[data.bugFixAction as SupportManagerEnum],
        SupportManagerBugReasonId: null,
      } as Payload_Types[K];

    case BugFixPagesTypes.USER_VERIFY:
      return {
        RequesterVerify: data.bugFixAction === UserReviewEnum.FIXED,
        RequesterDescription: data.additionalDescription,
      } as Payload_Types[K];

    case BugFixPagesTypes.DEVELOPMENT_MANAGER:
      isPaymentUnit = unit === "payment";

      const refToExpert =
        data.bugFixAction === DevelopmentManagerEnum.REFERRAL_TO_EXPERT;
      const refToSupport =
        data.bugFixAction === DevelopmentManagerEnum.REFERRAL_TO_SUPPORT_EXPERT;
      const refToAnotherUnit =
        data.bugFixAction ===
        DevelopmentManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT;
      console.log({ unit });
      if (isPaymentUnit) {
        return {
          MPBugValid: false,
          MPReferToSupport: refToSupport,
          MPReferToInfraDev: refToAnotherUnit,
          MPHasTlpAssignee: refToExpert,
          MPTlpAssigneePersonnelId: refToExpert ? data.selectValue : "",
          MPDescription: data.additionalDescription,
          MPBugReasonId: refToAnotherUnit ? data.selectValue : undefined,
          MPBugStatus: 2,
          MPTlpAssigneeUserId: String(userId),
        } as Payload_Types[K];
      } else
        return {
          MBOBugValid: false,
          MBOReferToSupport: refToSupport,
          MBOReferToPaymentDev: refToAnotherUnit,
          MBOHasTlboAssignee: refToExpert,
          MBOTlboAssigneePersonnelId: refToExpert ? data.selectValue : "",
          MBODescription: data.additionalDescription,
          MBOBugReasonId: refToAnotherUnit ? data.selectValue : undefined,
          MBOBugStatus: 2,
          MBOTlboAssigneeUserId: String(userId),
        } as Payload_Types[K];

    case BugFixPagesTypes.DEVELOPMENT_EXPERT:
      isPaymentUnit = unit === "payment";
      isValid = data.bugFixAction === DevelopmentExpertEnum.FIXED;

      const description =
        (data.additionalDescription?.trim() || "") + defaultDescription;

      if (isPaymentUnit) {
        return {
          TLPBugValid: isValid,
          TLPNeedEdit:
            data.bugFixAction === DevelopmentExpertEnum.NEED_USER_ACTION,
          TLPNewDev:
            data.bugFixAction ===
            DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST,
          TLPDescription: description,
          TLPBugReasonId: 0,
          TLPBugstatus:
            developmentExpertBugStatuses[
              data.bugFixAction as DevelopmentExpertEnum
            ],
          JiraTitle: data.JiraTitle,
          Stakeholder: data.Stakeholder,
          StakeholderDirector: data.StakeholderDirector,
          StakeholderContatctPoint: data.StakeholderContatctPoint,
          JiraDescription: data.JiraDescription,
          JiraTlpPersonnelId: data.JiraPersonnelId,
        } as Payload_Types[K];
      } else
        return {
          TLBOBugValid: isValid,
          TLBONeedEdit:
            data.bugFixAction === DevelopmentExpertEnum.NEED_USER_ACTION,
          TLBONewDev:
            data.bugFixAction ===
            DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST,
          TLBODescription: description,
          TLBOBugReasonId: 0,
          TLBOBugstatus:
            developmentExpertBugStatuses[
              data.bugFixAction as DevelopmentExpertEnum
            ],
          JiraTitle: data.JiraTitle,
          Stakeholder: data.Stakeholder,
          StakeholderDirector: data.StakeholderDirector,
          StakeholderContatctPoint: data.StakeholderContatctPoint,
          JiraDescription: data.JiraDescription,
          JiraTlboPersonnelId: data.JiraPersonnelId,
        } as Payload_Types[K];

    case BugFixPagesTypes.USER_EDIT:
    default:
      return {} as Payload_Types[K];
  }
};
