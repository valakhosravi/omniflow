import { ProcessedMealOrder } from "@/components/food/plan/PlanList";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportMealOrderToExcel = async (
  _data: ProcessedMealOrder[],
  fileName: string
) => {
  if (!_data || _data.length === 0) return;

  const workbook = new ExcelJS.Workbook();

  _data.forEach((supplierWithRows) => {
    const data = supplierWithRows.rows;
    const supplierName = supplierWithRows.supplierName;
    const worksheet = workbook.addWorksheet(supplierName);

    // Add headers and data
    if (data.length > 0) {
      const headers = Object.keys(data[0]);

      // Add "جمع کل" (Total) to headers
      worksheet.columns = headers
        .map((header) => ({
          header,
          key: header,
          width: 15,
        }))
        .concat([{ header: "جمع کل", key: "total", width: 15 }]);

      // Add rows with calculated totals
      data.forEach((row) => {
        // Calculate total for numeric columns (excluding تاریخ, روز هفته, and غذا)
        const total = Object.entries(row).reduce((sum, [key, value]) => {
          const isIgnored =
            key === "تاریخ" ||
            key === "روز هفته" ||
            key === "غذا" ||
            key.startsWith("ساختمان (");

          if (!isIgnored && typeof value === "number") {
            return sum + (value || 0);
          }
          return sum;
        }, 0);

        worksheet.addRow({ ...row, total });
      });

      // Handle merges for تاریخ and روز هفته
      let startRow = 2; // Row 1 = header
      while (startRow <= data.length + 1) {
        const dateValue = data[startRow - 2]["تاریخ"];

        // Skip if date is empty or already part of merged group
        if (!dateValue) {
          startRow++;
          continue;
        }

        // Find end of the same date group
        let endRow = startRow + 1;
        while (endRow <= data.length + 1 && data[endRow - 2]["تاریخ"] === "") {
          endRow++;
        }

        // Merge cells for this group
        if (endRow > startRow + 1) {
          worksheet.mergeCells(`A${startRow}:A${endRow - 1}`);
          worksheet.mergeCells(`B${startRow}:B${endRow - 1}`);
        }

        // Move to the next group
        startRow = endRow;
      }
    }
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
