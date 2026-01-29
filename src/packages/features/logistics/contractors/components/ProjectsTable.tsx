import TableTop from "@/components/TableTop";
import { calculateRowIndex } from "@/packages/features/task-inbox/utils/calculateRowIndex";
import { useDisclosure } from "@heroui/react";
import { Dispatch, SetStateAction, useState, useMemo, useEffect } from "react";
import {
  ProjectDetails,
  useDeleteProjectMutation,
  useGetContractorProjectsByContractorIdQuery,
} from "../api/contractorApi";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { Icon } from "@/ui/Icon";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import { ContractStatus } from "../constants/ContractStatus";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { useSearchParams } from "next/navigation";
import { Add, Eye } from "iconsax-reactjs";
import InvoicesModal from "./InvoicesModal";
import AddInvoiceModal from "./AddInvoiceModal";

export default function ProjectsTable({
  searchTerm,
  onOpen: onOpenEditProject,
  setEditId,
  contractorName,
}: {
  searchTerm: string;
  onOpen: () => void;
  setEditId: Dispatch<SetStateAction<number | null>>;
  contractorName: string | undefined;
}) {
  const searchParams = useSearchParams();
  const contractorId = searchParams.get("contractorId");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedProjectIdForInvoice, setSelectedProjectIdForInvoice] = useState<number | null>(null);
  
  const {
    isOpen: isInvoicesModalOpen,
    onOpen: onInvoicesModalOpen,
    onClose: onInvoicesModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddInvoiceModalOpen,
    onOpen: onAddInvoiceModalOpen,
    onClose: onAddInvoiceModalClose,
  } = useDisclosure();
  
  // When searching, fetch all projects with a large page size to enable proper filtering
  const effectivePageSize = searchTerm?.trim() ? 10000 : pageSize;
  
  const { data: contractorProjects, isLoading: isGetting } =
    useGetContractorProjectsByContractorIdQuery(
      {
        id: Number(contractorId),
        queryParams: {
          PageNumber: searchTerm?.trim() ? 1 : currentPage,
          PageSize: effectivePageSize,
        },
      },
      { refetchOnMountOrArgChange: true }
    );

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm?.trim()) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Filter projects by project name
  const filteredProjects = useMemo(() => {
    if (!contractorProjects?.Data?.Items) return [];
    if (!searchTerm?.trim()) return contractorProjects.Data.Items;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return contractorProjects.Data.Items.filter((project) =>
      project.Name?.toLowerCase().includes(searchLower)
    );
  }, [contractorProjects?.Data?.Items, searchTerm]);

  // Paginate filtered results
  const paginatedProjects = useMemo(() => {
    if (!searchTerm?.trim()) {
      return filteredProjects;
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage, pageSize, searchTerm]);
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onDeleteOpen();
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    onOpenEditProject();
  };

  const handleAddInvoice = (id: number) => {
    setSelectedProjectIdForInvoice(id);
    onAddInvoiceModalOpen();
  };

  const handleAddInvoiceModalClose = () => {
    onAddInvoiceModalClose();
    setSelectedProjectIdForInvoice(null);
  };

  const handleViewInvoices = (id: number) => {
    setSelectedProjectId(id);
    onInvoicesModalOpen();
  };

  const handleInvoicesModalClose = () => {
    onInvoicesModalClose();
    setSelectedProjectId(null);
  };

  const confirmDelete = async (selectedId: number) => {
    deleteProject(selectedId).then(() => {
      onDeleteClose();
    });
  };

  const headers = [
    {
      key: "index",
      title: "شماره",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(currentPage, pageSize, index);
      },
    },
    {
      key: "Name",
      title: <div className="flex items-center gap-1">نام پروژه</div>,
    },
    {
      key: "BeneficiaryName",
      title: "ذینفع",
      render: (_: any, row: ProjectDetails) => {
        return row.BeneficiaryName;
      },
    },
    {
      key: "ContractNumber",
      title: "شماره قرارداد",
      render: (_: any, row: ProjectDetails) => {
        return row.ContractNumber;
      },
    },
    {
      key: "ContractStartDate",
      title: "تاریخ شروع قرارداد",
      render: (_: any, row: ProjectDetails) => {
        return toLocalDateShort(row.ContractStartDate ?? "");
      },
    },
    {
      key: "ContractEndDate",
      title: "تاریخ پایان قرارداد",
      render: (_: any, row: ProjectDetails) => {
        return toLocalDateShort(row.ContractEndDate ?? "");
      },
    },
    {
      key: "ContractStatus",
      title: "وضعیت",
      render: (_: any, row: ProjectDetails) => {
        const statusLabel = ContractStatus.find(
          (c) => c.value === row.ContractStatus
        );
        return statusLabel?.label;
      },
    },
    {
      key: "ContractAmount",
      title: "مبلغ قرارداد",
      render: (_: any, row: ProjectDetails) => {
        return formatNumberWithCommas(row.ContractAmount ?? 0);
      },
    },
    {
      key: "IBAN",
      title: "شماره شبا",
      render: (_: any, row: ProjectDetails) => {
        return row.IBAN;
      },
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: ProjectDetails) => {
        const items = [
          {
            key: "add",
            label: "افزودن صورتحساب",
            icon: <Add className="size-[20px]" />,
            onClick: () => handleAddInvoice(row.ProjectId),
          },
          {
            key: "view",
            label: "لیست صورتحساب ها",
            icon: <Eye className="size-[20px]" />,
            onClick: () => handleViewInvoices(row.ProjectId),
          },
          {
            key: "edit",
            label: "ویرایش",
            icon: <Icon name="edit" className="size-[20px]" />,
            onClick: () => handleEdit(row.ProjectId),
          },
          {
            key: "delete",
            label: "حذف",
            color: "#e53935",
            icon: <Icon name="trash" className="size-[20px]" />,
            onClick: () => handleDelete(row.ProjectId),
          },
        ].filter(Boolean);
        return <OperationDropdown items={items as DropdownAction[]} />;
      },
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <h2 className="font-semibold text-[20px]/[28px] text-secondary-950">
          پروژه‌های {contractorName}
        </h2>
        <TableTop
          headers={headers}
          isLoading={false}
          rows={paginatedProjects}
          totalPages={Math.ceil(filteredProjects.length / pageSize) || 1}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalCount={filteredProjects.length}
          onPageSizeChange={handlePageSizeChange}
          onPaginationStickToTable={true}
        />
      </div>
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={isDeleting}
          itemId={selectedId}
        />
      )}
      <InvoicesModal
        isOpen={isInvoicesModalOpen}
        onOpenChange={handleInvoicesModalClose}
        projectId={selectedProjectId}
      />
      {selectedProjectIdForInvoice !== null && (
        <AddInvoiceModal
          isOpen={isAddInvoiceModalOpen}
          onOpenChange={handleAddInvoiceModalClose}
          projectId={selectedProjectIdForInvoice}
        />
      )}
    </>
  );
}
