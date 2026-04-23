import { UserDetail } from "@/packages/auth/types/UserDetail";
import { useLoginStore } from "@/store/LoginStore";
import Loading from "@/ui/Loading";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchMutation } from "../homePage.services";

const HomePageSearch = ({ userDetail }: { userDetail: UserDetail | null }) => {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchFn, { isLoading: searchLoading }] = useSearchMutation();
  const { onOpen } = useLoginStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedQuery = query.trim();
    if ((e.key === "Enter" || trimmedQuery.length >= 0) && !userDetail) {
      onOpen();
      return;
    }
    if (e.key === "Enter" || trimmedQuery.length >= 2) {
      searchFn({ text: query, count: 5 }).then((res) => {
        if (!res.data) return;
        setResults(res.data);
        setShowResults(true);
      });
    }
  };

  return (
    <div className="relative h-[58px]">
      <div
        ref={searchContainerRef}
        className={`absolute z-50 top-0 ${
          showResults
            ? "shadow-[0_8px_40px_0px_#64646F1A]"
            : "shadow-[-4px_8px_40px_0px_#64646F1A]"
        } rounded-[12px]`}
      >
        <Image
          src="/icons/search.svg"
          alt="search"
          width={20}
          height={20}
          className="absolute left-4 top-[28px] transform -translate-y-1/2"
        />
        <input
          name="search"
          type="search"
          autoComplete="off"
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value.trim() === "") {
              setResults([]);
              setShowResults(false);
            }
          }}
          onKeyUp={handleKeyDown}
          placeholder="جستجو میان فرم‌ها، فیش حقوقی، مرخصی و..."
          className={`w-[586px] h-[57px] p-4 focus:outline-none bg-white 
           [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none
            ${showResults ? "rounded-t-[12px]" : "rounded-[12px]"}`}
        />
        <div className="top-[52px] w-full bg-white rounded-b-[12px] z-10">
          {searchLoading ? (
            <div className="flex justify-center items-center p-6">
              <Loading />
            </div>
          ) : (
            showResults && (
              <>
                {results.length > 0 ? (
                  results.map((item) => (
                    <Link
                      href={item.UrlSlug}
                      key={item.MenuId}
                      className="block px-4 py-3 text-sm text-gray-800 last:rounded-b-[12px]
          hover:bg-gray-100 transition-all duration-200 text-right font-medium"
                    >
                      {item.Title}
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center py-[32px]">
                    <p className="font-medium text-[14px]/[20px] text-secondary-500">
                      متاسفانه خدمت مورد نظر شما پیدا نشد.
                    </p>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageSearch;
