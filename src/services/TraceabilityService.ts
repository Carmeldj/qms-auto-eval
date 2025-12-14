import { TraceabilityTemplate } from "../types/traceability";
import {
  traceabilityRecordService,
  TraceabilityRecord,
} from "./TracabilityRecordService";
import jsPDF from "jspdf";
import { signatureGenerator } from "./SignatureGenerator";
import { missingProductsService } from "./MissingProductsService";
import { generateUploadAndDownloadPDF } from "../utils/pdfUploadHelper";
import { DocumentAccessLevel, DocumentStatus } from "../types/documents";

export class TraceabilityService {
  private static instance: TraceabilityService;

  private constructor() {}

  public static getInstance(): TraceabilityService {
    if (!TraceabilityService.instance) {
      TraceabilityService.instance = new TraceabilityService();
    }
    return TraceabilityService.instance;
  }

  private generateInitials(pharmacyName: string): string {
    if (!pharmacyName) return "XXX";

    const words = pharmacyName
      .toUpperCase()
      .replace(/[^A-Z\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (words.length === 1) {
      return words[0].substring(0, 3);
    }

    if (words.length === 2) {
      return words[0].charAt(0) + words[1].substring(0, 2);
    }

    return words
      .slice(0, 3)
      .map((word) => word.charAt(0))
      .join("");
  }

  public async generatePDF(
    template: TraceabilityTemplate,
    record: any,
    userEmail?: string
  ): Promise<any> {
    try {
      // Sauvegarder dans Supabase
      const savedRecord: TraceabilityRecord = {
        template_id: template.id,
        template_title: template.title,
        template_category: template.category,
        classification: template.classification,
        process_code: template.processCode,
        pharmacy_name: record.data.pharmacyName || "Non renseigné",
        record_data: record.data,
        created_by: userEmail || "unknown",
      };

      await traceabilityRecordService.saveRecord(savedRecord);

      // Si c'est un registre de produits manquants, sauvegarder aussi dans la table dédiée
      if (template.id === "missing-products-tracking" && userEmail) {
        await missingProductsService.saveMissingProduct({
          user_email: userEmail,
          pharmacy_name: record.data.pharmacyName,
          date: record.data.date,
          time: record.data.time,
          product_name: record.data.productName,
          dosage: record.data.dosage,
          quantity: record.data.quantity,
          unit_price: parseFloat(record.data.unitPrice) || 0,
          total_lost: parseFloat(record.data.totalLost) || 0,
          customer_type: record.data.customerType,
          customer_contact: record.data.customerContact,
          has_ordered: record.data.hasOrdered,
          supplier_name: record.data.supplierName,
          expected_delivery: record.data.expectedDelivery,
          reason: record.data.reason,
          observations: record.data.observations,
          recorded_by: record.data.recordedBy,
        });
      }

      // Générer le PDF
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      const pharmacyInitials = this.generateInitials(
        record.data.pharmacyName || ""
      );
      const fullClassificationCode =
        template.classification && template.processCode
          ? `${pharmacyInitials}/${template.processCode}/${template.classification}`
          : "Non classifie";

      // En-tête - SANS FOND DE COULEUR
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("REGISTRE OFFICIEL DE TRAÇABILITE", pageWidth / 2, 15, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const documentTitle = record.data._customTitle || template.title;
      pdf.text(documentTitle.toUpperCase(), pageWidth / 2, 23, {
        align: "center",
      });

      pdf.setFontSize(9);
      pdf.text(`Code: ${fullClassificationCode}`, pageWidth / 2, 30, {
        align: "center",
      });

      yPos = 38;

      // Informations en haut
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      const infoLine1 = `Pharmacie: ${
        record.data.pharmacyName || "Non renseigne"
      }`;
      const infoLine2 = `Date: ${new Date(record.createdAt).toLocaleDateString(
        "fr-FR"
      )} - Heure: ${new Date(record.createdAt).toLocaleTimeString("fr-FR")}`;
      const infoLine3 = `No enregistrement: ${record.id}`;

      pdf.text(infoLine1, margin, yPos);
      pdf.text(infoLine2, pageWidth / 2, yPos, { align: "center" });
      pdf.text(infoLine3, pageWidth - margin, yPos, { align: "right" });

      yPos += 8;

      // Ligne séparatrice
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Filtrer les champs (exclure pharmacyName qui est déjà affiché)
      const fieldsToDisplay = template.fields.filter(
        (f) => f.id !== "pharmacyName"
      );

      // Format tableau horizontal comme la compilation mensuelle
      const tableWidth = pageWidth - 2 * margin;
      const colWidth = tableWidth / fieldsToDisplay.length;
      const headerRowHeight = 10;
      const minDataRowHeight = 7;
      const lineHeight = 3.5; // Hauteur d'une ligne de texte

      // En-têtes du tableau (TITRES DES COLONNES) - SANS FOND
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");

      let xPos = margin;

      // Calculer la hauteur maximale nécessaire pour les en-têtes
      let maxHeaderLines = 1;
      fieldsToDisplay.forEach((field) => {
        const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);
        maxHeaderLines = Math.max(maxHeaderLines, labelLines.length);
      });
      const adjustedHeaderHeight = Math.max(
        headerRowHeight,
        maxHeaderLines * 4 + 2
      );

      fieldsToDisplay.forEach((field) => {
        pdf.rect(xPos, yPos, colWidth, adjustedHeaderHeight);

        // Diviser le texte pour qu'il tienne dans la cellule
        const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);

        // Centrer verticalement le texte
        const textStartY =
          yPos + (adjustedHeaderHeight - labelLines.length * 4) / 2 + 3;

        labelLines.forEach((line: string, index: number) => {
          pdf.text(line, xPos + colWidth / 2, textStartY + index * 4, {
            align: "center",
            maxWidth: colWidth - 3,
          });
        });

        xPos += colWidth;
      });

      yPos += adjustedHeaderHeight;

      // Ligne de données - SANS FOND - avec hauteur dynamique
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);

      // Calculer la hauteur nécessaire pour les données
      let maxDataLines = 1;
      fieldsToDisplay.forEach((field) => {
        const value = record.data[field.id] || "";
        const valueStr = String(value);
        const valueLines = pdf.splitTextToSize(valueStr, colWidth - 3);
        maxDataLines = Math.max(maxDataLines, valueLines.length);
      });

      // Hauteur dynamique basée sur le nombre de lignes
      const dataRowHeight = Math.max(
        minDataRowHeight,
        maxDataLines * lineHeight + 2
      );

      xPos = margin;

      fieldsToDisplay.forEach((field) => {
        pdf.rect(xPos, yPos, colWidth, dataRowHeight);

        const value = record.data[field.id] || "";
        const valueStr = String(value);
        const valueLines = pdf.splitTextToSize(valueStr, colWidth - 3);

        // Afficher toutes les lignes de texte
        valueLines.forEach((line: string, index: number) => {
          pdf.text(line, xPos + 1.5, yPos + 3 + index * lineHeight, {
            maxWidth: colWidth - 3,
          });
        });

        xPos += colWidth;
      });

      yPos += dataRowHeight + 10;

      // Section signatures
      if (yPos > pageHeight - 40) {
        pdf.addPage("a4", "landscape");
        yPos = margin;
      }

      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("VALIDATION ET SIGNATURES", margin, yPos);
      yPos += 8;

      // Helper function to add signature or initials with blue styled signature
      const addSignatureOrInitials = (
        x: number,
        y: number,
        name: string,
        signatureImage?: string,
        maxWidth: number = 25,
        maxHeight: number = 8
      ) => {
        if (signatureImage) {
          // Add signature image provided by user
          try {
            pdf.addImage(
              signatureImage,
              "PNG",
              x,
              y,
              maxWidth,
              maxHeight,
              undefined,
              "FAST"
            );
          } catch (error) {
            console.error("Failed to add signature image:", error);
            // Generate default signature as fallback
            const generatedSignature = signatureGenerator.generateSignature(
              name,
              maxWidth * 10,
              maxHeight * 10
            );
            try {
              pdf.addImage(
                generatedSignature,
                "PNG",
                x,
                y,
                maxWidth,
                maxHeight,
                undefined,
                "FAST"
              );
            } catch (err) {
              console.error("Failed to generate signature:", err);
            }
          }
        } else {
          // Generate default manuscript-style signature with blue color and decorative line
          try {
            const generatedSignature = signatureGenerator.generateSignature(
              name,
              maxWidth * 10,
              maxHeight * 10
            );
            pdf.addImage(
              generatedSignature,
              "PNG",
              x,
              y,
              maxWidth,
              maxHeight,
              undefined,
              "FAST"
            );
          } catch (error) {
            console.error("Failed to generate signature:", error);
            // Ultimate fallback: simple text
            const nameParts = name.trim().split(/\s+/);
            let signatureText = "";
            if (nameParts.length >= 2) {
              const lastName = nameParts[nameParts.length - 1];
              const firstNameInitial = nameParts[0][0].toUpperCase();
              signatureText = `${lastName} ${firstNameInitial}`;
            } else {
              signatureText = name;
            }
            pdf.setFont("times", "italic");
            pdf.setFontSize(10);
            pdf.setTextColor(0, 102, 204);
            pdf.text(signatureText, x + maxWidth / 2, y + maxHeight / 2 + 2, {
              align: "center",
            });
          }
        }
      };

      const signatureBoxWidth = (pageWidth - 2 * margin - 20) / 3;
      const signatureBoxHeight = 25;

      // Trois zones de signature avec données
      const signatureData = [
        { label: "Enregistre par:", data: record.signatures?.recorder },
        { label: "Verifie par:", data: record.signatures?.verifier },
        { label: "Approuve par:", data: record.signatures?.approver },
      ];

      xPos = margin;
      signatureData.forEach(({ label, data }, index) => {
        const isApprover = index === 2; // L'approbateur est le 3ème (index 2)

        pdf.setDrawColor(150, 150, 150);
        pdf.setLineWidth(0.3);
        pdf.rect(xPos, yPos, signatureBoxWidth, signatureBoxHeight);

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(label, xPos + 3, yPos + 5);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);

        if (data) {
          const dateStr = data.date
            ? new Date(data.date).toLocaleDateString("fr-FR")
            : "___/___/______";
          pdf.text(`Date: ${dateStr}`, xPos + 3, yPos + 11);
          pdf.text(`Nom: ${data.name || ""}`, xPos + 3, yPos + 16);

          if (data.name) {
            const signatureX = xPos + 3;
            const signatureY = yPos + 17;

            // Pour l'approbateur, ajouter signature + cachet côte à côte
            if (isApprover) {
              const signatureWidth = (signatureBoxWidth - 6) / 2 - 2;
              // Signature à gauche
              addSignatureOrInitials(
                signatureX,
                signatureY,
                data.name,
                data.signatureImage,
                signatureWidth,
                6
              );

              // Cachet à droite
              if (data.stampImage) {
                try {
                  pdf.addImage(
                    data.stampImage,
                    "PNG",
                    signatureX + signatureWidth + 4,
                    signatureY - 1,
                    8,
                    8,
                    undefined,
                    "FAST"
                  );
                } catch (error) {
                  console.error("Failed to add stamp image:", error);
                }
              }
            } else {
              // Pour les autres, signature normale
              addSignatureOrInitials(
                signatureX,
                signatureY,
                data.name,
                data.signatureImage,
                signatureBoxWidth - 6,
                6
              );
            }
          } else {
            pdf.text("Signature:", xPos + 3, yPos + 21);
          }
        } else {
          pdf.text("Date: ___/___/______", xPos + 3, yPos + 11);
          pdf.text("Nom:", xPos + 3, yPos + 16);
          pdf.text("Signature:", xPos + 3, yPos + 21);
        }

        xPos += signatureBoxWidth + 10;
      });

      yPos += signatureBoxHeight + 10;

      // Pied de page
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(120, 120, 120);
      pdf.text(
        "Ce document est conforme au Systeme de Management de la Qualite (SMQ) de l'officine",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      pdf.text(
        `PHARMA QMS v1.0 - Page 1 - ${new Date().toLocaleDateString("fr-FR")}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );

      // Générer le nom de fichier
      const safeTemplateTitle = template.title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const fileName = `registre-${safeTemplateTitle}-${
        new Date().toISOString().split("T")[0]
      }-${record.id}.pdf`;

      // Upload and download PDF
      await generateUploadAndDownloadPDF(pdf, fileName, {
        title: template.title,
        type: "Traçabilité",
        category: "Registres",
        description: `Registre de traçabilité: ${template.title}`,
        author: userEmail || "Système",
        version: "1.0",
        accessLevel: DocumentAccessLevel.RESTRICTED,
        status: DocumentStatus.DRAFT,
        tags: ["traçabilité", "registre", template.category],
      });

      const pdfBlob = pdf.output("blob");
      return { blob: pdfBlob, fileName };
    } catch (error) {
      console.error("Error generating traceability PDF:", error);
      throw new Error(
        `Erreur lors de la generation du PDF: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  }

  public async generateMonthlyCompilation(
    template: TraceabilityTemplate,
    year: number,
    month: number,
    pharmacyName?: string,
    userEmail?: string
  ): Promise<any> {
    try {
      // Récupérer tous les enregistrements du mois
      const records = await traceabilityRecordService.getRecordsByMonth(
        template.id,
        year,
        month,
        userEmail || ""
      );

      if (records.length === 0) {
        alert("Aucun enregistrement trouvé pour cette période");
        return;
      }

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      const pharmacyInitials = this.generateInitials(
        pharmacyName || records[0].pharmacy_name
      );
      const fullClassificationCode =
        template.classification && template.processCode
          ? `${pharmacyInitials}/${template.processCode}/${template.classification}`
          : "Non classifie";

      // En-tête - SANS FOND DE COULEUR
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        "COMPILATION MENSUELLE - REGISTRE DE TRAÇABILITE",
        pageWidth / 2,
        15,
        { align: "center" }
      );

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(template.title.toUpperCase(), pageWidth / 2, 23, {
        align: "center",
      });

      pdf.setFontSize(9);
      const monthName = new Date(year, month - 1).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
      pdf.text(
        `Periode: ${monthName} | Code: ${fullClassificationCode}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      yPos = 38;

      // Informations
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Pharmacie: ${pharmacyName || records[0].pharmacy_name}`,
        margin,
        yPos
      );
      pdf.text(
        `Nombre d'enregistrements: ${records.length}`,
        pageWidth - margin,
        yPos,
        { align: "right" }
      );

      yPos += 8;

      // Ligne séparatrice
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Préparer les données du tableau
      const fieldsToDisplay = template.fields.filter(
        (f) => f.id !== "pharmacyName"
      );
      const tableWidth = pageWidth - 2 * margin;
      const colWidth = tableWidth / (fieldsToDisplay.length + 1); // +1 pour la colonne date
      const headerRowHeight = 10;
      const minDataRowHeight = 7;
      const lineHeight = 3.5;

      // Calculer la hauteur maximale nécessaire pour les en-têtes
      let maxHeaderLines = 1;
      fieldsToDisplay.forEach((field) => {
        const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);
        maxHeaderLines = Math.max(maxHeaderLines, labelLines.length);
      });
      const adjustedHeaderHeight = Math.max(
        headerRowHeight,
        maxHeaderLines * 4 + 2
      );

      // En-têtes du tableau - SANS FOND DE COULEUR
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");

      let xPos = margin;

      // Colonne Date
      pdf.rect(xPos, yPos, colWidth, adjustedHeaderHeight);
      pdf.text(
        "DATE",
        xPos + colWidth / 2,
        yPos + adjustedHeaderHeight / 2 + 2,
        { align: "center" }
      );
      xPos += colWidth;

      // Autres colonnes avec titres complets
      fieldsToDisplay.forEach((field) => {
        pdf.rect(xPos, yPos, colWidth, adjustedHeaderHeight);

        // Diviser le texte pour qu'il tienne dans la cellule
        const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);

        // Centrer verticalement le texte
        const textStartY =
          yPos + (adjustedHeaderHeight - labelLines.length * 4) / 2 + 3;

        labelLines.forEach((line: string, index: number) => {
          pdf.text(line, xPos + colWidth / 2, textStartY + index * 4, {
            align: "center",
            maxWidth: colWidth - 3,
          });
        });

        xPos += colWidth;
      });

      yPos += adjustedHeaderHeight;

      // Lignes de données - SANS FOND DE COULEUR
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);

