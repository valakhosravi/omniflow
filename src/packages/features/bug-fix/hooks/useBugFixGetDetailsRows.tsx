import {
  Document,
  Global,
  Link,
  MonitorMobbile,
  User,
  Warning2,
} from "iconsax-reactjs";
import { useGetBugInfoByRequestIdQuery } from "../api/BugFixApi";
import { useState } from "react";
import { priorityColors, priorityNames } from "../BugFix.const";
import { InfoRowProps } from "../BugFix.types";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";

const useGetRows = ({ requestId }: { requestId: string }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const { data: bugFixRequestData } = useGetBugInfoByRequestIdQuery(
    Number(requestId)
  );

  const generalInfoRows: InfoRowProps[] = [
    {
      icon: <Document size={16} />,
      title: "عنوان باگ",
      value: bugFixRequestData?.Data?.Title,
    },
    {
      icon: <Warning2 size={16} />,
      title: "اولویت باگ",
      value: bugFixRequestData?.Data?.Priority && (
        <div
          className={`${
            priorityColors[bugFixRequestData?.Data?.Priority]
          } px-4 py-1 rounded-[50px] font-[500] text-[14px]`}
        >
          <span className={priorityColors[bugFixRequestData?.Data?.Priority]}>
            {priorityNames[bugFixRequestData?.Data?.Priority]}
          </span>
        </div>
      ),
    },
    {
      icon: <MonitorMobbile size={16} />,
      title: "سامانه",
      value: bugFixRequestData?.Data?.FeatureName,
    },
    {
      icon: <Global size={16} />,
      title: "جزییات درخواست در سامانه",
      value: bugFixRequestData?.Data?.ApplicationName,
    },
    {
      icon: <User size={16} />,
      title: "توضیحات",
      value: bugFixRequestData?.Data?.Description,
      isTextArea: true,
    },
    {
      icon: <Link size={16} />,
      title: "لینک مربوط به مشکل",
      value: bugFixRequestData?.Data?.Link && (
        <a href={bugFixRequestData?.Data?.Link} target="_blank">
          <span className="text-primary-800 font-[500] text-[14px] underline">
            {bugFixRequestData?.Data?.Link}
          </span>
        </a>
      ),
      isTextArea: false,
    },
    {
      icon: <Document size={16} />,
      title: "پیوست‌ها",
      value: (
        <div className="flex flex-row gap-1">
          <AppFile
            requestId={requestId}
            files={files}
            setFiles={setFiles}
            enableUpload={false}
            featureName={FeatureNamesEnum.BUG_FIX}
          />
        </div>
      ),
      isTextArea: false,
    },
  ];
  const jiraRequirement = {
    JiraTitle: bugFixRequestData?.Data?.Title,
    JiraDescription: bugFixRequestData?.Data?.Description,
    priority: priorityNames[bugFixRequestData?.Data?.Priority!],
  };
  return { rows: generalInfoRows, jiraRequirement };
};

export default useGetRows;
