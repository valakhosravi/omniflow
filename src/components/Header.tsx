"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SearchNormal1 } from "iconsax-reactjs";

import UserDropDown from "./search/UserDropDown";
import MegaMenuDrawer from "./search/MegaMenuDrawer";
import CoServicesDropDown from "./search/CoServicesDropDown";
import NotificationDropdown from "./search/NotificationDropdown";

import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import Loading from "@/ui/Loading";

import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useSearch } from "@/hooks/search/useSearchAction";
import { Badge } from "@heroui/react";
import { useDispatch } from "react-redux";
import { useGetUnreadQuery } from "@/packages/features/task-inbox/api/ReadApi";
import { setUnReadCount } from "@/packages/features/task-inbox/slice/UnReadCountDataSlice";

// Types
interface SearchResult {
  MenuId: string;
  Title: string;
  UrlSlug: string;
}

interface HeaderProps {
  className?: string;
  onOpen?: () => void;
}

// Constants
const SEARCH_PLACEHOLDER = "جستجو میان فرم‌ها، فیش حقوقی، مرخصی و...";
const SEARCH_RESULTS_COUNT = 5;
const MIN_SEARCH_LENGTH = 2;

// Custom hook for outside click detection
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

// Custom hook for search functionality
const useSearchState = () => {
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

// Auth Section Component
const AuthSection = ({ onOpen }: { onOpen: () => void }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Remove the isClient state and useEffect that was causing hydration mismatch
  if (isLoading) {
    return (
      <div className="w-[120px] h-[40px] bg-gray-200 rounded animate-pulse" />
    );
  }

  if (!user) {
    return (
      <CustomButton
        buttonSize="md"
        buttonVariant="primary"
        onPress={onOpen}
        className="text-[14px] whitespace-nowrap"
        data-cy="open-login-modal"
      >
        ورود به سامانه
      </CustomButton>
    );
  }

  return (
    <div className="flex items-center justify-between w-full gap-x-[24px]">
      <UserDropDown />
      <NotificationDropdown />
      <MegaMenuDrawer />
    </div>
  );
};

// Taskbox Link Component
const TaskboxLink = ({ onOpen }: { onOpen: () => void }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      onOpen();
    }
  };

  const { data: unReadTasks } = useGetUnreadQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
    if (unReadTasks?.Data) {
      dispatch(setUnReadCount(unReadTasks?.Data?.length));
    }
  }, [unReadTasks?.Data]);

  return (
    <Link
      href={isAuthenticated ? "/task-inbox" : "#"}
      onClick={handleClick}
      className="text-primary-950 font-medium text-[12px] leading-[18px]
        hover:bg-primary-950/[3%] hover:text-primary-950 border border-transparent hover:border-primary-950/[25%]
        focus:bg-primary-950/[8%] focus:text-primary-950 p-3 rounded-[12px]
        disabled:border-secondary-0 disabled:text-secondary-300 disabled:bg-secondary-0
        cursor-pointer shrink-0"
    >
      <Badge
        content={
          unReadTasks?.Data?.length && unReadTasks.Data.length > 0
            ? unReadTasks.Data.length
            : ""
        }
        color="default"
        placement="top-left"
        size="sm"
        isInvisible={(unReadTasks?.Data?.length ?? 0) === 0}
        classNames={{
          badge:
            "min-w-[18px] h-[18px] text-[10px] top-[-1px] left-[-1px] bg-trash text-white flex items-center justify-center",
        }}
      >
        کارتابل من
      </Badge>
    </Link>
  );
};

// Search Results Component
const SearchResults = ({
  results,
  isSearching,
}: {
  results: SearchResult[];
  isSearching: boolean;
}) => {
  if (isSearching) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loading />
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <>
        {results.map((item) => (
          <Link
            href={item.UrlSlug}
            key={item.MenuId}
            className="block px-4 py-3 text-sm text-gray-800 last:rounded-b-[12px]
              hover:bg-gray-100 transition-all duration-200 text-right font-medium"
          >
            {item.Title}
          </Link>
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center py-[32px]">
      <Icon
        name="notFoundSearch"
        className="size-[102px] text-primary-950/[25%]"
      />
      <p className="font-medium text-[14px]/[20px] text-secondary-500">
        متاسفانه خدمت مورد نظر شما پیدا نشد.
      </p>
    </div>
  );
};

// Search Component
const SearchSection = () => {
  const {
    query,
    results,
    showResults,
    isSearching,
    searchContainerRef,
    handleSearch,
    handleQueryChange,
  } = useSearchState();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <div
      ref={searchContainerRef}
      className="relative rounded-[12px] border border-secondary-200 w-full"
    >
      <SearchNormal1
        className="absolute left-4 top-[28px] transform -translate-y-1/2"
        size={20}
        color="#1C3A63"
      />
      <input
        name="search"
        type="search"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={SEARCH_PLACEHOLDER}
        className={`relative w-full h-[57px] p-4 focus:outline-none bg-white 
          [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none
          ${showResults ? "rounded-t-[12px]" : "rounded-[12px]"}`}
      />
      {showResults && (
        <div
          className="absolute w-[1094.45px] mx-auto bg-white rounded-b-[12px] z-50 -mt-2
          border-x border-b border-secondary-200"
        >
          <SearchResults results={results} isSearching={isSearching} />
        </div>
      )}
    </div>
  );
};

// Main Header Component
export default function Header({ onOpen, className }: HeaderProps) {
  return (
    <div className="h-[105px] px-4 py-7 flex items-center gap-x-2 border-b border-color-neutral-100 flex-1">
      <div
        className={`flex justify-between items-center gap-x-[50px] w-full ${className}`}
      >
        <div className="flex items-center gap-x-[40px]">
          <AuthSection onOpen={onOpen || (() => {})} />
          <CoServicesDropDown />
          <TaskboxLink onOpen={onOpen || (() => {})} />
        </div>
        <SearchSection />
      </div>
    </div>
  );
}
