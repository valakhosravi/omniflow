// Rewrite all search related logics
"use client";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/packages/auth/hooks/useAuth";
import { searchApi, searchUrlApi } from "@/services/search/search";
import { useMutation, useQuery } from "@tanstack/react-query";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;
const SEARCH_RESULTS_COUNT = 5;
const MIN_SEARCH_LENGTH = 2;

const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

export function useSearch() {
  const { mutate: search, isPending: isSearching } = useMutation({
    mutationFn: searchApi,
  });
  return { search, isSearching };
}

export function useSearchUrl(url: string) {
  const { userDetail } = useAuth();
  const { data: searchUrl, isLoading: isSearching } = useQuery({
    queryKey: ["searchUrl", url],
    queryFn: async () => {
      try {
        return await searchUrlApi(url);
      } catch (error) {
        // Silently handle errors - don't show error messages for bookmark API
        return null;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    enabled: !!userDetail && !!url,
  });
  return { searchUrl, isSearching };
}

export const useSearchState = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { search, isSearching } = useSearch();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(searchContainerRef, () => setShowResults(false));

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length >= MIN_SEARCH_LENGTH) {
      search(
        { text: searchQuery, count: SEARCH_RESULTS_COUNT },
        {
          onSuccess: (data: any[]) => {
            const mappedResults = data.map((item) => ({
              ...item,
              id: String(item.id), // Convert number to string
            }));
            setResults(mappedResults);
            setShowResults(true);
          },
        }
      );
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      setShowResults(false);
    }
  };

  return {
    query,
    results,
    showResults,
    isSearching,
    searchContainerRef,
    handleSearch,
    handleQueryChange,
  };
};
