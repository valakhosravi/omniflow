"use client";

import { Icon } from "./Icon";
import { addToast } from "./NextUi";

type ToasterColor = "primary" | "secondary" | "success" | "warning" | "danger";
interface ToasterOptions {
  title: string;
  color?: ToasterColor;
  timeout?: number;
  shouldShowTimeoutProgress?: boolean;
}

const colorClassMap: Record<
  ToasterColor,
  { bg: string; border: string; text: string; Icon: React.ReactElement }
> = {
  primary: {
    bg: "bg-accent-600",
    text: "text-accent-700",
    border: "border-accent-700/[.3]",
    Icon: <Icon name="infoToaster" className="text-accent-700" />,
  },
  secondary: {
    bg: "bg-accent-800",
    text: "text-accent-900",
    border: "border-accent-900/[.3]",
    Icon: <Icon name="infoToaster" className="text-accent-900" />,
  },
  success: {
    bg: "bg-accent-S-C",
    text: "text-accent-100",
    border: "border-accent-100/[.3]",
    Icon: <Icon name="tickCircle" className="size-[28px]" />,
  },
  warning: {
    bg: "bg-accent-200",
    text: "text-accent-300",
    border: "border-accent-300/[.3]",
    Icon: <Icon name="warningToaster" />,
  },
  danger: {
    bg: "bg-accent-400",
    text: "text-accent-500",
    border: "border-accent-500/[.3]",
    Icon: <Icon name="dangerToaster" />,
  },
};

export function addToaster(options: ToasterOptions) {
  const baseTime = 2000;
  const perWordTime = 300;

  const wordCount = options.title.trim().split(/\s+/).length;
  const timeout = options.timeout ?? baseTime + wordCount * perWordTime;

  const selectedColor = options.color ?? "primary";
  const styles = colorClassMap[selectedColor];

  addToast({
    ...options,
    icon: styles.Icon,
    timeout,
    // shouldShowTimeoutProgress: options.shouldShowTimeoutProgress ?? true,
    closeIcon: <Icon name="closeIcon" className="size-[10px]" />,
    classNames: {
      base: `flex gap-[8px] items-center px-[12px] py-[18px] !w-[457px] border rounded-[12px] shadow-none
      ${styles.border} ${styles.bg}`,
      content: `gap-x-[8px]`,
      title: `font-medium text-[14px]/[20px] ${styles.text}`,
      closeButton:
        "opacity-100 relative -ml-3 top-1/2 flex items-center justify-center",
    },
  });
}
