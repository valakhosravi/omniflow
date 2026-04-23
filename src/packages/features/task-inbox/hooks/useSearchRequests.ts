import { useSearchRequestsMutation } from "../api/RequestApi";

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
