import React, { type Dispatch, type SetStateAction } from "react";
import {
  Controller,
  useForm,
  type FieldErrors,
  type FieldValues,
} from "react-hook-form";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import type { FieldSchema, SelectOption } from "../AppWorkflowPage.type";
import { AppCheckbox } from "../../AppCheckbox";
import AppFile from "../../AppFile";
import type { FileType } from "../../AppFile/AppFile.types";

/* ----------------------- Helpers ----------------------- */

/** Resolve a (possibly nested) field error message from RHF errors object. */
function getFieldError(
  errors: Record<string, any>,
  name: string,
): string | undefined {
  const segments = name.split(".");
  let node: any = errors;
  for (const seg of segments) {
    node = node?.[seg];
  }
  return typeof node?.message === "string" ? node.message : undefined;
}

/* ----------------------- FieldRenderer ----------------------- */

type FieldRendererProps<TData, TForm extends FieldValues> = {
  field: FieldSchema<TForm, TData>;
  disabled: boolean;
  data: TData;
  /** Reactive snapshot from useWatch — use for render-time reads. */
  values: TForm;
  /** Imperative getter — only needed for validation callbacks that run outside render. */
  getValues: () => TForm;
  register: ReturnType<typeof useForm<TForm>>["register"];
  control: ReturnType<typeof useForm<TForm>>["control"];
  errors: FieldErrors<TForm>;
};

export default function FieldRenderer<TData, TForm extends FieldValues>(
  props: FieldRendererProps<TData, TForm>,
) {
  const { field, register, control, disabled, data, values, getValues, errors } = props;

  const rules = buildRHFRegisterOptions(field, getValues);
  const errorMessage = getFieldError(
    errors as Record<string, any>,
    field.name,
  );

  switch (field.type) {
    case "text":
    case "date":
    case "number": {
      const inputType = field.type === "text" ? "text" : field.type;

      return (
        <Input
          type={inputType}
          label={field.label}
          placeholder={field.placeholder}
          description={field.description}
          isDisabled={disabled}
          isInvalid={!!errorMessage}
          errorMessage={errorMessage}
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
          isInvalid={!!errorMessage}
          errorMessage={errorMessage}
          minRows={4}
          {...register(field.name, rules)}
          {...(field.ui as any)}
        />
      );
    }

    case "checkbox": {
      return (
        <Controller
          control={control}
          name={field.name}
          rules={rules}
          render={({ field: rhf }) => (
            <>
              <AppCheckbox
                name={field.name}
                label={field.label}
                description={field.description}
                checked={!!rhf.value}
                onChange={rhf.onChange}
                disabled={disabled}
              />
              {errorMessage && (
                <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
              )}
            </>
          )}
        />
      );
    }

    case "select": {
      const options: SelectOption[] =
        typeof field.options === "function"
          ? field.options({ data, values })
          : field.options;

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
                isInvalid={!!errorMessage}
                errorMessage={errorMessage}
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                  const first = Array.from(keys)[0];
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
      const resolvedRequestId =
        typeof field.requestId === "function"
          ? field.requestId({ data, values })
          : field.requestId;

      return (
        <Controller
          control={control}
          name={field.name}
          rules={rules}
          render={({ field: rhf }) => {
            const files: FileType[] = rhf.value ?? [];
            const setFiles: Dispatch<SetStateAction<FileType[]>> = (action) => {
              const next =
                typeof action === "function" ? action(files) : action;
              rhf.onChange(next);
            };

            if (disabled) {
              return (
                <AppFile
                  enableUpload={false}
                  files={files}
                  setFiles={setFiles}
                  featureName={field.featureName}
                  requestId={resolvedRequestId ?? ""}
                />
              );
            }

            return (
              <AppFile
                enableUpload={true}
                files={files}
                setFiles={setFiles}
                featureName={field.featureName}
                isMultiple={field.isMultiple ?? false}
                requestId={resolvedRequestId}
              />
            );
          }}
        />
      );
    }

    default:
      return null;
  }
}

/* ----------------------- Helpers ----------------------- */

function buildRHFRegisterOptions<TForm extends FieldValues, TData>(
  field: FieldSchema<TForm, TData>,
  getValues: () => TForm,
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
