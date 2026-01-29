"use client";
import { useEffect, useRef } from "react";

export default function useOutsideClick<T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
  listenCapturing = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClick, listenCapturing);
    }

    return () => {
      if (typeof document !== "undefined") {
        return document.removeEventListener(
          "click",
          handleClick,
          listenCapturing
        );
      }
    };
  }, [handler, listenCapturing]);

  return ref;
}
