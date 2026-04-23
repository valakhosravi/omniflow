"use client";

import { AppButton } from "@/components/common/AppButton";
import { AppCheckbox } from "@/components/common/AppCheckbox";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useCamunda } from "@/packages/camunda";
import { toPersianDateOnly } from "@/utils/dateFormatter";
import { useCallback, useEffect, useState } from "react";
import { useGetBanksQuery } from "../salary-deduction.services";
import { addToaster } from "@/ui/Toaster";
import { useRouter } from "next/navigation";

export default function SalaryDeductionStartPageComponent() {
  const router = useRouter();
  const { data: processByNameAndVersion } =
    useGetLastProcessByName("SalaryDeduction");
  const { startProcessWithPayload, isStartingProcess } = useCamunda();

  const { userDetail } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    nationalCode: "",
    phoneNumber: "",
    jobPosition: "",
    employmentDate: "",
    bankId: "",
    amount: "",
    installmentCount: "",
    installmentAmount: "",
    guaranteeNationalCode: "",
    guaranteeFullName: "",
    hasJobPosition: false,
    hasPhoneNumber: false,
    hasEmploymentDate: false,
    isGuarantee: false,
  });

  const { data: bankOptions } = useGetBanksQuery();

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleStart = useCallback(async () => {
    if (processByNameAndVersion?.Data?.DefinitionId) {
      try {
        await startProcessWithPayload(
          processByNameAndVersion.Data.DefinitionId,
          {
            EmployeeMobileNumber: form.phoneNumber,
            JobPosition: form.jobPosition,
            EmploymentDate: toPersianDateOnly(form.employmentDate),
            BankId: Number(form.bankId),
            Amount: Number(form.amount.replaceAll(",", "")),
            InstallmentCount: Number(form.installmentCount.replaceAll(",", "")),
            InstallmentAmount: Number(
              form.installmentAmount.replaceAll(",", ""),
            ),
            GuaranteedNationalCode: form.guaranteeNationalCode,
            GuaranteedFullName: form.guaranteeFullName,
            HasJobPosition: form.hasJobPosition,
            HasPhoneNumber: form.hasPhoneNumber,
            HasEmploymentStartDate: form.hasEmploymentDate,
            IsGuarantee: form.isGuarantee,
          },
        );
        router.push("/task-inbox/requests");
      } catch (error: any) {
        addToaster({
          title: error?.data?.ResponseMessage || "خطا در ثبت گواهی کسر از حقوق",
          color: "danger",
        });
        console.error(error);
      }
    }
  }, [processByNameAndVersion, form]);

  useEffect(() => {
    if (userDetail?.UserDetail) {
      setForm((prev) => ({
        ...prev,
        firstName: userDetail.UserDetail.FirstName,
        lastName: userDetail.UserDetail.LastName,
        fatherName: userDetail.UserDetail.FatherName,
        nationalCode: userDetail.UserDetail.NationalCode,
        phoneNumber: userDetail.UserDetail.Mobile,
        jobPosition: userDetail.UserDetail?.Title || "",
        employmentDate: userDetail.UserDetail.EmploymentDate || "",
      }));
    }
  }, [userDetail]);

  return (
    <div className="w-full py-10 flex justify-center bg-gray-50">
      <div className="w-full max-w-5xl bg-white card p-8 rounded-xl">
        {/* Title */}
        <h1 className="text-xl font-bold mb-6 text-center">
          درخواست صدور گواهی کسر از حقوق / مستمری
        </h1>

        {/* --- Section: مشخصات متقاضی --- */}
        <section className="mb-8">
          <h2 className="font-semibold mb-4">مشخصات متقاضی</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AppInput label="نام" value={form.firstName} readOnly />
            <AppInput label="نام خانوادگی" value={form.lastName} readOnly />
            <AppInput label="نام پدر" value={form.fatherName} readOnly />

            <AppInput label="کد ملی" value={form.nationalCode} readOnly />
            <AppInput label="شماره تماس" value={form.phoneNumber} readOnly />
            <AppInput label="سمت شغلی" value={form.jobPosition} readOnly />
            <AppInput
              label="تاریخ استخدام"
              value={new Date(form.employmentDate).toLocaleDateString("fa-IR")}
              readOnly
            />
          </div>
        </section>

        {/* --- Section: سقف مبلغ قابل کسر از حقوق --- */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">سقف مبلغ قابل کسر از حقوق</h2>

          <div className="bg-primary-50 border border-primary-300 p-4 rounded-xl">
            <p className="text-sm text-primary-700 leading-relaxed">
              سقف تسویه ۵۰٪ حقوق مبنا کارمندان.
              <br />* مبلغ قابل کسر ماهانه: با توجه به حقوق ماهانه و میزان تسویه
              وام.
            </p>
          </div>
        </section>

        {/* --- Section: مشخصات تسهیلات --- */}
        <section className="mb-8">
          <h2 className="font-semibold mb-4">مشخصات تسهیلات</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AppInput
              label="مبلغ تسهیلات (ریال)"
              value={form.amount}
              onChange={(v) => update("amount", v.target.value)}
              type="number"
            />

            <AppInput
              label="تعداد اقساط"
              value={form.installmentCount}
              onChange={(v) => update("installmentCount", v.target.value)}
              type="number"
            />

            <AppInput
              label="مبلغ هر قسط (ریال)"
              value={form.installmentAmount}
              onChange={(v) => update("installmentAmount", v.target.value)}
              type="number"
            />
          </div>

          <div className="mt-4">
            <AppSelect
              label="سازمان / اداره هدف"
              name="bankId"
              options={(bankOptions?.Data || []).map((x) => ({
                label: x.BankName || "",
                value: x.BankId,
              }))}
              value={form.bankId}
              onChange={(e: { target: { value: string; name: string } }) => {
                setForm((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              placeholder="بانک / موسسه قرض‌الحسنه و غیره را انتخاب کنید"
              searchable
              required
            />
          </div>
        </section>

        {/* --- Section: ضامنین --- */}
        <section className="mb-8">
          <h2 className="font-semibold mb-4">مشخصات ضامن</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput
              label="کد ملی ضامن"
              value={form.guaranteeNationalCode}
              onChange={(v) => update("guaranteeNationalCode", v.target.value)}
            />
            <AppInput
              label="نام و نام خانوادگی ضامن"
              value={form.guaranteeFullName}
              onChange={(v) => update("guaranteeFullName", v.target.value)}
            />
          </div>
        </section>

        {/* --- Section: مدارک لازم --- */}
        <section className="mb-8">
          <h2 className="font-semibold mb-4">مدارک مورد نیاز</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppCheckbox
              label="سمت شغلی"
              checked={form.hasJobPosition}
              onChange={(v) => update("hasJobPosition", v)}
              name="hasJobPosition"
            />

            <AppCheckbox
              label="شماره تماس"
              checked={form.hasPhoneNumber}
              onChange={(v) => update("hasPhoneNumber", v)}
              name="hasPhoneNumber"
            />

            <AppCheckbox
              label="تاریخ استخدام"
              checked={form.hasEmploymentDate}
              onChange={(v) => {
                update("hasEmploymentDate", v);
              }}
              name="hasEmploymentDate"
            />
          </div>
        </section>

        {/* --- Submit Button --- */}
        <div className="text-left">
          <AppButton
            onClick={handleStart}
            loading={isStartingProcess}
            label="ثبت و ادامه"
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
