import { Icon } from "@/ui/Icon";
import { Card, useDisclosure } from "@/ui/NextUi";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import { SubCategory } from "../../contract.types";
import { Trash, DocumentText, Edit2 } from "iconsax-reactjs";
import { AppButton } from "@/components/common/AppButton";
import { useLazyGetSubCategoryTemplateQuery } from "../../contract.services";
import { useCallback } from "react";
import { useSaveSubCategoryTemplate } from "../../hook/contractHook";
import AppInput from "@/components/common/AppInput";
import { useRouter } from "next/navigation";

interface ContractTypeItemProps {
  item: SubCategory;
  selected: boolean;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  showDeleteButton?: boolean;
  onEdit?: (id: number) => void;
  showEditButton?: boolean;
  refetch?: () => Promise<void>;
}

export default function ContractItem({
  item,
  onSelect,
  selected,
  onDelete,
  showDeleteButton = false,
  refetch,
  showEditButton,
}: ContractTypeItemProps) {
  const isBlankContract = item.IsType === false;
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const [getSubCategoryTemplate, { isLoading: getSubCategoryTemplateLoading }] =
    useLazyGetSubCategoryTemplateQuery();
  const { saveSubCategoryTemplate, isLoading: isSavingTemplate } =
    useSaveSubCategoryTemplate();
  // const { fields, isLoading } = useSubCategoryFields(item.SubCategoryId);

  const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.SubCategoryId);
    }
  };

  const handleCreateClone = useCallback(
    (subCategoryId: number, name: string, description: string) => {
      getSubCategoryTemplate(subCategoryId).then((response) => {
        if (response?.data?.Data) {
          saveSubCategoryTemplate({
            CategoryId: response.data.Data.CategoryId,
            Description: description,
            IsPersonal: true,
            Name: name,
            Template: response.data.Data.Template,
          }).then(async () => {
            if (refetch) {
              refetch().then(() => {
                onClose();
              });
            }
          });
        }
      });
    },
    [getSubCategoryTemplate, saveSubCategoryTemplate, refetch, onClose],
  );

  return (
    <Card
      isPressable
      as={"div"}
      className={`px-[19px] py-3 rounded-[12px] space-y-2 border relative
         transition-all duration-300 ease-in-out w-[221px] h-[126px]
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
      {showEditButton && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            router.push(
              `/issue/contract/personal-template/update/${item.SubCategoryId}`,
            );
          }}
          role="button"
          tabIndex={0}
          className="absolute top-2 left-10 z-10 p-1.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="ویرایش قرارداد"
        >
          <Edit2 className="text-blue-500 size-[16px]" />
        </div>
      )}
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
      {showDeleteButton && (
        <div className="flex justify-end pb-2">
          {
            <AppButton
              label="ایجاد کپی"
              size="x-small"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            />
          }
        </div>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget; // <-- correctly typed
                const formData = new FormData(form);
                const name = formData.get("name") as string;
                const description = formData.get("description") as string;
                handleCreateClone(
                  item.SubCategoryId,
                  name || "",
                  description || "",
                );
              }}
            >
              <ModalHeader>ایجاد قالب جدید</ModalHeader>

              <ModalBody>
                <AppInput name="name" label="نام قالب" />

                <AppInput name="description" label="توضیحات قالب" />
              </ModalBody>

              <ModalFooter>
                <AppButton
                  size="small"
                  variant="outline"
                  label="بستن"
                  onClick={onClose}
                />
                <AppButton
                  size="small"
                  label="ذخیره"
                  type="submit"
                  loading={getSubCategoryTemplateLoading && isSavingTemplate}
                />
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