      records.forEach((record, recordIndex) => {
        // Calculer la hauteur nécessaire pour cette ligne
        let maxDataLines = 1;
        fieldsToDisplay.forEach((field) => {
          const value = record.record_data[field.id] || "";
          const valueStr = String(value);
          const valueLines = pdf.splitTextToSize(valueStr, colWidth - 3);
          maxDataLines = Math.max(maxDataLines, valueLines.length);
        });

        const currentRowHeight = Math.max(
          minDataRowHeight,
          maxDataLines * lineHeight + 2
        );

        if (yPos + currentRowHeight > pageHeight - 30) {
          pdf.addPage("a4", "landscape");
          yPos = margin;

          // Réafficher les en-têtes sur la nouvelle page - SANS FOND
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.3);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(7);
          pdf.setFont("helvetica", "bold");

          xPos = margin;
          pdf.rect(xPos, yPos, colWidth, adjustedHeaderHeight);
          pdf.text(
            "DATE",
            xPos + colWidth / 2,
            yPos + adjustedHeaderHeight / 2 + 2,
            { align: "center" }
          );
          xPos += colWidth;

          fieldsToDisplay.forEach((field) => {
            pdf.rect(xPos, yPos, colWidth, adjustedHeaderHeight);
            const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);

            const textStartY =
              yPos + (adjustedHeaderHeight - labelLines.length * 4) / 2 + 3;

            labelLines.forEach((line: string, index: number) => {
              pdf.text(line, xPos + colWidth / 2, textStartY + index * 4, {
                align: "center",
                maxWidth: colWidth - 3,
              });
            });

            xPos += colWidth;
          });

          yPos += adjustedHeaderHeight;
        }

