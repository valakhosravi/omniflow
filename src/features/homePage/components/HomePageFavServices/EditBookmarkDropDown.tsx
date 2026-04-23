import { favoriteModel } from "@/features/homePage/homePage.types";
import { Icon } from "@/ui/Icon";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@/ui/NextUi";
import { addToaster } from "@/ui/Toaster";
import { useDeleteFavoriteMutation } from "../../homePage.services";

interface EditFavProps {
  favorite: favoriteModel;
  onOpenChange: (open: boolean) => void;
  setIsEditMode: (edit: boolean) => void;
  setEditingFavorite: (favorite: favoriteModel) => void;
}

const dropdownItems = [
  {
    key: "edit",
    label: "ویرایش بوکمارک",
  },
  {
    key: "delete",
    label: "حذف",
  },
];

export default function EditBookmarkDropDown({
  favorite,
  onOpenChange,
  setIsEditMode,
  setEditingFavorite,
}: EditFavProps) {
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const { onClose } = useDisclosure();
  const id = favorite.FavoriteId;

  const handleDelete = async (id: number) => {
    deleteFavorite(id)
      .then((response) => {
        if (response?.data?.ResponseCode === 100) {
          onClose();
        } else {
          addToaster({
            title: String(response?.error),
            color: "danger",
          });
        }
      })
      .catch((err) => {
        addToaster({
          title: err,
          color: "danger",
        });
      });
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setEditingFavorite(favorite);
    onOpenChange(true);
  };

  return (
    <>
      <Dropdown
        placement="bottom-end"
        className="min-w-[119px] w-[119px] rounded-[12px] border-secondary-0 
        shadow-[(-8px_8px_40px_0px_#959DA51F)] p-0"
      >
        <DropdownTrigger>
          <span
            className="absolute top-2.5 right-2.5 rounded-[6px] opacity-0 group-hover:opacity-100
        cursor-pointer hover:bg-primary-950/[3%] hover:text-primary-950"
          >
            <Icon name="moreCircle" className="text-primary-950" />
          </span>
        </DropdownTrigger>
        <DropdownMenu items={dropdownItems} className="space-y-[16px] p-3">
          {(item) => (
            <DropdownItem
              key={item.key}
              className="hover:!bg-primary-950/[3%] p-2"
              onPress={() => {
                if (item.key === "delete") {
                  handleDelete(id);
                } else if (item.key === "edit") {
                  handleEdit();
                }
              }}
            >
              <div className={`font-medium text-[12px]/[18px]`}>
                {item.label}
              </div>
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
