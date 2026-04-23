import UserDropDown from "@/components/common/AppHeader/components/AuthSection/UserDropDown";
import NotificationDropdown from "@/components/common/AppHeader/components/AuthSection/NotificationDropdown";
import CustomButton from "@/ui/Button";
import MegaMenuDrawer from "@/components/common/AppHeader/components/HeaderHamburgerMenu/HeaderHamburgerMenu";
import Login from "@/features/homePage/components/Login";
import { useDisclosure } from "@heroui/react";
import { SigninResponse } from "@/models/auth/SignResponse";

const AuthSection = ({
  user,
  loading,
}: {
  user: SigninResponse | null;
  loading: boolean;
}) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  // Remove the isClient state and useEffect that was causing hydration mismatch
  if (loading) {
    return (
      <div className="w-[120px] h-[40px] bg-gray-200 rounded animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        <CustomButton
          buttonSize="md"
          buttonVariant="primary"
          onPress={() => onOpen()}
          className="text-[14px] whitespace-nowrap"
        >
          ورود به سامانه
        </CustomButton>
        <Login isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
      </>
    );
  }

  return (
    <div className="flex items-center justify-between w-full gap-x-[24px]">
      <UserDropDown />
      <NotificationDropdown />
      <MegaMenuDrawer />
    </div>
  );
};

export default AuthSection;
