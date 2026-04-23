export const requestTypeOptions = [
  { label: "تغییر", value: 1 },
  { label: "توسعه", value: 2 },
];

export const orderOptions = [
  { label: "کم", value: 1 },
  { label: "متوسط", value: 2 },
  { label: "زیاد", value: 3 },
];

export const deputyNameOptions = [
  {
    label: "معاونت توسعه کسب و کارهای مالی و امتیازی",
    value: "معاونت توسعه کسب و کارهای مالی و امتیازی",
  },
  { label: "معاونت پشتیبانی عملیات", value: "معاونت پشتیبانی عملیات" },
  { label: "معاونت فروش و توسعه بازار", value: "معاونت فروش و توسعه بازار" },
  {
    label: "معاونت برنامه ریزی و بهبود سازمانی",
    value: "معاونت برنامه ریزی و بهبود سازمانی",
  },
  { label: "معاونت فناوری اطلاعات", value: "معاونت فناوری اطلاعات" },
  { label: "معاونت مالی و تدارکات", value: "معاونت مالی و تدارکات" },
];

export const hasSimilarProcessOptions = [
  { label: "بله", value: 1 },
  { label: "نمیدانم", value: 2 },
];

export const isRegulatoryCompliantOptions = [
  { label: "بله", value: 1 },
  { label: "خیر", value: 2 },
  { label: "ارتباطی ندارد", value: 3 },
];

export const developmentDefaultValues = {
  order: 0,
  requestType: 0,
  title: "",
  description: "",
  deputyName: "",
  stackHolderContactDirector: "",
  hasSimilarProcess: 0,
  similarProcessDescription: "",
  isRegulatoryCompliant: 0,
  regulatoryCompliantDescription: "",
  beneficialCustomers: "",
  customerUsageDescription: "",
  requestedFeatures: "",
  isReportRequired: false,
  reportPath: "",
  expectedOutput: "",
  technicalDetails: "",
  kpi: "",
  letterNumber: "",
  stackHolder: "",
  extraDescription: "",
};
