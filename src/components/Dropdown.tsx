import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/ui/NextUi";
import { PiUserCircleFill } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { UserDetail } from "@/packages/auth/types/UserDetail";
import { useAuth } from "@/packages/auth/hooks/useAuth";

export default function DropdownC({ user }: { user: UserDetail }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="flex items-center gap-x-2 cursor-pointer">
          <PiUserCircleFill className="size-10" />
          <span>{user.UserDetail.FullName}</span>
        </div>
      </DropdownTrigger>

      <DropdownMenu aria-label="User Menu">
        <DropdownItem key="logout" className="text-danger" color="danger">
          <div className="flex items-center gap-x-2" onClick={handleLogout}>
            <IoIosLogOut className="size-5" />
            <span>خروج</span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
