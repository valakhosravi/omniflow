import CustomButton from "@/ui/Button";
import AccordionCard from "@/ui/AccordionCard";
import { Chip, useDisclosure } from "@heroui/react";
import { Add, Trash } from "iconsax-reactjs";
import { Clause, ClauseTypeTerm } from "../../../contract.types";
import { useDispatch, useSelector } from "react-redux";
import {
  addTerm,
  deleteClause,
  deleteTerm,
  setActiveClause,
  setActiveTerm,
} from "../../../contract.slices";
import { RootState } from "@/store/store";
import { useState } from "react";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";

interface MaterialItemProps {
  clause: Clause;
}

export default function MaterialItem({ clause }: MaterialItemProps) {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { activeClause, activeTerm } = useSelector(
    (state: RootState) => state.nonTypeContractData
  );

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleAddTerm = () => {
    const newTermNumber = `${clause.clauseIndex}.${clause.terms.length + 1}`;
    dispatch(addTerm({ clauseIndex: clause.clauseIndex }));
    dispatch(setActiveClause(clause.clauseIndex));
    dispatch(setActiveTerm(newTermNumber));
  };

  const handleSelectTerm = (clause: Clause, term: ClauseTypeTerm) => {
    dispatch(setActiveClause(clause.clauseIndex));
    dispatch(setActiveTerm(term.number));
  };

  const totalSubClauses = clause.terms.reduce(
    (sum, term) => sum + (term.subClause?.length ?? 0),
    0
  );

  const confirmDelete = async () => {
    dispatch(deleteClause(clause.clauseIndex));
    onDeleteClose();
  };

  const handleDelete = () => {
    setSelectedId(clause.clauseIndex);
    onDeleteOpen();
  };

  return (
    <>
      <AccordionCard
        key={activeClause}
        defaultOpen={activeClause === clause.clauseIndex}
        className="w-full"
        cardClassName={
          activeClause === clause.clauseIndex
            ? "!border-primary-950/[.5]"
            : "!border-primary-950/[.1]"
        }
        title={
          <div
            className="flex flex-col space-y-[16px] w-full cursor-pointer"
            onClick={() => {
              dispatch(setActiveClause(clause.clauseIndex));
              dispatch(setActiveTerm(""));
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[16px]/[30px] text-primary-950">
                {clause.title}
              </h2>
              <div className="flex items-center gap-x-2">
                <button
                  className="border border-primary-950/[.1] rounded-[8px] p-1.5 cursor-pointer"
                  onClick={() => handleDelete()}
                >
                  <Trash className="size-[20px] text-delete-snooze" />
                </button>

                <CustomButton
                  buttonSize="xs"
                  buttonVariant="outline"
                  startContent={<Add />}
                  onPress={handleAddTerm}
                >
                  افزودن بند
                </CustomButton>
              </div>
            </div>

            <div className="flex items-center gap-x-[8px]">
              <Chip
                key={`${clause.termCount}-بند`}
                variant="bordered"
                className="border border-primary-950/[.1] text-primary-950/[.6]"
              >
                {`${clause.termCount} بند`}
              </Chip>
              <Chip
                key={`${totalSubClauses}-تبصره`}
                variant="bordered"
                className="border border-primary-950/[.1] text-primary-950/[.6]"
              >
                {`${totalSubClauses} تبصره`}
              </Chip>
            </div>
          </div>
        }
      >
        <div
          className={`${clause.terms.length > 0 && "mt-[16px]"} space-y-[8px]`}
        >
          {clause.terms.map((term) => {
            return (
              <div
                key={term.number}
                className={`border border-primary-950/[.1] rounded-[16px] p-3 
              hover:bg-secondary-50 cursor-pointer ${
                activeTerm === term.number ? "bg-secondary-50" : ""
              }`}
                onClick={() => handleSelectTerm(clause, term)}
              >
                <div className="flex items-center justify-between">
                  <p>{term.number}</p>
                  <button
                    className="border border-primary-950/[.1] rounded-[8px] p-1.5 cursor-pointer"
                    onClick={() =>
                      dispatch(
                        deleteTerm({
                          clauseIndex: clause.clauseIndex,
                          termNumber: term.number,
                        })
                      )
                    }
                  >
                    <Trash className="size-[20px] text-delete-snooze" />
                  </button>
                </div>

                <div className="mt-3 mb-2 font-medium text-[14px]/[23px] text-primary-950/[.5]">
                  {term.description}
                </div>

                <div className="w-full flex justify-end">
                  <Chip
                    key={`${term.number}-تبصره`}
                    variant="bordered"
                    className="border border-primary-950/[.1] text-primary-950/[.6]"
                  >
                    {`${term.subClause.length} تبصره`}
                  </Chip>
                </div>
              </div>
            );
          })}
        </div>
      </AccordionCard>
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete()}
          itemId={selectedId}
        />
      )}
    </>
  );
}
