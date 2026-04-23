import {
  useCreateSnoozeMutation,
  useDeleteSnoozeMutation,
  useEditSnoozeMutation,
} from "../api/SnoozeApi";

export const useSnoozes = () => {
  const [
    createSnooze,
    {
      isLoading: isCreating,
      isSuccess: isCreateSuccessful,
      data: createdSnooze,
    },
  ] = useCreateSnoozeMutation();
  const [deleteSnooze, { isLoading: isDeleting }] = useDeleteSnoozeMutation();
  const [editSnooze, { isLoading: isEditing }] = useEditSnoozeMutation();

  return {
    createSnooze,
    isCreating,
    isCreateSuccessful,
    createdSnooze,
    deleteSnooze,
    isDeleting,
    editSnooze,
    isEditing,
  };
};
