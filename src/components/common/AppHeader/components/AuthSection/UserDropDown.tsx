import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@/ui/NextUi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const dropdownItems = [
  // {
  //   key: "profile",
  //   label: "مشاهده پروفایل",
  //   icon: <Image src="/icons/user.svg" alt="user" width={20} height={20} />,
  // },
  {
    key: "logout",
    label: "خروج",
    color: "error",
    icon: <Image src="/icons/logout.svg" alt="logout" width={20} height={20} />,
    href: "/logout",
  },
];

export default function UserDropDown() {
  const { userDetail } = useAuth();
  const router = useRouter();

  return (
    <Dropdown
      placement="bottom-end"
      className="rounded-[10px] border-secondary-0 shadow-[(-8px_8px_40px_0px_#959DA51F)] p-0 min-w-[156px] w-[156px]"
    >
      <DropdownTrigger
        className={`transition-none !opacity-100 [box-shadow:-8px_8px_40px_0px_#959DA51F] drop-shadow-md shrink-0`}
      >
        <button
          className="cursor-pointer rounded-[12px] w-[48px] h-[48px] bg-primary-950 text-white
        hover:!bg-primary-950 font-medium text-[16px]/[24px]"
        >
          <Tooltip
            placement="bottom"
            content={userDetail?.UserDetail.FullName || ""}
            closeDelay={300}
            className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px]
            px-[6px] py-[3.5px] rounded-[4px]"
            offset={20}
          >
            {userDetail?.UserDetail.FullName[0]}
          </Tooltip>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User Menu"
        items={dropdownItems}
        className="space-y-[20px] p-3"
      >
        {(item) => (
          <DropdownItem
            onPress={() => {
              if (item.href) {
                router.push(item.href);
              }
            }}
            key={item.key}
            className={`hover:!bg-primary-950/[3%] p-2 ${
              item.color === "danger" ? "text-danger" : ""
            }`}
          >
            <div
              className={`flex items-center gap-x-2 font-semibold text-[12px]/[18px] ${
                item.color === "error"
                  ? "text-accent-500"
                  : "text-secondary-950"
              }`}
            >
              {item.icon}
              {item.label}
            </div>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
