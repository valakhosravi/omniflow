"use client";
import ContractTypeItem from "./ContractItem";
import CustomButton from "@/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton, useDisclosure } from "@heroui/react";
import NonTypeContractModal from "./non-type/NonTypeContractModal";
import { useAllSubCategories, useSubCategories, useDeleteSubCategoryTemplate } from "../hook/contractHook";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setCategoryId,
  setSubCategoryId,
  setSelectedContract,
  setTemplateFormData,
} from "../slice/ContractDataSlice";
import { Category } from "../types/contractModel";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import SaveTemplateWithFieldsModal, {
  SaveTemplateWithFieldsFormData,
} from "./lmc/modals/SaveTemplateWithFieldsModal";

interface SelectContractProps {
  selectedFilter: number | "all" | "new";
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  categories: Category[];
}

export default function SelectContract({
  selectedFilter,
  isOpen,
  onOpen,
  onOpenChange,
  categories,
}: SelectContractProps) {
  const selected = useSelector(
    (state: RootState) => state.nonTypeContractData.CategoryId
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [editItemId, setEditItemId] = useState<number | null>(null);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const isAll = selectedFilter === "all";

  const { subCategories, isLoading, refetch: refetchSubCategories } = useSubCategories(
    isAll || selectedFilter === "new" ? null : selectedFilter
  );

  const { allSubCategories, isLoading: isGettingAll, refetch: refetchAllSubCategories } = useAllSubCategories();
  
  const { deleteSubCategoryTemplate, isLoading: isDeleting } = useDeleteSubCategoryTemplate();

  const contracts = isAll ? allSubCategories : subCategories;
  const Loading = isAll ? isGettingAll : isLoading;

  const typeContracts = contracts.filter((c) => c.IsType);
  const nonTypeContracts = contracts.filter((c) => !c.IsType);

  const personalContracts = typeContracts.filter((c) => c.IsPersonal === true);
  console.log('personalContracts', personalContracts, contracts)
  const nonPersonalContracts = typeContracts.filter(
    (c) => c.IsPersonal === false || c.IsPersonal === undefined
  );

  const [isTemplate, setIsTemplate] = useState(false);
  const {
    isOpen: isSaveTemplateModalOpen,
    onOpen: onSaveTemplateOpen,
    onClose: onSaveTemplateClose,
  } = useDisclosure();

  const {
    isOpen: isPersonalContractModalOpen,
    onOpen: onPersonalContractModalOpen,
    onClose: onPersonalContractModalClose,
    onOpenChange: onPersonalContractModalOpenChange,
  } = useDisclosure();
  const [selectedPersonalContract, setSelectedPersonalContract] = useState<any>(null);

  const handleSelect = (contract: any) => {
    dispatch(setCategoryId(contract.CategoryId));
    
    if (contract) {
      dispatch(setSubCategoryId(contract.SubCategoryId));
      dispatch(setSelectedContract(contract));

      if (contract.IsPersonal === true) {
        router.push(
          `/contract/non-type?categoryId=${contract.CategoryId}&subCategoryId=${contract.SubCategoryId}`
        );
      } else {
        router.push(
          `/contract/type?categoryId=${contract.CategoryId}&subCategoryId=${contract.SubCategoryId}`
        );
      }
    }
  };

  const handleDelete = (id: number) => {
    setDeleteItemId(id);
    onDeleteOpen();
  };

  const handleEdit = (id: number) => {
    setEditItemId(id);
    onEditOpen();
  };

  const resetContractLocalStorage = () => {
    // Clear direct localStorage keys
    localStorage.removeItem("contract_draft_data");
    localStorage.removeItem("contractFormData");
    
    // Clear Redux persist keys
    localStorage.removeItem("persist:contractData");
    localStorage.removeItem("persist:nonTypeContractData");
    localStorage.removeItem("persist:lmcData");
  };

  return (
    <>
      <div
        className="flex flex-col border border-primary-950/[.1] rounded-[20px] p-4
        min-w-[990px] 2xl:min-w-[990px]"
      >
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[20px]/[28px] text-primary-950">
            انتخاب نوع قرارداد
          </h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-[8.5px] border rounded-[12px] font-semibold text-[14px]/[23px] cursor-pointer
           bg-white text-primary-950`}
              onClick={() => {
                resetContractLocalStorage();
                setIsTemplate(true);
                onSaveTemplateOpen();
              }}
            >
              ایجاد قالب قرارداد
            </button>
            <button
              className={`px-3 py-[8.5px] border rounded-[12px] font-semibold text-[14px]/[23px] cursor-pointer
           bg-primary-950 text-white border-primary-950`}
              onClick={() => {
                resetContractLocalStorage();
                setIsTemplate(false);
                onOpen();
              }}
            >
              ایجاد قرارداد جدید
            </button>
          </div>
        </div>
        <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-6" />
        {Loading ? (
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-[120px] w-[221px] rounded-[12px]"
              />
            ))}
          </div>
        ) : typeContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-primary-950/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary-950/70 mb-2">
              هیچ قراردادی یافت نشد
            </p>
            <p className="text-sm text-primary-950/50">
              {isAll
                ? "هنوز هیچ قراردادی در سیستم ثبت نشده است"
                : "برای این دسته‌بندی قراردادی وجود ندارد"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {/* {!isAll &&
              nonTypeContracts.map((nonTypeContract) => {
                return (
                  <ContractTypeItem
                    key="new-contract"
                    item={{
                      SubCategoryId: nonTypeContract.SubCategoryId,
                      CategoryId: nonTypeContract.CategoryId,
                      Name: "ایجاد قرارداد جدید",
                      Description: "قرارداد خود را از ابتدا ایجاد کنید",
                      IsType: false,
                      FilePath: nonTypeContract.FilePath,
                      CreatedDate: nonTypeContract.CreatedDate,
                    }}
                    selected={selected === 0}
                    onSelect={() => {
                      setSelected(nonTypeContract.CategoryId);
                      dispatch(setCategoryId(nonTypeContract.CategoryId));
                      onOpen();
                    }}
                  />
                );
              })} */}

            {personalContracts.length > 0 && (
              <>
                <div className="col-span-4 mb-2">
                  <h3 className="font-semibold text-[16px]/[24px] text-primary-950">
                    قالب‌های قراردادهای شخصی
                  </h3>
                </div>
                {personalContracts.map((contract) => (
                  <ContractTypeItem
                    key={contract.SubCategoryId}
                    item={contract}
                    selected={selected === contract.SubCategoryId}
                    onSelect={() => {
                      setSelectedPersonalContract(contract);
                      setIsTemplate(false);
                      dispatch(setSubCategoryId(contract.SubCategoryId));
                      dispatch(setSelectedContract(contract));
                      onPersonalContractModalOpen();
                    }}
                    onDelete={handleDelete}
                    showDeleteButton={true}
                    onEdit={handleEdit}
                    showEditButton={true}
                  />
                ))}
              </>
            )}

            {nonPersonalContracts.length > 0 && (
              <>
                {personalContracts.length > 0 && (
                  <div className="col-span-4 mt-4 mb-2">
                    <h3 className="font-semibold text-[16px]/[24px] text-primary-950">
                      قالب‌های قراردادهای تیپ
                    </h3>
                  </div>
                )}
                {nonPersonalContracts.map((contract) => (
                  <ContractTypeItem
                    key={contract.SubCategoryId}
                    item={contract}
                    selected={selected === contract.SubCategoryId}
                    onSelect={() => handleSelect(contract)}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <NonTypeContractModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        categoryId={selected}
        nonTypeContracts={nonTypeContracts}
        categories={categories}
        isTemplate={isTemplate}
      />
      <NonTypeContractModal
        isOpen={isPersonalContractModalOpen}
        onOpenChange={onPersonalContractModalOpenChange}
        categoryId={selectedPersonalContract?.CategoryId || null}
        subCategoryId={selectedPersonalContract?.SubCategoryId || null}
        nonTypeContracts={nonTypeContracts}
        categories={categories}
        isTemplate={false}
      />
      {deleteItemId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => {
            onDeleteClose();
            setDeleteItemId(null);
          }}
          onConfirm={async () => {
            if (deleteItemId !== null) {
              try {
                await deleteSubCategoryTemplate(deleteItemId);
                // Refetch data after successful deletion
                if (isAll) {
                  await refetchAllSubCategories();
                } else {
                  await refetchSubCategories();
                }
                onDeleteClose();
                setDeleteItemId(null);
              } catch (error) {
                // Error handling is done in the hook
                console.error("Error deleting contract template:", error);
              }
            }
          }}
          isLoading={isDeleting}
          itemId={deleteItemId}
          description="آیا از حذف این قالب قرارداد شخصی مطمئن هستید؟"
        />
      )}
      {editItemId !== null && (
        <SaveTemplateWithFieldsModal
          isOpen={isEditOpen}
          onClose={() => {
            onEditClose();
            setEditItemId(null);
          }}
          onSave={(data: SaveTemplateWithFieldsFormData) => {
            // Navigate to update page with the subcategory ID and category ID
            router.push(`/legal/contract/templates/update?subCategoryId=${editItemId}&categoryId=${data.CategoryId}`);
            onEditClose();
            setEditItemId(null);
          }}
          isUpdateMode={true}
          subCategoryId={editItemId}
          initialData={{
            CategoryId: contracts.find(c => c.SubCategoryId === editItemId)?.CategoryId || 0,
            Name: contracts.find(c => c.SubCategoryId === editItemId)?.Name || "",
            Description: contracts.find(c => c.SubCategoryId === editItemId)?.Description || "",
          }}
        />
      )}
      <SaveTemplateWithFieldsModal
        isOpen={isSaveTemplateModalOpen}
        onClose={onSaveTemplateClose}
        onSave={(data: SaveTemplateWithFieldsFormData) => {
          dispatch(setTemplateFormData(data));
          onSaveTemplateClose();
        }}
        isLoading={false}
      />
    </>
  );
}
