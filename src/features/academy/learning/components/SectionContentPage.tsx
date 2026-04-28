"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import {
  useGetCourseByIdQuery,
  useGetSeasonByIdQuery,
  useGetSectionByIdQuery,
  useGetSectionsBySeasonIdQuery,
} from "../learning.services";
import type { SectionDto } from "../learning.types";

type SectionComment = {
  id: number;
  text: string;
  createdAt: string;
};

function getSectionMedia(sectionData: unknown): {
  url: string | null;
  mimeType: string | null;
} {
  const data = (sectionData ?? {}) as Record<string, unknown>;
  const rawUrl =
    (typeof data.FileUrl === "string" && data.FileUrl) ||
    (typeof data.MediaUrl === "string" && data.MediaUrl) ||
    (typeof data.Url === "string" && data.Url) ||
    null;

  const attachmentAddress =
    typeof data.AttachmentAddress === "string" ? data.AttachmentAddress : null;

  let resolvedUrl = rawUrl;
  if (!resolvedUrl && attachmentAddress) {
    if (attachmentAddress.startsWith("http")) {
      resolvedUrl = attachmentAddress;
    } else if (typeof window !== "undefined") {
      resolvedUrl = `${window.location.origin}/uploads/${attachmentAddress}`;
    }
  }

  const mimeType =
    (typeof data.ContentType === "string" && data.ContentType) ||
    (typeof data.FileType === "string" && data.FileType) ||
    (typeof data.MimeType === "string" && data.MimeType) ||
    null;

  return { url: resolvedUrl, mimeType };
}

function isPdf(url: string | null, mimeType: string | null): boolean {
  return !!mimeType?.includes("pdf") || !!url?.toLowerCase().endsWith(".pdf");
}

