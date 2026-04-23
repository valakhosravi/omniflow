import { Textarea } from "@heroui/react";
import { AppTextAreaPrpsType } from "./AppTextArea.type";

export default function AppTextArea({
  onChange,
  label,
  labelPlacement,
  name,
  errorMessage,
  value,
}: AppTextAreaPrpsType) {
  return (
    <div>
      <div className="w-full mb-2">
        <p>{label}</p>
      </div>
      <Textarea
        name={name}
        value={value}
        rows={3}
        onChange={onChange}
        classNames={{
          base: "w-full",
          inputWrapper: `
          ${"bg-white "}
               "w-full"
              
          }
          border border-default-300 rounded-[12px] shadow-none 
          h-[120px]`,
        }}
        labelPlacement={labelPlacement}
        fullWidth
      />
      {typeof errorMessage === "string" && (
        <div className="mt-2">
          <p className="text-sm  text-accent-500 placeholder:text-secondary-400 font-[300] text-[12px]">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
