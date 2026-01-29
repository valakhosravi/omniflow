// SchemaPageRenderer.tsx
// ✅ HeroUI version (Input/Textarea/Select/Button/Modal) + react-hook-form
// Assumptions:
// - You have @heroui/react installed
// - Your schema types are in ./AppWorkflowPage.type
// - Icon rendering is provided via renderIcon prop (keeps this component generic)

import React, { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";

import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import type {
  SchemaPage,
  DetailRow,
  DetailRowType,
  FieldSchema,
  SelectOption,
  ActionButton,
} from "../AppWorkflowPage.type";
import AppInfoRow from "../../AppInfoRow/AppInfoRow";
import { AppIcon } from "../../AppIcon";

/** Helpers */
function evalBool<TCtx>(
  v: boolean | ((ctx: TCtx) => boolean) | undefined,
  ctx: TCtx
) {
  if (typeof v === "function") return v(ctx);
  return !!v;
}

function isVisible<TCtx>(
  predicate: ((ctx: TCtx) => boolean) | undefined,
  ctx: TCtx
) {
  if (!predicate) return true;
  return predicate(ctx);
}

function toHeroUIButtonProps(action: ActionButton<any, any>) {
  // HeroUI Button: variant + color mapping
  return {
    variant: action.variant,
    color: action.color,
  } as const;
}

export type SchemaPageRendererProps<TData, TForm extends FieldValues> = {
  schema: SchemaPage<TData, TForm>;
  data: TData;
  onActionError?: (err: unknown) => void;
};

export function SchemaPageRenderer<TData, TForm extends FieldValues>(
  props: SchemaPageRendererProps<TData, TForm>
) {
  const { schema, data, onActionError } = props;

  const methods = useForm<TForm>({
    defaultValues: (schema.form?.defaultValues ?? {}) as DefaultValues<TForm>,
    mode: "onChange",
  });

  const { register, control, watch, getValues } = methods;

  // watch for dynamic visibility/disabled
  watch();

  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const isModalOpen = !!activeModalId;

  const openModal = (id: string) => setActiveModalId(id);
  const closeModal = () => setActiveModalId(null);

  const activeModal = useMemo(() => {
    if (!activeModalId) return null;
    return schema.modals?.find((m) => m.id === activeModalId) ?? null;
  }, [activeModalId, schema.modals]);

  async function runAction(action: ActionButton<TData, TForm>) {
    try {
      const ctx = {
        data,
        values: getValues(),
        openModal,
        closeModal,
      };

      if (action.onPress) await action.onPress(ctx);
      if (action.modalId) openModal(action.modalId);
    } catch (err) {
      onActionError?.(err);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  return (
    <FormProvider {...methods}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ margin: 0 }}>{schema.title}</h2>

        <DetailsList rows={schema.details} data={data} title={"خلاصه درخواست"} />

        {schema.form ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {schema.form.fields.map((field) => {
              const ctx = { data, values: getValues() };
              if (!isVisible(field.visibleIf, ctx)) return null;

              const disabled = evalBool(field.disabled, ctx);

              return (
                <FieldRenderer<TData, TForm>
                  key={field.name}
                  field={field}
                  disabled={disabled}
                  getValues={getValues}
                  register={register}
                  control={control}
                  data={data}
                />
              );
            })}
          </div>
        ) : null}

        <div className="justify-end" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {schema.actions.map((action) => {
            const disabled =
              typeof action.disabled === "function"
                ? action.disabled({ data, values: getValues() })
                : !!action.disabled;

            return (
              <Button
                key={action.id}
                isDisabled={disabled}
                onPress={() => runAction(action)}
                {...toHeroUIButtonProps(action)}
              >
                {action.label}
              </Button>
            );
          })}
        </div>

        {/* HeroUI Modal Host */}
        <Modal
          isOpen={isModalOpen}
          onOpenChange={(open) => (open ? null : closeModal())}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{activeModal?.title ?? ""}</span>
                  </div>
                </ModalHeader>

                <ModalBody>
                  {activeModal
                    ? activeModal.content({
                        data,
                        values: getValues(),
                        close: () => {
                          onClose();
                          closeModal();
                        },
                      })
                    : null}
                </ModalBody>

                {activeModal?.actionButtons?.length ? (
                  <ModalFooter
                    style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                  >
                    {activeModal.actionButtons.map((btn) => {
                      const disabled =
                        typeof btn.disabled === "function"
                          ? btn.disabled({ data, values: getValues() })
                          : !!btn.disabled;

                      return (
                        <Button
                          key={btn.id}
                          isDisabled={disabled}
                          onPress={() => runAction(btn)}
                          {...toHeroUIButtonProps(btn)}
                        >
                          {btn.label}
                        </Button>
                      );
                    })}
                    <Button
                      variant="light"
                      color="default"
                      onPress={() => {
                        onClose();
                        closeModal();
                      }}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                ) : (
                  <ModalFooter>
                    <Button
                      variant="light"
                      color="default"
                      onPress={() => {
                        onClose();
                        closeModal();
                      }}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </FormProvider>
  );
}

/* --------------------------- Details List --------------------------- */

type DetailsListProps<TData> = {
  title: string;
  rows: DetailRow<TData>[];
  data: TData;
};

export default function DetailsList<TData>({
  title,
  rows,
  data,
}: DetailsListProps<TData>) {
  return (
    <div
      className={`rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4 mb-2`}
    >
      <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
        {title}
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const valueNode =
            typeof row.value === "function" ? row.value({ data }) : row.value;

          return (
            <AppInfoRow
              key={row.key}
              icon={<AppIcon name={row.icon} />}
              title={row.label}
              value={renderValueForInfoRow(row.type, valueNode)}
              isTextArea={row.type === "paragraph"}
            />
          );
        })}
      </div>
    </div>
  );
}

