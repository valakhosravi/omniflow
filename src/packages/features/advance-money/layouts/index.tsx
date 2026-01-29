"use client";

import Header from "@/components/Header";
import { useFavoriteList } from "@/hooks/search/useFavoriteAction";
import { useFavoriteStore } from "@/store/BookmarkStore";
import { useDisclosure } from "@/ui/NextUi";
import { useEffect } from "react";

export default function AdvanceMoneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { favoriteData, isGetting } = useFavoriteList();
  const setFavoriteCount = useFavoriteStore((state) => state.setCount);
  const setFavorites = useFavoriteStore((state) => state.setFavorites);

  useEffect(() => {
    if (favoriteData?.Data) {
      setFavorites(favoriteData.Data);
      setFavoriteCount(favoriteData.Data.length);
    }
  }, [favoriteData]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex h-screen w-full">
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <div className="h-[105px] px-4 py-7 flex items-center gap-x-2">
          <Header onOpen={onOpen} className="w-full" />
        </div>
        {children}
      </main>
    </div>
  );
}
