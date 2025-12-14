import jsPDF from "jspdf";
import {
  uploadAndSaveDocument,
  DocumentUploadMetadata,
} from "./documentUploadHelper";
import { DocumentAccessLevel, DocumentStatus } from "../types/documents";

/**
 * Helper function to convert jsPDF to Blob
 */
export const jsPDFToBlob = (pdf: jsPDF): Blob => {
  return pdf.output("blob");
};

/**
 * Generate blob from jsPDF without saving
 */
export const generatePDFBlob = (
  pdf: jsPDF
): { blob: Blob; fileName: string } => {
  const blob = jsPDFToBlob(pdf);
  const fileName = `document_${Date.now()}.pdf`;
  return { blob, fileName };
};

/**
 * Save PDF locally (download)
 */
export const downloadPDF = (pdf: jsPDF, fileName: string): void => {
  pdf.save(fileName);
};

/**
 * Save PDF as blob with custom filename
 */
export const downloadPDFBlob = (blob: Blob, fileName: string): void => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

/**
 * Upload PDF blob and save to database
 */
export const uploadPDFToServer = async (
  blob: Blob,
  fileName: string,
  metadata: Partial<DocumentUploadMetadata>
): Promise<void> => {
  const defaultMetadata: DocumentUploadMetadata = {
    title: metadata.title || "Document généré",
    type: metadata.type || "PDF",
    category: metadata.category || "Général",
    description: metadata.description || "Document généré automatiquement",
    author: metadata.author || "Système",
    version: metadata.version || "1.0",
    accessLevel: metadata.accessLevel || DocumentAccessLevel.RESTRICTED,
    status: metadata.status || DocumentStatus.DRAFT,
    tags: metadata.tags || [],
  };

  await uploadAndSaveDocument(blob, fileName, defaultMetadata);
};

/**
 * Complete workflow: Generate PDF, upload to server, and download locally
 */
export const generateUploadAndDownloadPDF = async (
  pdf: jsPDF,
  fileName: string,
  metadata: Partial<DocumentUploadMetadata>,
  options: {
    upload?: boolean;
    download?: boolean;
  } = { upload: true, download: true }
): Promise<{ blob: Blob; fileName: string }> => {
  // Generate blob from PDF
  const blob = jsPDFToBlob(pdf);

  try {
    // Upload to server if enabled
    if (options.upload !== false) {
      await uploadPDFToServer(blob, fileName, metadata);
    }

    // Download locally if enabled
    if (options.download !== false) {
      downloadPDFBlob(blob, fileName);
    }

    return { blob, fileName };
  } catch (error) {
    console.error("Error in PDF generation workflow:", error);
    // Still download locally even if upload fails
    if (options.download !== false) {
      downloadPDFBlob(blob, fileName);
    }
    throw error;
  }
};

/**
 * Interface for PDF generation result
 */
export interface PDFGenerationResult {
  blob: Blob;
  fileName: string;
  uploaded: boolean;
  downloaded: boolean;
}

/**
 * Advanced workflow with result tracking
 */
export const generatePDFWithTracking = async (
  pdf: jsPDF,
  fileName: string,
  metadata: Partial<DocumentUploadMetadata>,
  options: {
    upload?: boolean;
    download?: boolean;
  } = { upload: true, download: true }
): Promise<PDFGenerationResult> => {
  const blob = jsPDFToBlob(pdf);
  let uploaded = false;
  let downloaded = false;

  try {
    // Upload to server if enabled
    if (options.upload !== false) {
      await uploadPDFToServer(blob, fileName, metadata);
      uploaded = true;
    }

    // Download locally if enabled
    if (options.download !== false) {
      downloadPDFBlob(blob, fileName);
      downloaded = true;
    }

    return { blob, fileName, uploaded, downloaded };
  } catch (error) {
    console.error("Error in PDF generation with tracking:", error);
    // Still try to download locally even if upload fails
    if (options.download !== false && !downloaded) {
      try {
        downloadPDFBlob(blob, fileName);
        downloaded = true;
      } catch (downloadError) {
        console.error("Error downloading PDF:", downloadError);
      }
    }
    return { blob, fileName, uploaded, downloaded };
  }
};
