"use client";
import Header from "@/components/Header";
import Login from "@/components/search/Login";
import { useGetBalanceAndChargeApi } from "@/hooks/food/useTransactionAction";
import { useFavoriteList } from "@/hooks/search/useFavoriteAction";
import { useFavoriteStore } from "@/store/BookmarkStore";
import useTransactionStore from "@/store/Transaction";
import { useDisclosure } from "@/ui/NextUi";
import React, { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { favoriteData, isGetting } = useFavoriteList();
  const setFavoriteCount = useFavoriteStore((state) => state.setCount);
  const setFavorites = useFavoriteStore((state) => state.setFavorites);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { lastTransactionData, isLoading } = useGetBalanceAndChargeApi();
  const setBalance = useTransactionStore((state) => state.setBalance);

  useEffect(() => {
    if (lastTransactionData?.Data) {
      setBalance(lastTransactionData?.Data?.Balance);
    }
  }, [lastTransactionData, isLoading]);

  useEffect(() => {
    if (favoriteData?.Data) {
      setFavorites(favoriteData.Data);

      setFavoriteCount(favoriteData.Data.length);
    }
  }, [favoriteData]);

  return (
    <div className="flex flex-col justify-start min-h-screen px-4 py-6 max-w-[1440px] mx-auto">
      <Header onOpen={onOpen} />
      <main
        className={`col-span-7 xl:col-span-4 2xl:col-span-5 min-[1880px]:!col-span-6 flex flex-col 
          w-full h-full`}
      >
        {React.isValidElement(children)
          ? React.cloneElement(children, { onOpen } as any)
          : children}
      </main>
      <Login isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
    </div>
  );
}
