import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import { toFaDigits, mapContentFa } from "@/utils/contractPdfUtils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Find Chrome on Windows (local development fallback)
// ---------------------------------------------------------------------------
function findWindowsChrome(): string | undefined {
  if (process.platform !== "win32") return undefined;

  const locations = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(
      process.env.LOCALAPPDATA || "",
      "Google\\Chrome\\Application\\chrome.exe",
    ),
    path.join(
      process.env.PROGRAMFILES || "",
      "Google\\Chrome\\Application\\chrome.exe",
    ),
    path.join(
      process.env["PROGRAMFILES(X86)"] || "",
      "Google\\Chrome\\Application\\chrome.exe",
    ),
  ];

  for (const p of locations) {
    if (p && fs.existsSync(p)) return p;
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// MAIN ROUTE — PDF RENDERING
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Accept both old and new camelCase/PascalCase formats
    const clauses = body.ContractClauses || body.clauses;
    const contractTitle = body.ContractTitle || body.contractTitle;
    const approvalHistory =
      body.approvalHistory || body.ApprovalHistory || null;

    // Signature settings (normalized)
    const signatureSettings = body.signatureSettings || {
      needsSignature: body.NeedsSignature || body.needsSignature || false,
      signerCompanyName: body.signerCompanyName || "",
      signerPerson: body.signerPerson || "",
      signerOrganizationPosition: body.signerOrganizationPosition || "",
      signaturePlacement: body.signaturePlacement || "endOfContract",
    };

    if (!Array.isArray(clauses)) {
      return NextResponse.json(
        { error: "Body must contain 'ContractClauses' or 'clauses' array." },
        { status: 400 },
      );
    }

    // Normalize Persian digits & RTL content
    const clausesFa = mapContentFa(clauses);
    const contractTitleFa = toFaDigits(contractTitle || "متن قرارداد");

    // Format date for PDF (Persian date format)
    const formatDateForPdf = (
      dateString: string | null | undefined,
    ): string => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        const parts = new Intl.DateTimeFormat("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).formatToParts(date);
        const year = parts.find((p) => p.type === "year")?.value ?? "";
        const month = parts.find((p) => p.type === "month")?.value ?? "";
        const day = parts.find((p) => p.type === "day")?.value ?? "";
        return toFaDigits(`${day} / ${month} / ${year}`);
      } catch {
        return "";
      }
    };

    // Process approval history if provided
    const approvalHistoryProcessed =
      approvalHistory && Array.isArray(approvalHistory)
        ? approvalHistory.map((item: any) => {
            // Map EntityTypeId to EntityTypeName: 1 = ماده (Clause), 2 = بند (Term)
            const entityTypeName =
              item.EntityTypeId === 1
                ? "ماده"
                : item.EntityTypeId === 2
                  ? "بند"
                  : "";

            return {
              FullName: toFaDigits(item.FullName || ""),
              JobTitle: toFaDigits(item.JobTitle || ""),
              Message: toFaDigits(item.Message || ""),
              Comment: toFaDigits(item.Comment || ""),
              CreatedDate: formatDateForPdf(item.CreatedDate),
              ModifiedDate: formatDateForPdf(item.ModifiedDate),
              Title: toFaDigits(item.Title || ""),
              EntityTypeId: item.EntityTypeId,
              EntityTypeName: entityTypeName,
            };
          })
        : null;

    // -----------------------------------------------------------------------
    // EJS template (embedded)
    // -----------------------------------------------------------------------
    const template = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    /* stylelint-disable */
    <% if (fontUrl) { %>
    @font-face {
      font-family: 'B Zar';
      src: url('<%= fontUrl %>') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    <% } else { %>
    /* Font file not found, using fallback */
    <% } %>
    /* stylelint-enable */

    /* Printer settings */
    @page {
      size: A4;                      /* 210 x 297 mm */
      margin: 20mm 20mm 25mm 20mm;   /* Top, Right, Bottom, Left */
    }

    * {
      font-family: 'B Zar', 'BZar', sans-serif;
    }

    html, body {
      font-family: 'B Zar', 'BZar', sans-serif;
      font-size: 12px;
      line-height: 1.8;
      color: #000;
      background: #fff;
      direction: rtl;
      unicode-bidi: plaintext;
      text-align: justify;
      margin: 0;
      padding: 0;
      <% if (needsSignature) { %>padding-bottom: 20mm;<% } %> /* Extra space to prevent content overlap with footer signatures */
    }

    .title {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      margin: 0 0 15mm 0;
    }

    .clause {
      margin-bottom: 8mm;
      /* Allow long clauses to continue on next page instead of reserving space */
      page-break-inside: auto;
      break-inside: auto;
    }

    .clause-header {
      font-size: 12px;
      font-weight: bold;
      padding-bottom: 3mm;
      margin-bottom: 6mm;
    }

    .term { margin-bottom: 8mm; }
    .term-title { 
      font-size: 12px;
      /* font-weight: 300; */
      margin-bottom: 2mm; 
    }

    /* Approval History Page Styles */
    .approval-history-page {
      page-break-after: always;
      padding: 10mm 0;
    }

    .approval-history-title {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10mm;
    }

    .approval-history-item {
      margin-bottom: 8mm;
      padding: 4mm;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }

    .approval-history-header {
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 3mm;
      color: #333;
    }

    .approval-history-job-title {
      font-size: 11px;
      color: #666;
      margin-bottom: 3mm;
    }

    .approval-history-entity {
      font-size: 12px;
      font-weight: bold;
      color: #333;
      margin-bottom: 2mm;
      padding: 2mm;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 2px;
    }

    .approval-history-content {
      font-size: 11px;
      margin-bottom: 2mm;
      padding: 2mm;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 2px;
    }

    .approval-history-label {
      font-weight: bold;
      margin-bottom: 1mm;
      font-size: 11px;
    }

    .approval-history-date {
      font-size: 10px;
      color: #888;
      margin-top: 2mm;
    }

    .desc {
      font-size: 12px;
      font-family: 'B Zar', 'BZar', sans-serif !important;
      /* font-weight: 300; */
      white-space: pre-line;      /* preserve \\n\\n from JSON */
      word-break: break-word;
      text-align: justify;
    }

    .desc span[dir="ltr"],
    .desc span[dir="LTR"] {
      direction: ltr;
      unicode-bidi: embed;
      display: inline-block;
    }

    .desc table {
      white-space: normal;        /* override pre-line for tables */
    }

    .sub-clauses {
      margin-top: 4mm;
      padding-right: 6mm;         /* RTL indent */
      font-size: 11px;
      /* font-weight: 300; */
    }
    .sub-clauses .item { 
      margin: 3mm 0;
      /* font-weight: 300; */
    }
    .sub-clauses span[dir="ltr"],
    .sub-clauses span[dir="LTR"] {
      direction: ltr;
      unicode-bidi: embed;
      display: inline-block;
    }

    .signature-section {
      margin-top: 15mm;
      margin-bottom: 10mm;
      page-break-inside: avoid;
      page-break-after: auto;
      display: flex;
      justify-content: space-between;
      direction: rtl;
    }

    .signature-box {
      width: 45%;
      text-align: center;
      font-size: 11px;
      /* font-weight: 300; */
    }

    .signature-line {
      border-top: 1px solid #000;
      margin-top: 15mm;
      padding-top: 2mm;
      min-height: 20mm;
    }

    .signature-label {
      margin-top: 1mm;
    }

    /* Optional class for explicit LTR spans if needed later */
    .ltr { direction: ltr; unicode-bidi: embed; text-align: left; }

    /* Table styles */
    table {
      border-collapse: collapse;
      width: 100%;
      max-width: 100%;
      margin: 4mm 0;
      direction: rtl;
      font-size: 12px;
      table-layout: auto;
    }

    table.MsoTableGrid {
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      max-width: 100%;
      margin: 4mm 0;
      direction: rtl;
      table-layout: auto;
    }

    table td,
    table th {
      border: 1px solid #000;
      padding: 4px 8px;
      text-align: right;
      vertical-align: top;
      direction: rtl;
      min-width: 0;
    }

    /* Override inline width attributes to prevent overflow */
    table td[width],
    table th[width] {
      width: auto !important;
      max-width: 100%;
    }

    table td p,
    table th p {
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.6;
    }

    table td p.MsoNormal {
      margin: 0;
      padding: 0;
    }

    table td span[dir="LTR"],
    table td span[dir="ltr"] {
      direction: ltr;
      unicode-bidi: embed;
      display: inline-block;
    }

    table tbody tr {
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <% if (approvalHistory && approvalHistory.length > 0) { %>
    <div class="approval-history-page">
      <div class="approval-history-title">تاریخچه تایید قرارداد</div>
      <% approvalHistory.forEach((item, index) => { %>
        <div class="approval-history-item">
          <div class="approval-history-header"><%= item.FullName %></div>
          <% if (item.JobTitle) { %>
            <div class="approval-history-job-title"><%= item.JobTitle %></div>
          <% } %>
          <% if (item.EntityTypeName && item.Title) { %>
            <div>
              <%= item.EntityTypeName %> <%= item.Title %>
            </div>
          <% } %>
          <% if (item.CreatedDate) { %>
            <div class="approval-history-date">
              <%= item.CreatedDate %>
            </div>
          <% } %>
        </div>
      <% }) %>
    </div>
  <% } %>

  <div class="title"><%= contractTitle %></div>

  <% clauses.forEach((clause, clauseIndex) => { %>
    <section class="clause">
      <div class="clause-header">ماده <%= clauseIndex + 1 %> - <%= clause.ClauseName %></div>
      <% if (clause.ClauseDescription && clause.ClauseDescription.trim()) { %>
        <div class="desc" style="margin-bottom: 2mm;"><%- clause.ClauseDescription %></div>
      <% } %>

      <% (clause.Terms || []).forEach((term, termIndex) => { %>
        <div class="term">
          <div class="term-title">بند - <%= term.Title %></div>
          <!-- description already digit-converted server-side -->
          <div class="desc"><%- (term.FinalDescription || term.InitialDescription) %></div>

          <% if (term.SubClauses && term.SubClauses.length) { %>
            <div class="sub-clauses">
              <% term.SubClauses.forEach(sc => { %>
                <div class="item">
                  <strong>تبصره <%= sc.Title %>:</strong>
                  <span><%- sc.Description %></span>
                </div>
              <% }) %>
            </div>
          <% } %>
        </div>
      <% }) %>
    </section>
  <% }) %>

  <% if (needsSignature && signatureSettings && signatureSettings.signaturePlacement === 'endOfContract') { %>
    <% 
      // Hardcoded first party signature information
      var firstPartyText = 'تجارت الکترونیک پارسیان(سهامی عام)<br/>رضا ساکیانی<br/>مدیرعامل<br/><br/>علی جلالی فر<br/>معاون مالی و پشتیبانی';
      
      // Build second party signature from user input
      var signerCompanyName = (signatureSettings.signerCompanyName || '').trim();
      var signerPerson = (signatureSettings.signerPerson || '').trim();
      var signerOrganizationPosition = (signatureSettings.signerOrganizationPosition || '').trim();
      var secondPartyText = '';
      
      if (signerCompanyName && signerPerson) {
        // Replace newlines with <br/> for proper HTML rendering
        var personWithBreaks = signerPerson.replace(/\\n/g, '<br/>');
        secondPartyText = signerCompanyName + '<br/>' + personWithBreaks;
        if (signerOrganizationPosition) {
          secondPartyText += '<br/>' + signerOrganizationPosition;
        }
      } else if (signerCompanyName) {
        secondPartyText = signerCompanyName;
        if (signerOrganizationPosition) {
          secondPartyText += '<br/>' + signerOrganizationPosition;
        }
      } else if (signerPerson) {
        secondPartyText = signerPerson.replace(/\\n/g, '<br/>');
        if (signerOrganizationPosition) {
          secondPartyText += '<br/>' + signerOrganizationPosition;
        }
      } else if (signerOrganizationPosition) {
        secondPartyText = signerOrganizationPosition;
      } else {
        secondPartyText = 'امضاء طرف دوم';
      }
    %>
    <div class="signature-section" style="margin-top: 20mm; page-break-inside: avoid;">
      <div class="signature-box">
        <div class="signature-line">
          <div class="signature-label"><%- firstPartyText %></div>
        </div>
      </div>
      <div class="signature-box">
        <div class="signature-line">
          <div class="signature-label"><%- secondPartyText %></div>
        </div>
      </div>
    </div>
  <% } %>
</body>
</html>
`;

    // Optional Persian font - embed as base64 for reliable loading in Puppeteer
    const publicDir = path.join(process.cwd(), "public");
    const bZarPath = path.join(publicDir, "fonts", "B-Zar.ttf");
    let fontDataUri: string | null = null;

    if (fs.existsSync(bZarPath)) {
      try {
        const fontBuffer = fs.readFileSync(bZarPath);
        const fontBase64 = fontBuffer.toString("base64");
        // Use standard TTF MIME type for better browser/Puppeteer compatibility
        fontDataUri = `data:font/ttf;base64,${fontBase64}`;
      } catch (error) {
        console.warn("Failed to read font file:", error);
      }
    }

    const html = ejs.render(template, {
      clauses: clausesFa,
      contractTitle: contractTitleFa,
      fontUrl: fontDataUri,
      signatureSettings,
      needsSignature: signatureSettings.needsSignature,
      approvalHistory: approvalHistoryProcessed,
    });

    // -----------------------------------------------------------------------
    // Launch Puppeteer in Docker-safe mode
    // -----------------------------------------------------------------------

    // 1) Prefer runtime Chromium path for Docker/Alpine
    // 2) Otherwise Windows Chrome
    // 3) Otherwise use Puppeteer bundled Chrome
    let executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH || findWindowsChrome() || undefined;

    // Verify executable exists if path is provided
    if (executablePath && !fs.existsSync(executablePath)) {
      console.warn(
        `Executable path not found: ${executablePath}, trying alternatives...`,
      );
      executablePath = undefined;
    }

    // Try common Alpine Linux Chromium paths if not set
    if (!executablePath && process.platform === "linux") {
      const linuxPaths = [
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
      ];
      for (const p of linuxPaths) {
        if (fs.existsSync(p)) {
          executablePath = p;
          break;
        }
      }
    }

    console.log(
      "Using Chromium executable:",
      executablePath || "Puppeteer bundled",
    );

    let browser;
    let page;

    try {
      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        dumpio: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--no-zygote",
        ],
        timeout: 60000,
      });

      page = await browser.newPage();

      // Set a reasonable timeout for page operations
      page.setDefaultTimeout(30000); // 30 seconds
      page.setDefaultNavigationTimeout(30000);

      // Use 'load' instead of 'networkidle0' to avoid hanging on font loading
      await page.setContent(html, {
        waitUntil: "load",
        timeout: 30000,
      });

      // Wait a bit for fonts to load if needed
      await page.evaluateHandle(() => document.fonts.ready);

      // -----------------------------------------------------------------------
      // Signature footer (shown only when signaturePlacement=endOfEachPage)
      // -----------------------------------------------------------------------
      const showSignatureInFooter =
        signatureSettings.needsSignature &&
        signatureSettings.signaturePlacement === "endOfEachPage";

      const buildPageFooter = () => {
        if (!showSignatureInFooter) return "";

        const firstPartyText =
          "تجارت الکترونیک پارسیان(سهامی عام)<br/>رضا ساکیانی<br/>مدیرعامل<br/><br/>علی جلالی فر<br/>معاون مالی و پشتیبانی";

        const {
          signerCompanyName = "",
          signerPerson = "",
          signerOrganizationPosition = "",
        } = signatureSettings;

        let second = "";

        if (signerCompanyName || signerPerson || signerOrganizationPosition) {
          const sanitizedPerson = signerPerson.replace(/\n/g, "<br/>");
          second = [
            signerCompanyName,
            sanitizedPerson,
            signerOrganizationPosition,
          ]
            .filter(Boolean)
            .join("<br/>");
        } else {
          second = "امضاء طرف دوم";
        }

        return `
          <div style="font-family:'B Zar','BZar',sans-serif; font-size:11px; width:100%; direction:rtl; margin-bottom:3mm;">
            <div style="display:flex; justify-content:space-between;">
              <div style="width:45%; text-align:center;">
                <div style="border-top:1px solid #000; padding-top:2mm; min-height:15mm;"></div>
                <div>${firstPartyText}</div>
              </div>
              <div style="width:45%; text-align:center;">
                <div style="border-top:1px solid #000; padding-top:2mm; min-height:15mm;"></div>
                <div>${second}</div>
              </div>
            </div>
          </div>
        `;
      };

      const footerTemplate = `
        <div style="font-family:'B Zar','BZar',sans-serif; font-size:10px; width:100%; text-align:center; direction:rtl;">
          ${buildPageFooter()}
        </div>
      `;

      const bottomMargin = showSignatureInFooter ? "50mm" : "25mm";

      // -----------------------------------------------------------------------
      // Generate PDF
      // -----------------------------------------------------------------------
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: bottomMargin,
          left: "20mm",
        },
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate,
        timeout: 30000, // 30 second timeout for PDF generation
      });

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="contract.pdf"',
        },
      });
    } finally {
      // Always close browser, even if there's an error
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error("Error closing browser:", closeError);
        }
      }
    }
  } catch (error: any) {
    console.error("PDF rendering error:", error);
    return NextResponse.json(
      {
        error: "Failed to render PDF",
        details: error.message || String(error),
      },
      { status: 500 },
    );
  }
}
