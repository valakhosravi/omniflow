"use client";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import Title from "../components/Title";
import { useState } from "react";
import CustomButton from "@/ui/Button";
import { Add } from "iconsax-reactjs";
import AddContractorProjectModal from "../components/AddContractorProjectModal";
import { useDisclosure } from "@heroui/react";
import ContractorProjectsPage from "../components/ContractorProjectsPage";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  // { Name: "تدارکات", Href: "/logistics" },
  { Name: "لیست پیمانکاران", Href: "/logistics/contractors" },
  { Name: "لیست پروژه ها", Href: "/logistics/contractors/projects" },
];

export default function ContractorProjectsIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);

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
      افزودن پروژه
    </CustomButton>,
  ];
  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <Title
        title="لیست پروژه ها"
        buttons={buttons}
        haveSearch={true}
        setSearchTerm={setSearchTerm}
      />
      <ContractorProjectsPage
        searchTerm={searchTerm}
        onOpen={onOpen}
        setEditId={setEditId}
      />
      <AddContractorProjectModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        editId={editId}
      />
    </>
  );
}
