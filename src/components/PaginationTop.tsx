import { Icon } from "@/ui/Icon";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  PaginationItemType,
} from "@/ui/NextUi";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function PaginationTop({
  totalPages,
  currentPage,
  onPageChange,
  totalCount,
  onPageSizeChange,
  pageSize,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: {
    ref?: React.Ref<any>;
    key?: React.Key;
    value: any;
    isActive?: boolean;
    onNext?: () => void;
    onPrevious?: () => void;
    setPage?: (page: number) => void;
    className?: string;
  }) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          onClick={onNext}
          className={`${className} min-w-8 w-8 h-8 p-0 flex items-center justify-center cursor-pointer`}
        >
          <IoChevronBackOutline />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          onClick={onPrevious}
          className={`${className} min-w-8 w-8 h-8 p-0 flex items-center justify-center cursor-pointer`}
        >
          <IoChevronForwardOutline />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button
          key={key}
          className={`${className} min-w-8 w-8 h-8 p-0 flex items-center justify-center`} // Added base className and some minimal styling
          disabled
        >
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        ref={ref}
        className={`${className} min-w-8 w-8 h-8 text-sm flex items-center justify-center 
        cursor-pointer ${isActive ? "" : "hover:bg-default-200"}`}
        onClick={() => {
          if (setPage) {
            setPage(value);
          }
        }}
      >
        {value}
      </button>
    );
  };
  const pageSizeOptions = [5, 10, 25, 50];

  return (
    <div className="flex justify-center items-center mt-[24px] gap-x-[20px]">
      <Dropdown
        className="rounded-[12px] shadow-none p-0 w-[152px] min-w-[152px]
            font-semibold text-[12px]/[18px] border border-border-dropdown"
      >
        <DropdownTrigger className="px-2 py-1.5 w-[152px]">
          <Button className="bg-[#F8F9FA] text-primary-950">
            <span>نمایش {pageSize} مورد</span>
            <Icon name="arrowDown" className="size-[20px]" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="operation menu"
          className="space-y-[12px] p-[12px] text-secondary-900"
          onAction={(key) => {
            onPageSizeChange(Number(key));
          }}
        >
          {pageSizeOptions.map((size) => (
            <DropdownItem
              className="hover:!bg-day-title p-2 rounded-[8px]"
              key={size}
            >
              نمایش {size} مورد
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Pagination
        key={`pagination-${totalPages}-${pageSize}`}
        showControls
        className="cursor-pointer"
        classNames={{
          item: `text-primary-950`,
          cursor: `bg-primary-950`,
        }}
        // isCompact
        // initialPage={1}
        total={totalPages}
        page={currentPage}
        renderItem={renderItem}
        onChange={onPageChange}
      />
      <div className="flex items-center text-primary-950 font-semibold text-[12px]/[18px] gap-x-0.5">
        <span>{formatNumberWithCommas(totalCount)}</span>
        <span>مورد</span>
      </div>
    </div>
  );
}
