import jsPDF from "jspdf";
import { supabase } from "../lib/supabase";

export interface MonthlyCompilationData {
  month: number;
  year: number;
  pharmacyName: string;
  registryType:
    | "equipment-lifecycle"
    | "hygiene-tracking"
    | "premises-cleaning";
  records: any[];
}

class MonthlyCompilationService {
  async getRecordsByMonth(
    registryType: string,
    month: number,
    year: number
  ): Promise<any[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { data, error } = await supabase
      .from("traceability_records")
      .select("*")
      .eq("template_id", registryType)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching records:", error);
      throw error;
    }

    return data || [];
  }

  async generateMonthlyCompilation(
    compilationData: MonthlyCompilationData
  ): Promise<void> {
    const doc = new jsPDF();
    const { month, year, pharmacyName, registryType, records } =
      compilationData;

    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const registryTitles: Record<string, string> = {
      "equipment-lifecycle": "Registre de vie des équipements",
      "hygiene-tracking": "Registre de suivi de l'hygiène du personnel",
      "premises-cleaning": "Registre de l'entretien des locaux et toilettes",
    };

    // En-tête
    doc.setFontSize(18);
    doc.text("COMPILATION MENSUELLE", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text(registryTitles[registryType] || "Registre", 105, 30, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text(`${monthNames[month - 1]} ${year}`, 105, 40, { align: "center" });

    doc.setFontSize(10);
    doc.text(pharmacyName, 105, 50, { align: "center" });

    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    let yPosition = 65;

    if (records.length === 0) {
      doc.setFontSize(11);
      doc.text("Aucune entrée pour ce mois", 105, yPosition, {
        align: "center",
      });
    } else {
      doc.setFontSize(11);
      doc.text(`Nombre total d'entrées : ${records.length}`, 20, yPosition);
      yPosition += 10;

      // Affichage des enregistrements
      records.forEach((record, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Entrée ${index + 1}`, 20, yPosition);
        yPosition += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        const recordData = record.record_data;
        const date = new Date(record.created_at).toLocaleDateString("fr-FR");
        doc.text(`Date : ${date}`, 25, yPosition);
        yPosition += 5;

        // Affichage des champs selon le type de registre
        Object.entries(recordData).forEach(([key, value]) => {
          if (key === "pharmacyName") return; // Skip pharmacy name as it's in header

          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          const displayValue =
            typeof value === "object"
              ? JSON.stringify(value)
              : String(value || "-");
          const lines = doc.splitTextToSize(
            `${this.formatFieldName(key)} : ${displayValue}`,
            160
          );

          lines.forEach((line: string) => {
            doc.text(line, 25, yPosition);
            yPosition += 5;
          });
        });

        yPosition += 5;
        doc.setLineWidth(0.1);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 5;
      });
    }

    // Pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Compilation générée le ${new Date().toLocaleDateString(
          "fr-FR"
        )} - Page ${i}/${pageCount}`,
        105,
        290,
        { align: "center" }
      );
    }

    // Téléchargement
    const fileName = `Compilation_${registryType}_${
      monthNames[month - 1]
    }_${year}.pdf`;
    doc.save(fileName);
  }

  private formatFieldName(fieldName: string): string {
    const fieldMap: Record<string, string> = {
      date: "Date",
      equipmentType: "Type d'équipement",
      equipmentID: "ID équipement",
      eventType: "Type d'événement",
      description: "Description",
      cost: "Coût",
      operator: "Opérateur",
      personnelName: "Nom du personnel",
      hygieneType: "Type de contrôle",
      laundryDate: "Date de lavage",
      conformity: "Conformité",
      observations: "Observations",
      controller: "Contrôleur",
      zone: "Zone",
      cleaningType: "Type de nettoyage",
      products: "Produits utilisés",
      cleaner: "Agent d'entretien",
    };

    return fieldMap[fieldName] || fieldName;
  }
}

export const monthlyCompilationService = new MonthlyCompilationService();
