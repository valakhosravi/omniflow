"use client";
import PaginationTop from "@/components/PaginationTop";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@/ui/NextUi";

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
  setIsHovered: React.Dispatch<React.SetStateAction<string | number | null>>;
  onRowClick?: (row: any) => void;
  name?: string;
  "data-cy": string;
}

export default function TableTaskInbox({
  headers,
  rows,
  isLoading = false,
  totalPages,
  currentPage,
  pageSize = 8,
  onPageSizeChange,
  onPageChange,
  totalCount,
  setIsHovered,
  onRowClick,
  name,
  "data-cy": dataCy,
}: DynamicTableProps) {
  const getRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  return (
    <div
      className={`flex flex-col justify-between ${
        name === "Task"
          ? "sm:h-[550px] lg:h-[615px]"
          : "sm:h-[600px] lg:h-[680px]"
      }`}
    >
      <div className="max-h-[500px] xl:max-h-[580px] overflow-hidden border border-secondary-100 rounded-[12px]">
        <Table
          data-cy={dataCy}
          aria-label="Table"
          color="primary"
          isHeaderSticky
          classNames={{
            td: "py-3 !rounded-none !before:rounded-none",
            th: "bg-day-title !rounded-none h-[44px]",
            thead: "h-auto sticky top-0 z-10",
            wrapper: "p-0 !shadow-none",
            base: `${name === "Task" ? "max-h-[600px]" : "max-h-[600px]"}`,
            // table: "min-h-[400px]",
          }}
          // shadow="none"
        >
          <TableHeader>
            {headers.map((col, colIndex) => (
              <TableColumn
                className="font-semibold text-[14px]/[20px] text-secondary-600"
                key={`${col.key}-header-${colIndex}`}
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
            {rows.map((row, index) => {
              return (
                <TableRow
                  onClick={() => onRowClick?.(row)}
                  key={row.RequestId || row.requestId || `row-${index}`}
                  className={`font-medium text-[14px]/[20px] transition-all hover:[box-shadow:-4px_4px_20px_0_rgba(0,0,0,0.12)] ${
                    !row.isRead && name === "Task"
                      ? "text-secondary-400 bg-header-table"
                      : "text-primary-950"
                  }
                  ${onRowClick ? "cursor-pointer" : ""}
                  `}
                  onMouseEnter={() => {
                    const id = row.RequestId ?? row.requestId;
                    setIsHovered(String(id));
                  }}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  {headers.map((col, colIndex) => {
                    const value =
                      col.key === "index" ? getRowIndex(index) : row[col.key];
                    return (
                      <TableCell
                        key={`${col.key}-${index}-${colIndex}`}
                        className={`${
                          col.key === "CreatedDate" && "!text-secondary-400"
                        }`}
                      >
                        {col.render ? col.render(value, row, index) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
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
    </div>
  );
}
