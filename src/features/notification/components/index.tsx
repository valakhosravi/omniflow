"use client";

import { useState, useEffect, useRef } from "react";
import BookmarkIcon from "@/ui/BookmarkIcon";
import { useBookmark } from "@/hooks/food/useBookmark";
import { useSearchParams } from "next/navigation";
import { Tab, Tabs, useDisclosure } from "@/ui/NextUi";
import NotificationDetailModal from "./NotificationDetailModal";
import { useGetAllUserNotificationQuery } from "../notification.services";
import { allNotification } from "../../../packages/features/task-inbox/types/NotificationModels";
import NotificationList from "./NotificationList";

export default function NotificationPageComponent() {
  const searchParams = useSearchParams();
  const notificationId = searchParams.get("id");
  const notificationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [urlValue] = useState(() => window.location.href);
  const [highlightedId, setHighlightedId] = useState<string | null>(
    notificationId,
  );
  const [selectedNotification, setSelectedNotification] =
    useState<allNotification | null>(null);

  const { data, isLoading } = useGetAllUserNotificationQuery();
  const notifications = data?.Data ?? [];

  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  useEffect(() => {
    if (notificationId && notificationRefs.current[notificationId]) {
      setTimeout(() => {
        notificationRefs.current[notificationId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      const timer = setTimeout(() => setHighlightedId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notificationId]);

  const handleCardClick = (notification: allNotification) => {
    setSelectedNotification(notification);
    onOpen();
  };

  const readedNotifications = notifications.filter((n) => n.IsRead);
  const unReadedNotifications = notifications.filter((n) => !n.IsRead);

  return (
    <div className="container mx-auto">
      <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          {favoriteCount < 9 && (
            <BookmarkIcon
              isBookmarked={isBookmarked}
              onClick={handleToggleBookmark}
            />
          )}
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            اعلان‌ها
          </h1>
        </div>
      </div>
      <Tabs
        fullWidth
        variant="underlined"
        aria-label="days"
        className="mb-[32px]"
        classNames={{
          tabList: `gap-x-0`,
          tab: `border-b border-secondary-200 !px-0 pb-[10px] pt-[2px] leading-none`,
          cursor: `w-full h-[2px] bg-secondary-950 shadow-none`,
          tabContent: `font-semibold text-[14px]/[20px] text-secondary-500 
            group-data-[selected=true]:text-secondary-950 group-data-[selected=true]:font-bold`,
        }}
      >
        <Tab key="All" title={`همه (${notifications.length})`}>
          <NotificationList
            handleCardClick={handleCardClick}
            highlightedId={highlightedId}
            isLoading={isLoading}
            notifications={notifications}
          />
        </Tab>
        <Tab
          key="unread"
          title={`خوانده نشده (${
            notifications.filter((n) => !n.IsRead).length
          })`}
        >
          <NotificationList
            handleCardClick={handleCardClick}
            highlightedId={highlightedId}
            isLoading={isLoading}
            notifications={unReadedNotifications}
          />
        </Tab>
        <Tab
          key="read"
          title={`خوانده شده (${notifications.filter((n) => n.IsRead).length})`}
        >
          <NotificationList
            handleCardClick={handleCardClick}
            highlightedId={highlightedId}
            isLoading={isLoading}
            notifications={readedNotifications}
          />
        </Tab>
      </Tabs>
      <NotificationDetailModal
        isOpen={isOpen}
        onClose={onClose}
        selectedNotification={selectedNotification}
      />
    </div>
  );
}
