"use client";
import Title from "../Title";
import ContractorsTable from "../ContractorsTable";
import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import AddContractorModal from "./AddContractorModal";
import { useGetInvoiceCategoriesQuery } from "../../contractor.services";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import { AppButton } from "@/components/common/AppButton";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "لیست پیمانکاران", Href: "/logistics/contractors" },
];

export default function ContractorListPageComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);
  const { data: categories } = useGetInvoiceCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleAdd = () => {
    setEditId(null);
    onOpen();
  };

  const handleEdit = (id: number) => {
    console.log({ id });
    onOpen();
    setEditId(id);
  };

  const buttons = [
    <AppButton
      iconPos="left"
      icon="Add"
      key={1}
      label="افزودن پیمانکار"
      onClick={handleAdd}
    />,
  ];

  return (
    <div className="container mx-auto ">
      <AppBreadcrumb items={breadcrumbs} />
      <Title
        title="لیست پیمانکاران"
        buttons={buttons}
        haveSearch={true}
        setSearchTerm={setSearchTerm}
      />
      <ContractorsTable
        searchTerm={searchTerm}
        handleEdit={handleEdit}
        categories={categories}
      />
      {isOpen && (
        <AddContractorModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          editId={editId}
          categories={categories}
        />
      )}
    </div>
  );
}
