"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { ArrowDown2, ArrowUp2 } from "iconsax-reactjs";

type AccordionCardProps = {
  title?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  cardClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  onToggle?: (open: boolean) => void;
  disabled?: boolean;
};

export default function AccordionCard({
  title,
  children,
  defaultOpen = false,
  className = "",
  cardClassName = "",
  headerClassName = "",
  contentClassName = "",
  onToggle,
  disabled = false,
}: AccordionCardProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [height, setHeight] = useState<number | "auto">(
    defaultOpen ? "auto" : 0
  );
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      const el = contentRef.current;
      const full = el.scrollHeight;
      setHeight(full);
      const id = window.setTimeout(() => setHeight("auto"), 200);
      return () => window.clearTimeout(id);
    } else {
      const el = contentRef.current;
      const full = el.scrollHeight;
      setHeight(full);
      const id = window.requestAnimationFrame(() => setHeight(0));
      return () => window.cancelAnimationFrame(id);
    }
  }, [open, children]);

  const toggle = () => {
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`rounded-xl border border-secondary-200 bg-white shadow-sm ${cardClassName}`}
      >
        {title ? (
          <div className={`px-4 pt-3 pb-1 sm:px-5 ${headerClassName}`}>
            {title}
          </div>
        ) : null}
        <div
          className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
          style={{
            maxHeight: typeof height === "number" ? `${height}px` : height,
          }}
        >
          <div
            ref={contentRef}
            className={`px-4 pb-4 sm:px-5 ${contentClassName}`}
          >
            {children}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            aria-label={open ? "Collapse" : "Expand"}
            onClick={toggle}
            className="border-none hover:bg-white px-3 pt-3 pb-2 mb-1 cursor-pointer"
          >
            <span
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            >
              {!open ? (
                <ArrowDown2 className="text-primary-950 size-4" />
              ) : (
                <ArrowUp2 className="text-primary-950 size-4" />
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
