"use client";
import Loading from "@/ui/Loading";
import {
  useGetReservation,
  useGetReservationForOthers,
} from "@/hooks/food/useOrderAction";
import ReservationTable from "./ReservationTable";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Select, SelectItem } from "@heroui/react";
import Link from "next/link";
import { SearchNormal1 } from "iconsax-reactjs";
import { useSearchByFullName } from "@/hooks/food/useGuestReservation";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useBasketStore } from "@/store/basketStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchByFullNameModel } from "@/models/food/guestReservation/CreateGuestOrderModel";

export default function ReservationPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { reservationData, isGetting } = useGetReservation();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { searchByFullName } = useSearchByFullName(search);
  const { userDetail } = useAuth();
  const hasAccessToOrder = userDetail?.ServiceIds.find((id) => {
    return id === 1575;
  });
  const setSelectedUser = useBasketStore((state) => state.setSelectedUser);
  const selectedUser = useBasketStore((state) => state.selectedUser);
  const { reservationForOthers, isGettingForOthers } =
    useGetReservationForOthers(selectedUser?.UserId ?? 0);

  // Initialize user from URL params on mount
  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    const userNameParam = searchParams.get("userName");

    if (userIdParam && userNameParam && !selectedUser) {
      const userId = parseInt(userIdParam, 10);
      if (!isNaN(userId)) {
        const user: SearchByFullNameModel = {
          UserId: userId,
          FullName: decodeURIComponent(userNameParam),
          Title: "",
          PersonnelId: 0,
        };
        setSearch(user.FullName);
        setSelectedUser(user);
      }
    }
  }, [searchParams, selectedUser, setSelectedUser]);

  const updateRouteParams = (userId: number | null, userName: string | null) => {
    const params = new URLSearchParams();
    if (userId && userName) {
      params.set("userId", userId.toString());
      params.set("userName", userName);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl);
  };

  const dataToShow =
    hasAccessToOrder && selectedUser
      ? reservationForOthers?.Data ?? []
      : reservationData?.Data ?? [];

  const [doesUserHasOpenOrder, openOrders] = useMemo(() => {
    const openOrders = (dataToShow || []).filter((x) => x.IsOpen);
    return [
      openOrders.length > 0,
      openOrders.map((x) => {
        return {
          title: x.PlanName,
          value: x.OrderId,
        };
      }),
    ];
  }, [dataToShow]);

  if (isGetting || isGettingForOthers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {hasAccessToOrder && (
        <div className="self-center">
          <Input
            isClearable
            classNames={{
              inputWrapper:
                "border border-secondary-950/[.2] rounded-[10px] bg-white max-w-[300px] w-[300px]",
              input:
                "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
              label:
                "font-bold text-[14px]/[20px] text-secondary-950 mb-[8.5px]",
            }}
            className="relative mb-2"
            radius="lg"
            startContent={
              <SearchNormal1
                size={20}
                className="text-black/50 mb-0.5 dark:text-white/90 pointer-events-none shrink-0"
              />
            }
            value={search}
            onChange={(e) => {
              const value = e.target.value ?? "";
              setSearch(value);
              if (selectedUser && value !== selectedUser.FullName) {
                setSelectedUser(null);
                updateRouteParams(null, null);
              }
            }}
            onClear={() => {
              setSearch("");
              setSelectedUser(null);
              updateRouteParams(null, null);
            }}
            placeholder="رزرو غذا برای"
          />
          {!selectedUser &&
            searchByFullName?.Data &&
            searchByFullName?.Data?.length > 0 && (
              <div className="absolute z-10 min-w-[300px] bg-white border border-primary-950/[.2] rounded-[10px]">
                {searchByFullName?.Data &&
                  searchByFullName?.Data.map((user) => {
                    return (
                      <div
                        key={user.UserId}
                        onClick={() => {
                          setSearch(user.FullName);
                          setSelectedUser(user);
                          updateRouteParams(user.UserId, user.FullName);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {user.FullName}
                      </div>
                    );
                  })}
              </div>
            )}
        </div>
      )}
      {/* {doesUserHasOpenOrder && openOrders.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <Alert
            // hideIcon
            // color="success"
            description={
              "در صورت عدم پرداخت سفارش خود، سفارش به صورت خودکار ثبت شده و مبلغ آن از حقوق شما کسر خواهد شد."
            }
            title={"شما سفارش باز دارید"}
            variant="faded"
            className="w-full"
            endContent={
              <>
                <Select
                  className="w-[240px] me-1"
                  variant="bordered"
                  classNames={{
                    base: "w-full",
                    trigger: `
                  bg-white 
                  border border-default-300 
                  rounded-[12px] 
                  shadow-none 
                  hover:border-default-400
                  focus:border-default-500
                `,
                    value: "text-sm text-secondary-950",
                    popoverContent: "border border-default-300",
                  }}
                  selectedKeys={selectedOrder ? [selectedOrder] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setSelectedOrder(selectedKey || null);
                  }}
                >
                  {openOrders.map((x) => {
                    return <SelectItem key={x.value}>{x.title}</SelectItem>;
                  })}
                </Select>
                <Link
                  href={
                    selectedOrder
                      ? `/food/reservation/checkout/${selectedOrder}`
                      : ""
                  }
                >
                  <Button
                    size="md"
                    className="w-[200px] btn-primary"
                    isDisabled={!selectedOrder}
                  >
                    پرداخت
                  </Button>
                </Link>
              </>
            }
          />
        </div>
      )} */}
      <ReservationTable reservationData={dataToShow} />
    </>
  );
}
