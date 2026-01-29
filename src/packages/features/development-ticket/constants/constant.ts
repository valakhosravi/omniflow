import EditFormV1 from "../components/v1/EditForm";
import ManagerFormV1 from "../components/v1/ManagerForm";
import ProductManagerFormV1 from "../components/v1/ProductManagerForm";
import SpecialistFormV1 from "../components/v1/SpecialistForm";
import SecondSpecialistFormV1 from "../components/v1/SecondSpecialistForm";

import EditFormV2 from "../components/v2/EditForm";
import ManagerFormV2 from "../components/v2/ManagerForm";
import ProductManagerFormV2 from "../components/v2/ProductManagerForm";
import SpecialistFormV2 from "../components/v2/SpecialistForm";
import SecondSpecialistFormV2 from "../components/v2/SecondSpecialistForm";

export const FORM_KEYS = {
  M_CHECK: "development-manager-review",
  PM_CHECK: "development-product-manager-review",
  S_CHECK: "development-product-specialist-review",
  SS_CHECK: "development-product-second-specialist-review",
  EDIT: "development-edit",
} as const;

export const FORM_COMPONENTS_DEVELOPMENT: Record<string, React.ElementType>[] =
  [
    {
      [FORM_KEYS.M_CHECK]: ManagerFormV1,
      [FORM_KEYS.PM_CHECK]: ProductManagerFormV1,
      [FORM_KEYS.S_CHECK]: SpecialistFormV1,
      [FORM_KEYS.SS_CHECK]: SecondSpecialistFormV1,
      [FORM_KEYS.EDIT]: EditFormV1,
    },
    {
      [FORM_KEYS.M_CHECK]: ManagerFormV2,
      [FORM_KEYS.PM_CHECK]: ProductManagerFormV2,
      [FORM_KEYS.S_CHECK]: SpecialistFormV2,
      [FORM_KEYS.SS_CHECK]: SecondSpecialistFormV2,
      [FORM_KEYS.EDIT]: EditFormV2,
    },
  ];
