"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@/ui/NextUi";
import PaginationTop from "./PaginationTop";

interface DynamicColumn {
  key: string;
  title: string | React.ReactNode;
  render?: (value: any, row: any, index?: number) => React.ReactNode;
}

interface DynamicTableProps {
  headers: DynamicColumn[];
  rows: any[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalCount: number;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick?: (row: any) => void;
  onPaginationStickToTable?: boolean;
}

export default function TableTop({
  headers,
  rows,
  isLoading = false,
  totalPages,
  currentPage,
  pageSize = 8,
  onPageSizeChange,
  onPageChange,
  totalCount,
  onRowClick,
  onPaginationStickToTable,
}: DynamicTableProps) {
  const getRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  return (
    <>
      <div
        className={`${
          onPaginationStickToTable ? "" : "h-[550px]"
        } overflow-y-auto`}
      >
        <Table
          aria-label="Table"
          color="primary"
          isHeaderSticky
          classNames={{
            tr: `${
              onRowClick
                ? ""
                : "transition-all hover:bg-header-table even:bg-header-table"
            } !border-none`,
            td: "py-3 !rounded-none !before:rounded-none",
            th: "bg-day-title !rounded-none h-[44px]",
            thead: "h-auto",
            wrapper: "p-0",
            table: `${
              onRowClick
                ? "border-separate border-spacing-0 border border-secondary-100 rounded-[12px]"
                : "border-separate border-spacing-0 border border-secondary-100 rounded-[12px]"
            }`,
          }}
          shadow="none"
          isStriped={!onRowClick}
        >
          <TableHeader>
            {headers.map((col) => (
              <TableColumn
                className="font-semibold text-[14px]/[20px] text-secondary-600"
                key={col.key}
              >
                {col.title}
              </TableColumn>
            ))}
          </TableHeader>

          <TableBody
            isLoading={isLoading}
            loadingContent={
              <Spinner
                label="درحال بارگزاری..."
                classNames={{
                  wrapper: "scale-[1]",
                  circle1: "border-2 border-t-primary-950 border-b-primary-950",
                  circle2: "border-2 border-primary-950",
                }}
              />
            }
            emptyContent={"موردی برای نمایش وجود ندارد."}
          >
            {rows.map((row, index) => (
              <TableRow
                key={row.id ?? index}
                className={`font-medium text-[14px]/[20px] transition-all
                ${
                  onRowClick
                    ? "cursor-pointer hover:[box-shadow:-4px_4px_20px_0_rgba(0,0,0,0.12)]"
                    : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {headers.map((col) => {
                  const value =
                    col.key === "index" ? getRowIndex(index) : row[col.key];
                  const isNameCol = col.key === "Name";
                  return (
                    <TableCell
                      key={col.key}
                      className={`${
                        isNameCol ? "text-secondary-950" : "text-secondary-500"
                      }`}
                    >
                      {col.render ? col.render(value, row, index) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationTop
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
