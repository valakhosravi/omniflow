import CustomButton from "@/ui/Button";
import {
  ContractClauseDetails,
  GetContractInfo,
  GetTermAssigneeDetails,
  TermDetails,
} from "../../contract.types";
import { Edit2, Send2, Trash } from "iconsax-reactjs";
import { Checkbox, CheckboxGroup, Chip, useDisclosure } from "@heroui/react";
import { useState } from "react";
import {
  useGetContractInfoByRequestIdQuery,
  useSoftDeleteTermMutation,
} from "../../contract.services";
import LmcSubClauses from "./LmcSubClauses";
import LmcCommentAndFeedback from "./LmcCommentAndFeedback";
import ClauseTitleModal from "../non-type/complete/ClauseTitleModal";
import LmcEditTermModal from "./LmcEditTermModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import RefereModal from "./RefereModal";
import AccordionCard from "@/ui/AccordionCard";

interface LmcTabItemProps {
  contractData: GetContractInfo;
  termAssignee: GeneralResponse<GetTermAssigneeDetails[]> | undefined;
}

export default function LmcTabItem({
  contractData,
  termAssignee,
}: LmcTabItemProps) {
  const [editClause, setEditClause] = useState<ContractClauseDetails | null>();
  const [term, setTerm] = useState<TermDetails | null>();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { requestId } = useSelector((state: RootState) => state.lmcData);
  const { refetch } = useGetContractInfoByRequestIdQuery(Number(requestId));

  const approvedTerms =
    (termAssignee?.Data &&
      termAssignee?.Data.filter((term) => term.StatusCode === 2)) ??
    [];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [softDeleteTerm, { isLoading: isDeleting }] =
    useSoftDeleteTermMutation();

  const [termIds, setTermIds] = useState<number[]>([]);

  const {
    isOpen: isEditTermOpen,
    onOpen: onEditTermOpen,
    onOpenChange: onEditTermOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isRefereOpen,
    onOpen: onRefereOpen,
    onOpenChange: onRefereOpenChange,
  } = useDisclosure();

  const handleEditClause = (clause: ContractClauseDetails) => {
    setEditClause(clause);
    onOpen();
  };

  const handleEditTerm = (term: TermDetails) => {
    setTerm(term);
    onEditTermOpen();
  };

  const handleDeleteTerm = async (termId: number) => {
    setSelectedId(termId);
    onDeleteOpen();
  };

  const confirmDelete = async (termId: number) => {
    await softDeleteTerm(termId).then(() => {
      refetch();
      onDeleteClose();
    });
  };

  const handleRefereClause = (clause: ContractClauseDetails) => {
    const ids = clause.Terms?.map((term) => Number(term.TermId)) ?? [];
    setTermIds(ids);
    onRefereOpen();
  };

  const handleRefereTerm = (termId: number) => {
    setTermIds([termId]);
    onRefereOpen();
  };

  return (
    <>
      <div className="flex flex-col space-y-[24px]">
        {contractData.ContractClauses.map((clause) => {
          const subClauseCount = clause.Terms.reduce(
            (sum, term) => sum + term.SubClauses.length,
            0,
          );

          return (
            <AccordionCard
              key={clause.ClauseName}
              cardClassName="bg-primary-950/[.03] border-primary-950/[.1]"
              title={
                <div className="flex flex-col gap-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-[20px]/[28px] text-primary-950">
                      {clause.ClauseName}
                    </div>
                    <div className="flex items-center gap-x-2">
                      <CustomButton
                        as="div"
                        buttonVariant="outline"
                        buttonSize="xs"
                        className="font-semibold"
                        startContent={<Edit2 size={16} />}
                        onPress={() => handleEditClause(clause)}
                      >
                        ویرایش ماده
                      </CustomButton>
                      <CustomButton
                        as="div"
                        buttonVariant="outline"
                        buttonSize="xs"
                        className="font-semibold"
                        startContent={<Send2 size={16} />}
                        onPress={() => handleRefereClause(clause)}
                      >
                        ارجاع ماده
                      </CustomButton>
                      <div className="font-semibold text-[14px]/[23px] text-primary-950/[.5]">
                        {` (${approvedTerms.length} / ${clause.Terms.length}) تایید`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-[8px]">
                    <Chip
                      key={`${clause.Terms.length}-بند`}
                      variant="bordered"
                      className="border border-primary-950/[.1] text-primary-950/[.6] bg-white"
                    >
                      {`${clause.Terms.length} بند`}
                    </Chip>
                    <Chip
                      key={`${subClauseCount}-تبصره`}
                      variant="bordered"
                      className="border border-primary-950/[.1] text-primary-950/[.6] bg-white"
                    >
                      {`${subClauseCount} تبصره`}
                    </Chip>
                  </div>
                </div>
              }
            >
              <CheckboxGroup
                className="space-y-[20px]"
                classNames={{ wrapper: `space-y-[24px]` }}
              >
                {clause.Terms.map((term) => {
                  return (
                    <div
                      key={term.Title}
                      className="border border-primary-950/[.1] px-5 py-3 rounded-[16px] 
                      bg-white relative flex flex-col gap-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                          <Checkbox
                            value={String(term.Title)}
                            classNames={{
                              wrapper: "relative after:bg-primary-950",
                            }}
                          />

                          <div className="font-semibold text-[20px]/[28px]">
                            {term.Title}
                          </div>
                        </div>
                        <div className="flex items-center gap-x-2.5">
                          <CustomButton
                            buttonVariant="outline"
                            buttonSize="xs"
                            startContent={<Edit2 size={16} />}
                            onPress={() =>
                              handleRefereTerm(Number(term.TermId))
                            }
                          >
                            ارجاع بند
                          </CustomButton>
                          <CustomButton
                            buttonVariant="outline"
                            buttonSize="xs"
                            startContent={<Send2 size={16} />}
                            onPress={() => handleEditTerm(term)}
                          >
                            ویرایش بند
                          </CustomButton>
                          <CustomButton
                            buttonSize="xs"
                            buttonVariant="outline"
                            startContent={<Trash size={16} />}
                            className="!text-delete-snooze"
                            onPress={() =>
                              handleDeleteTerm(Number(term.TermId))
                            }
                            isLoading={
                              selectedId === Number(term.TermId) && isDeleting
                            }
                          >
                            حذف بند
                          </CustomButton>
                        </div>
                      </div>
                      <div className="font-medium text-[16px]/[30px] text-primary-950/[.5] mt-[10px]">
                        {term.InitialDescription}
                      </div>
                      {term.SubClauses.length > 0 && (
                        <LmcSubClauses term={term} />
                      )}
                      {termAssignee?.Data && termAssignee.Data.length > 0 && (
                        <LmcCommentAndFeedback
                          termAssignee={termAssignee}
                          termId={Number(term.TermId || 0)}
                        />
                      )}
                    </div>
                  );
                })}
              </CheckboxGroup>
            </AccordionCard>
          );
        })}
      </div>
      <ClauseTitleModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        editClause={editClause}
        refetch={refetch}
      />
      <LmcEditTermModal
        isOpen={isEditTermOpen}
        onOpenChange={onEditTermOpenChange}
        term={term}
        refetch={refetch}
      />
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={false}
          itemId={selectedId}
        />
      )}
      <RefereModal
        isOpen={isRefereOpen}
        onOpenChange={onRefereOpenChange}
        contractData={contractData}
        termIds={termIds}
      />
    </>
  );
}
