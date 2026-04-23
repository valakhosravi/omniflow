"use client";

import { Select, SelectItem } from "@heroui/react";
import AppInput from "@/components/common/AppInput";
import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useSalaryAdvanceTeCheckWorkflow } from "../hooks/useSalaryAdvanceTeCheckWorkflow";
import SalaryAdvanceCheckDetails from "./SalaryAdvanceCheckDetails";

function SalaryAdvanceTeCheckPageComponent() {
  const wf = useSalaryAdvanceTeCheckWorkflow();

  return (
    <AppWorkflowPage
      title={wf.title}
      actions={wf.actions}
      requestId={wf.requestId}
      isLoading={wf.isInitialDataLoading}
      DetailsComponent={
        <SalaryAdvanceCheckDetails
          detailsConfig={wf.detailsConfig}
          data={wf.data}
          isLoading={wf.isInitialDataLoading}
          isTaskClaimed={wf.isTaskClaimed}
          description={wf.description}
          setDescription={wf.setDescription}
          descriptionError={wf.descriptionError}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <AppInput
                label="کد پیگیری پرداخت"
                value={wf.paymentId}
                onChange={(e) => wf.setPaymentId(e.target.value)}
                error={wf.paymentIdError ?? undefined}
                placeholder="کد پیگیری پرداخت را وارد کنید"
                type="text"
              />
            </div>
            <div>
              <div className="text-[14px] mb-[10px]">وضعیت پرداخت</div>
              <Select
                isInvalid={!!wf.paymentStatusError}
                errorMessage={wf.paymentStatusError ?? undefined}
                selectedKeys={wf.paymentStatus ? [wf.paymentStatus] : []}
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys)[0] as string;
                  wf.setPaymentStatus(selectedValue || "");
                }}
                placeholder="انتخاب وضعیت پرداخت"
                className="w-full"
                classNames={{
                  trigger: "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                  value: "text-right",
                  popoverContent: "border border-[#D8D9DF]",
                }}
              >
                <SelectItem key="success">پرداخت موفق</SelectItem>
              </Select>
            </div>
          </div>
        </SalaryAdvanceCheckDetails>
      }
    />
  );
}

export default AppWithTaskInboxSidebar(SalaryAdvanceTeCheckPageComponent);
