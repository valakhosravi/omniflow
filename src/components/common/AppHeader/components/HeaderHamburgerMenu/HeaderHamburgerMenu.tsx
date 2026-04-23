import useGetSidebar from "@/hooks/useGetSidebar";
import { DrawerBody, Drawer, DrawerContent, Tooltip } from "@/ui/NextUi";
import Image from "next/image";
import ChildMenuItems from "./ChildMenuItems";
import { useRef, useState } from "react";
import HeaderHamburgerMenu from "@/components/common/AppHeader/components/HeaderHamburgerMenu/MegaMenuParent";

export default function MegaMenuDrawer() {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const { menuData, isLoading } = useGetSidebar();
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleDrawerMouseLeave = () => {
    setSelectedParentId(null);
  };

  return (
    <>
      <button
        className="hover:bg-primary-950/[3%] hover:text-primary-950 border border-transparent hover:border-primary-950/[25%]
    focus:bg-primary-950/[8%] focus:text-primary-950 p-3 rounded-[12px] cursor-pointer shrink-0
    disabled:border-secondary-0 disabled:text-secondary-300 disabled:bg-secondary-0"
        onClick={() => {
          setOpen(true);
          if (!isLoading && menuData?.Data?.length) {
            const firstParent = menuData.Data.find(
              (item) => item.ParentId === null,
            );
            if (firstParent) {
              setSelectedParentId(firstParent.MenuId);
            }
          }
        }}
      >
        <Tooltip
          placement="bottom"
          content="خدمات سامانه"
          closeDelay={300}
          className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px]
  px-[6px] py-[3.5px] rounded-[4px]"
          offset={20}
        >
          <Image src="/icons/menu.svg" alt="menu" width={20} height={20} />
        </Tooltip>
      </button>

      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        className="fixed top-1/2 right-[132px] -translate-y-1/2 rounded-[16px] bg-white z-50"
        hideCloseButton
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
            },
            exit: {
              x: 100,
              opacity: 0,
            },
          },
        }}
      >
        <DrawerContent className="p-1 w-[516px] h-[680px] 2xl:h-[780px] min-w-[516px]">
          <div
            ref={drawerRef}
            onMouseLeave={handleDrawerMouseLeave}
            className="h-full"
          >
            <DrawerBody className="p-0 grid grid-cols-2 gap-x-[20px] flex-none h-full">
              <div className="bg-secondary-100 w-[254px] min-w-[248px] rounded-[12px] p-[3px] flex flex-col gap-y-[12px]">
                <HeaderHamburgerMenu
                  setSelectedParentId={setSelectedParentId}
                  selectedParentId={selectedParentId}
                />
              </div>
              <div className="py-[20px] w-[234px]">
                <ChildMenuItems
                  selectedParentId={selectedParentId}
                  menuData={menuData}
                  onClose={() => setOpen(false)}
                />
              </div>
            </DrawerBody>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
