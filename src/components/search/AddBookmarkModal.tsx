import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import RHFInput from "../../ui/RHFInput";
import useUrlSearchValidation from "@/validations/SearchUrl";
import { useSearchUrl } from "@/hooks/search/useSearchAction";
import {
  useCreateFavorite,
  useEditFavorite,
} from "@/hooks/search/useFavoriteAction";
import favoriteModel from "@/models/search/favoriteModel";
import { useEffect } from "react";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  editingFavorite: favoriteModel | null;
}

export default function AddBookmarkModal({
  isOpen,
  onOpenChange,
  isEditMode,
  editingFavorite,
}: AddBookmarkModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useUrlSearchValidation();
  const urlValue = watch("url");
  const { searchUrl, isSearching } = useSearchUrl(urlValue);

  const { createFavorite, isCreating } = useCreateFavorite();
  const { editFavorite, isEditting } = useEditFavorite();

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editingFavorite?.MenuUrlSlug) {
        reset({
          url: `${window.location.origin}${editingFavorite.MenuUrlSlug}`,
        });
      } else {
        reset({ url: "" });
      }
    }
  }, [isOpen, isEditMode, editingFavorite, reset]);

  const onSubmit = () => {
    if (
      isEditMode &&
      editingFavorite &&
      searchUrl?.Data?.MenuId !== undefined
    ) {
      editFavorite(
        {
          id: editingFavorite.FavoriteId,
          data: {
            MenuId: searchUrl?.Data?.MenuId,
            ColorCode: "#fff",
          },
        },
        {
          onSuccess: () => {
            reset();
            onOpenChange(false);
          },
        }
      );
    } else {
      createFavorite(
        {
          MenuId: searchUrl?.Data?.MenuId,
          Ordering: searchUrl?.Data?.Ordering,
          ColorCode: "#fff",
        },
        {
          onSuccess: () => {
            reset();
            onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) reset();
        onOpenChange(open);
      }}
      hideCloseButton
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[483px] max-w-[479px] max-h-[563px]">
          <ModalHeader className="flex justify-between items-center pt-[20px] px-[24px]">
            {isEditMode ? (
              <h1 className="font-semibold text-[16px]/[24px] text-secondary-950">
                ویرایش میانبر
              </h1>
            ) : (
              <h1 className="font-semibold text-[16px]/[24px] text-secondary-950">
                اضافه کردن میانبر
              </h1>
            )}
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[16px] mb-[32px] mx-[24px] bg-background-devider h-[1px]" />
          <ModalBody className="px-[24px] py-0">
            <div className="text-secondary-950 w-[435px]">
              <RHFInput
                label="آدرس اینترنتی URL "
                placeholder="https://"
                placeholderAlign="left"
                inputDirection="ltr"
                required
                type="text"
                register={register("url")}
                error={
                  !isSearching && urlValue && !searchUrl?.Data?.UrlSlug
                    ? "آدرس وجود ندارد"
                    : errors.url?.message
                }
                className=""
              />
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-between gap-x-[16px] pt-[148px] pb-[20px] px-[24px]">
            {isEditMode ? (
              <CustomButton
                type="submit"
                className="flex items-center justify-center w-[304px] h-[48px]
               btn-primary rounded-[12px] text-secondary-0 cursor-pointer font-semibold text-[14px]/[20px]"
                isLoading={isEditting}
                isDisabled={isEditting}
              >
                ذخیره تغییرات
              </CustomButton>
            ) : (
              <CustomButton
                type="submit"
                className="flex items-center justify-center min-w-[304px] min-h-[48px]
               btn-primary rounded-[12px] text-secondary-0 cursor-pointer font-semibold text-[14px]/[20px]"
                isLoading={isCreating}
                isDisabled={isCreating}
              >
                اضافه کردن میانبر
              </CustomButton>
            )}
            <CustomButton
              className="flex items-center justify-center min-w-[115px] min-h-[48px]
               btn-outline rounded-[12px] cursor-pointer font-semibold text-[14px]/[20px]"
              onPress={() => {
                reset();
                onOpenChange(false);
              }}
            >
              انصراف
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
