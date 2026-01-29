import Link from "next/link";

export const AppHeaderSearchResult = ({
  results,
  isSearching,
}: {
  results: SearchResult[];
  isSearching: boolean;
}) => {
  if (isSearching) {
    return (
      <div className="flex justify-center items-center p-6">
        {/* TODO: replace with skeleton loading*/}
        {/* <Loading /> */}
        Loading ...
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
      {/* TODO: add icon */}
      {/* <Icon
        name="notFoundSearch"
        className="size-[102px] text-primary-950/[25%]"
      /> */}
      <p className="font-medium text-[14px]/[20px] text-secondary-500">
        متاسفانه خدمت مورد نظر شما پیدا نشد.
      </p>
    </div>
  );
};