        xPos = margin;

        // Définir le texte noir pour les données - SANS FOND
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);

        // Date
        pdf.rect(xPos, yPos, colWidth, currentRowHeight);
        const dateStr = new Date(record.created_at!).toLocaleDateString(
          "fr-FR"
        );
        pdf.text(dateStr, xPos + 1.5, yPos + 3);
        xPos += colWidth;

        // Données avec hauteur dynamique
        fieldsToDisplay.forEach((field) => {
          pdf.rect(xPos, yPos, colWidth, currentRowHeight);

          const value = record.record_data[field.id] || "";
          const valueStr = String(value);
          const valueLines = pdf.splitTextToSize(valueStr, colWidth - 3);

          // Afficher toutes les lignes de texte
          valueLines.forEach((line: string, index: number) => {
            pdf.text(line, xPos + 1.5, yPos + 3 + index * lineHeight, {
              maxWidth: colWidth - 3,
            });
          });

          xPos += colWidth;
        });

        yPos += currentRowHeight;
      });

      // Pied de page
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(120, 120, 120);
        pdf.text(
          `Compilation mensuelle - ${monthName}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
        pdf.text(
          `PHARMA QMS v1.0 - Page ${i}/${totalPages} - ${new Date().toLocaleDateString(
            "fr-FR"
          )}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      }

      const fileName = `compilation-${template.id}-${year}-${String(
        month
      ).padStart(2, "0")}.pdf`;

      // Upload and download PDF
      await generateUploadAndDownloadPDF(pdf, fileName, {
        title: `Compilation mensuelle ${template.title}`,
        type: "Compilation",
        category: "Registres",
        description: `Compilation mensuelle pour ${template.title} - ${month}/${year}`,
        author: "Système",
        version: "1.0",
        accessLevel: DocumentAccessLevel.RESTRICTED,
        status: DocumentStatus.DRAFT,
        tags: ["compilation", "mensuel", template.category],
      });

      const pdfBlob = pdf.output("blob");
      return { blob: pdfBlob, fileName };
    } catch (error) {
      console.error("Error generating monthly compilation:", error);
      throw error;
    }
  }
}

export const traceabilityService = TraceabilityService.getInstance();
