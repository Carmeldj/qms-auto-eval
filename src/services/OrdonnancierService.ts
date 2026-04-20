import jsPDF from "jspdf";
import { OrdonnancierEntry, TRIMESTRES } from "../types/ordonnancier";
import {
  generateDocumentCode,
  getCategoryByCode,
  getProcessForCategory,
} from "../data/documentClassification";
import { signatureGenerator } from "./SignatureGenerator";
import { uploadAndSaveDocument } from "../utils/documentUploadHelper";
import { downloadPDFBlob } from "../utils/pdfUploadHelper";
import { DocumentAccessLevel, DocumentStatus } from "../types/documents";

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Supabase configuration missing:", { url, key: !!key });
    throw new Error(
      "Configuration Supabase manquante. Veuillez redémarrer le serveur de développement.",
    );
  }

  return { url, key };
};

class OrdonnancierService {
  async generateTrimesterReportPDF(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacyInitials?: string,
    pharmacistName?: string,
    signatureImage?: string,
    stampImage?: string,
  ): Promise<Blob> {
    const pdf = this.createTrimesterPDF(
      entries,
      trimestre,
      annee,
      pharmacieName,
      pharmacyInitials,
      pharmacistName,
      signatureImage,
      stampImage,
    );
    return pdf.output("blob");
  }

  async generateTrimesterPDF(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacyInitials?: string,
    pharmacistName?: string,
    signatureImage?: string,
    stampImage?: string,
  ): Promise<void> {
    const pdf = this.createTrimesterPDF(
      entries,
      trimestre,
      annee,
      pharmacieName,
      pharmacyInitials,
      pharmacistName,
      signatureImage,
      stampImage,
    );
    const fileName = `rapport_ordonnancier_T${trimestre}_${annee}.pdf`;
    const blob = pdf.output("blob");

    try {
      await uploadAndSaveDocument(blob, fileName, {
        title: `Rapport Ordonnancier T${trimestre} ${annee}`,
        type: "Ordonnancier",
        category: "Ordonnancier",
        description: `Rapport trimestriel ordonnancier T${trimestre} ${annee} - ${pharmacieName}`,
        author: pharmacistName || pharmacieName,
        version: "1.0",
        accessLevel: DocumentAccessLevel.RESTRICTED,
        status: DocumentStatus.ACTIVE,
        tags: ["ordonnancier", `T${trimestre}`, String(annee)],
      });
    } catch (error) {
      console.error("Error uploading ordonnancier report:", error);
    }

    downloadPDFBlob(blob, fileName);
  }

  createTrimesterPDF(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacyInitials?: string,
    pharmacistName?: string,
    signatureImage?: string,
    stampImage?: string,
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
      "Agence Nationale de Régulation Pharmaceutique",
      pageWidth / 2,
      yPosition,
      { align: "center" },
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
      `Période: ${dateDebut.toLocaleDateString("fr-FR")} au ${dateFin.toLocaleDateString("fr-FR")}`,
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );
    yPosition += 6;

