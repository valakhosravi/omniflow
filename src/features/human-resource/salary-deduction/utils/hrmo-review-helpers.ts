type SalaryDeductionPrintData = {
  fullName: string;
  fatherName: string;
  nationalCode: string;
  personnelId: string;
  trackingCode: string;
  createdDate: string;
  guaranteeFullName: string;
  amount: string;
  installmentAmount: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function printableValue(value: string, fallback = "....................") {
  return value ? escapeHtml(value) : fallback;
}

export function buildSalaryDeductionPrintHtml(data: SalaryDeductionPrintData) {
  const printable = {
    fullName: printableValue(data.fullName),
    fatherName: printableValue(data.fatherName),
    nationalCode: printableValue(data.nationalCode),
    personnelId: printableValue(data.personnelId),
    trackingCode: printableValue(data.trackingCode),
    createdDate: printableValue(data.createdDate),
    guaranteeFullName: printableValue(data.guaranteeFullName),
    amount: printableValue(data.amount),
    installmentAmount: printableValue(data.installmentAmount),
  };

  return `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>نامه کسر از حقوق / ضمانت</title>
    <style>
      body {
        font-family: Tahoma, Arial, sans-serif;
        margin: 0;
        background: #f5f5f5;
      }
      .container {
        max-width: 900px;
        margin: 24px auto;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 28px;
        line-height: 2.1;
        color: #222;
      }
      h1 {
        margin: 0 0 20px;
        font-size: 22px;
        text-align: center;
      }
      .meta {
        margin-bottom: 16px;
        font-size: 14px;
        color: #444;
      }
      .content {
        text-align: justify;
        font-size: 15px;
      }
      .sign {
        margin-top: 56px;
        display: flex;
        justify-content: space-between;
        font-size: 15px;
      }
      .print-btn {
        margin-top: 24px;
        border: none;
        background: #2563eb;
        color: #fff;
        padding: 10px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
      }
      @media print {
        body {
          background: #fff;
        }
        .container {
          margin: 0;
          max-width: none;
          box-shadow: none;
          border-radius: 0;
        }
        .print-btn {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>نامه کسر از حقوق / ضمانت</h1>
      <div class="meta">شماره نامه: ${printableValue(data.trackingCode, "—")} | تاریخ: ${printableValue(data.createdDate, "—")}</div>
      <div class="content">
        اینجانب ${printable.fullName} فرزند ${printable.fatherName} دارای کد ملی
        ${printable.nationalCode} و کد پرسنلی ${printable.personnelId} در خصوص نامه کسر از حقوق / ضمانت
        شماره ${printable.trackingCode} مورخ ${printable.createdDate} جهت اخذ تسهیلات آقای / خانم
        ${printable.guaranteeFullName} به مبلغ ${printable.amount} ریال با اقساط
        ${printable.installmentAmount} ریال اعلام می دارم در صورتی که بنا به هر دلیلی از طریق نامه مکتوب بدهی
        اینجانب یا وام گیرنده از ناحیه مراجع قضایی در اجرای ماده 96 قانون اجرای احکام و ماده 83 آئین نامه اجرای مفاد اسناد رسمی و یا بانک ها
        و سایر موسسات به شرکت تجارت الکترونیک پارسیان اعلام گردد، شرکت مذکور مجاز است رأساً نسبت به کسر میزان بدهی اعلامی از حقوق و مزایای
        اینجانب و واریز به حساب تعیین شده اقدام نماید. لذا اینجانب ضمن پذیرش کلیه شرایط فوق الذکر و اطلاع کامل از نحوه صدور گواهی کسر از حقوق،
        حق هر گونه ادعا و یا اعتراض آتی را از خود سلب و ساقط می نمایم.
      </div>
      <div class="sign">
        <div>امضاء</div>
        <div>تاریخ</div>
      </div>
      <button class="print-btn" onclick="window.print()">چاپ سند</button>
    </div>
  </body>
</html>`;
}
