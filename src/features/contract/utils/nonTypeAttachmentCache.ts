let nonTypeAttachmentFile: File | null = null;
let nonTypeAttachmentTitle = "";

export function setNonTypeAttachment(file: File | null, title?: string) {
  nonTypeAttachmentFile = file;
  nonTypeAttachmentTitle = title || file?.name || "";
}

export function getNonTypeAttachment() {
  return {
    file: nonTypeAttachmentFile,
    title: nonTypeAttachmentTitle,
  };
}

export function clearNonTypeAttachment() {
  nonTypeAttachmentFile = null;
  nonTypeAttachmentTitle = "";
}
