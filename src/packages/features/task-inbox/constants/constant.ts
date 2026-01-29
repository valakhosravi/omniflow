import FmCheckForm from "../components/FmCheckForm";
import HrhCheckForm from "../components/HrhCheckForm";
import HrmCheckForm from "../components/HrmCheckForm";
import PreCheckForm from "../components/PreCheckForm";
import TeCheckForm from "../components/TeCheckForm";

export const FORM_KEYS = {
  HRH_CHECK: "salary-advance-request-hrh-check",
  FM_CHECK: "salary-advance-request-fm-check",
  PRE_CHECK: "salary-advance-request-pre-check",
  TE_CHECK: "salary-advance-request-te-check",
  HRM_CHECK: "salary-advance-request-hrm-check",
} as const;

export const STATUS_STYLES: Record<number, string> = {
  100: "bg-[#8D9CB11A] text-[#307FE2]",
  111: "bg-accent-300 text-accent-200",
  112: "bg-blue-100 text-blue-400",
  102: "bg-[#4CAF50] text-[#EAF7EC]",
  108: "bg-[#4CAF50] text-[#EAF7EC]",
  103: "bg-[#FFEBEE] text-[#FF1751]",
  104: "bg-gray-200 text-gray-400",
};

export const FORM_COMPONENTS: Record<string, React.ElementType> = {
  [FORM_KEYS.HRH_CHECK]: HrhCheckForm,
  [FORM_KEYS.HRM_CHECK]: HrmCheckForm,
  [FORM_KEYS.PRE_CHECK]: PreCheckForm,
  [FORM_KEYS.FM_CHECK]: FmCheckForm,
  [FORM_KEYS.TE_CHECK]: TeCheckForm,
};
