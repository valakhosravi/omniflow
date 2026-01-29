import { FORM_COMPONENTS } from "../constants/constant";

export function renderFormByKey(
  formKey: string,
  commonProps: any,
  extraProps: any
) {
  const FormComponent = FORM_COMPONENTS[formKey];
  if (!FormComponent) return null;

  return <FormComponent {...commonProps} {...extraProps} />;
}
