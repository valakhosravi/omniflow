"use client";
import CustomButton from "@/ui/Button";
import { ArrowLeft } from "iconsax-reactjs";
import MaterialInputs from "./MaterialInputs";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  addTerm,
  deleteTerm,
  resetContractData,
  setActiveTerm,
  deleteAllClauses,
} from "../../../contract.slices";
import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { useFullSaveContractRequest } from "../../../hook/contractHook";
import { addToaster } from "@/ui/Toaster";
import { useCamunda } from "@/packages/camunda";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useFullEditContractMutation } from "../../../contract.services";
import { ContractClauses } from "@/features/contract/contract.types";

export default function Completion() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [selectedId] = useState<number | null>(null);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const taskId = searchParams.get("taskId");

  const {
    activeClause,
    activeTerm,
    clauses,
    contractTitle,
    formValues,
    CategoryId,
    contractData,
  } = useSelector((state: RootState) => state.nonTypeContractData);
  const clause = clauses.find((c) => c.clauseIndex === activeClause);

  const { fullSaveContractRequest, isLoading } = useFullSaveContractRequest();
  const [fullEditContract, { isLoading: isEditing }] =
    useFullEditContractMutation();

  const { isOpen: isDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const {
    isOpen: isDeleteAllOpen,
    onOpen: onDeleteAllOpen,
    onClose: onDeleteAllClose,
  } = useDisclosure();

  const { startProcessWithPayload, completeTaskWithPayload } = useCamunda();
  const { userDetail } = useAuth();

  const { data: processByNameAndVersion } = useGetLastProcessByName("Contract");

  const confirmDelete = async () => {
    if (!activeClause || !activeTerm) return;
    dispatch(
      deleteTerm({
        clauseIndex: activeClause,
        termNumber: activeTerm,
      }),
    );
    onDeleteClose();
  };

  const handleDeleteAll = () => {
    setSelectedDeleteId(0);
    onDeleteAllOpen();
  };

  const confirmDeleteAll = async () => {
    dispatch(deleteAllClauses());
    onDeleteAllClose();
  };

  const handleNextTerm = () => {
    if (!activeClause) return;

    const clause = clauses.find((c) => c.clauseIndex === activeClause);
    if (!clause) return;

    // If no term exists at all, create the first one
    if (clause.terms.length === 0) {
      const newTermNumber = `${activeClause}.1`;
      dispatch(addTerm({ clauseIndex: activeClause }));
      dispatch(setActiveTerm(newTermNumber));
      return;
    }

    // Find the index of the current active term
    const currentIndex = clause.terms.findIndex((t) => t.number === activeTerm);

    // If there's a next existing term, just move to it
    if (currentIndex !== -1 && currentIndex < clause.terms.length - 1) {
      const nextTermNumber = clause.terms[currentIndex + 1].number;
      dispatch(setActiveTerm(nextTermNumber));
      return;
    }

    // Otherwise, create a new term and go to it
    const newTermNumber = `${activeClause}.${clause.terms.length + 1}`;
    dispatch(addTerm({ clauseIndex: activeClause }));
    dispatch(setActiveTerm(newTermNumber));
  };

  const handleCreateContract = async () => {
    const contractClauses: ContractClauses[] = clauses
      .filter((c) => c.terms.length > 0)
      .map((clause, clauseIndex) => {
        const terms = clause.terms.map((term, termIndex) => {
          const subClauses = term.subClause.map((subClause) => {
            return {
              Title: String(subClause.subClauseIndex),
              Description: subClause.subClauseDescription,
            };
          });
          return {
            Title: term.number,
            InitialDescription: term.description,
            SortOrder: termIndex,
            SubClauses: subClauses,
          };
        });

        return {
          Name: clause.title,
          Description: "",
          SortOrder: clauseIndex,
          Terms: terms,
          IsEditable: clause.IsEditable,
        };
      });

    const editContractClauses = clauses
      .filter((c) => c.terms.length > 0)
      .map((clause, index) => ({
        ClauseName: clause.title,
        SortOrder: index + 1,
        Terms: clause.terms.map((term, index) => ({
          Title: term.number,
          InitialDescription: term.description,
          FinalDescription: "",
          SortOrder: index + 1,
          SubClauses: term.subClause.map((sub) => ({
            Title: String(sub.subClauseIndex),
            Description: sub.subClauseDescription,
          })),
        })),
      }));

    if (taskId) {
      await fullEditContract({
        id: contractData?.ContractId ?? 0,
        body: {
          Attachments: [formValues.attachmentUrl[0]],
          ContractClauses: editContractClauses,
          ContractFields: formValues.data ?? [],
          ContractTitle: contractData?.ContractTitle ?? "",
          IsType: false,
          PersonnelId: Number(userDetail?.UserDetail.PersonnelId),
        },
      }).then((res) => {
        if (res.data?.ResponseCode === 100)
          completeTaskWithPayload(taskId, {}).then(() => {
            router.push(`/task-inbox/requests`);
          });
      });
    } else {
      await fullSaveContractRequest({
        RequestId: null,
        ContractClauses: contractClauses,
        ContractFields: formValues.data ?? [],
        CategoryId: CategoryId ?? 0,
        Title: contractTitle,
        NationalId: "-1",
        PartyName: "",
        PartyType: 1,
      })
        .then((res) => {
          const payload = {
            ContractId: res.data?.Data?.ContractId,
            EmployeeMobileNumber: userDetail?.UserDetail.Mobile,
            PersonnelId: userDetail?.UserDetail.PersonnelId,
            AttachmentAddress: formValues.attachmentUrl,
            IsType: false,
            Title: contractTitle,
          };
          startProcessWithPayload(
            processByNameAndVersion?.Data?.DefinitionId || "",
            payload,
          ).then(() => {
            addToaster({
              title:
                res.data?.ResponseMessage ?? "درخواست شما با موفقیت ثبت شد.",
              color: "success",
            });
            router.push(`/task-inbox/requests`);
            dispatch(resetContractData());
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <>
      <div className="justify-between space-y-4 overflow-y-auto">
        <div className="w-[600px] border border-primary-950/[.1] rounded-[20px] p-4">
          <h2 className="font-semibold text-[20px]/[28px] text-primary-950">
            تکمیل مفاد قرارداد {contractTitle}
          </h2>
          <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-1" />
          {!clause && (
            <div className="border border-secondary-200 bg-day-title rounded-[8px] p-3 text-xs text-primary-950 text-justify space-y-2 leading-relaxed">
              <p className="font-semibold text-sm">
                راهنمای کار با ویرایشگر قرارداد
              </p>

              <p>
                ۱. ابتدا از باکس سمت راست با کلیک بر دکمه{" "}
                <strong>افزودن ماده</strong>، ماده جدید اضافه کنید.
              </p>

              <p>
                ۲. برای ایجاد <strong>بند</strong>، روی دکمه{" "}
                <strong>افزودن بند</strong> در هر ماده کلیک کنید.
              </p>

              <p>
                ۳. پس از اضافه کردن بند، می‌توانید <strong>تبصره‌ها</strong> را
                نیز به آن اضافه نمایید.
              </p>

              <p>
                ۴. با کلیک روی هر بند یا تبصره، می‌توانید{" "}
                <strong>توضیحات</strong> آن را ویرایش کنید.
              </p>

              <p>
                ۵. برای حذف بند یا تبصره، روی آیکون <strong>سطل زباله</strong>{" "}
                کلیک کرده و حذف را تأیید کنید.
              </p>
            </div>
          )}
          <MaterialInputs />
          {clause && clause?.terms.length > 0 && activeTerm && (
            <div className="w-full flex justify-end">
              <button
                className="flex items-center gap-x-2 text-primary-950 cursor-pointer mt-[20px]"
                onClick={handleNextTerm}
              >
                <span className="font-semibold text-[14px]/[23px]">
                  بند بعدی
                </span>
                <ArrowLeft size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-4 self-end justify-between">
          <span>
            <CustomButton
              buttonVariant="outline"
              onPress={() => handleDeleteAll()}
              className="border !border-trash !text-trash rounded-[8px] p-1.5 
              cursor-pointer mr-[1px]"
              isDisabled={clauses.length === 0}
            >
              حذف تمامی ماده ها
            </CustomButton>
          </span>
          <span className="flex items-center gap-x-2">
            {/* <CustomButton
              buttonSize="md"
              buttonVariant="outline"
              className="font-semibold text-[14px]/[23px]"
              onPress={handlePreview}
              disabled={clauses.length === 0}
            >
              پیش‌نمایش
            </CustomButton> */}
            <CustomButton
              buttonSize="md"
              buttonVariant="primary"
              className="font-semibold text-[14px]/[23px]"
              disabled={clauses.length === 0}
              onPress={handleCreateContract}
              isLoading={isLoading || isEditing}
            >
              {taskId ? "ویرایش قرارداد" : "ثبت اولیه قرارداد"}
            </CustomButton>
          </span>
        </div>
      </div>
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete()}
          itemId={selectedId}
          description="آیا از حذف این بند مطمئن هستید؟"
        />
      )}
      {selectedDeleteId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteAllOpen}
          onClose={onDeleteAllClose}
          onConfirm={() => confirmDeleteAll()}
          itemId={selectedDeleteId}
          description="آیا از حذف تمامی ماده ها مطمئن هستید؟"
        />
      )}
    </>
  );
}
