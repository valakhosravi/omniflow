import { Icon } from "@/ui/Icon";
import { Card } from "@/ui/NextUi";
import { SubCategory } from "../types/contractModel";
import { Shop, Trash, Edit2, Document, DocumentText } from "iconsax-reactjs";

interface ContractTypeItemProps {
  item: SubCategory;
  selected: boolean;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  showDeleteButton?: boolean;
  onEdit?: (id: number) => void;
  showEditButton?: boolean;
}

export default function ContractItem({
  item,
  onSelect,
  selected,
  onDelete,
  showDeleteButton = false,
  onEdit,
  showEditButton = false,
}: ContractTypeItemProps) {
  const isBlankContract = item.IsType === false;
  // const { fields, isLoading } = useSubCategoryFields(item.SubCategoryId);

  const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.SubCategoryId);
    }
  };

  const handleEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item.SubCategoryId);
    }
  };

  return (
    <Card
      isPressable
      className={`px-[19px] py-3 rounded-[12px] space-y-2 border relative
         transition-all duration-300 ease-in-out w-[221px] h-[120px] max-h-[120px]
         ${
           selected
             ? "bg-[#F8F9FA] !border-primary-950"
             : "hover:bg-[#F8F9FA] hover:border-primary-950/[.1]"
         }
        ${
          isBlankContract
            ? "border-primary-950 hover:border-primary-950 bg-primary-950 hover:bg-primary-950"
            : "border-[#eeeef0]"
        }`}
      classNames={{
        base: `shadow-none`,
      }}
      onPress={() => {
        if (item.SubCategoryId === 0) {
          onSelect(0);
        } else {
          onSelect(item.SubCategoryId);
        }
      }}
    >
      {/* {showEditButton && onEdit && (
        <div
          onClick={handleEdit}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleEdit(e);
            }
          }}
          className="absolute top-2 left-2 z-10 p-1.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="ویرایش قرارداد"
        >
          <Edit2 className="text-blue-500 size-[16px]" />
        </div>
      )} */}
      {showDeleteButton && onDelete && (
        <div
          onClick={handleDelete}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleDelete(e);
            }
          }}
          className="absolute top-2 left-2 z-10 p-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="حذف قرارداد"
        >
          <Trash className="text-red-500 size-[16px]" />
        </div>
      )}
      <div className="flex items-center gap-x-2">
        <div
          className={`rounded-full p-[5px] border text-primary-950 
             transition-all duration-300 ease-in-out
            ${
              isBlankContract
                ? "border-primary-950/[.1] bg-white"
                : "border-primary-950/[.1]"
            }`}
        >
          {isBlankContract ? (
            <Icon name="add" className="text-primary-950 size-[16px]" />
          ) : (
            <DocumentText className="text-primary-950 size-[16px]" />
          )}
        </div>
        <h4
          className={`font-semibold text-[14px]/[23px] transition-all duration-300 ease-in-out
            ${isBlankContract ? "text-white" : "text-primary-950"}`}
        >
          {item.Name}
        </h4>
      </div>

      <p
        className={`font-medium text-right text-[12px]/[22px] transition-all duration-300 ease-in-out
          ${isBlankContract ? "text-white/[.6]" : "text-primary-950/50"}`}
      >
        {item.Description}
      </p>
    </Card>
  );
}
