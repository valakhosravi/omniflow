"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function EmploymentCertificateDisplayPage() {
  const searchParams = useSearchParams();

  // Get data from URL parameters
  const fullName = searchParams?.get("fullName") || "";
  const fatherName = searchParams?.get("fatherName") || "";
  const nationalCode = searchParams?.get("nationalCode") || "";
  const startDate = searchParams?.get("startDate") || "";
  const phoneNumber = searchParams?.get("phoneNumber") || "";
  const jobPosition = searchParams?.get("jobPosition") || "";
  const receiverOrganization = searchParams?.get("receiverOrganization") || "";
  const forReason = searchParams?.get("forReason") || "";
  const isNeedJobPosition = searchParams?.get("isNeedJobPosition") === "true";
  const isNeedPhone = searchParams?.get("isNeedPhone") === "true";
  const isNeedStartDate = searchParams?.get("isNeedStartDate") === "true";
  const isNeedSalary = searchParams?.get("isNeedSalary") === "true";
  const agentName = searchParams?.get("agentName") || "";
  const agentRole = searchParams?.get("agentRole") || "";
  const createdDate = searchParams?.get("createdDate") || "";
  const trackingCode = searchParams?.get("trackingCode") || "";

  // Change page title when component mounts
  useEffect(() => {
    document.title = "گواهی اشتغال به کار";
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            گواهی اشتغال به کار
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          {(trackingCode || createdDate) && (
            <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
              {trackingCode && (
                <div>
                  <span className="font-semibold">شماره نامه:</span>{" "}
                  <span>{trackingCode}</span>
                </div>
              )}
              {createdDate && (
                <div>
                  <span className="font-semibold">تاریخ صدور:</span>{" "}
                  <span>{createdDate}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Certificate Content */}
        <div className="space-y-6 text-right" dir="rtl">
          {/* Recipient */}
          <div className="text-base text-gray-700 leading-relaxed mb-4 font-bold">
            ریاست محترم {receiverOrganization || "___________"}
          </div>

          {/* Greeting */}
          <div className="text-base text-gray-700 leading-relaxed">
            با سلام و احترام،
          </div>

          {/* Main Content */}
          <div className="text-base text-gray-700 leading-relaxed space-y-2">
            <p>
              بدینوسیله گواهی می‌گردد{" "}
              <span className="font-semibold text-gray-800">
                {fullName || "___________"}
              </span>
              ، فرزند:{" "}
              <span className="font-semibold text-gray-800">
                {fatherName || "___________"}
              </span>{" "}
              با کدملی:{" "}
              <span className="font-semibold text-gray-800">
                {nationalCode || "___________"}
              </span>
              {isNeedStartDate && (
                <>
                  {" "}
                  از تاریخ:{" "}
                  <span className="font-semibold text-gray-800">
                    {startDate || "___________"}
                  </span>
                </>
              )}
              {isNeedPhone && (
                <>
                  {" "}
                  با شماره تماس:{" "}
                  <span className="font-semibold text-gray-800">
                    {phoneNumber || "___________"}
                  </span>
                </>
              )}{" "}
              {isNeedJobPosition ? (
                <>
                  در این شرکت شروع به کار نموده و در حال حاضر با سمت{" "}
                  <span className="font-semibold text-gray-800">
                    {jobPosition}
                  </span>{" "}
                </>
              ) : (
                <>در این شرکت شروع به کار نموده </>
              )}
              مشغول به فعالیت می‌باشد. ضمناً حق بیمه ماهانه ایشان به شعبه 22
              سازمان تأمین اجتماعی پرداخت می‌گردد.
            </p>

            <p>
              این گواهی بنا به درخواست نامبرده جهت ارائه به{" "}
              {receiverOrganization} صادر گردیده و فاقد هرگونه ارزش قانونی دیگری
              می‌باشد.
            </p>
          </div>

          {/* Signature Section */}
          <div className="mt-12 flex justify-end items-end">
            <div className="text-center">
              <div className="text-base text-gray-700 mb-2 flex h-[100px] w-[280px] gap-2">
                <Image className="" alt="محل امضا" src="/pictures/tanha-sign.png" width={140} height={100} />
                <Image className="" alt="مهر رسمی" src="/pictures/seal.png" width={140} height={100} />
              </div>
              <div className="text-base font-semibold text-gray-800 mb-1">
                {agentName || "___________"}
              </div>
              <div className="text-base font-semibold text-gray-800 ">
                {agentRole || "___________"}
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            چاپ گواهی
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 20mm 0 0 0;
            size: A4;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .max-w-4xl {
            max-width: none;
            margin: 0;
            padding-top: 20mm;
            box-shadow: none;
            border-radius: 0;
          }

          /* Add text-align justify for print */
          .text-right {
            text-align: justify !important;
          }

          button {
            display: none !important;
          }

          .bg-gray-50 {
            background: white;
          }

          /* Hide browser-generated headers and footers */
          @page {
            @top-left {
              content: "";
            }
            @top-center {
              content: "";
            }
            @top-right {
              content: "";
            }
            @bottom-left {
              content: "";
            }
            @bottom-center {
              content: "";
            }
            @bottom-right {
              content: "";
            }
          }
        }
      `}</style>
    </div>
  );
}
