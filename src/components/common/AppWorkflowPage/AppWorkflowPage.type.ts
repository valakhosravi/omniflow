// schema.ts
// ✅ Final: all types (Details + Form + Actions + Modals) strongly typed for react-hook-form

import type React from "react";
import type {
  DefaultValues,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import type { IconName } from "../AppIcon";

/* ----------------------------- Details ----------------------------- */

export type DetailRowType = "text" | "paragraph" | "badge" | "file";

export type DetailRow<TData = unknown> = {
  icon: IconName;
  label: string;
  key: string;
  type: DetailRowType;

  // string / computed / custom rendering
  value: React.ReactNode | ((ctx: { data: TData }) => React.ReactNode);

  badgeColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
};

/* ----------------------------- Buttons ----------------------------- */

export type ButtonVariant = "solid" | "bordered" | "light";
export type ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export type ActionContext<TData, TForm extends FieldValues> = {
  data: TData;
  values: TForm;
  openModal: (id: string) => void;
  closeModal: () => void;
};

export type ActionButton<
  TData = unknown,
  TForm extends FieldValues = FieldValues
> = {
  id: string;
  label: string;
  variant: ButtonVariant;
  color: ButtonColor;

  /** open modal by id (optional) */
  modalId?: string;

  /** execute logic (optional) */
  onPress?: (ctx: ActionContext<TData, TForm>) => void | Promise<void>;

  disabled?: boolean | ((ctx: { data: TData; values: TForm }) => boolean);
};

/* ------------------------------ Modals ----------------------------- */

export type ModalSchema<
  TData = unknown,
  TForm extends FieldValues = FieldValues
> = {
  id: string;
  title: string;
  content: (ctx: {
    data: TData;
    values: TForm;
    close: () => void;
  }) => React.ReactNode;
  actionButtons?: Array<ActionButton<TData, TForm>>;
};

/* ------------------------------- Form ------------------------------ */

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "date"
  | "checkbox"
  | "file";

export type SelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type FieldRules<TForm extends FieldValues> = {
  /**
   * RHF-compatible rules (we keep it close to RegisterOptions)
   * - Use Path<TForm> to avoid "keyof TForm not assignable to Path<TForm>" errors
   */
  register?: RegisterOptions<TForm, Path<TForm>>;

  /**
   * Optional: cross-field validation for this field
   * - Return true if ok, string message if invalid
   */
  validateWithValues?: (
    value: unknown,
    ctx: { values: TForm }
  ) => true | string;
};

export type BaseFieldSchema<TForm extends FieldValues, TData = unknown> = {
  name: Path<TForm>; // ✅ fixes Path<TForm> errors
  type: FieldType;
  label: string;

  placeholder?: string;
  description?: string;

  visibleIf?: (ctx: { data: TData; values: TForm }) => boolean;
  disabled?: boolean | ((ctx: { data: TData; values: TForm }) => boolean);

  rules?: FieldRules<TForm>;

  /** passthrough to UI components if needed */
  ui?: Record<string, unknown>;
};

export type TextFieldSchema<
  TForm extends FieldValues,
  TData = unknown
> = BaseFieldSchema<TForm, TData> & {
  type: "text" | "textarea" | "date";
};

export type NumberFieldSchema<
  TForm extends FieldValues,
  TData = unknown
> = BaseFieldSchema<TForm, TData> & {
  type: "number";
};

export type CheckboxFieldSchema<
  TForm extends FieldValues,
  TData = unknown
> = BaseFieldSchema<TForm, TData> & {
  type: "checkbox";
};

export type FileFieldSchema<
  TForm extends FieldValues,
  TData = unknown
> = BaseFieldSchema<TForm, TData> & {
  type: "file";
  accept?: string;
  multiple?: boolean;
};

export type SelectFieldSchema<
  TForm extends FieldValues,
  TData = unknown
> = BaseFieldSchema<TForm, TData> & {
  type: "select";
  options:
    | SelectOption[]
    | ((ctx: { data: TData; values: TForm }) => SelectOption[]);
};

export type FieldSchema<TForm extends FieldValues, TData = unknown> =
  | TextFieldSchema<TForm, TData>
  | NumberFieldSchema<TForm, TData>
  | CheckboxFieldSchema<TForm, TData>
  | FileFieldSchema<TForm, TData>
  | SelectFieldSchema<TForm, TData>;

export type FormSchema<TForm extends FieldValues, TData = unknown> = {
  defaultValues: DefaultValues<TForm>; // ✅ fixes defaultValues error
  fields: Array<FieldSchema<TForm, TData>>;

  /** optional cross-field form validation */
  formValidate?: (ctx: { data: TData; values: TForm }) => true | string;
};

/* ------------------------------- Page ------------------------------ */

export type SchemaPage<TData, TForm extends FieldValues> = {
  title: string;
  details: DetailRow<TData>[];

  form?: FormSchema<TForm, TData>;

  actions: ActionButton<TData, TForm>[];

  modals?: ModalSchema<TData, TForm>[];
};
