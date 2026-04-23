"use client";

import React from "react";
import Link from "next/link";
import { AppIcon } from "../AppIcon";
import {
  COLOR_CLASSES,
  SIZE_CLASSES,
  BORDER_RADIUS_CLASSES,
  ICON_SIZE,
  FOCUS_RING_CLASSES,
} from "./AppButton.constants";
import type { AppButtonProps, ButtonColor } from "./AppButton.types";
import { classNames } from "@/utils/classNames";

const BASE_CLASSES =
  "inline-flex items-center justify-center font-medium transition-all duration-500 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative text-nowrap";

function AppButton({
  label,
  linkConfig,
  icon,
  iconPos = "left",
  loading = false,
  color = "primary",
  raised = false,
  variant = "contained",
  badge,
  badgeClassName,
  size = "normal",
  disabled = false,
  onClick,
  type = "button",
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const colorClasses = COLOR_CLASSES[color as ButtonColor][variant];
  const sizeClasses = SIZE_CLASSES[size];
  const radiusClass = BORDER_RADIUS_CLASSES[size];
  const iconSize = ICON_SIZE[size];

  const isIconOnly = !label && (icon || loading);
  const sizeOrPaddingClasses = isIconOnly
    ? size === "x-small"
      ? "p-1.5"
      : size === "small"
        ? "p-2"
        : size === "large"
          ? "p-4"
          : "p-3"
    : sizeClasses;

  const buttonClasses = classNames(
    BASE_CLASSES,
    colorClasses,
    sizeOrPaddingClasses,
    radiusClass,
    FOCUS_RING_CLASSES[color as ButtonColor],
    raised && "shadow-md hover:shadow-lg active:shadow-sm",
    linkConfig && "no-underline"
  );

  const iconElement =
    loading ? (
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ width: iconSize, height: iconSize }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ) : icon ? (
      <AppIcon name={icon} size={iconSize} />
    ) : null;

  const content = (
    <>
      {iconElement && iconPos === "left" && iconElement}
      {label && <span>{label}</span>}
      {iconElement && iconPos === "right" && iconElement}
    </>
  );

  const inner = (
    <>
      {content}
      {badge != null && (
        <span
          className={classNames(
            "absolute -top-1 -end-1 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center text-xs font-semibold rounded-full bg-red-500 text-white",
            badgeClassName
          )}
        >
          {badge}
        </span>
      )}
    </>
  );

  if (linkConfig?.href && !isDisabled) {
    return (
      <Link
        href={linkConfig.href}
        target={linkConfig.target}
        rel={linkConfig.rel}
        className={buttonClasses}
        onClick={
          onClick
            ? (e: React.MouseEvent<HTMLAnchorElement>) =>
                onClick(e as unknown as React.MouseEvent<HTMLButtonElement>)
            : undefined
        }
        aria-label={label}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={label}
      aria-busy={loading}
    >
      {inner}
    </button>
  );
}

export default AppButton;
