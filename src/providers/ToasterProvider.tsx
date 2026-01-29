"use client";

import { HeroUIProvider } from "@/ui/NextUi";
import { ToastProvider } from "@heroui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ToasterProvider({ children }: Props) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-left" toastOffset={60} />
      {children}
    </HeroUIProvider>
  );
}
