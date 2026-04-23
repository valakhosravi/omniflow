import { useGetSupplierList } from "@/hooks/food/useSupplierAction";
import { Icon } from "@/ui/Icon";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/ui/NextUi";

type SupplierDropDownProps = {
  selectedSupplier: string | null;
  setSelectedSupplier: (supplier: string | null) => void;
};

export default function SupplierDropDown({
  selectedSupplier,
  setSelectedSupplier,
}: SupplierDropDownProps) {
  const { supplierData } = useGetSupplierList(1, 10);

  return (
    <Dropdown
      className="shadow-none border border-secondary-950/[.2] rounded-[12px]
      min-w-[138px] w-[138px]"
    >
      <DropdownTrigger className="px-2">
        <Button
          className="cursor-pointer bg-transparent rounded-[8px] w-[138px] h-[32px] text-secondary-400
           font-medium text-[12px]/[18px] border border-secondary-950/[.2]
           flex items-center justify-between"
        >
          <span>{selectedSupplier ?? "فیلتر تامین کننده"}</span>
          <Icon name="arrowDown" className="text-secondary-950" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="selfs"
        items={[
          { SupplierId: "all", Name: "همه" },
          ...(supplierData?.Data?.Items || []),
        ]}
        className="space-y-[20px]"
        classNames={{
          base: "p-1",
        }}
      >
        {(supplier) => (
          <DropdownItem
            key={supplier.SupplierId}
            className="font-semibold text-[8px]/[14px] text-secondary-900 hover:!bg-primary-950/[3%] p-2"
            onPress={() =>
              supplier.SupplierId === "all"
                ? setSelectedSupplier(null)
                : setSelectedSupplier(supplier.Name)
            }
          >
            {supplier.Name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