    // Classification Badge (code 11.02 for Ordonnancier)
    if (pharmacyInitials) {
      const categoryInfo = getCategoryByCode("11.02");
      const processInfo = categoryInfo
        ? getProcessForCategory("11.02")
        : undefined;

      if (categoryInfo && processInfo) {
        const classificationCode = generateDocumentCode(
          pharmacyInitials,
          processInfo.code,
          "11.02",
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
          { align: "center" },
        );
        yPosition += 4;
        pdf.text(categoryInfo.name, pageWidth / 2, yPosition, {
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

    const colWidths = [10, 15, 20, 25, 18, 25, 25, 20, 12, 15, 25, 15];
    const headers = [
      "N°",
      "PRESCRIPTION\nDISPENSATION",
      "DATE",
      "PRESCRIPTEUR\n(NOM ET N°\nINSCRIPTION À\nL'ORDRE\nCONTACT)",
      "QUALITÉ DU\nPRESCRIPTEUR",
      "FORMATION\nSANITAIRE\nAYANT\nL'ORDONNANCE",
      "PRESCRIPTION\nSPÉCIALITÉS\nDCI ET\nPRÉSENTATION",
      "PRESCRIPTION\nFORME\nGALÉNIQUE ET\nDOSAGE",
      "RESTE\n(à livrer)",
      "QUANTITÉ\nDÉLIVRÉE",
      "NOM ET CONTACT DU\nMALADE OU DE LA\nPERSONNE\nMANDATÉE PAR LE\nDISPENSATEUR",
      "PRIX\nUNITAIRE\n(FCFA)",
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
          { align: "center" },
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
              { align: "center" },
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

      const prescInfo = `${entry.prescripteur.nomPrenoms}\n${entry.prescripteur.numeroOrdre}\n${entry.prescripteur.contact || ""}`;
      const produitInfo = `${entry.produit.specialiteDCI}\n${entry.produit.presentation || ""}`;
      const formeInfo = `${entry.produit.formeGalenique || ""}\n${entry.produit.dosage || ""}`;
      const patientInfo = `${entry.patient.nomPrenoms}\n${entry.patient.contact || ""}`;

      const rowData = [
        entry.numeroOrdre.toString(),
        "PRESCRIPTION",
        `${new Date(entry.datePrescription).toLocaleDateString("fr-FR")}\n${new Date(entry.dateDispensation).toLocaleDateString("fr-FR")}`,
        prescInfo,
        entry.prescripteur.qualite || "",
        entry.formationSanitaire || "",
        produitInfo,
        formeInfo,
        entry.produit.resteALivrer.toString(),
        entry.produit.quantiteDelivree.toString(),
        patientInfo,
        `${entry.prixUnitaire} F`,
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
      yPosition,
    );
    yPosition += 5;

    // Afficher le nom du pharmacien si fourni (en tant qu'image)
    if (pharmacistName) {
      try {
        const nameImage = signatureGenerator.generateTextImage(
          `Pharmacien: ${pharmacistName}`,
          120,
          15,
          9,
        );
        pdf.addImage(
          nameImage,
          "PNG",
          margin,
          yPosition - 3,
          60,
          5,
          undefined,
          "FAST",
        );
        yPosition += 5;
      } catch (error) {
        console.error("Error generating pharmacist name image:", error);
        // Fallback au texte si erreur
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text(`Pharmacien: ${pharmacistName}`, margin, yPosition);
        yPosition += 5;
      }
    }

    // Afficher signature et cachet
    if (signatureImage || stampImage) {
      const signatureWidth = 30;
      const signatureHeight = 10;
      const stampSize = 20;

      // Signature à gauche
      if (signatureImage) {
        try {
          pdf.addImage(
            signatureImage,
            "PNG",
            margin,
            yPosition,
            signatureWidth,
            signatureHeight,
            undefined,
            "FAST",
          );
        } catch (error) {
          console.error("Error adding signature:", error);
        }
      }

      // Cachet à droite de la signature
      if (stampImage) {
        try {
          const stampX = margin + (signatureImage ? signatureWidth + 5 : 0);
          pdf.addImage(
            stampImage,
            "PNG",
            stampX,
            yPosition,
            stampSize,
            stampSize,
            undefined,
            "FAST",
          );
        } catch (error) {
          console.error("Error adding stamp:", error);
        }
      }

      yPosition += Math.max(signatureHeight, stampSize);
    } else {
      // Rectangle vide si pas de signature/cachet
      pdf.setLineWidth(0.3);
      pdf.setDrawColor(180, 180, 180);
      pdf.rect(margin, yPosition, 50, 25);
      yPosition += 25;
    }

    yPosition = pageHeight - 20;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Contact:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    yPosition += 4;
    pdf.text(
      "Veuillez contacter votre agence nationale du médicament pour plus d'informations",
      margin,
      yPosition,
    );

    return pdf;
  }

  generatePDFBase64(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacyInitials?: string,
    pharmacistName?: string,
    signatureImage?: string,
    stampImage?: string,
  ): string {
    const pdf = this.createTrimesterPDF(
      entries,
      trimestre,
      annee,
      pharmacieName,
      pharmacyInitials,
      pharmacistName,
      signatureImage,
      stampImage,
    );
    return pdf.output("datauristring").split(",")[1];
  }

  generateTrimesterExcel(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
  ): Blob {
    const trimestreInfo = TRIMESTRES.find((t) => t.numero === trimestre);
    const dateDebut = new Date(annee, (trimestre - 1) * 3, 1);
    const dateFin = new Date(annee, trimestre * 3, 0);

    let csvContent = "\uFEFF";

    csvContent += `RÉPUBLIQUE DU BÉNIN\n`;
    csvContent += `MINISTÈRE DE LA SANTÉ\n`;
    csvContent += `Agence Nationale de Régulation Pharmaceutique\n`;
    csvContent += `\n`;
    csvContent += `ANNEXE 1 - CARNET D'ORDONNANCIER\n`;
    csvContent += `${trimestreInfo?.label} ${annee}\n`;
    csvContent += `Période: ${dateDebut.toLocaleDateString("fr-FR")} au ${dateFin.toLocaleDateString("fr-FR")}\n`;
    csvContent += `\n`;
    csvContent += `Pharmacie: ${pharmacieName}\n`;
    csvContent += `Total de délivrances: ${entries.length}\n`;
    csvContent += `\n`;

    csvContent +=
      [
        "N°",
        "PRESCRIPTION/DISPENSATION",
        "Date Prescription",
        "Date Dispensation",
        "Prescripteur",
        "N° Ordre Prescripteur",
        "Contact Prescripteur",
        "Qualité Prescripteur",
        "Formation Sanitaire",
        "Spécialités DCI",
        "Présentation",
        "Forme Galénique",
        "Dosage",
        "Reste à livrer",
        "Quantité Délivrée",
        "Patient/Mandataire",
        "Contact Patient",
        "Prix Unitaire (FCFA)",
      ].join(";") + "\n";

    entries.forEach((entry) => {
      const row = [
        entry.numeroOrdre.toString(),
        "PRESCRIPTION",
        new Date(entry.datePrescription).toLocaleDateString("fr-FR"),
        new Date(entry.dateDispensation).toLocaleDateString("fr-FR"),
        `"${entry.prescripteur.nomPrenoms.replace(/"/g, '""')}"`,
        `"${entry.prescripteur.numeroOrdre.replace(/"/g, '""')}"`,
        `"${(entry.prescripteur.contact || "").replace(/"/g, '""')}"`,
        `"${(entry.prescripteur.qualite || "").replace(/"/g, '""')}"`,
        `"${(entry.formationSanitaire || "").replace(/"/g, '""')}"`,
        `"${entry.produit.specialiteDCI.replace(/"/g, '""')}"`,
        `"${(entry.produit.presentation || "").replace(/"/g, '""')}"`,
        `"${(entry.produit.formeGalenique || "").replace(/"/g, '""')}"`,
        `"${(entry.produit.dosage || "").replace(/"/g, '""')}"`,
        entry.produit.resteALivrer.toString(),
        entry.produit.quantiteDelivree.toString(),
        `"${entry.patient.nomPrenoms.replace(/"/g, '""')}"`,
        `"${(entry.patient.contact || "").replace(/"/g, '""')}"`,
        entry.prixUnitaire.toString(),
      ];
      csvContent += row.join(";") + "\n";
    });

    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  }

  async downloadTrimesterExcel(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
  ): Promise<void> {
    const blob = this.generateTrimesterExcel(
      entries,
      trimestre,
      annee,
      pharmacieName,
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rapport_ordonnancier_T${trimestre}_${annee}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  generateExcelBase64(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = this.generateTrimesterExcel(
        entries,
        trimestre,
        annee,
        pharmacieName,
      );
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async sendTrimesterReport(
    entries: OrdonnancierEntry[],
    trimestre: number,
    annee: number,
    pharmacieName: string,
    pharmacieEmail: string,
    pharmacyInitials?: string,
    pharmacistName?: string,
    signatureImage?: string,
    stampImage?: string,
  ): Promise<void> {
    try {
      const { url, key } = getSupabaseConfig();
      const pdfBase64 = this.generatePDFBase64(
        entries,
        trimestre,
        annee,
        pharmacieName,
        pharmacyInitials,
        pharmacistName,
        signatureImage,
        stampImage,
      );
      const excelBase64 = await this.generateExcelBase64(
        entries,
        trimestre,
        annee,
        pharmacieName,
      );

      const response = await fetch(
        `${url}/functions/v1/send-ordonnancier-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            trimestre,
            annee,
            pharmacieName,
            pharmacieEmail,
            totalEntries: entries.length,
            pdfBase64,
            excelBase64,
          }),
        },
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de l'envoi de l'email");
      }

      await fetch(`${url}/rest/v1/ordonnancier_reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${key}`,
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
