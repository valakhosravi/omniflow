"use client";
import { Button, useDisclosure } from "@/ui/NextUi";
import Image from "next/image";
import Link from "next/link";
import FooterBackup from "./FooterBackup";

export default function HomePageFooter() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "unknown";
  return (
    <div className="flex justify-between w-full px-12 py-4 items-center">
      <div className="text-transparent text-xs cursor-default">
        version: {appVersion || "1.0.0"}
      </div>
      <nav className="self-end text-secondary-500 text-medium flex items-center gap-x-6 font-medium text-[14px] leading-[20px]">
        <Link href="#">
          <Image
            alt="logo"
            src="/icons/logo.svg"
            width={56}
            height={32}
            priority
            className="object-fill pointer-events-none"
          />
        </Link>
        <Link href="#">درباره ما</Link>
        <Button variant="flat" className="bg-transparent" onPress={onOpen}>
          پشتیبانی
        </Button>
        <Link href="#">راهنمای سامانه</Link>
        <FooterBackup isOpen={isOpen} onOpenChange={onOpenChange} />
      </nav>
    </div>
  );
}
