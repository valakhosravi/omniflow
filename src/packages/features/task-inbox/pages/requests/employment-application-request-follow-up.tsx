"use client";

import React, { useCallback, useEffect, useState } from "react";
import TaskInboxLayout from "../../layouts";
import { Button, Spinner, useDisclosure } from "@heroui/react";
import {
  Arrow,
  Buildings,
  Calendar,
  Eye,
  Global,
  Refresh,
  DocumentText,
  User,
  UserTag,
  Call,
  UserSquare,
} from "iconsax-reactjs";
import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import { useEmploymentCertificate } from "../../hooks/useEmploymentCertificate";
import { addToaster } from "@/ui/Toaster";
import { useSearchParams, useRouter } from "next/navigation";
import { useSendMessageMutation } from "@/packages/camunda";
import { useRequestStatus } from "../../hooks/useRequestStatus";
import { useGetRequestByIdProcess } from "@/hooks/process/useHumanResource";
import { useLazyGetEmployeeInfoByPersonnelIdQuery } from "../../api/employmentCertificateApi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import RequestFlowModal from "../../components/RequestFlowModal";
import { useRequestTimeline } from "../../hooks/useRequestTimeline";
import RequestDetail from "@/packages/features/development-ticket/components/v2/RequestDetail";

interface EmploymentApplicationRequestFollowUpPageProps {
  requestId: string;
  formKey: string;
}
export default function EmploymentApplicationRequestFollowUpPage({
  requestId,
  formKey,
}: EmploymentApplicationRequestFollowUpPageProps) {
  const { employmentCertificateData, isLoading, error } =
    useEmploymentCertificate(requestId);

  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const { requestData } = useGetRequestByIdProcess(Number(requestId));
  const [
    getEmployeeInfoByPersonnelId,
    { data: userData, isLoading: isLoadingUser, isError: isErrorUser },
  ] = useLazyGetEmployeeInfoByPersonnelIdQuery();
  const searchParams = useSearchParams();
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

  const RequestId = Number(requestId);

  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: RequestId });

  useEffect(() => {
    if (requestData?.Data?.PersonnelId) {
      getEmployeeInfoByPersonnelId(requestData.Data.PersonnelId);
    }
  }, [requestData]);

  const infoRows = [
    {
      icon: <User size={16} />,
      title: "نام و نام خانوادگی",
      value: requestStatus?.FullName || "",
    },
    {
      icon: <User size={16} />,
      title: "سمت",
      value: requestStatus?.JobPositionName || "",
    },
    {
      icon: <UserSquare size={16} />,
      title: "کد پرسنلی",
      value: requestData?.Data?.PersonnelId || "",
    },
    {
      icon: <Buildings size={16} />,
      title: "سازمان / اداره هدف",
      value: employmentCertificateData?.ReceiverOrganizationName,
    },
    {
      icon: <Arrow size={16} />,
      title: "جهت",
      value: employmentCertificateData?.ForReason,
    },
    {
      icon: <Global size={16} />,
      title: "زبان گواهی اشتغال به کار",
      value: "فارسی",
    },
    {
      icon: <Eye size={16} />,
      title: "موارد قابل‌نمایش در نامه",
      value: (
        <div className="flex gap-2">
          {employmentCertificateData?.IsNeedJobPosition && (
            <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
              سمت شغلی
            </div>
          )}
          {employmentCertificateData?.IsNeedPhone && (
            <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
              شماره تماس
            </div>
          )}
          {employmentCertificateData?.IsNeedStartDate && (
            <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
              تاریخ استخدام
            </div>
          )}
          {employmentCertificateData?.IsNeedSalary && (
            <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
              مقدار حقوق
            </div>
          )}
        </div>
      ),
    },
  ];

  const detailRows = [
    {
      title: "وضعیت درخواست",

      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px]
         ${requestStatus?.StatusCode === 100 && "bg-[#8D9CB11A] text-[#307FE2]"}
        ${requestStatus?.StatusCode === 111 && "bg-yellow-100 text-yellow-400"}
        ${requestStatus?.StatusCode === 112 && "bg-blue-100 text-blue-400"}
        ${requestStatus?.StatusCode === 102 && "bg-[#4CAF50] text-[#EAF7EC]"}
        ${requestStatus?.StatusCode === 103 && "bg-[#FFEBEE] text-[#FF1751]"}
        ${requestStatus?.StatusCode === 104 && "bg-gray-200 text-gray-400"}
        `}
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

  const onDownloadPDF = useCallback(async () => {
    if (!userData?.Data || !employmentCertificateData) {
      addToaster({
        color: "danger",
        title: "اطلاعات کاربر یافت نشد",
      });
      return;
    }

    try {
      console.log(
        "employmentCertificateData.IsNeedJobPosition",
        employmentCertificateData.IsNeedJobPosition
      );
      // Prepare data for the certificate
      const certificateData = {
        fullName: userData.Data.FullName || "",
        fatherName: userData.Data.FatherName || "",
        nationalCode: userData.Data.NationalCode || "",
        startDate: userData.Data.EmploymentDate
          ? new Date(userData.Data.EmploymentDate)
              .toLocaleString("fa-IR")
              .split(", ")[0]
          : "",
        phoneNumber: userData.Data.Mobile || "",
        jobPosition: userData.Data.Title || "",
        receiverOrganization:
          employmentCertificateData.ReceiverOrganizationName || "",
        forReason: employmentCertificateData.ForReason || "",
        isNeedJobPosition: employmentCertificateData.IsNeedJobPosition || false,
        isNeedPhone: employmentCertificateData.IsNeedPhone || false,
        isNeedStartDate: employmentCertificateData.IsNeedStartDate || false,
        isNeedSalary: employmentCertificateData.IsNeedSalary || false,
        agentName: requestStatus?.FullName || "",
        agentRole: requestStatus?.JobPositionName || "",
      };

      // Create URL with parameters
      const params = new URLSearchParams();
      Object.entries(certificateData).forEach(([key, value]) => {
        params.append(key, String(value));
      });

      // Open certificate page in new tab
      const certificateUrl = `/EmploymentCertificate/v2/certificate-display?${params.toString()}`;
      window.open(certificateUrl, "_blank");
    } catch (error) {
      console.error("Error opening certificate:", error);
      addToaster({
        color: "danger",
        title: "خطا در باز کردن گواهی",
      });
    }
  }, [userData, employmentCertificateData]);

  const onSendMessageClick = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    sendMessage({
      body: {
        messageName: "Employment-Certificate-Terminate-Request-Message",
        processInstanceId: requestData?.Data?.InstanceId || "",
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

  if (isLoading) {
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
              درخواست گواهی اشتغال به کار {employmentCertificateData?.FullName}{" "}
              برای {employmentCertificateData?.ReceiverOrganizationName} جهت{" "}
              {employmentCertificateData?.ForReason}
            </span>
          </div>
          <div>
            <CustomButton
              buttonVariant="outline"
              className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
              buttonSize="md"
              startContent={<Refresh size={20} />}
              onPress={onRequestFlowOpen}
            >
              مراحل گردش درخواست
            </CustomButton>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            {requestStatus?.StatusCode === 102 && (
              <div className="mb-4 p-4 border border-[#D8D9DF] rounded-[20px]">
                <div className="bg-[#EAF7ECB2] border border-[#4CAF5033] p-4 rounded-[16px] flex justify-between items-center">
                  <div className="me-3">
                    <svg
                      width="55"
                      height="55"
                      viewBox="0 0 55 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.05">
                        <path
                          d="M27.3095 1.71973C41.681 1.71973 53.3495 13.3883 53.3495 27.7597C53.3495 42.1312 41.681 53.7997 27.3095 53.7997C12.9381 53.7997 1.26953 42.1312 1.26953 27.7597C1.26953 13.3883 12.9381 1.71973 27.3095 1.71973Z"
                          fill="#2FC15B"
                        />
                      </g>
                      <g opacity="0.1">
                        <path
                          d="M26.7725 12C36.0292 12 43.5449 19.5157 43.5449 28.7725C43.5449 38.0292 36.0292 45.5449 26.7725 45.5449C17.5157 45.5449 10 38.0292 10 28.7725C10 19.5157 17.5157 12 26.7725 12Z"
                          fill="#4CAF50"
                        />
                      </g>
                      <g filter="url(#filter0_f_1030_150374)">
                        <path
                          d="M27.3097 12.8779C35.522 12.8779 42.1897 19.5457 42.1897 27.7579C42.1897 35.9702 35.522 42.6379 27.3097 42.6379C19.0974 42.6379 12.4297 35.9702 12.4297 27.7579C12.4297 19.5457 19.0974 12.8779 27.3097 12.8779Z"
                          fill="#4CAF50"
                        />
                      </g>
                      <path
                        d="M32.2649 24L26.0194 30.8779L22 27.6771"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <filter
                          id="filter0_f_1030_150374"
                          x="0.429688"
                          y="0.87793"
                          width="53.7598"
                          height="53.7598"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="6"
                            result="effect1_foregroundBlur_1030_150374"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-[600] text-[#1C3A63] mb-2">
                      درخواست نهایی و نامه صادر شد.
                    </div>
                    <div className="text-sm text-[#1C3A6399]">
                      تاریخ صدور:{" "}
                      {
                        new Date(
                          requestData?.Data?.ActionDate?.split("T")[0] || ""
                        )
                          .toLocaleString("fa-IR")
                          .split(", ")[0]
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-left mb-1 text-sm text-[#1C3A6399]">
                      شماره نامه: {requestData?.Data?.TrackingCode}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="bordered"
                        className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px] bg-white"
                        onPress={onDownloadPDF}
                      >
                        مشاهده نامه
                      </Button>
                      <Button
                        variant="solid"
                        className="bg-[#1C3A63] border-[#1C3A63] border-1 rounded-[12px] text-white"
                        onPress={onDownloadPDF}
                      >
                        دریافت PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="border border-[#D8D9DF] p-4 rounded-[20px]">
              <div className="text-[#1C3A63] pb-3 mb-4 border-b border-[#1C3A631A]">
                شرح درخواست
              </div>
              <div
                className={`rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4`}
              >
                <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
                  خلاصه درخواست گواهی اشتغال به کار
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
                  (requestStatus.StatusCode === 100 ||
                    requestStatus.StatusCode === 112) && (
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
          <RequestDetail
            formData={detailRows}
            CreatedDate={employmentCertificateData?.CreatedDate}
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
