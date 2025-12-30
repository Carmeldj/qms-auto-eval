import { supabase } from "../lib/supabase";

export const uploadFile = async (
  file: File,
  directory: string
): Promise<string> => {
  try {
    const tenantId = localStorage.getItem("tenantId") || "default";
    const timestamp = Date.now();
    const fileName = `${tenantId}/${directory}/${timestamp}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading to Supabase Storage:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
