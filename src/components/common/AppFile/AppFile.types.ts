import { Dispatch, SetStateAction } from "react";
import { FeatureNamesEnum } from "./AppFile.const";

export type AppFileUploadSectionPropsType = {
  setFiles: Dispatch<SetStateAction<FileType[]>>;
};

export type AppFilePropsType = ReviewFilePropsType | EditableFilePropsType;

export type ReviewFilePropsType = {
  enableUpload: false;
  requestId: string;
} & Omit<AppFileCommonPropsType, "isMultiple">;

export type EditableFilePropsType = {
  enableUpload: true;
  requestId?: string;
} & AppFileCommonPropsType;

export type AppFileCommonPropsType = {
  featureName: FeatureNamesEnum;
  files: FileType[];
  setFiles: Dispatch<SetStateAction<FileType[]>>;
  isMultiple: boolean;
};

export type AppFileReviewFileCardSectionPropsType = {
  file: FileType;
  featureName: FeatureNamesEnum;
  index: number;
  enableUpload: boolean;
  setFiles: Dispatch<SetStateAction<FileType[]>>;
};

export type FileType = {
  url: string;
  type?: string;
  name?: string;
  size?: number;
  file?: File;
  attachmentId?: number;
  AttachmentKey?: string;
  AttachmentAddress?: string;
};

export interface UploadedFile {
  url: string;
  type: string;
  name: string;
  size: number;
  isFromServer?: boolean;
  attachmentId?: number;
}
