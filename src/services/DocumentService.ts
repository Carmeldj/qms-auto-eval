import { DocumentTemplate, DocumentData } from "../types/documents";
import jsPDF from "jspdf";

export class DocumentService {
  private static instance: DocumentService;

  private constructor() {}

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  private removeAccents(text: string): string {
    return text
      .replace(/[àáâãäå]/g, "a")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y")
      .replace(/[ç]/g, "c")
      .replace(/[ñ]/g, "n")
      .replace(/[ÀÁÂÃÄÅ]/g, "A")
      .replace(/[ÈÉÊË]/g, "E")
      .replace(/[ÌÍÎÏ]/g, "I")
      .replace(/[ÒÓÔÕÖ]/g, "O")
      .replace(/[ÙÚÛÜ]/g, "U")
      .replace(/[ÝŸ]/g, "Y")
      .replace(/[Ç]/g, "C")
      .replace(/[Ñ]/g, "N")
      .replace(/'/g, "'")
      .replace(/[""]/g, '"')
      .replace(/[–—]/g, "-");
  }

  public async generatePDF(
    template: DocumentTemplate,
    document: DocumentData
  ): Promise<void> {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const leftMargin = 25;
      const rightMargin = 20;
      const topMargin = 25;
      const bottomMargin = 30;
      let yPosition = topMargin;

      const addText = (
        text: string,
        fontSize: number = 12,
        isBold: boolean = false,
        color: string = "black",
        align: "left" | "center" | "right" = "left"
      ) => {
        const cleanText = this.removeAccents(text);

        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont("helvetica", "bold");
        } else {
          pdf.setFont("helvetica", "normal");
        }

        if (color === "teal") {
          pdf.setTextColor(0, 150, 136);
        } else if (color === "gray") {
          pdf.setTextColor(100, 100, 100);
        } else {
          pdf.setTextColor(0, 0, 0);
        }

        const textWidth = pageWidth - leftMargin - rightMargin;
        const lines = pdf.splitTextToSize(cleanText, textWidth);

        let xPosition = leftMargin;
        if (align === "center") {
          xPosition = pageWidth / 2;
        } else if (align === "right") {
          xPosition = pageWidth - rightMargin;
        }

        pdf.text(lines, xPosition, yPosition, {
          align: align === "left" ? undefined : align,
        });
        yPosition += lines.length * (fontSize * 0.4) + 5;

        if (yPosition > pageHeight - bottomMargin - 15) {
          addFooter();
          pdf.addPage();
          yPosition = topMargin;
        }
      };

      const addFooter = () => {
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);

        const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
        pdf.text(`Page ${pageNum}`, leftMargin, footerY);
        pdf.text(
          "PHARMA QMS - Systeme de Management de la Qualite",
          pageWidth - rightMargin,
          footerY,
          { align: "right" }
        );

        pdf.setTextColor(0, 0, 0);
      };

      const addSection = (title: string) => {
        yPosition += 15;
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        pdf.line(
          leftMargin,
          yPosition - 5,
          pageWidth - rightMargin,
          yPosition - 5
        );

        addText(title, 16, true, "teal");
        yPosition += 8;
      };

      const addSeparatorLine = () => {
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        pdf.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
        yPosition += 10;
      };

      // En-tête du document
      yPosition = topMargin;
      addText("DOCUMENT OFFICIEL PHARMA QMS", 24, true, "teal", "center");
      yPosition += 5;
      addText(template.title.toUpperCase(), 18, true, "black", "center");
      yPosition += 10;

      // Ligne décorative
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(1);
      pdf.line(
        leftMargin + 50,
        yPosition,
        pageWidth - rightMargin - 50,
        yPosition
      );
      yPosition += 15;

      // Informations du document
      addSection("INFORMATIONS DU DOCUMENT");

      const docInfo = [
        ["Type de document:", template.title],
        ["Categorie:", template.category],
        [
          "Date de creation:",
          new Date(document.createdAt).toLocaleDateString("fr-FR"),
        ],
        [
          "Heure de creation:",
          new Date(document.createdAt).toLocaleTimeString("fr-FR"),
        ],
        ["Numero de document:", document.id],
        ["Pharmacie:", document.data.pharmacyName || "Non renseigne"],
      ];

      docInfo.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(label, leftMargin, yPosition);