function isVideo(url: string | null, mimeType: string | null): boolean {
  return (
    !!mimeType?.startsWith("video/") ||
    !!url?.match(/\.(mp4|webm|mov|avi|mkv)$/i)
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function SectionContentPage() {
  const router = useRouter();
  const params = useParams<{ courseId: string; seasonId: string; sectionId: string }>();
  const courseId = Number(params.courseId);
  const seasonId = Number(params.seasonId);
  const sectionId = Number(params.sectionId);

  const { data: courseData } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const { data: seasonData } = useGetSeasonByIdQuery(seasonId, { skip: !seasonId });
  const { data: sectionData, isLoading: isSectionLoading } = useGetSectionByIdQuery(
    sectionId,
    { skip: !sectionId },
  );
  const { data: sectionsData } = useGetSectionsBySeasonIdQuery(seasonId, {
    skip: !seasonId,
  });

  const courseTitle = courseData?.Data?.Title ?? "...";
  const seasonTitle = seasonData?.Data?.Title ?? "...";
  const sectionTitle = sectionData?.Data?.Title ?? "...";

  const sortedSections = useMemo(
    () =>
      [...(sectionsData?.Data ?? [])].sort(
        (a, b) =>
          ((a as unknown as Record<string, number>).OrderNumber ?? 0) -
          ((b as unknown as Record<string, number>).OrderNumber ?? 0),
      ),
    [sectionsData],
  );

  const currentIndex = sortedSections.findIndex((s) => s.SectionId === sectionId);
  const prevSection = currentIndex > 0 ? sortedSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < sortedSections.length - 1
      ? sortedSections[currentIndex + 1]
      : null;

  const breadcrumbs: BreadcrumbsItem[] = [
    { Name: "خانه", Href: "/" },
    { Name: "دوره‌ها", Href: "/academy/learning/courses" },
    { Name: `فصل‌های ${courseTitle}`, Href: `/academy/learning/courses/${courseId}/seasons` },
    {
      Name: `بخش‌های ${seasonTitle}`,
      Href: `/academy/learning/courses/${courseId}/seasons/${seasonId}/sections`,
    },
    {
      Name: `${sectionTitle}`,
      Href: `/academy/learning/courses/${courseId}/seasons/${seasonId}/sections/${sectionId}`,
    },
  ];

  const [comments, setComments] = useState<SectionComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSavedSecondRef = useRef(0);

  const { url: mediaUrl, mimeType } = getSectionMedia(sectionData?.Data);
  const showPdf = isPdf(mediaUrl, mimeType);
  const showVideo = isVideo(mediaUrl, mimeType);
  const progressPercent =
    videoDuration > 0 ? Math.min(100, (watchedSeconds / videoDuration) * 100) : 0;
  const progressStorageKey = `learning-video-progress-${sectionId}`;

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;
    setComments((prev) => [
      {
        id: Date.now(),
        text,
        createdAt: new Date().toLocaleString("fa-IR"),
      },
      ...prev,
    ]);
    setNewComment("");
  };

  const goToSection = (target: SectionDto) => {
    router.push(
      `/academy/learning/courses/${courseId}/seasons/${seasonId}/sections/${target.SectionId}`,
    );
  };

  const handleVideoLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    setVideoDuration(video.duration || 0);
    setWatchedSeconds(0);
    lastSavedSecondRef.current = 0;

    const savedProgress = Number(localStorage.getItem(progressStorageKey) ?? 0);
    if (savedProgress > 0) {
      const resumeTime = Math.min(savedProgress, Math.max(0, (video.duration || 0) - 1));
      video.currentTime = resumeTime;
      setWatchedSeconds(resumeTime);
      lastSavedSecondRef.current = Math.floor(resumeTime);
    }
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const currentSecond = Math.floor(video.currentTime);
    setWatchedSeconds(video.currentTime);

    if (currentSecond !== lastSavedSecondRef.current) {
      localStorage.setItem(progressStorageKey, String(currentSecond));
      lastSavedSecondRef.current = currentSecond;
    }
  };

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-semibold text-xl/[28px] text-secondary-950">
          محتوای بخش {sectionTitle}
        </h1>
        <AppButton
          label="بازگشت به فصل"
          color="secondary"
          variant="outline"
          onClick={() => router.push(`/academy/learning/courses/${courseId}/seasons`)}
        />
      </div>

      <div className="rounded-xl border border-secondary-100 bg-secondary-0 p-4 mb-6">
        {isSectionLoading ? (
          <div className="text-sm/[20px] text-secondary-500">در حال بارگذاری محتوا...</div>
        ) : !mediaUrl ? (
          <div className="text-sm/[20px] text-secondary-500">
            برای این بخش هنوز فایل ویدیویی یا PDF ثبت نشده است.
          </div>
        ) : showVideo ? (
          <div>
            <video
              ref={videoRef}
              className="w-full rounded-lg bg-black max-h-[560px]"
              controls
              src={mediaUrl}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onTimeUpdate={handleVideoTimeUpdate}
            />
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm/[20px] text-secondary-700">
                <span>
                  میزان مشاهده: {formatTime(watchedSeconds)} از {formatTime(videoDuration)}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary-100">
                <div
                  className="h-2 rounded-full bg-primary-500 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : showPdf ? (
          <iframe
            title={`pdf-${sectionId}`}
            src={mediaUrl}
            className="w-full h-[70vh] rounded-lg border border-secondary-100"
          />
        ) : (
          <div className="text-sm/[20px] text-secondary-500">
            فرمت این فایل در حال حاضر قابل نمایش نیست.
          </div>
        )}
      </div>

      <div className="mb-8 flex items-center justify-between gap-3">
        <AppButton
          label="بخش قبلی"
          icon="ArrowRight2"
          disabled={!prevSection}
          onClick={() => prevSection && goToSection(prevSection)}
        />
        <AppButton
          label="بخش بعدی"
          icon="ArrowLeft2"
          iconPos="right"
          disabled={!nextSection}
          onClick={() => nextSection && goToSection(nextSection)}
        />
      </div>

      <div className="rounded-xl border border-secondary-100 bg-secondary-0 p-4">
        <div className="flex items-center gap-2 mb-4">
          <AppIcon name="MessageText" size={18} />
          <h2 className="font-semibold text-[16px]/[24px] text-secondary-950">دیدگاه‌ها</h2>
        </div>

        <form onSubmit={handleSubmitComment} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full min-h-[100px] rounded-xl border border-secondary-200 p-3 text-sm/[20px] outline-none focus:border-primary-300"
            placeholder="نظر خود را درباره این بخش بنویسید..."
          />
          <div className="mt-3">
            <AppButton type="submit" label="ثبت دیدگاه" />
          </div>
        </form>

        {comments.length === 0 ? (
          <div className="text-sm/[20px] text-secondary-500">
            هنوز دیدگاهی ثبت نشده است.
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-secondary-100 bg-secondary-50 p-3"
              >
                <div className="text-sm/[20px] text-secondary-900">{comment.text}</div>
                <div className="text-xs/[18px] text-secondary-500 mt-1">
                  {comment.createdAt}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