function renderValueForInfoRow(type: DetailRowType, value: React.ReactNode) {
  if (type === "badge") {
    // If you later want real badge colors, return a Chip here instead
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-300 text-[12px]">
        {value}
      </span>
    );
  }

  if (type === "file") {
    // If `value` is already a link element, keep it
    return value;
  }

  if (type === "paragraph") {
    // AppInfoRow renders textarea using dangerouslySetInnerHTML, so pass string
    return typeof value === "string" ? value : String(value ?? "");
  }

  return value;
}

function renderDetailValue(
  type: DetailRowType,
  value: React.ReactNode,
  badgeColor?: string
) {
  if (type === "badge") {
    // HeroUI has Chip; but you asked "all others ui components".
    // If you want Chip, I can swap this to <Chip color=...>
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 10px",
          borderRadius: 999,
          border: "1px solid #d1d5db",
          fontSize: 12,
        }}
      >
        {value}
        {badgeColor ? null : null}
      </span>
    );
  }

  if (type === "paragraph") {
    return (
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{value}</div>
    );
  }

  return <div>{value}</div>;
}

/* --------------------------- Field Renderer -------------------------- */

function FieldRenderer<TData, TForm extends FieldValues>(props: {
  field: FieldSchema<TForm, TData>;
  disabled: boolean;
  data: TData;

  getValues: () => TForm;

  register: ReturnType<typeof useForm<TForm>>["register"];
  control: ReturnType<typeof useForm<TForm>>["control"];
}) {
  const { field, register, control, disabled, data, getValues } = props;

  const rules = buildRHFRegisterOptions(field, getValues);

  // HeroUI components show label internally; we use label prop
  switch (field.type) {
    case "text":
    case "date":
    case "number": {
      const inputType = field.type === "text" ? "text" : field.type;

      // register works fine for simple inputs
      return (
        <Input
          type={inputType}
          label={field.label}
          placeholder={field.placeholder}
          description={field.description}
          isDisabled={disabled}
          {...register(field.name, rules)}
          {...(field.ui as any)}
        />
      );
    }

    case "textarea": {
      return (
        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          description={field.description}
          isDisabled={disabled}
          minRows={4}
          {...register(field.name, rules)}
          {...(field.ui as any)}
        />
      );
    }

    case "checkbox": {
      // HeroUI has Checkbox component; using it is better than raw input.
      // If you want, I can switch to import { Checkbox } and use Controller here.
      // For now, keep it simple (still works):
      return (
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            disabled={disabled}
            {...register(field.name, rules)}
          />
          <span style={{ fontWeight: 600 }}>{field.label}</span>
          {field.description ? (
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {field.description}
            </span>
          ) : null}
        </label>
      );
    }

    case "select": {
      const options: SelectOption[] =
        typeof field.options === "function"
          ? field.options({ data, values: getValues() })
          : field.options;

      // HeroUI Select works best with Controller.
      // It uses selectedKeys (Set) and onSelectionChange(Set).
      return (
        <Controller
          control={control}
          name={field.name}
          rules={rules}
          render={({ field: rhf }) => {
            const current = rhf.value;
            const selectedKeys =
              current === undefined || current === null || current === ""
                ? new Set<string>([])
                : new Set<string>([String(current)]);

            return (
              <Select
                label={field.label}
                placeholder={field.placeholder ?? "Select..."}
                description={field.description}
                isDisabled={disabled}
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                  const first = Array.from(keys)[0];
                  // if user clears selection
                  rhf.onChange(first ?? "");
                }}
                {...(field.ui as any)}
              >
                {options.map((opt: SelectOption) => (
                  <SelectItem
                    key={String(opt.value)}
                    isDisabled={!!opt.disabled}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </Select>
            );
          }}
        />
      );
    }

    case "file": {
      const accept = "accept" in field ? field.accept : undefined;
      const multiple = "multiple" in field ? field.multiple : undefined;

      // HeroUI doesn't have a native File input component; use Input type="file"
      return (
        <Input
          type="file"
          label={field.label}
          description={field.description}
          isDisabled={disabled}
          accept={accept}
          multiple={multiple}
          {...register(field.name, rules)}
          {...(field.ui as any)}
        />
      );
    }

    default:
      return null;
  }
}

/** Build RHF rules from our FieldRules */
function buildRHFRegisterOptions<TForm extends FieldValues, TData>(
  field: FieldSchema<TForm, TData>,
  getValues: () => TForm
) {
  const base = field.rules?.register ?? undefined;

  if (!field.rules?.validateWithValues) return base;

  const validateWithValues = field.rules.validateWithValues;

  return {
    ...base,
    validate: (value: any) =>
      validateWithValues(value, { values: getValues() }),
  };
}
