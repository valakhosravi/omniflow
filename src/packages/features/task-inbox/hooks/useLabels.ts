import {
  useGetAllLabelsQuery,
  useCreateLabelMutation,
  useEditLabelMutation,
  useDeleteLabelMutation,
} from "../api/labelApi";

export const useLabels = () => {
  const { data, error, isLoading, refetch } = useGetAllLabelsQuery();
  const [
    createLabel,
    {
      isLoading: isCreating,
      isSuccess: isCreateSuccessful,
      data: createdLabel,
    },
  ] = useCreateLabelMutation();
  const [
    editLabel,
    { isLoading: isEditing, isSuccess: isEditSuccessful, data: editedLabel },
  ] = useEditLabelMutation();
  const [deleteLabel, { isLoading: isDeleting }] = useDeleteLabelMutation();

  return {
    labels: data,
    error,
    isLoading,
    refetch,
    createLabel,
    createdLabel,
    isCreating,
    isCreateSuccessful,
    editLabel,
    isEditing,
    isEditSuccessful,
    editedLabel,
    deleteLabel,
    isDeleting,
  };
};
