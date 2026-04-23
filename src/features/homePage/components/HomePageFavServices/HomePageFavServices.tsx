"use client";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import SortableFavorite from "./SortableFavorite";
import Loading from "../../../../ui/Loading";
import { useDisclosure } from "@/ui/NextUi";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { PiHamburgerBold } from "react-icons/pi";
import { favoriteModel } from "@/features/homePage/homePage.types";
import HomePageBookmarkModal from "../HomePageBookmarkModal";
import {
  useGetAllFavoriteQuery,
  useUpdateFavoriteOrderMutation,
} from "../../homePage.services";
import { addToaster } from "@/ui/Toaster";

export default function HomePageFavServices() {
  const { userDetail } = useAuth();
  const { data: favoriteData, isLoading: isGetting } = useGetAllFavoriteQuery(
    undefined,
    { skip: !Boolean(userDetail?.UserDetail) },
  );
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [favoriteItemsMap, setFavoriteItemsMap] = useState<
    Record<string, favoriteModel>
  >({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const hasRequiredService = userDetail?.ServiceIds.includes(1004);
  const [updateOrderFn, { isLoading: isUpdating }] =
    useUpdateFavoriteOrderMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFavorite, setEditingFavorite] = useState<favoriteModel | null>(
    null,
  );

  useEffect(() => {
    if (favoriteData?.Data) {
      const ids: string[] = [];
      const map: Record<string, favoriteModel> = {};

      favoriteData.Data.forEach((fav) => {
        const uniqueId = `${fav.FavoriteId}-${fav.UserId}`;
        ids.push(uniqueId);
        map[uniqueId] = { ...fav, id: uniqueId };
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItemIds(ids);
      setFavoriteItemsMap(map);
    }
  }, [favoriteData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));

    const newOrderedIds = arrayMove(itemIds, oldIndex, newIndex);

    setItemIds(newOrderedIds); 

    const payload = newOrderedIds.map((id, index) => {
      const fav = favoriteItemsMap[id];
      return {
        FavoriteId: fav.FavoriteId,
        Ordering: index + 1,
      };
    });

    if (hasRequiredService) {
      updateOrderFn({ body: payload }); 
    } else {
      addToaster({
        title: "دسترسی لازم وجود ندارد",
        color: "danger",
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeItemData = activeId ? favoriteItemsMap[activeId] : null;

  const isLogin = useAuth();

  if (isGetting) {
    return <Loading />;
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={itemIds}
          strategy={horizontalListSortingStrategy}
        >
          {isLogin.user && (
            <nav className="flex items-center gap-x-[24px] justify-center">
              <div className="flex flex-row items-center gap-x-[24px]">
                {itemIds.map((id) => {
                  const favorite = favoriteItemsMap[id];
                  if (!favorite) return null;

                  return (
                    <SortableFavorite
                      key={favorite.id}
                      favorite={favorite}
                      onOpenChange={onOpenChange}
                      setIsEditMode={setIsEditMode}
                      setEditingFavorite={setEditingFavorite}
                    />
                  );
                })}
              </div>

              {(favoriteData?.Data?.length ?? 0) < 9 && (
                <div className="flex flex-col items-center space-y-[12px]">
                  <button
                    className="flex items-center justify-center btn bg-primary-950 text-white size-[64px] rounded-xl
              hover:[box-shadow:-8px_8px_40px_0px_#959DA51F] hover:drop-shadow-md h-[84px] w-[84px]"
                    onClick={() => {
                      onOpen();
                      setIsEditMode(false);
                    }}
                    disabled={isUpdating || isOpen}
                  >
                    <Image
                      src="/icons/plus.svg"
                      alt="plus"
                      width={20}
                      height={20}
                    />
                  </button>
                  <span className="text-secondary-950 text-medium font-medium leading-[20px]">
                    اضافه کردن
                  </span>
                </div>
              )}
            </nav>
          )}
        </SortableContext>

        <DragOverlay>
          {activeItemData ? (
            <div className="flex flex-col items-center space-y-[12px] bg-transparent border border-transparent rounded-[10px] shadow-lg p-2 text-center w-[100px]">
              <button
                className="flex items-center justify-center btn bg-white size-[64px] border-none
              rounded-[10px] [box-shadow:-8px_8px_40px_0px_#959DA51F]"
              >
                {activeItemData.MenuIcon ? (
                  <Image
                    src={activeItemData.MenuIcon}
                    alt={activeItemData.MenuTitle}
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="text-primary-950 text-[20px] font-bold">
                    <span className="text-primary-950 text-[20px] font-bold">
                      {activeItemData.MenuTitle === "رزرو غذا" ? (
                        <PiHamburgerBold className="flex-shrink-0 text-2xl" />
                      ) : (
                        activeItemData.MenuTitle?.[0] || "?"
                      )}
                    </span>
                  </span>
                )}
              </button>
              <span className="text-secondary-950 text-medium font-medium leading-[20px]">
                {activeItemData.MenuTitle}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <HomePageBookmarkModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isEditMode={isEditMode}
        editingFavorite={editingFavorite}
      />
    </>
  );
}
