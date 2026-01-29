import { allNotification } from "../../task-inbox/types/NotificationModels";
import { Notification as NotificationIcon } from "iconsax-reactjs";
import { formatJalaliDateTime, toDurationFromNow } from "../../task-inbox/utils/toDurationFromNow";
import { getTypeColor, getTypeTextColor } from "../types/notifColors";

interface NotificationListProps {
  isLoading: boolean;
  notifications: allNotification[];
  highlightedId: string | null;
  handleCardClick: (notification: allNotification) => void;
}

export default function NotificationList({
  isLoading,
  notifications,
  highlightedId,
  handleCardClick,
}: NotificationListProps) {
  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="bg-white rounded-[12px] p-12 text-center text-secondary-500">
          در حال بارگذاری...
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.NotificationId}
            onClick={() => handleCardClick(notification)}
            className={`bg-white rounded-[12px] p-5 border transition-all hover:shadow-sm
              cursor-pointer
              ${
                highlightedId === String(notification.NotificationId)
                  ? "border-primary-950 bg-primary-100/50 ring-2 ring-primary-950/20"
                  : !notification.IsActive
                  ? "border-primary-200 bg-primary-50/30"
                  : "border-secondary-100"
              } ${!notification.IsRead && "!border-primary-950/[.4]"}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-[48px] h-[48px] rounded-[12px] flex items-center justify-center shrink-0 border ${getTypeColor(
                  notification.Type
                )}`}
              >
                <NotificationIcon
                  className={`size-[20px] ${getTypeTextColor(
                    notification.Type
                  )}`}
                />
              </div>
              <div className="flex-1">
                <h3
                  className={`${
                    !notification.IsRead
                      ? "text-[16px] font-semibold"
                      : "text-[15px] font-medium"
                  } text-secondary-800 mb-1`}
                >
                  {notification.Title}
                </h3>
                <div
                  className={`${
                    !notification.IsRead ? "text-[15px]" : "text-[14px]"
                  } text-secondary-600 mb-3 leading-relaxed`}
                  dangerouslySetInnerHTML={{ __html: notification.Description }}
                />
                <div className="text-[11px] text-secondary-400 font-normal">
                  <span>{toDurationFromNow(notification.CreatedDate)}</span>
                  <span>
                    {" "}
                    ({formatJalaliDateTime(notification.CreatedDate)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-[12px] p-12 text-center">
          <NotificationIcon className="size-[64px] text-secondary-300 mx-auto mb-4" />
          <p className="text-[15px] text-secondary-500">
            اعلانی برای نمایش وجود ندارد
          </p>
        </div>
      )}
    </div>
  );
}
