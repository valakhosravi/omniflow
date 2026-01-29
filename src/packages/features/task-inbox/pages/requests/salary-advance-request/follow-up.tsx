"use client";

import React, { useCallback, useEffect, useState } from "react";
import TaskInboxLayout from "../../../layouts";
import { Button, Spinner, useDisclosure } from "@heroui/react";
import {
  Calendar,
  Refresh,
  DocumentText,
  User,
  UserTag,
  Call,
  PercentageCircle,
  Money,
  UserSquare,
  Coin,
  Card,
  Warning2,
  SmsTracking,
} from "iconsax-reactjs";
import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import { addToaster } from "@/ui/Toaster";
import { useRouter } from "next/navigation";
import { useSendMessageMutation } from "@/packages/camunda";
import { useRequestStatus } from "../../../hooks/useRequestStatus";
import { useGetRequestByIdProcess } from "@/hooks/process/useHumanResource";
import { useLazyGetEmployeeInfoByPersonnelIdQuery } from "../../../api/employmentCertificateApi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import {
  useGetLoanRequestByRequestIdQuery,
  useGetSalaryAdvancedPaidRequestPerYearQuery,
} from "@/packages/features/advance-money/api/advanceMoneyApi";
import { formatTimePeriod } from "@/utils/dateFormatter";
import RequestDetail from "@/packages/features/development-ticket/components/v2/RequestDetail";
import { STATUS_STYLES } from "../../../constants/constant";
import CustomButton from "@/ui/Button";
import RequestFlowModal from "../../../components/RequestFlowModal";
import { useRequestTimeline } from "../../../hooks/useRequestTimeline";

