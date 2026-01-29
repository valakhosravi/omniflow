import { RHFTextFieldProps } from "@/models/input/import";
import React, { useState } from "react";

export default function RHFTextField({
  type = "text",
  label,
  name,
  dir = "rtl",
  register,
  errors,
  validationSchema = {},
  icon,
  placeholder,
  isLogin,
  ...rest
}: RHFTextFieldProps) {
  const errorMessages = errors?.[name];
  const hasError = !!(errors && errorMessages);

  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      className={`textField relative ${hasError ? "textField--invalid" : ""}`}
    >
      {icon && !inputValue && (
        <span
          className={`absolute right-2 ${
            hasError ? "top-[33%] text-red-600" : "top-[50%] text-secondary-200"
          } -translate-y-1/2  pointer-events-none`}
        >
          {icon}
        </span>
      )}
      {isLogin && (
        <label htmlFor={name} className="block text-secondary-700">
          {label}
        </label>
      )}
      <input
        autoComplete="off"
        placeholder={placeholder}
        type={type}
        id={name}
        dir={dir}
        className={`${
          hasError
            ? "placeholder:text-red-600"
            : "placeholder:text-secondary-200"
        }  ${hasError ? "border-red-600" : "border-secondary-200"} ${
          dir === "ltr" ? "text-left" : "text-right"
        } ${isLogin ? "textField__input border-b" : "textField__input-login"}`}
        {...register(name, validationSchema)}
        {...rest}
        value={inputValue}
        onChange={handleChange}
      />
      {hasError && (
        <span className="text-red-600 block text-xs mt-2">
          {errorMessages?.message as string}
        </span>
      )}
    </div>
  );
}
