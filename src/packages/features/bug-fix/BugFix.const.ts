import {
  DevelopmentExpertEnum,
  DevelopmentManagerEnum,
  SelectOption,
  SupportExpertEnum,
  SupportManagerEnum,
  UserReviewEnum,
} from "./BugFix.types";

export const needToSelecActions = [
  SupportExpertEnum.NOT_FIXED,
  SupportManagerEnum.REFERRAL_TO_EXPERT,
  SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
  DevelopmentExpertEnum.REFERRAL_TO_DEVELOPMENT_MANAGER,
  DevelopmentManagerEnum.NOT_VALID,
];

export const needToDescription = [
  UserReviewEnum.NOT_FIXED,
  SupportExpertEnum.NOT_FIXED,
  SupportExpertEnum.NEED_USER_ACTION,
  SupportManagerEnum.REFERRAL_TO_EXPERT,
  SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
  DevelopmentExpertEnum.NEED_USER_ACTION,
  DevelopmentExpertEnum.REFERRAL_TO_DEVELOPMENT_MANAGER,
  DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST,
  DevelopmentManagerEnum.NOT_VALID,
  "need-user-action",
];

export const priorityLevele = {
  low: 1,
  medume: 2,
  hight: 3,
};

export const priorityNames = {
  [priorityLevele.low]: "کم",
  [priorityLevele.medume]: "متوسط",
  [priorityLevele.hight]: "زیاد",
};

export const priorityColors = {
  [priorityLevele.low]: "text-accent-700 bg-primary-200 ",
  [priorityLevele.medume]: "bg-badge-orange text-accent-300",
  [priorityLevele.hight]: "text-accent-500 bg-accent-400",
};

export const developmentUnits: SelectOption[] = [
  { value: "1", label: "واحد توسعه زیر ساخت " },
  { value: "2", label: " واحد توسعه نرم افزارهای پرداخت " },
];

export const refToManager = {
  payment: "توسعه نرم افزارهای پرداخت",
  infra: "توسعه زیرساخت",
};
export const refToAnotherUnit = {
  infra: "توسعه نرم افزارهای پرداخت",
  payment: "توسعه زیرساخت",
};

export const developmentExpertBugStatuses = {
  [DevelopmentExpertEnum.FIXED]: 1,
  [DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST]: 2,
  [DevelopmentExpertEnum.NEED_USER_ACTION]: 2,
  [DevelopmentExpertEnum.REFERRAL_TO_DEVELOPMENT_MANAGER]: 2,
};

export const supportManagerBugStatuses = {
  [SupportManagerEnum.FIXED]: 1,
  [SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT]: 2,
  [SupportManagerEnum.REFERRAL_TO_EXPERT]: 2,
};

export const defaultDescription = "(توضیح راهنما: نیازمند ثبت تیکت توسعه)";
