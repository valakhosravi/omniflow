"use client";
import Link from "next/link";
import CoServicesDropDown from "./components/CoServicesDropDown";
import Image from "next/image";
import MyTasksLink from "./components/MyTasksLink";
import AuthSection from "./components/AuthSection/AuthSection";
import SearchSection from "./components/SearchSection/SearchSection";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();
  const { user, isLoading } = useAuth();

  const isHomePage = pathName === "/";

  return (
    <div
      className={`flex px-4 py-4  ${!isHomePage ? "border-b border-neutral-100" : ""}`}
    >
      {!isHomePage && (
        <div className="flex items-center gap-x-2 pl-8">
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
      )}
      <div
        className={` flex items-center gap-x-2 flex-1 ${!isHomePage ? "" : "px-8"}`}
      >
        <div
          className={`flex justify-between items-center gap-x-[50px] w-full`}
        >
          <div className="flex items-center gap-x-[40px]">
            <AuthSection user={user} loading={isLoading} />
            <CoServicesDropDown />
            <MyTasksLink />
          </div>
          {!isHomePage && <SearchSection />}
        </div>
      </div>
    </div>
  );
}
