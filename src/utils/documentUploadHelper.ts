import { uploadFile } from "../api/upload";
import { documentApi, DocumentResponse } from "../api/documents";
import {
  CreateDocumentDto,
  DocumentAccessLevel,
  DocumentStatus,
} from "../types/documents";

/**
 * Helper function to format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Interface for document metadata used during upload
 */
export interface DocumentUploadMetadata {
  title: string;
  type: string;
  category: string;
  description: string;
  author: string;
  version?: string;
  accessLevel?: DocumentAccessLevel;
  status?: DocumentStatus;
  tags?: string[];
}

/**
 * Upload a PDF blob to the server and save document metadata
 */
export const uploadAndSaveDocument = async (
  blob: Blob,
  fileName: string,
  metadata: DocumentUploadMetadata
): Promise<DocumentResponse> => {
  try {
    // Create File object from blob
    const pdfFile = new File([blob], fileName, {
      type: "application/pdf",
    });

    // Upload the PDF file to the server
    const uploadedFilePath = await uploadFile(pdfFile, "documents");

    // Get actual file size
    const actualFileSize = formatFileSize(blob.size);

    // Prepare document DTO for API
    const documentDto: CreateDocumentDto = {
      title: metadata.title,
      type: metadata.type,
      category: metadata.category,
      description: metadata.description,
      author: metadata.author,
      version: metadata.version || "1.0",
      accessLevel: metadata.accessLevel || DocumentAccessLevel.RESTRICTED,
      status: metadata.status || DocumentStatus.DRAFT,
      tags: metadata.tags || [],
      filePath: uploadedFilePath,
      fileSize: actualFileSize,
      fileType: "application/pdf",
      downloadCount: 0,
    };

    // Send to API
    const createdDocument = await documentApi.createDocument(documentDto);
    console.log("Document created successfully:", createdDocument);

    return createdDocument;
  } catch (error) {
    console.error("Error uploading and saving document:", error);
    throw new Error(
      `Failed to upload and save document: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
