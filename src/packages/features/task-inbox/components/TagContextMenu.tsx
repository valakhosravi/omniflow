import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/ui/NextUi";
import { Icon } from "@/ui/Icon";
import { useLabels } from "../hooks/useLabels";

interface TagContextMenuProps {
  onEdit: () => void;
  deleteId?: number;
  children: React.ReactNode;
}

export default function TagContextMenu({
  onEdit,
  deleteId,
  children,
}: TagContextMenuProps) {
  const { deleteLabel, isDeleting } = useLabels();
  const handleDelete = () => {
    if (deleteId) {
      deleteLabel(deleteId);
    }
  };

  const menuItems = [
    {
      key: "edit",
      label: "ویرایش",
      icon: <Icon name="edit" className="size-[16px]" />,
      onClick: onEdit,
      color: "default" as const,
    },
    {
      key: "delete",
      label: "حذف",
      icon: <Icon name="trash" className="size-[16px]" />,
      onClick: handleDelete,
      color: "danger" as const,
    },
  ];

  return (
    <Dropdown
      placement="bottom-end"
      className="rounded-[12px] border border-border-dropdown shadow-none p-0 min-w-[102px] w-[102px]"
    >
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownMenu
        aria-label="tag context menu"
        className="space-y-[12px] p-2 text-secondary-900 w-[102px] min-w-[102px]"
      >
        {menuItems.map(({ key, label, icon, onClick, color = "default" }) => (
          <DropdownItem
            key={key}
            className={`p-2 rounded-[8px] flex items-center gap-x-2
                 ${key === "delete" && "text-accent-500"}`}
            classNames={{
              title: `!font-semibold !text-[12px]/[18px]`,
            }}
            color={color}
            onPress={onClick}
            startContent={icon}
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
