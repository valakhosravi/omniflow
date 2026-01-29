import { useSearchRequestsMutation } from "../api/RequestApi";

interface SearchRequestParams {
  Title?: string;
  ProcessTypeId?: number;
  LabelId?: number;
  FromDate?: string;
  ToDate?: string;
  IsTerminate?: boolean;
  pageNumber: number;
  pageSize: number;
}

export const useSearchRequests = () => {
  const [searchRequests, { isLoading: isSearching, error, data }] =
    useSearchRequestsMutation();

  return {
    searchRequests,
    isSearching,
    error,
    searchResults: data,
  };
};
