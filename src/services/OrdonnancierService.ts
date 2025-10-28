import jsPDF from "jspdf";
import { OrdonnancierEntry, TRIMESTRES } from "../types/ordonnancier";
import {
  generateDocumentCode,
  getCategoryByCode,
  getProcessForCategory,
} from "../data/documentClassification";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class OrdonnancierService {
  async generateTrimesterPDF(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacyInitials?: string
  ): Promise<any> {
    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    const trimestreInfo = TRIMESTRES.find((t) => t.numero === trimestre);
    const dateDebut = new Date(annee, (trimestre - 1) * 3, 1);
    const dateFin = new Date(annee, trimestre * 3, 0);

    pdf.setTextColor(0, 0, 0);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("RÉPUBLIQUE DU BÉNIN", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 6;

    pdf.setFontSize(12);
    pdf.text("MINISTÈRE DE LA SANTÉ", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 6;

    pdf.setFontSize(11);
    pdf.text(
      "ABMed - Agence Béninoise du Médicament",
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 8;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("ANNEXE 1 - CARNET D'ORDONNANCIER", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${trimestreInfo?.label} ${annee}`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;
    pdf.text(
      `Période: ${dateDebut.toLocaleDateString(
        "fr-FR"
      )} au ${dateFin.toLocaleDateString("fr-FR")}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 6;

    // Classification Badge (code 11.02 for Ordonnancier)
    if (pharmacyInitials) {
      const categoryInfo = getCategoryByCode("11.02");
      const processInfo = categoryInfo
        ? getProcessForCategory("11.02")
        : undefined;

      if (processInfo) {
        const classificationCode = generateDocumentCode(
          pharmacyInitials,
          processInfo.code,
          "11.02"
        );

        // Badge with classification code
        pdf.setFillColor(224, 242, 241);
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        const badgeWidth = 70;
        const badgeHeight = 12;
        const badgeX = (pageWidth - badgeWidth) / 2;
        pdf.roundedRect(badgeX, yPosition, badgeWidth, badgeHeight, 2, 2, "FD");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0, 150, 136);
        pdf.text(classificationCode, pageWidth / 2, yPosition + 8, {
          align: "center",
        });
        yPosition += badgeHeight + 5;

        // Description of classification
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);
        pdf.text(
          `Processus ${processInfo.code}: ${processInfo.name}`,
          pageWidth / 2,
          yPosition,
          { align: "center" }
        );
        yPosition += 4;
        pdf.text(categoryInfo?.name ?? "", pageWidth / 2, yPosition, {
          align: "center",
        });
        yPosition += 7;

        pdf.setTextColor(0, 0, 0);
      }
    }

    yPosition += 2;

    pdf.setFontSize(10);
    pdf.text(`Pharmacie: ${pharmacieName}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Total de délivrances: ${entries.length}`, margin, yPosition);
    yPosition += 8;

    const colWidths = [12, 32, 25, 18, 18, 28, 18, 45, 20, 20];
    const headers = [
      "Numéro",
      "Désignation du produit\n(Nom, forme\npharmaceutique et\nprésentation)",
      "Dénomination\ncommune\ninternationale",
      "Quantité",
      "Unité\n(plaquette,\nboite,\nampoule)",
      "Prix",
      "Prescripteur",
      "Formation sanitaire ayant prescrite",
      "Date de\nprescription",
      "Date de\ndispensation",
    ];

    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    let xPosition = margin;

    headers.forEach((header, i) => {
      const lines = header.split("\n");
      const lineHeight = 3.5;
      const startY = yPosition + 3;

      lines.forEach((line, lineIndex) => {
        pdf.text(
          line,
          xPosition + colWidths[i] / 2,
          startY + lineIndex * lineHeight,
          { align: "center" }
        );
      });

      pdf.rect(xPosition, yPosition, colWidths[i], 20);
      xPosition += colWidths[i];
    });

    yPosition += 20;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);

    // @ts-ignore
    entries.forEach((entry, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;

        pdf.setFillColor(230, 230, 230);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, "F");
        xPosition = margin;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        headers.forEach((header, i) => {
          const lines = header.split("\n");
          const lineHeight = 3.5;
          const startY = yPosition + 3;
          lines.forEach((line, lineIndex) => {
            pdf.text(
              line,
              xPosition + colWidths[i] / 2,
              startY + lineIndex * lineHeight,
              { align: "center" }
            );
          });
          pdf.rect(xPosition, yPosition, colWidths[i], 20);
          xPosition += colWidths[i];
        });
        yPosition += 20;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
      }

      const rowHeight = 12;
      xPosition = margin;

      const rowData = [
        entry.numeroOrdre.toString(),
        entry.produit.nature,
        "",
        entry.produit.quantite.toString(),
        entry.produit.dose || "",
        `${entry.prixVente} F`,
        entry.prescripteur.nomPrenoms,
        entry.patient.adresse || "",
        new Date(entry.dateDelivrance).toLocaleDateString("fr-FR"),
        new Date(entry.dateDelivrance).toLocaleDateString("fr-FR"),
      ];

      rowData.forEach((data, i) => {
        const lines = pdf.splitTextToSize(data, colWidths[i] - 2);
        pdf.text(lines, xPosition + 1, yPosition + 4);
        pdf.rect(xPosition, yPosition, colWidths[i], rowHeight);
        xPosition += colWidths[i];
      });

      yPosition += rowHeight;
    });

    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "Signature et cachet du pharmacien responsable:",
      margin,
      yPosition
    );
    yPosition += 10;
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(180, 180, 180);
    pdf.rect(margin, yPosition, 50, 25);

    yPosition = pageHeight - 20;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Contact ABMed:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    yPosition += 4;
    pdf.text(
      "Tél: (229) 01 51 45 79 87 | Email: contact.abmed@gouv.bj",
      margin,
      yPosition
    );
    yPosition += 4;
    pdf.text(
      "Adresse: Guinkomey, rue 108, Cotonou, Bénin | Site web: www.abmed.bj",
      margin,
      yPosition
    );

    const fileName = `ordonnancier-T${trimestre}-${annee}.pdf`;
    const pdfBlob = pdf.output("blob");
    return { blob: pdfBlob, fileName };
  }

  generatePDFBase64(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacyInitials?: string
  ): string {
    const pdf = this.createTrimesterPDF(
      entries,
      trimestre,
      annee,
      pharmacieName,
      pharmacyInitials
    );
    return pdf.output("datauristring").split(",")[1];
  }

  private createTrimesterPDF(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacyInitials?: string
  ): jsPDF {
    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    const trimestreInfo = TRIMESTRES.find((t) => t.numero === trimestre);
    const dateDebut = new Date(annee, (trimestre - 1) * 3, 1);
    const dateFin = new Date(annee, trimestre * 3, 0);

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("RÉPUBLIQUE DU BÉNIN", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 6;
    pdf.setFontSize(12);
    pdf.text("MINISTÈRE DE LA SANTÉ", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 6;
    pdf.setFontSize(11);
    pdf.text(
      "ABMed - Agence Béninoise du Médicament",
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.text("ANNEXE 1 - CARNET D'ORDONNANCIER", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 6;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${trimestreInfo?.label} ${annee}`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;
    pdf.text(
      `Période: ${dateDebut.toLocaleDateString(
        "fr-FR"
      )} au ${dateFin.toLocaleDateString("fr-FR")}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 6;

    // Classification Badge (code 11.02 for Ordonnancier)
    if (pharmacyInitials) {
      const categoryInfo = getCategoryByCode("11.02");
      const processInfo = categoryInfo
        ? getProcessForCategory("11.02")
        : undefined;

      if (processInfo) {
        const classificationCode = generateDocumentCode(
          pharmacyInitials,
          processInfo.code,
          "11.02"
        );

        // Badge with classification code
        pdf.setFillColor(224, 242, 241);
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        const badgeWidth = 70;
        const badgeHeight = 12;
        const badgeX = (pageWidth - badgeWidth) / 2;
        pdf.roundedRect(badgeX, yPosition, badgeWidth, badgeHeight, 2, 2, "FD");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0, 150, 136);
        pdf.text(classificationCode, pageWidth / 2, yPosition + 8, {
          align: "center",
        });
        yPosition += badgeHeight + 5;

        // Description of classification
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);
        pdf.text(
          `Processus ${processInfo.code}: ${processInfo.name}`,
          pageWidth / 2,
          yPosition,
          { align: "center" }
        );
        yPosition += 4;
        pdf.text(categoryInfo?.name ?? "", pageWidth / 2, yPosition, {
          align: "center",
        });
        yPosition += 7;

        pdf.setTextColor(0, 0, 0);
      }
    }

    yPosition += 2;

    pdf.setFontSize(10);
    pdf.text(`Pharmacie: ${pharmacieName}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Total de délivrances: ${entries.length}`, margin, yPosition);
    yPosition += 8;

    const colWidths = [12, 32, 25, 18, 18, 28, 18, 45, 20, 20];
    const headers = [
      "Numéro",
      "Désignation du produit\n(Nom, forme\npharmaceutique et\nprésentation)",
      "Dénomination\ncommune\ninternationale",
      "Quantité",
      "Unité\n(plaquette,\nboite,\nampoule)",
      "Prix",
      "Prescripteur",
      "Formation sanitaire ayant prescrite",
      "Date de\nprescription",
      "Date de\ndispensation",
    ];

    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    let xPosition = margin;

    headers.forEach((header, i) => {
      const lines = header.split("\n");
      const lineHeight = 3.5;
      const startY = yPosition + 3;
      lines.forEach((line, lineIndex) => {
        pdf.text(
          line,
          xPosition + colWidths[i] / 2,
          startY + lineIndex * lineHeight,
          { align: "center" }
        );
      });
      pdf.rect(xPosition, yPosition, colWidths[i], 20);
      xPosition += colWidths[i];
    });

    yPosition += 20;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);

    entries.forEach((entry) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
        pdf.setFillColor(230, 230, 230);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, "F");
        xPosition = margin;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        headers.forEach((header, i) => {
          const lines = header.split("\n");
          const lineHeight = 3.5;
          const startY = yPosition + 3;
          lines.forEach((line, lineIndex) => {
            pdf.text(
              line,
              xPosition + colWidths[i] / 2,
              startY + lineIndex * lineHeight,
              { align: "center" }
            );
          });
          pdf.rect(xPosition, yPosition, colWidths[i], 20);
          xPosition += colWidths[i];
        });
        yPosition += 20;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
      }

      const rowHeight = 12;
      xPosition = margin;
      const rowData = [
        entry.numeroOrdre.toString(),
        entry.produit.nature,
        "",
        entry.produit.quantite.toString(),
        entry.produit.dose || "",
        `${entry.prixVente} F`,
        entry.prescripteur.nomPrenoms,
        entry.patient.adresse || "",
        new Date(entry.dateDelivrance).toLocaleDateString("fr-FR"),
        new Date(entry.dateDelivrance).toLocaleDateString("fr-FR"),
      ];

      rowData.forEach((data, i) => {
        const lines = pdf.splitTextToSize(data, colWidths[i] - 2);
        pdf.text(lines, xPosition + 1, yPosition + 4);
        pdf.rect(xPosition, yPosition, colWidths[i], rowHeight);
        xPosition += colWidths[i];
      });

      yPosition += rowHeight;
    });

    return pdf;
  }

  async sendTrimesterReport(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacieEmail: string,
    pharmacyInitials?: string
  ): Promise<void> {
    try {
      const pdfBase64 = this.generatePDFBase64(
        entries,
        trimestre,
        annee,
        pharmacieName,
        pharmacyInitials
      );

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/send-ordonnancier-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            trimestre,
            annee,
            pharmacieName,
            pharmacieEmail,
            totalEntries: entries.length,
            pdfBase64,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de l'envoi de l'email");
      }

      await fetch(`${SUPABASE_URL}/rest/v1/ordonnancier_reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          trimestre,
          annee,
          date_debut: new Date(annee, (trimestre - 1) * 3, 1)
            .toISOString()
            .split("T")[0],
          date_fin: new Date(annee, trimestre * 3, 0)
            .toISOString()
            .split("T")[0],
          pharmacie_nom: pharmacieName,
          total_entries: entries.length,
          email_sent: true,
          email_sent_at: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error sending report:", error);
      throw error;
    }
  }
}

export const ordonnancierService = new OrdonnancierService();
