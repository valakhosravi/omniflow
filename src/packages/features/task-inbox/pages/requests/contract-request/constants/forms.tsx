import DCheckForm from "../components/DCheckForm";
import LCheckForm from "../components/LCheckForm";
import OCheckForm from "../components/OCheckForm";

export const FORM_KEYS = {
  D_CHECK: "contract-request-d-check",
  L_CHECK: "contract-request-l-check",
  O_CHECK: "contract-request-o-check",
} as const;

export const FORM_COMPONENTS: Record<string, React.ElementType> = {
  [FORM_KEYS.D_CHECK]: DCheckForm,
  [FORM_KEYS.L_CHECK]: LCheckForm,
  [FORM_KEYS.O_CHECK]: OCheckForm,
};
