import type React from "react";
import type {
  DefaultValues,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import type { IconName } from "../AppIcon";
import type { FeatureNamesEnum } from "../AppFile/AppFile.const";
import type {
  ButtonColor,
  ButtonVariant,
} from "../AppButton/AppButton.types";

/* ========================================================================= */
/*  Shell-level types — AppWorkflowPage contract                             */
/* ========================================================================= */

/* ----------------------------- Buttons ----------------------------- */

export type { ButtonColor, ButtonVariant };

/**
 * Configuration for a Tier-1 centralized modal hosted by the shell.
 * Complex (Tier-2) modals should be owned by DetailsComponent directly.
 */
export type ModalConfig = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode | ((close: () => void) => React.ReactNode);
  /** Custom className applied to ModalContent (e.g. for width overrides). */
  modalContentClassName?: string;
};

export type ActionButton = {
  id: string;
  label: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  icon?: IconName;

  /** Dynamic visibility — boolean or function evaluated at render time */
  hidden?: boolean;

  /** Dynamic disable — boolean or function evaluated at render time */
  disabled?: boolean;
  loading?: boolean;
  /**
   * Click handler — called when the button is pressed and no `modalConfig` is set.
   * If both `onPress` and `modalConfig` exist, `onPress` runs first; the modal
   * opens afterwards unless `onPress` already opened a modal via `ctx.openModal`.
   */
  onPress: () => void;

  /**
   * Declarative modal — clicking the button opens this modal instead of
   * (or after) calling `onPress`.
   */
  modalConfig?: ModalConfig;
};

/* ----------------------- Page Props ------------------------------ */

export type AppWorkflowPageProps = {
  /** Page title shown in header */
  title: string;

  /** Action buttons rendered in the action bar */
  actions: ActionButton[];

  /** Process-specific details renderer — fully owned by the calling feature */
  DetailsComponent: React.ReactNode;

  /** Request ID — passed to the self-contained sidebar component */
  requestId: number;

  /** Loading state for main content */
  isLoading?: boolean;

  /** Global action error handler */
};

/* -------------------- Workflow Hook Result ----------------------- */

/**
 * Standard return shape for workflow hooks.
 *
 * The page component spreads these directly and adds `DetailsComponent`:
 *
 * ```tsx
 * const wf = useMyWorkflow();
 * <AppWorkflowPage
 *   {...wf}
 *   DetailsComponent={<MyDetails data={wf.data} />}
 * />
 * ```
 */
export type WorkflowHookResult = {
  title: string;
  actions: ActionButton[];
  requestId: number;
  isInitialDataLoading: boolean;
};

/* ========================================================================= */
/*  Process-level types — used by DetailsComponent implementations           */
/* ========================================================================= */

/* ----------------------------- Details ----------------------------- */

export type DetailRowType = "text" | "paragraph" | "badge" | "file";

export type DetailRow<TData = unknown> = {
  icon: IconName;
  label: string;
  key: string;
  type: DetailRowType;
  value: React.ReactNode | ((ctx: { data: TData }) => React.ReactNode);
  badgeColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
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
  register?: RegisterOptions<TForm, Path<TForm>>;
  validateWithValues?: (
    value: unknown,
    ctx: { values: TForm },
  ) => true | string;
};

export type BaseFieldSchema<TForm extends FieldValues, TData = unknown> = {
  name: Path<TForm>;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  visibleIf?: (ctx: { data: TData; values: TForm }) => boolean;
  disabled?: boolean | ((ctx: { data: TData; values: TForm }) => boolean);
  rules?: FieldRules<TForm>;
  ui?: Record<string, unknown>;
};

export type TextFieldSchema<
  TForm extends FieldValues,
  TData = unknown,
> = BaseFieldSchema<TForm, TData> & {
  type: "text" | "textarea" | "date";
};

export type NumberFieldSchema<
  TForm extends FieldValues,
  TData = unknown,
> = BaseFieldSchema<TForm, TData> & {
  type: "number";
};

export type CheckboxFieldSchema<
  TForm extends FieldValues,
  TData = unknown,
> = BaseFieldSchema<TForm, TData> & {
  type: "checkbox";
};

export type FileFieldSchema<
  TForm extends FieldValues,
  TData = unknown,
> = BaseFieldSchema<TForm, TData> & {
  type: "file";
  featureName: FeatureNamesEnum;
  isMultiple?: boolean;
  requestId?: string | ((ctx: { data: TData; values: TForm }) => string);
};

export type SelectFieldSchema<
  TForm extends FieldValues,
  TData = unknown,
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
  defaultValues: DefaultValues<TForm>;
  fields: Array<FieldSchema<TForm, TData>>;
  formValidate?: (ctx: { data: TData; values: TForm }) => true | string;
};

/* ----------------------- Component-level types ----------------------- */

export type InfoRowProps = {
  icon: React.ReactNode;
  title: string;
  value: string | React.ReactNode;
  type?: DetailRowType;
};
