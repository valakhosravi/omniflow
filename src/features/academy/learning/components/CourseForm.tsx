"use client";

import { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { transformToOptions } from "@/ui/RHFSelect";
import useCourseFormValidation, {
  CourseFormValues,
} from "../hooks/useCourseFormValidation";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
  useGetAllCategoriesQuery,
  useGetAllTeachersQuery,
} from "../learning.services";

interface CourseFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  courseId: number | null;
}

export default function CourseForm({
  isOpen,
  onOpenChange,
  courseId,
}: CourseFormProps) {
  const { data: courseData } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId,
  });
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: teachersData } = useGetAllTeachersQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useCourseFormValidation();

  useEffect(() => {
    if (courseId && courseData?.Data) {
      const d = courseData.Data;
      setValue("Title", d.Title ?? "");
      setValue("Description", d.Description ?? "");
      setValue("CategoryId", d.CategoryId);
      setValue("TeacherId", d.TeacherId);
      setValue("DurationHours", Math.ceil(d.DurationMinutes / 60));
      setValue("IsActive", d.IsActive);
    } else {
      reset();
    }
  }, [courseId, courseData, setValue, reset]);

  const onSubmit = async (data: CourseFormValues) => {
    if (courseId) {
      await updateCourse({
        id: courseId,
        body: {
          Title: data.Title,
          Description: data.Description,
          CategoryId: data.CategoryId,
          TeacherId: data.TeacherId,
          DurationHours: data.DurationHours,
          IsActive: data.IsActive,
        },
      });
    } else {
      await createCourse({
        Title: data.Title,
        Description: data.Description,
        CategoryId: data.CategoryId,
        TeacherId: data.TeacherId,
        DurationHours: data.DurationHours,
        IsActive: data.IsActive,
      });
    }
    reset();
    onOpenChange();
  };

  const handleModalChange = (open: boolean) => {
    if (!open && courseId === null) {
      reset();
    }
    onOpenChange();
  };

  const categoryOptions = transformToOptions(
    categoriesData?.Data ?? [],
    "Title",
    "CategoryId",
  );

  const teacherOptions = transformToOptions(
    teachersData?.Data ?? [],
    "FullName",
    "TeacherId",
  );

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      className="w-[746px] min-w-[746px]"
    >
      <ModalContent>
        <ModalHeader
          className="flex items-center justify-between font-semibold
          text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]"
        >
          <span className="text-secondary-950">
            {courseId ? "ویرایش دوره" : "اضافه کردن دوره"}
          </span>
          <span className="cursor-pointer" onClick={() => onOpenChange()}>
            <AppIcon name="CloseCircle" size={20} className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-[706px] mx-auto mb-[15px]" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px] px-[20px]"
        >
          <ModalBody className="p-0">
            <div className="space-y-4 mb-[32px]">
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="Title"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      label="عنوان دوره"
                      required
                      placeholder="عنوان دوره را وارد کنید"
                      error={errors.Title?.message}
                      className="w-full"
                      dir="rtl"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
                <Controller
                  name="DurationHours"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      label="مدت زمان (ساعت)"
                      placeholder="مدت زمان"
                      type="number"
                      error={errors.DurationHours?.message}
                      className="w-full"
                      dir="ltr"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="CategoryId"
                  control={control}
                  render={({ field }) => (
                    <AppSelect
                      label="دسته‌بندی"
                      required
                      placeholder="دسته‌بندی را انتخاب کنید"
                      options={categoryOptions}
                      error={errors.CategoryId?.message}
                      className="w-full"
                      searchable
                      name={field.name}
                      defaultValue={String(field.value || "")}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        field.onChange(Number(e.target.value))
                      }
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
                <Controller
                  name="TeacherId"
                  control={control}
                  render={({ field }) => (
                    <AppSelect
                      label="مدرس"
                      required
                      placeholder="مدرس را انتخاب کنید"
                      options={teacherOptions}
                      error={errors.TeacherId?.message}
                      className="w-full"
                      searchable
                      name={field.name}
                      defaultValue={String(field.value || "")}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        field.onChange(Number(e.target.value))
                      }
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </div>
              <Controller
                name="Description"
                control={control}
                render={({ field }) => (
                  <AppInput
                    label="توضیحات"
                    required
                    placeholder="توضیحات دوره را وارد کنید"
                    error={errors.Description?.message}
                    className="w-full"
                    dir="rtl"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <AppButton
              type="submit"
              color="primary"
              disabled={isCreating || isUpdating}
              loading={isCreating || isUpdating}
              label={courseId ? "ویرایش دوره" : "اضافه کردن دوره"}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
