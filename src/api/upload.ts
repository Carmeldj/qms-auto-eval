import { api } from "../lib/axios";

export const uploadFile = async (
  file: File,
  directory: string
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`files/upload/${directory}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-tenant-id": localStorage.getItem("tenantId"),
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
