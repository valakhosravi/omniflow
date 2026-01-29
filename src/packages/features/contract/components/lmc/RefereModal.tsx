import CustomButton from "@/ui/Button";
import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  useGetContractDepartmentsQuery,
  useSaveTermAssigneeMutation,
} from "../../api/contractApi";
import { Icon } from "@/ui/Icon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GetContractInfo } from "../../types/contractModel";
import { addToaster } from "@/ui/Toaster";
import {
  addTermDepartments,
  setTermDepartments,
} from "../../slice/LmcDataSlice";

interface RefereModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contractData: GetContractInfo;
  termIds: number[];
}

export default function RefereModal({
  isOpen,
  onOpenChange,
  contractData,
  termIds,
}: RefereModalProps) {
  const dispatch = useDispatch();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const { data: contractDepartments, isLoading: isGetting } =
    useGetContractDepartmentsQuery();
  const currentTermDepartments = useSelector(
    (state: RootState) => state.lmcData.termDepartments
  );

  const handleModalChange = (open: boolean) => {
    setSelectedDepartments([]);
    onOpenChange(open);
  };

  const handleCancel = () => {
    setSelectedDepartments([]);
    onOpenChange(false);
  };

  const handleSelectionChange = (key: string | null) => {
    if (!key) return;
    if (!selectedDepartments.includes(key)) {
      setSelectedDepartments([...selectedDepartments, key]);
    }
  };

  const handleRemoveDepartment = (keyToRemove: string) => {
    setSelectedDepartments(
      selectedDepartments.filter((key) => key !== keyToRemove)
    );
  };

  const handleSaveTermAssignee = () => {
    if (termIds.length > 0) {
      const newMapping = termIds.map((termId) => ({
        termId: Number(termId),
        departments: [...selectedDepartments],
      }));

      dispatch(addTermDepartments(newMapping));
    }

    onOpenChange(false);
    setSelectedDepartments([]);
  };

  const renderChips = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedDepartments.map((key) => {
          const dept = contractDepartments?.Data?.find(
            (d) => d.GroupKey === key
          );
          if (!dept) return null;
          return (
            <Chip
              key={key}
              onClose={() => handleRemoveDepartment(key)}
              variant="bordered"
              classNames={{
                base: `border-1 rounded-[24px] text-secondary-200 px-[10px] py-[3px] max-w-[93px] gap-x-1`,
                content: `font-semibold text-[12px]/[18px] text-secondary-500 p-0`,
                closeButton: `text-secondary-400`,
              }}
            >
              {dept.Name}
            </Chip>
          );
        })}
      </div>
    );
  };

  const renderAutocomplete = () => {
    return (
      <Autocomplete
        selectedKey={null}
        onSelectionChange={(key) => handleSelectionChange(key as string)}
        className="w-full"
        variant="bordered"
        label="انتخاب گیرنده"
        labelPlacement="outside"
        isRequired
        placeholder="گیرندگان"
        errorMessage={
          selectedDepartments.length === 0
            ? "انتخاب گیرنده ضروری است."
            : undefined
        }
        popoverProps={{ offset: 10, classNames: { content: "shadow-none" } }}
        inputProps={{
          classNames: {
            input: `font-normal text-[12px]/[18px] text-secondary-400`,
            inputWrapper: `px-[8px] py-[6px] border-1 border-secondary-950/[.2] rounded-[8px]`,
          },
        }}
        classNames={{
          base: `text-sm text-secondary-950 bg-white w-[220px]`,
          selectorButton: `text-secondary-400`,
          popoverContent: `border border-default-300 data-[selected=true]:opacity-50`,
        }}
      >
        {(contractDepartments?.Data ?? []).map((department) => {
          const isSelected = selectedDepartments.includes(department.GroupKey);
          return (
            <AutocompleteItem
              key={department.GroupKey}
              isReadOnly={isSelected}
              className={`${
                isSelected ? "opacity-50 pointer-events-none" : ""
              }`}
              endContent={
                isSelected ? (
                  <Icon name="tick" className="text-primary-950" />
                ) : null
              }
            >
              {department.Name}
            </AutocompleteItem>
          );
        })}
      </Autocomplete>
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <ModalContent className="!w-[746px] max-w-[746px] max-h-[613px]">
        <ModalHeader className="flex justify-between items-center pt-[20px] px-[24px]">
          <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
            ارجاع درخواست
          </h1>
          <Icon
            name="closeCircle"
            className="text-secondary-300 cursor-pointer"
            onClick={() => onOpenChange(false)}
          />
        </ModalHeader>
        <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />
        <ModalBody className="px-[24px] py-0 space-y-4">
          <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
            لطفا تیکت را به فرد مربوطه ارجاع داده و روی تایید کلیک کنید.
          </p>
          <div
            className="border border-primary-950/[.1] rounded-[20px] px-5 py-4
                min-h-[150px]"
          >
            {renderAutocomplete()}
            {selectedDepartments.length > 0 && renderChips()}
          </div>
        </ModalBody>
        <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[150px] pb-[20px] px-[24px]">
          <CustomButton
            buttonSize="sm"
            className="flex items-center justify-center min-w-[102px] min-h-[40px]
                   btn-outline rounded-[12px] cursor-pointer font-semibold text-[14px]/[20px]"
            onPress={handleCancel}
          >
            انصراف
          </CustomButton>
          <CustomButton
            type="submit"
            buttonSize="sm"
            className="flex items-center justify-center min-w-[118px] min-h-[40px]
                   btn-primary rounded-[12px] text-secondary-0 cursor-pointer font-semibold text-[14px]/[20px]"
            isDisabled={selectedDepartments.length === 0}
            onPress={handleSaveTermAssignee}
          >
            تایید
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
