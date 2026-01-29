export const calculateRowIndex = (
  currentPage: number,
  pageSize: number,
  index: number
) => {
  return (currentPage - 1) * pageSize + index + 1;
};
