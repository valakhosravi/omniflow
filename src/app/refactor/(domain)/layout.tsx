import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // add header (buttons and search)
  return (
    <div>
      <div className="flex">
        <div className="h-[105px] px-4 py-7 flex items-center gap-x-2 border-b border-color-neutral-100">
          <Image
            src="/pictures/pec-logo.svg"
            alt="PEC Logo"
            width="46"
            height="25"
          />
          <Link href={`/`} className="text-[12px] font-[600] text-primary-950">
            تجارت الکترونیک پارسیان
          </Link>
        </div>
        {/* TODO: replace Header with AppHeader */}
        <Header />
      </div>
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
