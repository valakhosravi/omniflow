"use client";

import { useEffect } from "react";
import AppFileUploadSection from "./AppFileUploadSection";
import { AppFilePropsType, FileType } from "./AppFile.types";
import AppFileReviewFileCardSection from "./AppFileReviewFileCardSection";
import { useGetAttachmentByRequestIdQuery } from "@/services/commonApi/commonApi";
import { getMimeTypeFromName } from "./AppFile.utils";

const AppFile = (props: AppFilePropsType) => {
  const { files, featureName, requestId, setFiles, enableUpload } = props;

  const { data: attachments } = useGetAttachmentByRequestIdQuery(
    Number(requestId),
    {
      skip: !requestId || isNaN(Number(requestId)) || Number(requestId) === 0,
    }
  );

  console.log({ attachments });
  useEffect(() => {
    if (!attachments || !attachments.Data || attachments.Data.length === 0)
      return;

    const loadFiles = async () => {
      if (attachments?.Data?.length) {
        const serverFiles: FileType[] = attachments.Data.map((a) => ({
          url: `${window.location.origin}/uploads/${a.AttachmentAddress}`,
          type: getMimeTypeFromName(a.AttachmentAddress),
          name: a.Title,
          AttachmentAddress: a.AttachmentAddress,
          attachmentId: a.AttachmentId,
          size: 0,
        }));

        setFiles(serverFiles);
      }
    };

    loadFiles();
  }, [attachments]);

  return (
    <div className="w-full mx-auto bg-transparent">
      {enableUpload === true &&
        (!props.isMultiple ? (
          files.length !== 1 && <AppFileUploadSection setFiles={setFiles} />
        ) : (
          <AppFileUploadSection setFiles={setFiles} />
        ))}
      {files.length > 0 && (
        <div className="flex flex-row space-x-2 space-y-2 my-4 ">
          {files.map((file, index) => (
            <div key={index}>
              <AppFileReviewFileCardSection
                enableUpload={enableUpload}
                file={file}
                index={index}
                setFiles={enableUpload ? setFiles : () => {}}
                featureName={featureName}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppFile;
