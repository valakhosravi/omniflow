import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Notification } from "iconsax-reactjs";
import { allNotification } from "../../../packages/features/task-inbox/types/NotificationModels";
import {
  useGetAllUserNotificationQuery,
  useUpdateIsReadMutation,
} from "../notification.services";
import { toJalaliDateTime } from "../../../packages/features/task-inbox/utils/dateFormatter";
import { useEffect, useMemo } from "react";
import sanitizeHtml from "sanitize-html";
import { getTypeColor } from "../notifications.types";

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNotification: allNotification | null;
}

export default function NotificationDetailModal({
  isOpen,
  onClose,
  selectedNotification,
}: NotificationDetailModalProps) {
  const [updateIsRead] = useUpdateIsReadMutation();
  const { refetch: refetchDropDown } = useGetAllUserNotificationQuery(false);
  const { refetch } = useGetAllUserNotificationQuery();

  useEffect(() => {
    if (
      isOpen &&
      selectedNotification &&
      selectedNotification.IsRead === false
    ) {
      updateIsRead(selectedNotification.NotificationId)
        .unwrap()
        .then(() => {
          refetch();
          refetchDropDown();
        })
        .catch((err) => console.error("Error updating IsRead:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedNotification]);

  const sanitizedDescription = useMemo(() => {
    const html = selectedNotification?.Description ?? "";

    const sanitized = sanitizeHtml(html);
    return sanitized;
  }, [selectedNotification?.Description]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
      classNames={{
        base: "rounded-[16px]",
        header: "border-b border-secondary-100 pb-4",
        body: "py-6",
        footer: "border-t border-secondary-100 pt-4",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-3">
              <div
                className={`w-[48px] h-[48px] rounded-[12px] flex items-center justify-center shrink-0 border ${getTypeColor(
                  selectedNotification?.Type,
                )}`}
              >
                <Notification
                  className={`size-[20px] ${
                    selectedNotification?.Type === 1
                      ? "text-green-600"
                      : selectedNotification?.Type === 2
                        ? "text-yellow-600"
                        : selectedNotification?.Type === 3
                          ? "text-red-600"
                          : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-secondary-950">
                  {selectedNotification?.Title}
                </h3>
                <p className="text-[12px] text-secondary-400 font-normal mt-1">
                  {toJalaliDateTime(selectedNotification?.CreatedDate ?? "")}
                </p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div
                className="text-[15px] text-secondary-700"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </ModalBody>
            <ModalFooter className="border-none">
              {/* <CustomButton
                buttonVariant="outline"
                buttonSize="sm"
                onPress={onClose}
                className="text-secondary-700"
              >
                بستن
              </CustomButton>
              <CustomButton
                buttonVariant="primary"
                buttonSize="sm"
                onPress={handleUpdateIsRead}
                isLoading={isUpdating}
              >
                متوجه شدم
              </CustomButton> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
