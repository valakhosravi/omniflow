import { SearchNormal1 } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { useSearchMutation } from "@/features/homePage/homePage.services";
import {
  MIN_SEARCH_LENGTH,
  SEARCH_PLACEHOLDER,
  SEARCH_RESULTS_COUNT,
} from "../../Header.const";
import SearchResults from "./SearchResults";
import { SearchResponseModel } from "../../Header.type";

const SearchSection = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponseModel[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [searchFn, { isLoading: searchLoading }] = useSearchMutation();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length >= MIN_SEARCH_LENGTH) {
      searchFn({ text: searchQuery, count: SEARCH_RESULTS_COUNT }).then(
        (res) => {
          if (!res.data) return;
          setResults(res.data);
          setShowResults(true);
        },
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
          <SearchResults results={results} isSearching={searchLoading} />
        </div>
      )}
    </div>
  );
};

export default SearchSection;
