import { SearchNormal1 } from "iconsax-reactjs";

import { useSearchState } from "./hooks/useSearchState";
import { AppHeaderSearchResult } from "./AppHeaderSearchResult";

const SEARCH_PLACEHOLDER = "جستجو میان فرم‌ها، فیش حقوقی، مرخصی و...";

export const AppHeaderSearch = () => {
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
          <AppHeaderSearchResult results={results} isSearching={isSearching} />
        </div>
      )}
    </div>
  );
};
