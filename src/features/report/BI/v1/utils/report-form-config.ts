export const KPI_OPTIONS = [
  { id: "تعداد تراکنش موفق", name: "تعداد تراکنش موفق" },
  { id: "مبلغ تراکنش", name: "مبلغ تراکنش" },
  { id: "کارمزد نمایندگی", name: "کارمزد نمایندگی" },
  { id: "درصد رشد ماهانه", name: "درصد رشد ماهانه" },
];

/** Map numeric IDs from API (1-based) to KPI option ids */
export const KPI_ID_MAP: Record<string, string> = {
  "1": KPI_OPTIONS[0].id,
  "2": KPI_OPTIONS[1].id,
  "3": KPI_OPTIONS[2].id,
  "4": KPI_OPTIONS[3].id,
};