        pdf.setFont("helvetica", "normal");
        pdf.text(value, leftMargin + 60, yPosition);
        yPosition += 8;
      });

      addSeparatorLine();

      // Contenu spécifique selon le type de document
      if (template.id === "organization-chart") {
        await this.generateOrganizationChart(document, addText, addSection);
      } else {
        // Contenu générique pour les autres documents
        addSection("CONTENU DU DOCUMENT");

        template.fields.forEach((field) => {
          const value = document.data[field.id] || "Non renseigne";

          // Encadré pour chaque champ important
          if (field.type === "textarea" || field.required) {
            pdf.setDrawColor(240, 240, 240);
            pdf.setFillColor(250, 250, 250);

            const fieldHeight = field.type === "textarea" ? 25 : 15;
            pdf.roundedRect(
              leftMargin - 5,
              yPosition - 5,
              pageWidth - leftMargin - rightMargin + 10,
              fieldHeight,
              3,
              3,
              "F"
            );
          }

          addText(`${field.label}:`, 12, true, "teal");

          if (field.type === "textarea") {
            addText(value, 11);
          } else {
            addText(value, 11);
          }

          yPosition += 8;
        });
      }

      // Section de validation
      addSection("VALIDATION ET SIGNATURES");

      // Cadres pour signatures
      const signatureBoxHeight = 30;
      const signatureBoxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;

      // Signature responsable
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(leftMargin, yPosition, signatureBoxWidth, signatureBoxHeight);
      pdf.text("Etabli par:", leftMargin + 5, yPosition + 10);
      pdf.text("Date: _______________", leftMargin + 5, yPosition + 18);
      pdf.text("Signature:", leftMargin + 5, yPosition + 26);

      // Signature vérificateur
      pdf.rect(
        leftMargin + signatureBoxWidth + 10,
        yPosition,
        signatureBoxWidth,
        signatureBoxHeight
      );
      pdf.text(
        "Verifie par:",
        leftMargin + signatureBoxWidth + 15,
        yPosition + 10
      );
      pdf.text(
        "Date: _______________",
        leftMargin + signatureBoxWidth + 15,
        yPosition + 18
      );
      pdf.text(
        "Signature:",
        leftMargin + signatureBoxWidth + 15,
        yPosition + 26
      );

      yPosition += signatureBoxHeight + 15;

      // Informations de traçabilité
      addSection("TRACABILITE");
      addText(
        `Document genere le: ${new Date().toLocaleDateString(
          "fr-FR"
        )} a ${new Date().toLocaleTimeString("fr-FR")}`,
        10,
        false,
        "gray"
      );
      addText(`Systeme: PHARMA QMS - Module Documents v1.0`, 10, false, "gray");
      addText(`Identifiant unique: ${document.id}`, 10, false, "gray");

      // Ajouter le pied de page à toutes les pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);

        pdf.text(`Page ${i}/${totalPages}`, leftMargin, footerY);
        pdf.text(
          "PHARMA QMS - Systeme de Management de la Qualite",
          pageWidth - rightMargin,
          footerY,
          { align: "right" }
        );
      }

      // Générer le nom de fichier sécurisé
      const safeTemplateTitle = template.title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const fileName = `document-${safeTemplateTitle}-${
        new Date().toISOString().split("T")[0]
      }-${document.id}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating document PDF:", error);
      throw new Error(
        `Erreur lors de la generation du PDF: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  }

  async generatePDFBlob(
    template: DocumentTemplate,
    document: DocumentData
  ): Promise<{ blob: Blob; fileName: string }> {
    try {
      const pdf = new jsPDF();
      let yPosition = 20;

      // Configuration des couleurs et styles
      const primaryColor = [0, 150, 136]; // Teal
      const secondaryColor = [96, 125, 139]; // Blue Grey
      const textColor = [33, 33, 33]; // Dark Grey

      // Helper functions
      const addText = (
        text: string,
        fontSize: number = 12,
        isBold: boolean = false,
        color: string = "black"
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");

        switch (color) {
          case "teal":
            pdf.setTextColor(...primaryColor);
            break;
          case "grey":
            pdf.setTextColor(...secondaryColor);
            break;
          default:
            pdf.setTextColor(...textColor);
        }

        const lines = pdf.splitTextToSize(text, 170);
        pdf.text(lines, 20, yPosition);
        yPosition += lines.length * (fontSize * 0.4) + 5;
      };

      const addSection = (title: string) => {
        yPosition += 10;
        pdf.setFillColor(...primaryColor);
        pdf.rect(15, yPosition - 8, 180, 12, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, 20, yPosition);
        yPosition += 15;
        pdf.setTextColor(...textColor);
      };

      // En-tête du document
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, 210, 40, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("PHARMA QMS", 20, 20);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Système de Management de la Qualité", 20, 30);

      yPosition = 60;

      // Titre du document
      addText(template.title, 18, true, "teal");
      addText(`Catégorie: ${template.category}`, 12, false, "grey");
      addText(
        `Date de création: ${new Date().toLocaleDateString("fr-FR")}`,
        10,
        false,
        "grey"
      );

      yPosition += 10;

      // Traitement spécial pour l'organigramme
      if (template.category === "Organigramme") {
        await this.generateOrganizationChart(document, addText, addSection);
      } else {
        // Génération standard des champs
        addSection("INFORMATIONS DU DOCUMENT");

        template.fields.forEach((field) => {
          const value = document.data[field.id] || "Non renseigné";
          addText(`${field.label}:`, 12, true);
          addText(value, 11);
          yPosition += 5;

          // Nouvelle page si nécessaire
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
        });
      }

      // Pied de page
      const pageCount = pdf.getNumberOfPages();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const leftMargin = 20;
      const rightMargin = 20;

      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);

        pdf.text(`Page ${i}/${pageCount}`, leftMargin, footerY);
        pdf.text(
          "PHARMA QMS - Systeme de Management de la Qualite",
          pageWidth - rightMargin,
          footerY,
          { align: "right" }
        );
      }

      // Générer le nom de fichier sécurisé
      const safeTemplateTitle = template.title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const fileName = `document-${safeTemplateTitle}-${
        new Date().toISOString().split("T")[0]
      }-${document.id}.pdf`;

      // Return blob instead of saving
      const pdfBlob = pdf.output("blob");
      return { blob: pdfBlob, fileName };
    } catch (error) {
      console.error("Error generating document PDF blob:", error);
      throw new Error(
        `Erreur lors de la generation du PDF: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  }

  private async generateOrganizationChart(
    document: DocumentData,
    addText: Function,
    addSection: Function
  ): Promise<void> {
    addSection("ORGANIGRAMME DE L'OFFICINE");

    const data = document.data;

    // Structure hiérarchique
    addText("STRUCTURE HIERARCHIQUE", 14, true, "teal");
    yPosition += 10;

    // Niveau 1 - Direction
    if (data.titulaire) {
      addText("DIRECTION", 12, true);
      addText(`Pharmacien Titulaire: ${data.titulaire}`, 11);
      yPosition += 5;
    }

    // Niveau 2 - Pharmaciens
    if (data.adjoint) {
      addText("PHARMACIENS", 12, true);
      addText(`Pharmacien Adjoint: ${data.adjoint}`, 11);
      yPosition += 5;
    }

    // Niveau 3 - Personnel technique
    const technicalStaff = [];
    if (data.preparateur1)
      technicalStaff.push(`Preparateur: ${data.preparateur1}`);
    if (data.preparateur2)
      technicalStaff.push(`Preparateur: ${data.preparateur2}`);

    if (technicalStaff.length > 0) {
      addText("PERSONNEL TECHNIQUE", 12, true);
      technicalStaff.forEach((staff) => addText(staff, 11));
      yPosition += 5;
    }

    // Niveau 4 - Personnel de vente
    const salesStaff = [];
    if (data.vendeur1) salesStaff.push(`Vendeur/Assistant: ${data.vendeur1}`);
    if (data.vendeur2) salesStaff.push(`Vendeur/Assistant: ${data.vendeur2}`);

    if (salesStaff.length > 0) {
      addText("PERSONNEL DE VENTE", 12, true);
      salesStaff.forEach((staff) => addText(staff, 11));
      yPosition += 5;
    }

    // Fonctions transversales
    if (data.responsableQualite || data.stagiaire) {
      addText("FONCTIONS TRANSVERSALES", 12, true);
      if (data.responsableQualite)
        addText(`Responsable Qualite: ${data.responsableQualite}`, 11);
      if (data.stagiaire) addText(`Stagiaire: ${data.stagiaire}`, 11);
    }
  }
}

export const documentService = DocumentService.getInstance();
