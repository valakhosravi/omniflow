"use client";
import { Button, useDisclosure } from "@/ui/NextUi";
import Image from "next/image";
import Link from "next/link";
import Backup from "./Backup";

export default function Footer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
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
      <Backup isOpen={isOpen} onOpenChange={onOpenChange} />
    </nav>
  );
}
