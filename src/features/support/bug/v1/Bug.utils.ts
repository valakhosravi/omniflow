import {
  defaultDescription,
  developmentExpertBugStatuses,
  supportExpertBugStatus,
  supportManagerBugStatuses,
  userVerifyBugStatus,
} from "./Bug.const";
import {
  BugFixFormData,
  BugFixPagesTypes,
  DevelopmenrUnitsEnum,
  DevelopmentExpertEnum,
  DevelopmentManagerEnum,
  Payload_Types,
  SupportExpertEnum,
  SupportManagerEnum,
  UserReviewEnum,
} from "./Bug.types";

export const createPayload = <K extends BugFixPagesTypes>({
  pageType,
  data,
  unit,
}: {
  pageType: K;
  data: BugFixFormData;
  unit?: "payment" | "infra";
}): Payload_Types[K] => {
  return (payloadGenerators as any)[pageType](data, unit);
};

const bugFixSupportExpertPayloadGenerator = (
  data: BugFixFormData,
): Payload_Types[BugFixPagesTypes.SUPPORT_EXPERT] => {
  return {
    SueBugApprove: data.bugFixAction === SupportExpertEnum.FIXED,
    SueEdit: data.bugFixAction === SupportExpertEnum.NEED_USER_ACTION,
    SueDescription: data.additionalDescription,
    BugReasonId:
      data.bugFixAction === SupportExpertEnum.NOT_FIXED
        ? data.selectValue.id
        : null,
    SueBugStatus:
      supportExpertBugStatus[data.bugFixAction as SupportExpertEnum],
    FileAddress: data.fileAddress || "",
  };
};

const bugFixUserVerifyPayloadGenerator = (
  data: BugFixFormData,
): Payload_Types[BugFixPagesTypes.USER_VERIFY] => {
  return {
    RequesterVerify: data.bugFixAction === UserReviewEnum.FIXED,
    RequesterDescription: data.additionalDescription || "",
    RequesterVerifyBugstatus:
      userVerifyBugStatus[data.bugFixAction as UserReviewEnum],
  };
};
const bugFixDevelopmentExpertPayloadGenerator = (
  data: BugFixFormData,
  unit: "payment" | "infra",
): Payload_Types[BugFixPagesTypes.DEVELOPMENT_EXPERT] => {
  const isValid = data.bugFixAction === DevelopmentExpertEnum.FIXED;
  const needToDevTicket =
    data.bugFixAction === DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST;
  const refToDevManager =
    data.bugFixAction === DevelopmentExpertEnum.REFERRAL_TO_DEVELOPMENT_MANAGER;
  const isPaymentUnit = unit === "payment";

  const description =
    (data.additionalDescription?.trim() || "") +
    ((needToDevTicket || isValid) && defaultDescription);

  if (isPaymentUnit) {
    return {
      TLPBugValid: isValid,
      TLPNeedEdit: data.bugFixAction === DevelopmentExpertEnum.NEED_USER_ACTION,
      TLPNewDev: needToDevTicket,
      TLPDescription: description,
      TLPBugReasonId: refToDevManager ? data.selectValue.id : 0,
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
    };
  } else
    return {
      TLBOBugValid: isValid,
      TLBONeedEdit:
        data.bugFixAction === DevelopmentExpertEnum.NEED_USER_ACTION,
      TLBONewDev:
        data.bugFixAction === DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST,
      TLBODescription: description,
      TLBOBugReasonId: refToDevManager ? data.selectValue.id : 0,
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
    };
};

const bugFixDevelopmentManagmentPayloadGenerator = (
  data: BugFixFormData,
  unit: "payment" | "infra",
): Payload_Types[BugFixPagesTypes.DEVELOPMENT_MANAGER] => {
  const isPaymentUnit = unit === "payment";
  const refToExpert =
    data.bugFixAction === DevelopmentManagerEnum.REFERRAL_TO_EXPERT;
  const refToSupport =
    data.bugFixAction === DevelopmentManagerEnum.REFERRAL_TO_SUPPORT_EXPERT;
  const refToAnotherUnit =
    data.bugFixAction === DevelopmentManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT;
  if (isPaymentUnit) {
    return {
      MPBugValid: false,
      MPReferToSupport: refToSupport,
      MPReferToInfraDev: refToAnotherUnit,
      MPHasTlpAssignee: refToExpert,
      MPTlpAssigneeUserId: refToExpert
        ? String(data.selectValue.sueUserId)
        : "",
      MPTlpAssigneePersonnelId: refToExpert ? String(data.selectValue.id) : "",
      MPDescription: data.additionalDescription || "",
      MPBugReasonId: refToAnotherUnit ? data.selectValue.id : undefined,
      MPBugStatus: 2,
    };
  } else
    return {
      MBOBugValid: false,
      MBOReferToSupport: refToSupport,
      MBOReferToPaymentDev: refToAnotherUnit,
      MBOHasTlboAssignee: refToExpert,
      MBOTlboAssigneeUserId: refToExpert
        ? String(data.selectValue.sueUserId)
        : "",
      MBOTlboAssigneePersonnelId: refToExpert
        ? String(data.selectValue.id)
        : "",
      MBODescription: data.additionalDescription || "",
      MBOBugReasonId: refToAnotherUnit ? data.selectValue.id : undefined,
      MBOBugStatus: 2,
    };
};
const bugFixSupportManagerPayloadGenerator = (
  data: BugFixFormData,
): Payload_Types[BugFixPagesTypes.SUPPORT_MANAGER] => {
  const SupportManagerBugApprove =
    data.bugFixAction === SupportManagerEnum.FIXED;
  const HasSueAssignee =
    data.bugFixAction === SupportManagerEnum.REFERRAL_TO_EXPERT;
  const hasAssigneToDevelopmentUnit =
    data.bugFixAction === SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT;
  return {
    SupportManagerBugApprove: SupportManagerBugApprove,
    HasSueAssignee: HasSueAssignee,
    SueAssigneeUserlId: HasSueAssignee
      ? String(data.selectValue.sueUserId)
      : null,
    SueAssigneePersonnelId: HasSueAssignee ? String(data.selectValue.id) : null,
    ReferToPaymentDev: hasAssigneToDevelopmentUnit
      ? data.selectValue.id == DevelopmenrUnitsEnum.PAYMENT
      : false,
    ReferToInfraDev: hasAssigneToDevelopmentUnit
      ? data.selectValue.id == DevelopmenrUnitsEnum.DEVELOPMENT
      : false,
    SupportManagerDescription: data.additionalDescription || "",
    SupportManagerBugStatus:
      supportManagerBugStatuses[data.bugFixAction as SupportManagerEnum],
    SupportManagerBugReasonId: null,
  };
};

const payloadGenerators = {
  [BugFixPagesTypes.SUPPORT_EXPERT]: bugFixSupportExpertPayloadGenerator,
  [BugFixPagesTypes.SUPPORT_MANAGER]: bugFixSupportManagerPayloadGenerator,
  [BugFixPagesTypes.USER_VERIFY]: bugFixUserVerifyPayloadGenerator,
  [BugFixPagesTypes.DEVELOPMENT_MANAGER]:
    bugFixDevelopmentManagmentPayloadGenerator,
  [BugFixPagesTypes.DEVELOPMENT_EXPERT]:
    bugFixDevelopmentExpertPayloadGenerator,
};
