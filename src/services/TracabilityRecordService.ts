import { createClient } from "@supabase/supabase-js";
import { useAuth } from "../contexts/AuthContext";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TraceabilityRecord {
  id?: string;
  template_id: string;
  template_title: string;
  template_category: string;
  classification?: string;
  process_code?: string;
  pharmacy_name: string;
  record_data: Record<string, any>;
  created_at?: string;
  created_by?: string;
}

export class TraceabilityRecordService {
  private static instance: TraceabilityRecordService;

  private constructor() {}

  public static getInstance(): TraceabilityRecordService {
    if (!TraceabilityRecordService.instance) {
      TraceabilityRecordService.instance = new TraceabilityRecordService();
    }
    return TraceabilityRecordService.instance;
  }

  async saveRecord(record: TraceabilityRecord): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("traceability_records")
        .insert([
          {
            template_id: record.template_id,
            template_title: record.template_title,
            template_category: record.template_category,
            classification: record.classification,
            process_code: record.process_code,
            pharmacy_name: record.pharmacy_name,
            record_data: record.record_data,
            created_by: record.created_by,
          },
        ])
        .select("id")
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Error saving record:", error);
      throw error;
    }
  }

  async getRecordsByTemplate(
    templateId: string
  ): Promise<TraceabilityRecord[]> {
    try {
      const { data, error } = await supabase
        .from("traceability_records")
        .select("*")
        .eq("template_id", templateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  }

  async getRecordsByDateRange(
    templateId: string,
    startDate: string,
    endDate: string,
    userEmail: string
  ): Promise<TraceabilityRecord[]> {
    try {
      // Ne pas filtrer par created_by pour les compilations mensuelles
      // car elles doivent inclure tous les enregistrements de la période
      const { data, error } = await supabase
        .from("traceability_records")
        .select("*")
        .eq("template_id", templateId)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching records by date range:", error);
      throw error;
    }
  }

  async getRecordsByMonth(
    templateId: string,
    year: number,
    month: number,
    userEmail: string
  ): Promise<TraceabilityRecord[]> {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

      return await this.getRecordsByDateRange(
        templateId,
        startDate,
        endDate,
        userEmail
      );
    } catch (error) {
      console.error("Error fetching records by month:", error);
      throw error;
    }
  }

  async getRecordCountsByMonth(
    year: number,
    month: number,
    userEmail: string
  ): Promise<Record<string, number>> {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

      // Ne pas filtrer par created_by pour compter tous les enregistrements
      // car certains ont created_by = "unknown"
      const { data, error } = await supabase
        .from("traceability_records")
        .select("template_id")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      if (error) throw error;

      // Count records by template_id
      const counts: Record<string, number> = {};
      data?.forEach((record) => {
        counts[record.template_id] = (counts[record.template_id] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error("Error fetching record counts by month:", error);
      throw error;
    }
  }

  async getAllRecordsByMonth(
    year: number,
    month: number,
    pharmacyName?: string
  ): Promise<TraceabilityRecord[]> {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

      let query = supabase
        .from("traceability_records")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: true });

      if (pharmacyName) {
        query = query.eq("pharmacy_name", pharmacyName);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching all records by month:", error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("traceability_records")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting record:", error);
      throw error;
    }
  }

  async getAllTemplateCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("traceability_records")
        .select("template_category")
        .order("template_category");

      if (error) throw error;

      const categories = new Set(data?.map((r) => r.template_category) || []);
      return Array.from(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getRecordStats(pharmacyName?: string): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byMonth: Record<string, number>;
  }> {
    try {
      let query = supabase
        .from("traceability_records")
        .select("template_category, created_at");

      if (pharmacyName) {
        query = query.eq("pharmacy_name", pharmacyName);
      }

      const { data, error } = await query;

      if (error) throw error;

      const byCategory: Record<string, number> = {};
      const byMonth: Record<string, number> = {};

      data?.forEach((record) => {
        byCategory[record.template_category] =
          (byCategory[record.template_category] || 0) + 1;

        const monthKey = new Date(record.created_at).toLocaleDateString(
          "fr-FR",
          {
            year: "numeric",
            month: "long",
          }
        );
        byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
      });

      return {
        total: data?.length || 0,
        byCategory,
        byMonth,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  }
}

export const traceabilityRecordService =
  TraceabilityRecordService.getInstance();
