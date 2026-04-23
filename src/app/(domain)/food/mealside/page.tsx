"use client";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import MealsideForm from "@/components/food/mealside/MealsideForm";
import MealSideList from "@/components/food/mealside/MealSideList";

import ContainerTop from "@/ui/ContainerTop";
import { Button, useDisclosure } from "@/ui/NextUi";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "لیست کنار غذا", Href: "/food/mealside" },
];

export default function Page() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const handleAdd = () => {
    setEditId(null);
    onOpen();
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    onOpen();
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["mealsideList"] });
  };

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <ContainerTop>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-bold text-2xl text-logo-1">لیست کنار غذا</h1>
          <Button
            color="primary"
            size="lg"
            startContent={<IoIosAddCircleOutline size={26} />}
            onPress={handleAdd}
          >
            اضافه کردن کنار غذا
          </Button>
        </div>
        <MealsideForm
          isOpen={isOpen}
          mealsideId={editId}
          onOpenChange={onClose}
          onSuccess={handleSuccess}
        />
        <MealSideList onEdit={handleEdit} />
      </ContainerTop>
    </>
  );
}
