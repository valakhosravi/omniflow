import { FiledInputProps } from "@/models/input/FiledInputProps";
import { Button, Spinner } from "@/ui/NextUi";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "./Icon";
import Loading from "@/ui/Loading";

function FieldInput({
  label,
  name,
  value,
  dir = "rtl",
  onChange,
  className,
  validationSchema = {},
  errors,
  preview,
  onRemovePreview,
  loading,
  onPress,
  isRequired = false,
  hasSubmitted,
  file,
  ...rest
}: FiledInputProps) {
  const errorMessages = errors?.[name];
  const hasError = !!errorMessages;
  const showError = hasError && hasSubmitted;

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const event = {
        target: {
          name,
          files: e.dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onChange(event);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-secondary-950">
      <label
        // htmlFor="file-upload"
        className="font-bold text-[14px]/[20px] mb-[11px]"
      >
        {label} {isRequired && <span className="text-accent-500">*</span>}
      </label>

      {!preview && (
        <label
          tabIndex={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          htmlFor="file-upload"
          style={
            {
              "--dash-color": showError
                ? "rgba(244,67,54,0.8)"
                : "rgba(28,58,99,0.2)",
            } as React.CSSProperties
          }
          className={`cursor-pointer dash-border w-[706px] h-[120px]
         flex items-center justify-center transition relative overflow-hidden ${className}`}
        >
          <div className="flex flex-col items-center gap-y-2 justify-center">
            <Icon name="add" className="size-[24px] text-primary-950" />
            <div
              className="flex flex-col items-center gap-y-[12px] font-medium text-[12px]/[18px]
            text-secondary-400"
            >
              <span>
                فایل‌ها را بکشید و رها کنید یا کلیک کنید و انتخاب نمایید
              </span>
              <span>حداکثر حجم فایل: ۱۰ مگابایت</span>
            </div>
          </div>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="sr-only hidden"
            name={name}
            dir={dir}
            onChange={onChange}
            {...rest}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded">
              {/* <Spinner size="lg" color="primary" variant="wave" /> */}
              <Loading />
            </div>
          )}
        </label>
      )}

      {preview && (
        <div
          className="flex items-center justify-between w-full border border-primary-950/[.2] rounded-[12px]
        p-[12px]"
        >
          <div className="flex gap-x-[10px] items-center">
            <div className="relative w-[58px] h-[58px]">
              {preview.startsWith("blob:") || preview.startsWith("http") ? (
                <Image
                  src={preview}
                  alt="Uploaded Preview"
                  fill
                  className="object-cover object-center transition-all duration-300 ease-out rounded-[6px]"
                  unoptimized={preview.startsWith("blob:")}
                />
              ) : (
                <img
                  src={preview}
                  alt="Uploaded Preview"
                  className="w-full h-full object-cover object-center transition-all duration-300 ease-out rounded-[6px]"
                />
              )}
            </div>
            <div className="flex flex-col font-medium text-[12px]/[18px] space-y-1">
              <p className="text-secondary-950">فایل با موفقیت بارگذاری شد</p>
              <p className="text-secondary-400 gap-x-0.5 w-full">
                <span>{file?.size}</span>
                <span> کیلوبایت</span>
              </p>
            </div>
          </div>
          <Button
            isIconOnly
            onPress={onPress}
            className="bg-transparent top-0 self-start"
            as="div"
            role="button"
          >
            <Icon
              name="closeCircle"
              className="size-[24px] text-secondary-300"
            />
          </Button>
        </div>
      )}

      {showError && (
        <span className="text-red-600 block text-xs mt-2">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}
export default FieldInput;
