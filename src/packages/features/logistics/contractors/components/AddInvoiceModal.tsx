"use client";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@heroui/react";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCamunda } from "@/packages/camunda";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import { addToaster } from "@/ui/Toaster";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CloudPlus, Document, Image as ImageIcon } from "iconsax-reactjs";
import { PiPresentation } from "react-icons/pi";
import { TbZip } from "react-icons/tb";
import Image from "next/image";
import { useSaveProcessAttachmentMutation } from "@/services/commonApi/commonApi";

interface InvoiceFormData {
  Title: string;
  MobileNumber: string;
  Description: string;
  InvoiceTitle: string;
  InvoiceDate: string;
  FactorNumber: string;
  Amount: string;
  Destination: string;
}

interface AddInvoiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
}

export default function AddInvoiceModal({
  isOpen,
  onOpenChange,
  projectId,
}: AddInvoiceModalProps) {
  const { data: processByNameAndVersion } =
    useGetProcessByNameAndVersion("InvoicePayment");
  const { startProcessWithPayload, isStartingProcess } = useCamunda();
  const [saveProcessAttachment] = useSaveProcessAttachmentMutation();
  const { userDetail } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [fileTitles, setFileTitles] = useState<Record<number, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});
  const prevPreviewUrlsRef = useRef<Record<number, string>>({});

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      Title: "",
      MobileNumber: "",
      Description: "",
      InvoiceTitle: "",
      InvoiceDate: "",
      FactorNumber: "",
      Amount: "",
      Destination: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setFiles([]);
      setFileTitles({});
      setIsDragging(false);
    }
  }, [isOpen, reset]);

  // Create preview URLs for image files
  useEffect(() => {
    if (!isOpen) {
      // Cleanup all preview URLs when modal closes
      Object.values(prevPreviewUrlsRef.current).forEach((url: string) => {
        URL.revokeObjectURL(url);
      });
      prevPreviewUrlsRef.current = {};
      setPreviewUrls({});
      return;
    }

    const newPreviewUrls: Record<number, string> = {};
    files.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        newPreviewUrls[index] = URL.createObjectURL(file);
      }
    });

    // Revoke old URLs that are no longer needed
    Object.entries(prevPreviewUrlsRef.current).forEach(([index, url]) => {
      if (!newPreviewUrls[Number(index)]) {
        URL.revokeObjectURL(url as string);
      }
    });

    prevPreviewUrlsRef.current = newPreviewUrls;
    setPreviewUrls(newPreviewUrls);

    // Cleanup on unmount
    return () => {
      Object.values(newPreviewUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files, isOpen]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);

      // Set default titles for new files
      const newTitles: Record<number, string> = {};
      newFiles.forEach((file, index) => {
        const fileIndex = files.length + index;
        newTitles[fileIndex] = "فایل صورتحساب";
      });
      setFileTitles((prev) => ({ ...prev, ...newTitles }));
    }
    // Reset input to allow selecting the same file again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prev) => [...prev, ...newFiles]);

      // Set default titles for new files
      const newTitles: Record<number, string> = {};
      newFiles.forEach((file, index) => {
        const fileIndex = files.length + index;
        newTitles[fileIndex] = "فایل صورتحساب";
      });
      setFileTitles((prev) => ({ ...prev, ...newTitles }));
    }
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type;
    const fileName = file.name;
    const ext = fileName?.split(".").pop()?.toLowerCase();

    if (fileType.includes("pdf")) {
      return <Icon name="pdf" className="size-[32px]" />;
    }
    if (
      fileType.includes("presentation") ||
      fileType.includes("powerpoint") ||
      ext === "pptx" ||
      ext === "ppt"
    ) {
      return <PiPresentation className="size-[32px] text-orange-500" />;
    }
    if (
      fileType.includes("word") ||
      fileType.includes("document") ||
      ext === "docx" ||
      ext === "doc"
    ) {
      return <Icon name="word" className="size-[32px]" />;
    }
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      ext === "zip" ||
      ext === "rar"
    ) {
      return <TbZip size={32} />;
    }
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="size-[32px] text-primary-950/[.2]" />;
    }
    return <Document className="size-[32px] text-primary-950/[.2]" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const toEnglishDigits = (str: string): string => {
    return str.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
  };

  const getFilePreviewUrl = (index: number): string | null => {
    return previewUrls[index] || null;
  };

  const handleRemoveFile = (index: number) => {
    // Revoke preview URL if exists
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Update titles to match new indices
      setFileTitles((titles) => {
        const newTitles: Record<number, string> = {};
        updated.forEach((_, i) => {
          if (i < index) {
            newTitles[i] = titles[i];
          } else {
            newTitles[i] = titles[i + 1] || "فایل صورتحساب";
          }
        });
        return newTitles;
      });
      return updated;
    });

    // Update preview URLs
    const newUrls: Record<number, string> = {};
    Object.entries(previewUrls).forEach(([i, url]) => {
      const idx = Number(i);
      if (idx < index) {
        newUrls[idx] = url;
      } else if (idx > index) {
        newUrls[idx - 1] = url;
      }
    });
    prevPreviewUrlsRef.current = newUrls;
    setPreviewUrls(newUrls);
  };

  const handleFileTitleChange = (index: number, title: string) => {
    setFileTitles((prev) => ({ ...prev, [index]: title }));
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // Convert Amount to number (RHFInput with withCommaSeparator stores it without commas)
      const amountValue = data.Amount
        ? typeof data.Amount === "string"
          ? parseInt(data.Amount.replace(/,/g, ""), 10)
          : Number(data.Amount)
        : 0;

      const payload = {
        PersonnelId: String(userDetail?.UserDetail?.PersonnelId) || "",
        Title: data.Title || "",
        MobileNumber: data.MobileNumber || "",
        Description: data.Description || "",
        ProjectId: projectId,
        InvoiceTitle: data.InvoiceTitle || "",
        InvoiceDate: data.InvoiceDate ? toEnglishDigits(data.InvoiceDate) : "",
        FactorNumber: data.FactorNumber || "",
        Amount: amountValue,
        Destination: data.Destination || "",
      };

      // Start the Camunda process
      const processResult = await startProcessWithPayload(
        processByNameAndVersion?.Data?.DefinitionId || "",
        payload
      );

      // If there are files, submit them after process starts
      if (files.length > 0 && processResult?.id) {
        const attachments = files.map((file, index) => ({
          Title: fileTitles[index] || "فایل صورتحساب",
          AttachmentKey: fileTitles[index] || "فایل صورتحساب",
          AttachmentFile: file,
        }));

        await saveProcessAttachment({
          InstanceId: processResult.id,
          ProcessName: "InvoicePayment",
          IsStart: true,
          AttachmentDetails: attachments,
        }).unwrap();
      }

      addToaster({
        color: "success",
        title: "صورتحساب با موفقیت ثبت شد",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      addToaster({
        color: "danger",
        title: "خطا در ثبت صورتحساب",
      });
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "overflow-y-auto",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">افزودن صورتحساب</span>
          <span
            className="cursor-pointer"
            onClick={() => handleModalChange(false)}
          >
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="px-[20px] py-[20px] max-h-[640px] overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
              <RHFInput
                label="عنوان"
                {...register("Title", {
                  required: "عنوان الزامی است",
                })}
                error={errors.Title?.message}
                control={control}
                fullWidth
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
              />

              <RHFInput
                label="شماره موبایل"
                {...register("MobileNumber", {
                  required: "شماره موبایل الزامی است",
                  pattern: {
                    value: /^09\d{9}$/,
                    message: "شماره موبایل معتبر نیست",
                  },
                })}
                error={errors.MobileNumber?.message}
                control={control}
                fullWidth
                height={48}
                inputDirection="ltr"
                textAlignment="text-left"
              />

              <RHFInput
                label="عنوان صورتحساب"
                {...register("InvoiceTitle", {
                  required: "عنوان صورتحساب الزامی است",
                })}
                error={errors.InvoiceTitle?.message}
                control={control}
                fullWidth
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
              />

              <Controller
                name="InvoiceDate"
                control={control}
                rules={{ required: "تاریخ صورتحساب الزامی است" }}
                render={({ field }) => (
                  <div className="flex flex-col w-full">
                    <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[14px]">
                      تاریخ صورتحساب
                      <span className="text-accent-500"> *</span>
                    </label>
                    <div className="relative bg-white border border-default-300 rounded-[12px] shadow-none w-full h-[48px] flex items-center justify-center">
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={field.value}
                        onChange={(date: DateObject | null) => {
                          if (date) {
                            field.onChange(date.format("YYYY/MM/DD"));
                          } else {
                            field.onChange("");
                          }
                        }}
                        inputClass="text-sm text-secondary-950 text-right w-full h-full px-3 outline-none border-none bg-transparent"
                        containerClassName="w-full"
                      />
                    </div>
                    {errors.InvoiceDate?.message && (
                      <p className="text-danger text-[12px]/[18px] mt-1">
                        {errors.InvoiceDate?.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <RHFInput
                label="شماره فاکتور"
                {...register("FactorNumber", {
                  required: "شماره فاکتور الزامی است",
                })}
                error={errors.FactorNumber?.message}
                control={control}
                fullWidth
                height={48}
                inputDirection="ltr"
                textAlignment="text-left"
              />

              <RHFInput
                label="مبلغ"
                type="number"
                {...register("Amount", {
                  required: "مبلغ الزامی است",
                  validate: (value) => {
                    const numValue = value
                      ? parseInt(value.replace(/,/g, ""))
                      : 0;
                    return numValue > 0 || "مبلغ باید بیشتر از صفر باشد";
                  },
                })}
                error={errors.Amount?.message}
                control={control}
                fullWidth
                height={48}
                inputDirection="ltr"
                textAlignment="text-left"
                withCommaSeparator
              />

              <div className="col-span-3">
                <RHFInput
                  label="مقصد"
                  {...register("Destination", {
                    required: "مقصد الزامی است",
                  })}
                  error={errors.Destination?.message}
                  control={control}
                  fullWidth
                  height={48}
                  inputDirection="rtl"
                  textAlignment="text-right"
                />
              </div>

              <div className="col-span-3">
                <RHFInput
                  label="توضیحات"
                  isTextarea
                  {...register("Description")}
                  error={errors.Description?.message}
                  control={control}
                  fullWidth
                  height={100}
                  inputDirection="rtl"
                  textAlignment="text-right"
                  placeholder="توضیحات را وارد کنید"
                />
              </div>

              <div className="col-span-3">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[14px]/[20px] text-secondary-950">
                    فایل‌های پیوست
                  </label>

                  <label
                    tabIndex={0}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    htmlFor="invoice-file-upload"
                    style={
                      {
                        "--dash-color": isDragging
                          ? "rgba(28,58,99,0.5)"
                          : "rgba(28,58,99,0.2)",
                      } as React.CSSProperties
                    }
                    className={`cursor-pointer dash-border w-full h-[100px] transition-all duration-300 relative overflow-hidden ${
                      isDragging ? "bg-primary-50" : ""
                    } p-1`}
                  >
                    <div className="w-full h-full bg-primary-950/[.03] rounded-[12px] flex items-center justify-center">
                      <div className="flex items-center gap-x-2 justify-center">
                        <div
                          className={`p-2 bg-white rounded-[8px] border border-primary-950/[.1] transition-all duration-300 ${
                            isDragging ? "scale-110" : ""
                          }`}
                        >
                          <CloudPlus className="size-[24px] text-primary-950" />
                        </div>
                        <div className="flex flex-col items-start gap-y-[4px] text-[12px]/[18px]">
                          <span className="font-semibold text-secondary-950">
                            {isDragging
                              ? "فایل را رها کنید"
                              : "فایل را رها کرده و یا بکشید و بارگذاری کنید"}
                          </span>
                          <span className="font-medium text-secondary-400">
                            حداکثر حجم فایل ۱۰ مگابایت (PNG, JPEG, PDF, Word,
                            Docx)
                          </span>
                        </div>
                      </div>

                      <input
                        id="invoice-file-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="sr-only hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </label>

                  {files.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {files.map((file, index) => {
                        const previewUrl = getFilePreviewUrl(index);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 border border-default-300 rounded-[12px] bg-white hover:border-primary-950/[.3] transition-colors"
                          >
                            <div className="relative w-[64px] h-[64px] flex items-center justify-center flex-shrink-0">
                              {previewUrl ? (
                                <Image
                                  src={previewUrl}
                                  alt={file.name}
                                  fill
                                  className="object-cover rounded-[8px]"
                                />
                              ) : (
                                <div className="w-full h-full bg-primary-950/[.03] rounded-[8px] flex items-center justify-center border border-primary-950/[.1]">
                                  {getFileIcon(file)}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={fileTitles[index] || "فایل صورتحساب"}
                                onChange={(e) =>
                                  handleFileTitleChange(index, e.target.value)
                                }
                                placeholder="عنوان فایل"
                                className="w-full px-3 py-2 text-sm border border-default-300 rounded-[8px] text-right bg-white focus:outline-none focus:ring-2 focus:ring-primary-950/[.2] focus:border-primary-950"
                              />
                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-xs text-secondary-400 truncate">
                                  {file.name}
                                </p>
                                <span className="text-xs text-secondary-400 flex-shrink-0">
                                  • {formatFileSize(file.size)}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-danger hover:text-danger-600 p-2 hover:bg-danger-50 rounded-[8px] transition-colors flex-shrink-0"
                              title="حذف فایل"
                            >
                              <Icon name="trash" className="size-5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="px-[20px] pb-[20px]">
            <Button
              color="default"
              variant="light"
              onPress={() => handleModalChange(false)}
              isDisabled={isStartingProcess}
            >
              بستن
            </Button>
            <Button
              type="submit"
              className="bg-primary-950 text-white"
              isLoading={isStartingProcess}
              isDisabled={isStartingProcess}
            >
              ثبت
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
