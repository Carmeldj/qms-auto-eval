import {
  DocumentData,
  DocumentTemplate,
  CreateDocumentDto,
  DocumentAccessLevel,
  DocumentStatus,
} from "../types/documents";

export interface DocumentMappingOptions {
  filePath: string;
  fileSize: string;
  fileType: string;
  author?: string;
  version?: string;
  accessLevel?: DocumentAccessLevel;
  status?: DocumentStatus;
  tags?: string[];
  expirationDate?: Date;
}

export const mapDocumentToDto = (
  document: DocumentData,
  template: DocumentTemplate,
  options: DocumentMappingOptions
): CreateDocumentDto => {
  // Extract title from form data or use template title as fallback
  const title =
    document.data.title ||
    document.data.nom ||
    document.data.name ||
    template.title;

  // Extract description from form data or use template description
  const description =
    document.data.description || document.data.desc || template.description;

  return {
    title,
    type: template.category, // Using template category as type
    category: template.category,
    description,
    tags: options.tags || [],
    author: options.author || "Unknown Author",
    version: options.version || "1.0",
    expirationDate: options.expirationDate,
    accessLevel: options.accessLevel || DocumentAccessLevel.RESTRICTED,
    status: options.status || DocumentStatus.DRAFT,
    filePath: options.filePath,
    fileSize: options.fileSize,
    fileType: options.fileType,
    downloadCount: 0,
  };
};

// Helper function to get file size in a readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to determine file type from file path
export const getFileTypeFromPath = (filePath: string): string => {
  const extension = filePath.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "doc":
    case "docx":
      return "application/msword";
    case "txt":
      return "text/plain";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
};
