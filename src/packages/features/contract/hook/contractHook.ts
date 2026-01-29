import {
  useFullSaveMutation,
  useGetAllSubCategoriesQuery,
  useGetContractCategoriesQuery,
  useGetContractFieldValuesByContractIdQuery,
  useGetSubCategoriesByCategoryIdQuery,
  useGetSubCategoryFieldsBySubCategoryIdQuery,
  useGetTermLibrariesByCategotyIdQuery,
  useSaveContractFieldValuesMutation,
  useSaveContractRequestMutation,
  useSaveTermAssigneeMutation,
  useUpdateTermSortMutation,
  useUpdateClauseSortMutation,
  useSaveSubCategoryTemplateMutation,
  useSaveSubCategoryPersonalTemplateMutation,
  useUpdateSubCategoryTemplateMutation,
  useUpdateSubCategoryPersonalTemplateMutation,
  useDeleteSubCategoryTemplateMutation,
  useGetSubCategoryTemplateQuery,
} from "../api/contractApi";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { SaveSubCategoryTemplateRequest, SubCategory } from "../types/contractModel";
import { addToaster } from "@/ui/Toaster";

export const useContractCategories = () => {
  const { data, error, isLoading, isSuccess, refetch } =
    useGetContractCategoriesQuery();

  return {
    categories: data?.Data || [],
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export const useSubCategories = (categoryId: number | null) => {
  const skip = !categoryId;
  const { data, error, isLoading, isSuccess, refetch } =
    useGetSubCategoriesByCategoryIdQuery(categoryId as number, { skip, refetchOnMountOrArgChange: true });

  // Map the API response to include required fields with defaults
  const subCategories: SubCategory[] = (data?.Data || []).map((item: any) => ({
    ...item,
    IsType: item.IsType !== undefined ? item.IsType : true, // Default to true if not provided
    FilePath: item.FilePath || "", // Default to empty string if not provided
  }));

  return {
    subCategories,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export const useAllSubCategories = () => {
  const { data, error, isLoading, isSuccess, refetch } =
    useGetAllSubCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });
  // Map the API response to include required fields with defaults
  const allSubCategories: SubCategory[] = (data?.Data || []).map((item: any) => ({
    ...item,
    IsType: item.IsType !== undefined ? item.IsType : true, // Default to true if not provided
    FilePath: item.FilePath || "", // Default to empty string if not provided
  }));

  return {
    allSubCategories,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export const useSubCategoryFields = (subCategoryId: number) => {
  const skip = !subCategoryId;
  const { data, error, isLoading, isSuccess, refetch } =
    useGetSubCategoryFieldsBySubCategoryIdQuery(subCategoryId!, { skip });

  return {
    fields: data?.Data || [],
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export const useContractFieldValues = (contractId: number | null) => {
  const skip = !contractId;
  const { data, error, isLoading, isSuccess, refetch } =
    useGetContractFieldValuesByContractIdQuery(contractId as number, { skip });

  return {
    contractFieldValues: data?.Data ?? null,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export const useSaveContractFieldValues = () => {
  const [saveContractFieldValues, { data, error, isLoading, isSuccess }] =
    useSaveContractFieldValuesMutation();

  return {
    saveContractFieldValues,
    response: data,
    error,
    isLoading,
    isSuccess,
  };
};

export const useSaveContractRequest = () => {
  const [saveContractRequest, { data, error, isLoading, isSuccess }] =
    useSaveContractRequestMutation();

  return {
    saveContractRequest,
    response: data,
    error,
    isLoading,
    isSuccess,
  };
};

export const useGetTermLibraryByCategoryId = (categoryId: number) => {
  const skip = !categoryId;
  const { data, error, isLoading, isSuccess, refetch } =
    useGetTermLibrariesByCategotyIdQuery(categoryId!, { skip });

  return {
    termLibraries: data?.Data || [],
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export const useFullSaveContractRequest = () => {
  const [fullSaveContractRequest, { data, error, isLoading, isSuccess }] =
    useFullSaveMutation();

  return {
    fullSaveContractRequest,
    response: data,
    error,
    isLoading,
    isSuccess,
  };
};

export const useUpdateTermSort = () => {
  const [updateTermSort, { data, error, isLoading, isSuccess }] =
    useUpdateTermSortMutation();

  return {
    updateTermSort,
    response: data,
    error,
    isLoading,
    isSuccess,
  };
};

export const useUpdateClauseSort = () => {
  const [updateClauseSort, { data, error, isLoading, isSuccess }] =
    useUpdateClauseSortMutation();

  return {
    updateClauseSort,
    response: data,
    error,
    isLoading,
    isSuccess,
  };
};

export const useSaveSubCategoryTemplate = () => {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(6046);
  const hasPersonalService = userDetail?.ServiceIds.includes(6047);
  const [saveSubCategoryTemplate, { data: regularData, error: regularError, isLoading: regularIsLoading, isSuccess: regularIsSuccess }] =
    useSaveSubCategoryTemplateMutation();
  const [saveSubCategoryPersonalTemplate, { data: personalData, error: personalError, isLoading: personalIsLoading, isSuccess: personalIsSuccess }] =
    useSaveSubCategoryPersonalTemplateMutation();

  const saveSubCategoryTemplateWithGuard = async (
    request: SaveSubCategoryTemplateRequest
  ) => {
    // If user has service ID 6047, use personal template endpoint and always set IsPersonal to true
    if (hasPersonalService) {
      const personalRequest: SaveSubCategoryTemplateRequest = {
        ...request,
        IsPersonal: true,
      };

      try {
        const result = await saveSubCategoryPersonalTemplate(personalRequest).unwrap();
        if (result.ResponseCode === 100) {
          addToaster({
            title: result.ResponseMessage || "قالب قرارداد شخصی با موفقیت ذخیره شد",
            color: "success",
          });
        } else {
          addToaster({
            title: result.ResponseMessage || "خطا در ذخیره قالب قرارداد شخصی",
            color: "danger",
          });
        }
        return result;
      } catch (err: any) {
        addToaster({
          title: err?.data?.ResponseMessage || "خطا در ذخیره قالب قرارداد شخصی",
          color: "danger",
        });
        throw err;
      }
    }

    // Otherwise, use regular endpoint (requires service ID 6046)
    if (!hasRequiredService) {
      addToaster({
        title: "شما دسترسی لازم را ندارید",
        color: "warning",
      });
      return;
    }

    try {
      const result = await saveSubCategoryTemplate(request).unwrap();
      if (result.ResponseCode === 100) {
        addToaster({
          title: result.ResponseMessage || "قالب قرارداد با موفقیت ذخیره شد",
          color: "success",
        });
      } else {
        addToaster({
          title: result.ResponseMessage || "خطا در ذخیره قالب قرارداد",
          color: "danger",
        });
      }
      return result;
    } catch (err: any) {
      addToaster({
        title: err?.data?.ResponseMessage || "خطا در ذخیره قالب قرارداد",
        color: "danger",
      });
      throw err;
    }
  };

  return {
    saveSubCategoryTemplate: saveSubCategoryTemplateWithGuard,
    response: hasPersonalService ? personalData : regularData,
    error: hasPersonalService ? personalError : regularError,
    isLoading: hasPersonalService ? personalIsLoading : regularIsLoading,
    isSuccess: hasPersonalService ? personalIsSuccess : regularIsSuccess,
    hasRequiredService: hasRequiredService || hasPersonalService,
  };
};

export const useUpdateSubCategoryTemplate = () => {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(6048);
  const hasPersonalService = userDetail?.ServiceIds.includes(6049);
  const [updateSubCategoryTemplate, { data: regularData, error: regularError, isLoading: regularIsLoading, isSuccess: regularIsSuccess }] =
    useUpdateSubCategoryTemplateMutation();
  const [updateSubCategoryPersonalTemplate, { data: personalData, error: personalError, isLoading: personalIsLoading, isSuccess: personalIsSuccess }] =
    useUpdateSubCategoryPersonalTemplateMutation();

  const updateSubCategoryTemplateWithGuard = async (
    subCategoryId: number,
    request: SaveSubCategoryTemplateRequest
  ) => {
    // If user has service ID 6049, use personal template update endpoint and always set IsPersonal to true
    if (hasPersonalService) {
      const personalRequest: SaveSubCategoryTemplateRequest = {
        ...request,
        IsPersonal: true,
      };

      try {
        const result = await updateSubCategoryPersonalTemplate({
          subCategoryId,
          body: personalRequest,
        }).unwrap();
        if (result.ResponseCode === 100) {
          addToaster({
            title: result.ResponseMessage || "قالب قرارداد شخصی با موفقیت ویرایش شد",
            color: "success",
          });
        } else {
          addToaster({
            title: result.ResponseMessage || "خطا در ویرایش قالب قرارداد شخصی",
            color: "danger",
          });
        }
        return result;
      } catch (err: any) {
        addToaster({
          title: err?.data?.ResponseMessage || "خطا در ویرایش قالب قرارداد شخصی",
          color: "danger",
        });
        throw err;
      }
    }

    // Otherwise, use regular endpoint (requires service ID 6048)
    if (!hasRequiredService) {
      addToaster({
        title: "شما دسترسی لازم را ندارید",
        color: "warning",
      });
      return;
    }

    try {
      const result = await updateSubCategoryTemplate({
        subCategoryId,
        body: request,
      }).unwrap();
      if (result.ResponseCode === 100) {
        addToaster({
          title: result.ResponseMessage || "قالب قرارداد با موفقیت ویرایش شد",
          color: "success",
        });
      } else {
        addToaster({
          title: result.ResponseMessage || "خطا در ویرایش قالب قرارداد",
          color: "danger",
        });
      }
      return result;
    } catch (err: any) {
      addToaster({
        title: err?.data?.ResponseMessage || "خطا در ویرایش قالب قرارداد",
        color: "danger",
      });
      throw err;
    }
  };

  return {
    updateSubCategoryTemplate: updateSubCategoryTemplateWithGuard,
    response: hasPersonalService ? personalData : regularData,
    error: hasPersonalService ? personalError : regularError,
    isLoading: hasPersonalService ? personalIsLoading : regularIsLoading,
    isSuccess: hasPersonalService ? personalIsSuccess : regularIsSuccess,
    hasRequiredService: hasRequiredService || hasPersonalService,
  };
};

export const useDeleteSubCategoryTemplate = () => {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(6050);
  const [deleteSubCategoryTemplate, { data, error, isLoading, isSuccess }] =
    useDeleteSubCategoryTemplateMutation();

  const deleteSubCategoryTemplateWithGuard = async (
    subCategoryId: number
  ) => {
    if (!hasRequiredService) {
      addToaster({
        title: "شما دسترسی لازم را ندارید",
        color: "warning",
      });
      return;
    }

    try {
      const result = await deleteSubCategoryTemplate(subCategoryId).unwrap();
      if (result.ResponseCode === 100) {
        addToaster({
          title: result.ResponseMessage || "قالب قرارداد با موفقیت حذف شد",
          color: "success",
        });
      } else {
        addToaster({
          title: result.ResponseMessage || "خطا در حذف قالب قرارداد",
          color: "danger",
        });
      }
      return result;
    } catch (err: any) {
      addToaster({
        title: err?.data?.ResponseMessage || "خطا در حذف قالب قرارداد",
        color: "danger",
      });
      throw err;
    }
  };

  return {
    deleteSubCategoryTemplate: deleteSubCategoryTemplateWithGuard,
    response: data,
    error,
    isLoading,
    isSuccess,
    hasRequiredService,
  };
};

export const useGetSubCategoryTemplate = (id: number | null) => {
  const skip = !id;
  const { data, error, isLoading, isSuccess, refetch } =
    useGetSubCategoryTemplateQuery(id as number, { skip });

  return {
    template: data?.Data || null,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};
