"use client";
import Loading from "@/ui/Loading";
import FavServices from "@/components/search/FavServices";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useSearch } from "@/hooks/search/useSearchAction";
import { useLoginStore } from "@/store/LoginStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { isBirthdayToday } from "@/utils/isBirthdayToday";
import { isYaldaTodayOrTomorrow } from "@/utils/isYaldaTodayOrTomorrow";

export default function Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { search, isSearching } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const { onOpen } = useLoginStore();
  const { userDetail } = useAuth();

  const searchContainerRef = useRef<HTMLDivElement>(null);

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
      search(
        { text: query, count: 5 },
        {
          onSuccess: (data) => {
            setResults(data);
            setShowResults(true);
          },
        }
      );
    }
  };

  // Check if today is Yalda (prioritized)
  const isYalda = isYaldaTodayOrTomorrow();
  // Check if today is user's birthday
  const isBirthday = userDetail?.UserDetail?.BirthDate ? isBirthdayToday(userDetail.UserDetail.BirthDate) : false;
  // const isBirthday = true;

  // Determine which image to show: Yalda > Birthday > Default
  const getImageSrc = () => {
    if (isYalda) return "/icons/PECCO-yalda.png";
    if (isBirthday) return "/icons/PECCO-birthday.png";
    return "/icons/PECCO.svg";
  };

  const getImageAlt = () => {
    if (isYalda) return "pecco yalda";
    if (isBirthday) return "pecco birthday";
    return "pecco";
  };

  const getImageDimensions = () => {
    if (isYalda) return { width: 340, height: 180 }; // Using similar dimensions to birthday image
    if (isBirthday) return { width: 340, height: 180 };
    return { width: 294, height: 98 };
  };

  const imageDimensions = getImageDimensions();

  return (
    <div className="space-y-10 w-[586px]">
      <Image
        className="mx-auto"
        src={getImageSrc()}
        alt={getImageAlt()}
        width={imageDimensions.width}
        height={imageDimensions.height}
      />
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
            {isSearching ? (
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
                      {/* <Icon
                    name="notFoundSearch"
                    className="size-[102px] text-primary-950/[25%]"
                  /> */}
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
      <FavServices />
    </div>
  );
}
