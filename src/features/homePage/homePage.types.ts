export interface searchRequestModel {
  text: string;
  count: number;
}
export interface urlSearchResponseModel {
  MenuId: number;
  ParentId: number;
  Title: string;
  Icon: null;
  Ordering: number;
  UrlSlug: string;
}

export interface favoriteModel {
  FavoriteId: number;
  UserId: number;
  MenuId: number;
  Ordering: number;
  ColorCode: string;
  CreatedDate: string;
  MenuTitle: string;
  MenuUrlSlug: string;
  MenuIcon: string;
  id?: string;
}

export interface AddBookmarkModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  editingFavorite: favoriteModel | null;
}

export type UpdateFavorite = {
  FavoriteId: number;
  Ordering: number;
};
export default interface CreateFavoriteInput {
  MenuId: number;
  Ordering: number;
  ColorCode: string;
}
