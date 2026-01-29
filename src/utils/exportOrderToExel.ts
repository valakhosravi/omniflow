import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import { OrderModel } from "@/models/food/report/OrderByPlanId";
import { toLocalDateShortExel } from "./dateFormatter";

const sanitizeSheetName = (name: string) => {
  return name.replace(/[:\\\/\?\*\[\]]/g, "_").slice(0, 31);
};

export const exportOrderToExcel = async (
  data: { [key: string]: OrderModel[] },
  fileName: string
) => {
  const workbook = new ExcelJS.Workbook();

  if (data) {
    Object.keys(data).forEach((selfName) => {
      const sheetData = data[selfName];

      if (!Array.isArray(sheetData) || sheetData.length === 0) {
        return; // skip invalid or empty sheets
      }

      const sortedData = [...sheetData].sort(
        (a, b) =>
          new Date(a.MealDate).getTime() - new Date(b.MealDate).getTime()
      );

      const worksheet = workbook.addWorksheet(sanitizeSheetName(selfName));
      
      // Add headers
      worksheet.columns = [
        { header: 'کد پرسنلی', key: 'personnelId', width: 15 },
        { header: 'شماره موبایل', key: 'mobile', width: 15 },
        { header: 'نام و نام خانوادگی', key: 'fullName', width: 25 },
        { header: 'تاریخ', key: 'date', width: 12 },
        { header: 'نوع غذا', key: 'mealType', width: 30 },
        { header: 'تعداد', key: 'count', width: 10 }
      ];

      // Add data rows
      sortedData.forEach((item: OrderModel) => {
        worksheet.addRow({
          personnelId: item.PersonnelId,
          mobile: item.Mobile,
          fullName: item.FullName,
          date: toLocalDateShortExel(item.MealDate),
          mealType: `${item.MealName}-${item.SupplierName}`,
          count: item.OrderCount
        });
      });
    });
  }

  if (workbook.worksheets.length === 0) return;

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });
  saveAs(blob, `${fileName}.xlsx`);
};
