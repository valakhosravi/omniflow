import { RootState } from "@/store/store";
import CustomButton from "@/ui/Button";
import { Textarea, useDisclosure } from "@heroui/react";
import { Add, Trash } from "iconsax-reactjs";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubClause,
  deleteSubClause,
  updateSubClauseDescription,
  updateTermDescription,
  deleteTerm,
} from "../../../slice/NonTypeContractDataSlice";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { useState } from "react";
import { SubClause, Term } from "../../../types/ClauseType";

export default function MaterialInputs() {
  const dispatch = useDispatch();
  const {
    clauses,
    activeClause: activeClauseIndex,
    activeTerm,
  } = useSelector((state: RootState) => state.nonTypeContractData);
  const activeClause = clauses.find(
    (clause) => clause.clauseIndex === activeClauseIndex
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<{
    termNumber: string;
    subClauseIndex: number;
  } | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleDeleteTerm = () => {
    if (!activeClause || !activeTerm) return;
    dispatch(
      deleteTerm({
        clauseIndex: activeClause.clauseIndex,
        termNumber: activeTerm,
      })
    );
  };

  const confirmDelete = async () => {
    if (!selectedSub || !activeClause) return;
    dispatch(
      deleteSubClause({
        clauseIndex: activeClause.clauseIndex,
        termNumber: selectedSub.termNumber,
        subClauseIndex: selectedSub.subClauseIndex,
      })
    );
    onDeleteClose();
  };

  const handleDelete = (term: Term, sub: SubClause) => {
    setSelectedId(activeClause?.clauseIndex ?? 0);
    setSelectedSub({
      termNumber: term.number,
      subClauseIndex: sub.subClauseIndex,
    });
    onDeleteOpen();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-6">
        {activeClause?.terms
          .filter((term) => term.number === activeTerm)
          .map((term, index) => {
            return (
              <div className="space-y-6" key={`term-${term.number}`}>
                {activeClause &&
                  activeClause?.terms.length > 0 &&
                  activeTerm && (
                    <div className="flex items-center mb-6 mt-5 justify-between">
                      <div className="font-semibold text-[14px]/[23px] text-primary-950">توضیحات بند {term.number}</div>
                      <CustomButton
                        buttonSize="sm"
                        buttonVariant="outline"
                        startContent={<Trash className="size-5" />}
                        className="!text-delete-snooze text-[14px] !px-2 !rounded-[12px]"
                        onPress={handleDeleteTerm}
                      >
                        حذف بند
                      </CustomButton>
                    </div>
                  )}
                <Textarea
                  labelPlacement="outside"
                  name="description"
                  fullWidth={true}
                  type="text"
                  variant="bordered"
                  isRequired
                  classNames={{
                    inputWrapper:
                      "border border-secondary-950/[.2] rounded-[16px]",
                    input:
                      "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                    label: "font-bold text-[14px]/[20px] text-secondary-950",
                  }}
                  className="w-[568px]"
                  value={term.description}
                  onChange={(e) =>
                    dispatch(
                      updateTermDescription({
                        clauseIndex: activeClause.clauseIndex,
                        termNumber: term.number,
                        description: e.target.value,
                      })
                    )
                  }
                />
                <div className="flex flex-col gap-y-4 w-full items-center">
                  {term.subClause.map((sub, sIndex) => (
                    <div key={`sub-${term.number}-${sub.subClauseIndex}`} className="w-full flex flex-col gap-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px]/[20px] text-secondary-950">
                          تبصره {sIndex + 1}
                        </span>
                        <CustomButton
                          buttonSize="xs"
                          buttonVariant="outline"
                          startContent={<Trash size={16} />}
                          className="!text-delete-snooze rounded-[8px] !cursor-pointer"
                          onPress={() => handleDelete(term, sub)}
                        >
                          حذف تبصره
                        </CustomButton>
                      </div>

                      <Textarea
                        key={`textarea-${term.number}-${sub.subClauseIndex}`}
                        // label={`بند فرعی ${term.number}.${sub.subClauseIndex}`}
                        labelPlacement="outside"
                        value={sub.subClauseDescription}
                        onChange={(e) =>
                          dispatch(
                            updateSubClauseDescription({
                              clauseIndex: activeClause.clauseIndex,
                              termNumber: term.number,
                              subClauseIndex: sub.subClauseIndex,
                              subClauseDescription: e.target.value,
                            })
                          )
                        }
                        variant="bordered"
                        classNames={{
                          inputWrapper:
                            "border border-secondary-950/[.2] rounded-[16px]",
                          input:
                            "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                          label:
                            "font-bold text-[14px]/[20px] text-secondary-950/[.8]",
                        }}
                      />
                    </div>
                  ))}

                  <div
                    className="flex items-center gap-x-2 cursor-pointer"
                    onClick={() => {
                      dispatch(
                        addSubClause({
                          clauseIndex: activeClause.clauseIndex,
                          termNumber: term.number,
                        })
                      );
                    }}
                  >
                    <span className="text-primary-950">
                      <Add size={20} />
                    </span>
                    <span className="font-semibold text-[14px]/[23px] text-primary-950">
                      افزودن تبصره جدید
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete()}
          itemId={selectedId}
          description="آیا از حذف این تبصره مطمئن هستید؟"
        />
      )}
    </>
  );
}
