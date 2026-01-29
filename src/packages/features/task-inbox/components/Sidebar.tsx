import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Profile2User, Send2, Sms, TaskSquare } from "iconsax-reactjs";
import { Badge, useDisclosure } from "@/ui/NextUi";
import { Icon } from "@/ui/Icon";
import AddLabelDialog from "./AddLabelDialog";
import MenuItem from "./MenuItem";
import TagContextMenu from "./TagContextMenu";
import TagIcon from "./TagIcon";
import { useLabels } from "../hooks/useLabels";
import { useGetUnreadCountQuery } from "../api/ReadApi";

type MainMenuItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
  badge?: React.ReactNode;
};

const LABEL_ITEM_HEIGHT = 51;
const LABELS_PREVIEW_COUNT = 3;
const BADGE_CLASSNAMES = {
  badge:
    "min-w-[15px] h-[15px] text-[10px] top-[0px] left-[0px] bg-trash text-white flex items-center justify-center border-0",
};

const Header = () => (
  <div className="h-[105px] px-4 py-7 flex items-center gap-x-2 border-b border-color-neutral-100">
    <Image src="/pictures/pec-logo.svg" alt="PEC Logo" width={46} height={25} />
    <Link href="/" className="text-[12px] font-[600] text-primary-950">
      تجارت الکترونیک پارسیان
    </Link>
  </div>
);

export default function Sidebar() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { labels } = useLabels();
  const [editId, setEditId] = useState<number | undefined>(undefined);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const { data: unReadCount } = useGetUnreadCountQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const labelsData = labels?.Data ?? [];
  const unreadUserCount = unReadCount?.Data?.UserCount;
  const unreadGroupCount = unReadCount?.Data?.GroupCount;

  const renderUnreadBadge = useCallback(
    (count: number | undefined, icon: React.ReactNode) => (
      <Badge
        content={count}
        color="default"
        placement="top-left"
        size="sm"
        isInvisible={count === 0}
        classNames={BADGE_CLASSNAMES}
      >
        {icon}
      </Badge>
    ),
    [],
  );

  const mainMenuItems = useMemo<MainMenuItem[]>(
    () => [
      {
        title: "وظایف من",
        icon: renderUnreadBadge(unreadUserCount, <Sms variant="TwoTone" />),
        href: "/task-inbox/my-tasks",
      },
      {
        title: "وظایف گروه من",
        icon: renderUnreadBadge(
          unreadGroupCount,
          <Profile2User variant="TwoTone" />,
        ),
        href: "/task-inbox/group-tasks",
      },
      {
        title: "وظایف انجام شده",
        icon: <TaskSquare variant="TwoTone" />,
        href: "/task-inbox/completed-tasks",
      },
      {
        title: "درخواست‌های من",
        icon: <Send2 variant="TwoTone" />,
        href: "/task-inbox/requests",
      },
      {
        title: "یادآوری مجدد",
        icon: <Clock variant="TwoTone" />,
        href: "/task-inbox/snoozed",
      },
    ],
    [renderUnreadBadge, unreadGroupCount, unreadUserCount],
  );

  const handleOpenAddLabel = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleEditClick = useCallback(
    (id: number) => {
      setEditId(id);
      onOpen();
    },
    [onOpen],
  );

  const toggleShowLabels = useCallback(() => {
    setShowAllLabels((prev) => !prev);
  }, []);

  const labelListStyle = useMemo(() => {
    const maxItems = showAllLabels ? labelsData.length : LABELS_PREVIEW_COUNT;
    return { maxHeight: `${LABEL_ITEM_HEIGHT * maxItems}px` };
  }, [labelsData.length, showAllLabels]);

  const shouldShowLabelToggle = labelsData.length > LABELS_PREVIEW_COUNT;

  return (
    <>
      <Header />
      <div className="px-4 py-6 flex flex-col gap-y-3 mb-[116px]">
        {mainMenuItems.map((item) => (
          <MenuItem
            key={item.href}
            title={item.title}
            href={item.href}
            icon={item.icon}
            badge={item.badge ?? null}
          />
        ))}
      </div>

      <div
        className={`px-4 py-6 flex flex-col gap-y-3 transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center gap-x-2 py-[10px] px-[12px] text-primary-950 justify-between">
          <div className="text-[14px]">برچسب‌ها</div>
          <button
            onClick={handleOpenAddLabel}
            className="p-1 hover:bg-primary-100 cursor-pointer transition-colors rounded-full"
            aria-label="افزودن برچسب جدید"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 10H15"
                stroke="#1C3A63"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 15V5"
                stroke="#1C3A63"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div
          className="space-y-[12px] overflow-y-hidden transition-all duration-300 ease-in-out"
          style={labelListStyle}
        >
          {labelsData.map((label) => (
            <MenuItem
              key={label.LabelId}
              title={label.Name}
              icon={<TagIcon fill={label.ColorCode} />}
              showContextMenu={true}
              contextMenu={
                <TagContextMenu
                  deleteId={label.LabelId}
                  onEdit={() => handleEditClick(label.LabelId)}
                >
                  <button className="p-1 hover:bg-primary-100 cursor-pointer transition-colors rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 10.8333C10.4603 10.8333 10.8334 10.4602 10.8334 9.99999C10.8334 9.53975 10.4603 9.16666 10 9.16666C9.53978 9.16666 9.16669 9.53975 9.16669 9.99999C9.16669 10.4602 9.53978 10.8333 10 10.8333Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.8334 10.8333C15.8334 10.4602 15.4603 10.8333 15 10.8333C14.5398 10.8333 14.1667 10.4602 14.1667 9.99999C14.1667 9.53975 14.5398 9.16666 15 9.16666C15.4603 9.16666 15.8334 9.53975 15.8334 9.99999C15.8334 10.4602 15.8334 10.8333Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.16669 10.8333C4.16669 10.4602 3.7936 10.8333 3.33335 10.8333C2.87311 10.8333 2.50002 10.4602 2.50002 9.99999C2.50002 9.53975 2.87311 9.16666 3.33335 9.16666C3.7936 9.16666 4.16669 9.53975 4.16669 9.99999C4.16669 10.4602 4.16669 10.8333Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </TagContextMenu>
              }
            />
          ))}
        </div>
        {shouldShowLabelToggle && (
          <button
            className="flex gap-2 text-primary-950 text-[14px] items-center px-[12px] py-[10px] transition-transform cursor-pointer"
            onClick={toggleShowLabels}
          >
            <Icon
              name="arrowDown"
              className={`size-[20px] transition-transform duration-300 ${
                showAllLabels ? "rotate-180" : ""
              }`}
            />
            {showAllLabels ? "کمتر" : "بیشتر"}
          </button>
        )}
      </div>

      <AddLabelDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        editId={editId}
        onClose={onClose}
      />
    </>
  );
}
