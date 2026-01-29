import {
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { Refresh } from "iconsax-reactjs";
import { GetContractInfo } from "../../types/contractModel";
import CustomButton from "@/ui/Button";
import {
  useGetContractInfoByRequestIdQuery,
  useResetFinalDescriptionByTermIdMutation,
} from "../../api/contractApi";
import ResetConfirmModal from "./ResetConfirmModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface HistoryOfClausesDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  contractData: GetContractInfo;
}

export default function HistoryOfClausesDrawer({
  isOpen,
  onOpenChange,
  contractData,
}: HistoryOfClausesDrawerProps) {
  const [resetTerm, { isLoading: isReseting }] =
    useResetFinalDescriptionByTermIdMutation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { requestId } = useSelector((state: RootState) => state.lmcData);
  const { refetch } = useGetContractInfoByRequestIdQuery(Number(requestId));

  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();

  const handleResetTerm = (termId: number) => {
    setSelectedId(termId);
    onResetOpen();
  };

  const confirmReset = async () => {
    if (selectedId === null) return;
    await resetTerm(selectedId).then(() => {
      onResetClose();
      refetch();
    });
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="fixed top-[16px] bottom-[16px] right-[16px] rounded-[16px] bg-white z-50"
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
        <DrawerContent className="p-[20px] w-[746px] min-w-[746px]">
          <>
            <DrawerHeader
              className="flex flex-col gap-1 font-semibold text-[16px]/[30px] 
            text-secondary-950 p-0"
            >
              تاریخچه بند‌ها
            </DrawerHeader>
            <div className="w-full h-[1px] bg-secondary-100 mt-2 mb-4" />
            <DrawerBody className="p-0">
              {contractData.ContractClauses.map((clause) => {
                return (
                  <div
                    className="border border-primary-950/[.1] rounded-[20px] p-4"
                    key={clause.ClauseId}
                  >
                    <div className="font-semibold text-[20px]/[28px] text-primary-950">
                      {clause.ClauseName}
                    </div>
                    <div>
                      {clause.Terms.map((term) => {
                        return (
                          <div className="flex flex-col" key={term.TermId}>
                            <div className="w-full bg-primary-950/[.1] h-[1px] mt-[12px] mb-[24px]" />
                            <div className="grid grid-cols-2 items-center justify-center gap-x-5">
                              <div
                                className="border border-primary-950/[.1] rounded-[16px]
                              bg-secondary-50 py-[8px] px-[15px]"
                              >
                                <div
                                  className="font-semibold text-[16px]/[30px] text-primary-950
                                flex items-center gap-x-1.5"
                                >
                                  {term.Title}
                                  <Chip
                                    variant="bordered"
                                    className="border border-primary-950/[.1] text-primary-950/[.6] bg-white px-0"
                                  >
                                    نسخه اولیه
                                  </Chip>
                                </div>
                                <div
                                  className="font-medium text-[12px]/[22px] text-primary-950/[.8]"
                                  dangerouslySetInnerHTML={{
                                    __html: term.InitialDescription,
                                  }}
                                />
                              </div>
                              {term.FinalDescription && (
                                <div
                                  className="border border-primary-950/[.1] rounded-[16px]
                              bg-accent-S-C py-[8px] px-[15px]"
                                >
                                  <div
                                    className="font-semibold text-[16px]/[30px] text-primary-950
                                flex items-center gap-x-1.5"
                                  >
                                    {term.Title}
                                    <Chip
                                      variant="bordered"
                                      className="border border-primary-950/[.1] text-primary-950/[.6] bg-white px-0"
                                    >
                                      نسخه نهایی
                                    </Chip>
                                  </div>
                                  <div
                                    className="font-medium text-[12px]/[22px] text-primary-950/[.8]"
                                    dangerouslySetInnerHTML={{
                                      __html: term.InitialDescription,
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            {term.FinalDescription && (
                              <CustomButton
                                buttonVariant="outline"
                                buttonSize="xs"
                                startContent={<Refresh size={16} />}
                                className="self-end mt-[20px]"
                                onPress={() =>
                                  handleResetTerm(Number(term.TermId))
                                }
                              >
                                بازگردانی به نسخه اولیه
                              </CustomButton>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </DrawerBody>
          </>
        </DrawerContent>
      </Drawer>
      {selectedId !== null && (
        <ResetConfirmModal
          isOpen={isResetOpen}
          isLoading={isReseting}
          itemId={selectedId}
          onClose={onResetClose}
          onConfirm={() => confirmReset()}
        />
      )}
    </>
  );
}
