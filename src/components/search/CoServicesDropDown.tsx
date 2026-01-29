import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@/ui/NextUi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const dropdownItems = [
  {
    key: "email",
    label: "ایمیل",
    href: "#",
    icon: (
      <Image
        src="/icons/Microsoft_Office.svg"
        alt="office"
        width={24}
        height={24}
      />
    ),
  },
  {
    key: "top",
    label: "تاپ",
    href: "https://top.ir/",
    icon: <Image src="/icons/top.svg" alt="logout" width={24} height={24} />,
  },
  {
    key: "pargar",
    label: "پرگار",
    href: "https://pargar.pec.ir/",
    icon: <Image src="/icons/Pargar.svg" alt="user" width={24} height={24} />,
  },
  {
    key: "topyar",
    label: "تاپیار",
    href: "https://topiar.pec.ir/",
    icon: <Image src="/icons/topyar.svg" alt="logout" width={24} height={24} />,
  },
  {
    key: "pecco",
    label: "پککو",
    href: "https://www.pec.ir/",
    icon: <Image src="/icons/logo.svg" alt="user" width={38} height={24} />,
  },
  {
    key: "hamkaran",
    label: "همکاران",
    href: "https://rahkaran.pec.ir/eservice/account/login",
    icon: (
      <Image src="/icons/hamkaran.svg" alt="logout" width={24} height={24} />
    ),
  },
];

export default function CoServicesDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      className="rounded-[12px] border-white shadow-[(-4px_8px_40px_0px_#64646F1A)] p-6 min-w-[288px] w-[288px] h-[200px]"
      onOpenChange={(open) => setIsOpen(open)}
      placement="bottom-end"
      isOpen={isOpen}
    >
      <DropdownTrigger
        className={`transition-none !opacity-100 hover:[box-shadow:-8px_8px_40px_0px_#959DA51F] hover:drop-shadow-md shrink-0`}
      >
        <button
          className={`hover:bg-primary-950/[3%] hover:text-primary-950 border border-transparent hover:border-primary-950/[25%]
            p-3 rounded-[12px] cursor-pointer 
         ${
           isOpen &&
           "bg-primary-950/[8%] text-primary-950 border-primary-950/[25%]"
         }`}
        >
          <Tooltip
            placement="bottom"
            content="سرویس های سازمانی"
            closeDelay={300}
            className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px]
      px-[6px] py-[3.5px] rounded-[4px]"
            offset={20}
          >
            <Image
              src="/icons/dashboard.svg"
              alt="dashboard"
              width={20}
              height={20}
            />
          </Tooltip>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User Menu"
        items={dropdownItems}
        classNames={{
          list: "grid grid-cols-3 grid-rows-2 gap-6",
        }}
      >
        {(item) => (
          <DropdownItem key={item.key} className={`hover:!bg-primary-950/[3%]`}>
            <Link
              href={item.href}
              className={`flex flex-col items-center text-primary-950 gap-y-1 font-semibold text-[12px]/[18px]`}
              target="_blank"
            >
              {item.icon}
              {item.label}
            </Link>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
