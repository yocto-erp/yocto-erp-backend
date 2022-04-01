export const MIME_TYPE = {
  PDF: "application/pdf",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  DOC: "application/msword",
  DOCX:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  AUDIO: "audio/*",
  IMAGE: "image/*",
  TEXT: "text/*",
  ZIP: "application/zip",
  CSV: "text/csv",
  PPTX:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  PPT: "application/vnd.ms-powerpoint",
  VIDEO: "video/*",
  FILE: "file",
  FOLDER: "folder"
};

export function isImageMimeType(str) {
  const regex = new RegExp(/^image+\/[-\w.]+$/, "gm");
  return regex.test(str)
}

function matchRuleShort(rule) {
  const escapeRegex = (objStr) => objStr.replace(/([.*+?^=!:${}()|[]\/\\])/g, "\\$1");
  return new RegExp(`^${rule.split("*").map(escapeRegex).join(".*")  }$`, "gm");
}

export function isValidMimeType(str, listMimeType) {
  let rs = false;
  for (let i = 0; i < listMimeType.length; i += 1) {
    const regex = matchRuleShort(listMimeType[i]);
    rs = regex.test(str)
    if (rs) {
      break;
    }
  }

  return rs;
}
