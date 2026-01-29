"use client";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import Title from "../components/Title";
import CustomButton from "@/ui/Button";
import { Add } from "iconsax-reactjs";
import ContractorsTable from "../components/ContractorsTable";
import { useEffect, useState } from "react";
import { useDisclosure } from "@heroui/react";
import AddContractorModal from "../components/AddContractorModal";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import { useGetInvoiceCategoriesQuery } from "../api/contractorApi";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  // { Name: "تدارکات", Href: "/logistics" },
  { Name: "لیست پیمانکاران", Href: "/logistics/contractors" },
];

export default function ContractorsIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);
  const { data: categories, isLoading: isGetting } =
    useGetInvoiceCategoriesQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const handleAdd = () => {
    setEditId(null);
    onOpen();
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    onOpen();
  };

  const buttons = [
    <CustomButton
      key="add-contractor"
      buttonSize="md"
      startContent={<Add />}
      onPress={handleAdd}
    >
      افزودن پیمانکار
    </CustomButton>,
  ];

  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
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
      <AddContractorModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        editId={editId}
        categories={categories}
      />
    </>
  );
}
