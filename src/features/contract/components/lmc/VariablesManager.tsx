"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import { useForm, Controller } from "react-hook-form";
import { Select, SelectItem } from "@/ui/NextUi";
import { Checkbox } from "@heroui/react";
import OperationDropdown from "@/ui/OperationDropdown";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { useDisclosure } from "@/ui/NextUi";
import {
  ContractFieldType,
  TemplateVariable,
} from "../../contract.types";
import { addToaster } from "@/ui/Toaster";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy } from "iconsax-reactjs";

interface VariablesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  variables: TemplateVariable[];
  onVariablesChange: (variables: TemplateVariable[]) => void;
}

interface VariableFormData {
  Name: string;
  DisplayName: string;
  ContractFieldId: number;
  FieldType: number;
  FieldTypeDescription: string;
  IsRequired: boolean;
}

// Sortable Variable Item Component
function SortableVariableItem({
  variable,
  onEdit,
  onDelete,
}: {
  variable: TemplateVariable;
  onEdit: (variable: TemplateVariable) => void;
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: variable.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCopy = async () => {
    const textToCopy = `{${variable.Name}}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      addToaster({
        title: "متغیر کپی شد",
        color: "success",
      });
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        addToaster({
          title: "متغیر کپی شد",
          color: "success",
        });
      } catch {
        addToaster({
          title: "خطا در کپی کردن",
          color: "danger",
        });
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg border border-secondary-100"
    >
      <div className="flex items-center gap-2 flex-1">
        {/* <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-secondary-400 hover:text-secondary-600 transition-colors"
          type="button"
        >
          <More size={20} className="rotate-90" />
        </button> */}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-secondary-500 font-mono bg-white px-2 py-1 rounded border">
              {variable.Name}
            </span>
            <span className="text-secondary-300">-</span>
            <span className="text-[14px] text-secondary-950">
              {variable.DisplayName}
            </span>

            {variable.FieldTypeDescription && (
              <>
                <span className="text-secondary-300">-</span>
                <span className="text-[12px] text-secondary-400 bg-secondary-100 px-2 py-1 rounded">
                  {variable.FieldTypeDescription}
                </span>
              </>
            )}
            {variable.IsRequired && (
              <>
                <span className="text-secondary-300">-</span>
                <span className="text-[12px] text-accent-500 bg-accent-50 px-2 py-1 rounded">
                  اجباری
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          type="button"
          title="کپی متغیر"
        >
          <Copy size={18} className="text-secondary-600" />
        </button>
        <OperationDropdown
          items={[
            {
              key: "edit",
              label: "ویرایش",
              icon: <Icon name="edit" className="size-4" />,
              onClick: () => onEdit(variable),
            },
            {
              key: "delete",
              label: "حذف",
              color: "danger",
              icon: <Icon name="trash" className="size-4" />,
              onClick: () => onDelete(variable.id),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default function VariablesManager({
  isOpen,
  onClose,
  variables,
  onVariablesChange,
}: VariablesManagerProps) {
  console.log('variables', variables)
  const [editingVariable, setEditingVariable] =
    useState<TemplateVariable | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deletingVariableId, setDeletingVariableId] = useState<string | null>(
    null,
  );

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<VariableFormData>({
    defaultValues: {
      Name: "",
      DisplayName: "",
      FieldType: ContractFieldType.Text,
      FieldTypeDescription: "",
      IsRequired: false,
    },
  });

  // Reset form when editingVariable changes
  useEffect(() => {
    if (editingVariable) {
      // Set form values when editing - use setValue for all fields to ensure Controller fields update
      setValue("Name", editingVariable.Name || "", { shouldValidate: false });
      setValue("DisplayName", editingVariable.DisplayName || "", {
        shouldValidate: false,
      });
      setValue(
        "FieldType",
        editingVariable.FieldType || ContractFieldType.Text,
        { shouldValidate: false },
      );
      setValue(
        "FieldTypeDescription",
        editingVariable.FieldTypeDescription || "",
        { shouldValidate: false },
      );
      setValue("IsRequired", editingVariable.IsRequired || false, {
        shouldValidate: false,
      });
      // Also call reset to ensure form state is properly updated
      reset(
        {
          Name: editingVariable.Name || "",
          DisplayName: editingVariable.DisplayName || "",
          FieldType: editingVariable.FieldType || ContractFieldType.Text,
          FieldTypeDescription: editingVariable.FieldTypeDescription || "",
          IsRequired: editingVariable.IsRequired || false,
        },
        { keepDefaultValues: false },
      );
      // Scroll to form when editing starts
      setTimeout(() => {
        const formElement = document.getElementById("variable-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // Reset form when not editing
      reset(
        {
          Name: "",
          DisplayName: "",
          FieldType: ContractFieldType.Text,
          FieldTypeDescription: "",
          IsRequired: false,
        },
        { keepDefaultValues: false },
      );
    }
  }, [editingVariable, reset, setValue]);

  const handleEditVariable = (variable: TemplateVariable) => {
    setEditingVariable(variable);
  };

  const handleDeleteVariable = (variableId: string) => {
    setDeletingVariableId(variableId);
    onDeleteOpen();
  };

  const confirmDelete = (id: number | string) => {
    const variableId = id as string;
    const updatedVariables = variables.filter((v) => v.id !== variableId);
    onVariablesChange(updatedVariables);
    setDeletingVariableId(null);
    onDeleteClose();
  };

  const onSubmit = (data: VariableFormData) => {
    const now = new Date().toISOString();
    const currentMaxSortOrder =
      variables.length > 0
        ? Math.max(...variables.map((v) => v.SortOrder || 0))
        : 0;

    if (editingVariable) {
      // Update existing variable
      const updatedVariables = variables.map((v) =>
        v.id === editingVariable.id
          ? {
              ...v,
              Name: data.Name,
              DisplayName: data.DisplayName,
              FieldType: data.FieldType,
              FieldTypeDescription: data.FieldTypeDescription,
              IsRequired: data.IsRequired,
            }
          : v,
      );
      onVariablesChange(updatedVariables);
    } else {
      // Add new variable
      const newVariable: TemplateVariable = {
        id: crypto.randomUUID(),
        ContractFieldId: 0,
        Name: data.Name,
        DisplayName: data.DisplayName,
        FieldType: data.FieldType,
        FieldTypeDescription: data.FieldTypeDescription,
        IsRequired: data.IsRequired,
        SortOrder: currentMaxSortOrder + 1,
        CreatedDate: now,
      };
      onVariablesChange([...variables, newVariable]);
    }
    reset();
    setEditingVariable(null);
  };

  const handleClose = () => {
    reset();
    setEditingVariable(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleClose}
        hideCloseButton
        isDismissable={true}
        className="max-w-[800px]"
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
            <span className="text-secondary-950">مدیریت متغیرها</span>
            <span className="cursor-pointer" onClick={handleClose}>
              <Icon name="close" className="text-secondary-300" />
            </span>
          </ModalHeader>
          <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

          <ModalBody className="px-[20px] py-0 max-h-[60vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} id="variable-form">
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-secondary-950">
                    {editingVariable ? "ویرایش متغیر" : "افزودن متغیر جدید"}
                  </h3>
                  {/* {!editingVariable && (
                    <CustomButton
                      buttonVariant="outline"
                      buttonSize="sm"
                      type="button"
                      onPress={handleAddVariable}
                    >
                      <Icon name="add" className="size-4" />
                      افزودن
                    </CustomButton>
                  )} */}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <RHFInput
                    label="نام انگلیسی"
                    name="Name"
                    control={control}
                    rules={{
                      required: "نام الزامی است",
                      pattern: {
                        value: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                        message:
                          "نام باید با حرف یا _ شروع شود و فقط شامل حروف، اعداد و _ باشد",
                      },
                      validate: (value) => {
                        // Check for duplicate names (case-insensitive)
                        const normalizedValue = value?.toLowerCase().trim();
                        const isDuplicate = variables.some((v) => {
                          // When editing, exclude the current variable from the check
                          if (editingVariable && v.id === editingVariable.id) {
                            return false;
                          }
                          return (
                            v.Name?.toLowerCase().trim() === normalizedValue
                          );
                        });
                        return (
                          !isDuplicate ||
                          "این نام قبلاً استفاده شده است و باید یکتا باشد"
                        );
                      },
                    }}
                    error={errors.Name?.message}
                    placeholder="مثال: companyName"
                    inputDirection="rtl"
                    textAlignment="text-left"
                    fullWidth
                  />

                  <RHFInput
                    label="نام فارسی"
                    name="DisplayName"
                    control={control}
                    rules={{
                      required: "نام نمایشی الزامی است",
                      minLength: {
                        value: 2,
                        message: "نام نمایشی باید حداقل 2 کاراکتر باشد",
                      },
                    }}
                    error={errors.DisplayName?.message}
                    placeholder="مثال: نام شرکت"
                    inputDirection="rtl"
                    textAlignment="text-right"
                    fullWidth
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[14px]/[20px] text-secondary-950 block mb-[14px]">
                      نوع فیلد<span className="text-accent-500">*</span>
                    </label>
                    <Controller
                      name="FieldType"
                      control={control}
                      rules={{
                        required: "نوع فیلد الزامی است",
                      }}
                      render={({ field }) => (
                        <Select
                          placeholder="نوع فیلد را انتخاب کنید"
                          isInvalid={!!errors.FieldType}
                          errorMessage={errors.FieldType?.message}
                          variant="bordered"
                          aria-label="نوع فیلد"
                          selectedKeys={
                            field.value ? [String(field.value)] : []
                          }
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0];
                            const fieldType = Number(selectedValue);
                            field.onChange(fieldType);
                          }}
                          classNames={{
                            base: "w-full",
                            trigger:
                              "bg-white border border-default-300 rounded-[12px] shadow-none h-[56px] min-h-[56px] w-full",
                            value: "text-sm text-secondary-950",
                            popoverContent: "border border-default-300",
                          }}
                        >
                          <SelectItem key={String(ContractFieldType.Text)}>
                            متن (Text)
                          </SelectItem>
                          <SelectItem key={String(ContractFieldType.Number)}>
                            عدد (Number)
                          </SelectItem>
                          <SelectItem key={String(ContractFieldType.Date)}>
                            تاریخ (Date)
                          </SelectItem>
                          <SelectItem key={String(ContractFieldType.Checkbox)}>
                            چک باکس (Checkbox)
                          </SelectItem>
                        </Select>
                      )}
                    />
                  </div>

                  <RHFInput
                    label="توضیحات"
                    name="FieldTypeDescription"
                    control={control}
                    error={errors.FieldTypeDescription?.message}
                    placeholder=""
                    inputDirection="ltr"
                    textAlignment="text-right"
                    fullWidth
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Controller
                    name="IsRequired"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        isSelected={value}
                        onValueChange={onChange}
                        classNames={{
                          wrapper: "after:bg-primary-950",
                        }}
                      >
                        <span className="text-sm text-secondary-950">
                          فیلد اجباری است
                        </span>
                      </Checkbox>
                    )}
                  />
                </div>

                {editingVariable && (
                  <div className="flex gap-2">
                    <CustomButton
                      buttonVariant="primary"
                      buttonSize="sm"
                      type="submit"
                    >
                      ذخیره تغییرات
                    </CustomButton>
                    <CustomButton
                      buttonVariant="outline"
                      buttonSize="sm"
                      type="button"
                      onPress={() => {
                        reset();
                        setEditingVariable(null);
                      }}
                    >
                      انصراف
                    </CustomButton>
                  </div>
                )}
              </div>
            </form>
            {!editingVariable && (
              <div className="flex justify-end">
                <CustomButton
                  buttonVariant="primary"
                  type="submit"
                  form="variable-form"
                >
                  افزودن متغیر
                </CustomButton>
              </div>
            )}

            {variables.length > 0 && (
              <div className="mt-6 border-t border-secondary-100 pt-4">
                <h3 className="text-[14px] font-semibold text-secondary-950 mb-4">
                  لیست متغیرها ({variables.length})
                </h3>
                <div className="space-y-2">
                  {variables
                    .sort((a, b) => (a.SortOrder || 0) - (b.SortOrder || 0))
                    .map((variable) => (
                      <SortableVariableItem
                        key={variable.ContractFieldId}
                        variable={variable}
                        onEdit={handleEditVariable}
                        onDelete={handleDeleteVariable}
                      />
                    ))}
                </div>
              </div>
            )}

            {variables.length === 0 && (
              <div className="text-center py-8 text-secondary-400 text-[14px]">
                هیچ متغیری اضافه نشده است
              </div>
            )}
          </ModalBody>

          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[20px]">
            <CustomButton
              buttonVariant="outline"
              onPress={handleClose}
              type="button"
            >
              بستن
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {deletingVariableId && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={confirmDelete}
          itemId={deletingVariableId}
          description="آیا از حذف این متغیر مطمئن هستید؟"
        />
      )}
    </>
  );
}
