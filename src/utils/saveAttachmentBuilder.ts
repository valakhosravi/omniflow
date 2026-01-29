import { AttachmentDetails } from "@/services/commonApi/commonApi.type";

export interface SaveProcessAttachmentModel {
  InstanceId: string;
  ProcessName: string;
  IsStart: boolean;
  AttachmentDetails: AttachmentDetails[];
}

export const buildSaveProcessAttachmentFormData = (
  data: SaveProcessAttachmentModel
) => {
  const formData = new FormData();

  formData.append("InstanceId", data.InstanceId);
  formData.append("ProcessName", data.ProcessName);
  formData.append("IsStart", String(data.IsStart));

  data.AttachmentDetails.forEach((att, index) => {
    formData.append(`AttachmentDetails[${index}].Title`, att.Title);
    formData.append(
      `AttachmentDetails[${index}].AttachmentKey`,
      att.AttachmentKey
    );
    formData.append(
      `AttachmentDetails[${index}].AttachmentFile`,
      att.AttachmentFile
    ); // REAL FILE
  });

  return formData;
};
