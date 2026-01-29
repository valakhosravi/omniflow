export interface MenuRequest {
  MenuId: number;
  ParentId: number | null;
  Title: string;
  Icon: string | null;
  UrlSlug: string | null;
}
