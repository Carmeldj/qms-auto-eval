import { api } from "../lib/axios";
import { CreateDocumentDto } from "../types/documents";

export interface DocumentResponse {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  tags: string[];
  author: string;
  version: string;
  expirationDate?: Date;
  accessLevel: string;
  status: string;
  filePath: string;
  fileSize: string;
  fileType: string;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const documentApi = {
  // Create a new document
  createDocument: async (
    documentDto: CreateDocumentDto
  ): Promise<DocumentResponse> => {
    try {
      const response = await api.post<DocumentResponse>(
        "/documents",
        documentDto,
        {
          headers: {
            "x-tenant-id": localStorage.getItem("tenantId"),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating document:", error);
      throw new Error(
        `Failed to create document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Get all documents
  getDocuments: async (): Promise<DocumentResponse[]> => {
    try {
      const response = await api.get<DocumentResponse[]>("/documents", {
        headers: {
          "x-tenant-id": localStorage.getItem("tenantId"),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw new Error(
        `Failed to fetch documents: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Get document by ID
  getDocumentById: async (id: string): Promise<DocumentResponse> => {
    try {
      const response = await api.get<DocumentResponse>(`/documents/${id}`, {
        headers: {
          "x-tenant-id": localStorage.getItem("tenantId"),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw new Error(
        `Failed to fetch document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Update document
  updateDocument: async (
    id: string,
    documentDto: Partial<CreateDocumentDto>
  ): Promise<DocumentResponse> => {
    try {
      const response = await api.put<DocumentResponse>(
        `/documents/${id}`,
        documentDto,
        {
          headers: {
            "x-tenant-id": localStorage.getItem("tenantId"),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating document:", error);
      throw new Error(
        `Failed to update document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    try {
      await api.delete(`/documents/${id}`, {
        headers: {
          "x-tenant-id": localStorage.getItem("tenantId"),
        },
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      throw new Error(
        `Failed to delete document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Upload document file
  uploadDocumentFile: async (
    file: File
  ): Promise<{ filePath: string; fileSize: string; fileType: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<{
        filePath: string;
        fileSize: string;
        fileType: string;
      }>("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(
        `Failed to upload file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