interface SalaryAdvanceRequestFollowUpPageProps {
  requestId: string;
  formKey: string;
}
export default function SalaryAdvanceRequestFollowUpPage({
  requestId,
  formKey,
}: SalaryAdvanceRequestFollowUpPageProps) {
  const {
    data: loanRequestDetails,
    isLoading,
    error,
  } = useGetLoanRequestByRequestIdQuery(Number(requestId));
  const {
    requestTimeline,
    refetch: refetchRequestTimeline,
    isLoading: isTimelineLoading,
  } = useRequestTimeline({ requestId: Number(requestId) });
  const {
    data: salaryAdvancedPaidRequest,
    isLoading: isSalaryAdvancedPaidRequestLoading,
  } = useGetSalaryAdvancedPaidRequestPerYearQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const { requestData } = useGetRequestByIdProcess(Number(requestId));
  const [
    getEmployeeInfoByPersonnelId,
    { data: userData, isLoading: isLoadingUser, isError: isErrorUser },
  ] = useLazyGetEmployeeInfoByPersonnelIdQuery();

  const router = useRouter();

  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  // Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  useEffect(() => {
    if (requestData?.Data?.PersonnelId) {
      getEmployeeInfoByPersonnelId(requestData.Data.PersonnelId);
    }
  }, [requestData]);

  const infoRows = [
    {
      icon: <User size={16} />,
      title: "نام و نام خانوادگی",
      value: userData?.Data?.FullName || "",
    },
    {
      icon: <UserTag size={16} />,
      title: "شماره پرسنلی",
      value: Number(userData?.Data?.PersonnelId) || "",
    },
    {
      icon: <SmsTracking size={16} />,
      title: "کد پیگیری",
      value: Number(requestData?.Data?.TrackingCode) || "",
    },
    {
      icon: <PercentageCircle size={16} />,
      title: "درصد درخواست مساعده",
      value: `${(loanRequestDetails?.Data?.AmountRatio || 0) * 100}%`,
    },
    {
      icon: <Money size={16} />,
      title: "بازپرداخت",
      value: `${loanRequestDetails?.Data?.RepaymentMonth.toLocaleString()} ماه`,
    },
    {
      icon: <Warning2 size={16} />,
      title: "دارای شرایط خاص",
      value: loanRequestDetails?.Data?.IsStandard ? (
        <div className="text-[14px] font-bold">خیر</div>
      ) : (
        <div className="text-[14px] font-bold">بله</div>
      ),
    },
    {
      icon: <Money size={16} />,
      title: "تعداد درخواست های ثبت شده در سال",
      value: `${
        salaryAdvancedPaidRequest?.Data?.length &&
        salaryAdvancedPaidRequest?.Data?.length > 0
          ? salaryAdvancedPaidRequest.Data.length
          : "0"
      }`,
    },
    {
      icon: <Calendar size={16} />,
      title: "تاریخ استخدام",
      value: (
        <div>
          <span>
            {new Date(userData?.Data?.EmploymentDate || "")
              .toLocaleString("fa-IR")
              .split(", ")[0] || ""}
          </span>
          <span className="text-xs text-[#1C3A6399]">
            {userData?.Data?.EmploymentDate
              ? ` (${formatTimePeriod(userData.Data.EmploymentDate)})`
              : ""}
          </span>
        </div>
      ),
    },
    {
      icon: <UserTag size={16} />,
      title: "سمت",
      value: userData?.Data?.Title || "",
    },
    {
      icon: <UserSquare size={16} />,
      title: "کد ملی",
      value: userData?.Data?.NationalCode || "",
    },
  ];

  const detailRows = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[requestStatus?.StatusCode || 0]
          }`}
        >
          {requestStatus?.StatusName || ""}
        </div>
      ),
      icon: <Refresh size={16} />,
    },
    {
      title: "نام و نام خانوادگی",
      value: requestStatus?.FullName || "",
      icon: <User size={16} />,
    },
    {
      title: "سمت",
      value: requestStatus?.JobPositionName || "",
      icon: <User size={16} />,
    },
  ];

  const onSendMessageClick = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    sendMessage({
      body: {
        messageName: "Salary-Advance-Request-Terminate-Request-Massage",
        processInstanceId: requestData?.Data?.InstanceId || "",
        // processVariables: {
        //   SalaryAdvanceId: {
        //     value: ,
        //     type: "long",
        //   },
        // },
      },
    })
      .unwrap()
      .then(() => {
        addToaster({
          color: "success",
          title: "درخواست با موفقیت لغو شد",
        });
        setIsConfirmModalOpen(false);
        router.push("/task-inbox/requests");
      })
      .catch((error) => {
        addToaster({
          color: "danger",
          title: error.message || "خطا در لغو درخواست",
        });
      });
  }, [sendMessage, requestData, router]);

  const handleCancelModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  if (isLoading || isTimelineLoading) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </TaskInboxLayout>
    );
  }

  if (error) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">خطا در بارگذاری اطلاعات</div>
        </div>
      </TaskInboxLayout>
    );
  }

  return (
    <TaskInboxLayout>
      <div className="px-4 py-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="inline-flex items-center gap-2">
            {/* <TagIcon fill="#4A85E7" /> */}
            <span className="text-[#1C3A63] text-[16px] font-[500]">
              درخواست مساعده
            </span>
          </div>

          <CustomButton
            buttonVariant="outline"
            buttonSize="md"
            startContent={<Refresh size={20} />}
            onPress={onRequestFlowOpen}
          >
            مراحل گردش درخواست
          </CustomButton>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="border border-[#D8D9DF] p-4 rounded-[20px]">
              <div className="text-[#1C3A63] pb-3 mb-4 border-b border-[#1C3A631A]">
                شرح درخواست
              </div>
              <div
                className={`rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4 mb-2 ${
                  requestStatus?.StatusCode === 100 && "mb-4"
                }`}
              >
                <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
                  خلاصه درخواست مساعده
                </div>
                <div className="flex flex-col gap-4">
                  {infoRows.map((item, index) => (
                    <AppInfoRow
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      value={item.value}
                    />
                  ))}
                </div>
              </div>
              {
                /* follow-up */
                formKey === "follow-up" &&
                  requestStatus &&
                  requestStatus.CanBeCanceled && (
                    <div className="text-left mt-4">
                      <Button
                        variant="bordered"
                        className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
                        size="md"
                        onPress={onSendMessageClick}
                      >
                        لغو درخواست
                      </Button>
                    </div>
                  )
              }
            </div>
          </div>
          {/* <RequestDescription /> */}
          <RequestDetail
            formData={detailRows}
            CreatedDate={loanRequestDetails?.Data?.CreatedDate}
          />
        </div>
      </div>
      <Modal isOpen={isConfirmModalOpen} onClose={handleCancelModal} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#FF1751]">
                تایید لغو درخواست
              </ModalHeader>
              <ModalBody>
                <p>آیا از لغو این درخواست مطمئن هستید؟</p>
                <p className="text-sm text-gray-600 mt-2">
                  این عمل قابل بازگشت نیست.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
                  onPress={handleCancelModal}
                >
                  انصراف
                </Button>
                <Button
                  variant="solid"
                  className="bg-[#FF1751] text-white rounded-[12px]"
                  onPress={handleConfirmCancel}
                  isLoading={isSendingMessage}
                >
                  لغو درخواست
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </TaskInboxLayout>
  );
}
