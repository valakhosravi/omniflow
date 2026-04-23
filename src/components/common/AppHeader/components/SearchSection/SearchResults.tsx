import Loading from "@/ui/Loading";
import { SearchResponseModel } from "../../Header.type";
import Link from "next/link";
import { Icon } from "@/ui/Icon";

const SearchResults = ({
  results,
  isSearching,
}: {
  results: SearchResponseModel[];
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
            href={item.url}
            key={item.id}
            className="block px-4 py-3 text-sm text-gray-800 last:rounded-b-[12px]
              hover:bg-gray-100 transition-all duration-200 text-right font-medium"
          >
            {item.title}
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

export default SearchResults;
