export interface Pagination<T> {
    Items: T[];
    TotalCount: number;
    PageSize: number;
    CurrentPage: number;
    TotalPages: number;
    HasPrevious: boolean;
    HasNext: boolean;
  }