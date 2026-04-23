import CustomButton from "./Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "./NextUi";
import { FiMoreVertical } from "react-icons/fi";

export type DropdownAction = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color?: "danger" | "default";
  onClick?: () => void;
};

type Props = {
  items: DropdownAction[];
};

export default function OperationDropdown({ items }: Props) {
  return (
    <Dropdown
      placement="bottom-end"
      className="rounded-[12px] border border-border-dropdown shadow-none p-0 min-w-[200px] w-[200px]"
    >
      <DropdownTrigger>
        <CustomButton buttonVariant="outline" buttonSize="xs" iconOnly>
          <FiMoreVertical className="text-secondary-950 size-[15px]" />
        </CustomButton>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="operation menu"
        className={`space-y-[12px] p-2 w-[200px] min-w-[200px]`}
      >
        {items.map(({ key, label, icon, color = "default", onClick }) => (
          <DropdownItem
            key={key}
            className={`hover:!bg-day-title text-secondary-900 hover:!text-secondary-950 p-2 rounded-[8px] flex items-center gap-x-2
                 ${
                   key === "delete" && "text-accent-500 hover:!text-accent-500"
                 }`}
            classNames={{
              title: `!font-semibold !text-[12px]/[18px]`,
            }}
            color={color}
            onClick={onClick}
            startContent={icon}
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
