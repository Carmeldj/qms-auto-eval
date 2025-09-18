import { Procedure } from "../types/procedures";
import jsPDF from "jspdf";

export class ProcedureService {
  private static instance: ProcedureService;

  private constructor() {}

  public static getInstance(): ProcedureService {
    if (!ProcedureService.instance) {
      ProcedureService.instance = new ProcedureService();
    }
    return ProcedureService.instance;
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

  public async generatePDF(procedure: Procedure): Promise<void> {
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

        // Page number on the left
        const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
        pdf.text(`Page ${pageNum}`, leftMargin, footerY);

        // PHARMA QMS reference on the right
        pdf.text(
          "PHARMA QMS - Systeme de Management de la Qualite",
          pageWidth - rightMargin,
          footerY,
          { align: "right" }
        );

        // Reset text color
        pdf.setTextColor(0, 0, 0);
      };

      const addSection = (title: string) => {
        yPosition += 15;
        // Add a subtle line above section
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

      // Initialize position
      yPosition = topMargin;

      // En-tete du document avec design ameliore
      addText("PROCEDURE OFFICINALE", 24, true, "teal", "center");
      yPosition += 5;
      addText(
        procedure.info.pharmacyName.toUpperCase(),
        18,
        true,
        "black",
        "center"
      );
      yPosition += 10;

      // Ligne decorative
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

      // Tableau d'informations avec mise en forme amelioree
      const infoData = [
        ["Titre:", procedure.info.title],
        ["Version:", procedure.info.version],
        [
          "Date de creation:",
          new Date(procedure.info.creationDate).toLocaleDateString("fr-FR"),
        ],
        ["Duree de validite:", procedure.info.validityDuration],
        ["Auteur:", procedure.info.author],
      ];

      if (procedure.info.reviewer) {
        infoData.push(["Responsable de revision:", procedure.info.reviewer]);
      }

      infoData.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(label, leftMargin, yPosition);

        pdf.setFont("helvetica", "normal");
        pdf.text(value, leftMargin + 60, yPosition);
        yPosition += 8;
      });

      addSeparatorLine();

      // Objectif
      addSection("OBJECTIF");
      addText(procedure.info.objective, 12);
      yPosition += 5;

      // Champ d'application
      addSection("CHAMP D'APPLICATION");
      addText(procedure.info.scope, 12);
      yPosition += 5;

      // Etapes de la procedure
      addSection("DESCRIPTION DETAILLEE");

      procedure.steps.forEach((step) => {
        // Encadre pour chaque etape
        pdf.setDrawColor(240, 240, 240);
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(
          leftMargin - 5,
          yPosition - 5,
          pageWidth - leftMargin - rightMargin + 10,
          step.responsible || step.duration || step.documents.length > 0
            ? 35
            : 20,
          3,
          3,
          "F"
        );

        addText(`ETAPE ${step.order}`, 13, true, "teal");
        addText(step.description, 11);
        yPosition += 3;

        if (step.responsible) {
          addText(`→ Responsable: ${step.responsible}`, 10, false, "gray");
        }

        if (step.duration) {
          addText(`→ Duree estimee: ${step.duration}`, 10, false, "gray");
        }

        if (step.documents.length > 0) {
          addText(
            `→ Documents/Registres: ${step.documents.join(", ")}`,
            10,
            false,
            "gray"
          );
        }

        yPosition += 10;
      });

      // Indicateurs de performance
      if (procedure.indicators.length > 0) {
        addSection("INDICATEURS DE PERFORMANCE");

        procedure.indicators.forEach((indicator, index) => {
          addText(`${index + 1}. ${indicator.name}`, 12, true);
          if (indicator.description) {
            addText(`   Description: ${indicator.description}`, 11);
          }
          if (indicator.target) {
            addText(`   Objectif: ${indicator.target}`, 11);
          }
          addText(`   Frequence: ${indicator.frequency}`, 11);
          yPosition += 8;
        });
      }

      // Annexes
      if (procedure.annexes.length > 0) {
        addSection("ANNEXES");

        procedure.annexes.forEach((annex, index) => {
          const typeLabel =
            annex.type === "document"
              ? "Document"
              : annex.type === "form"
              ? "Formulaire"
              : "Reference reglementaire";

          addText(`Annexe ${index + 1}: ${annex.title}`, 12, true);
          addText(`   Type: ${typeLabel}`, 11);
          if (annex.description) {
            addText(`   Description: ${annex.description}`, 11);
          }
          if (annex.reference) {
            addText(`   Reference: ${annex.reference}`, 11);
          }
          yPosition += 8;
        });
      }

      // Informations de tracabilite
      addSection("TRACABILITE");
      addText(
        `Document genere le: ${new Date().toLocaleDateString(
          "fr-FR"
        )} a ${new Date().toLocaleTimeString("fr-FR")}`,
        10,
        false,
        "gray"
      );
      addText(
        `Systeme: PHARMA QMS - Module Procedures v1.0`,
        10,
        false,
        "gray"
      );

      // Signature et validation
      addSection("SIGNATURES ET VALIDATION");

      // Cadres pour signatures avec design ameliore
      const signatureBoxHeight = 25;
      const signatureBoxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;

      // Signature auteur
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(leftMargin, yPosition, signatureBoxWidth, signatureBoxHeight);
      addText("Redige par:", 10, true);
      addText(`${procedure.info.author}`, 10);
      addText("Date: _______________", 10);
      addText("Signature:", 10);

      // Reset position for second signature box
      const tempY = yPosition - (signatureBoxHeight + 5);

      if (procedure.info.reviewer) {
        pdf.rect(
          leftMargin + signatureBoxWidth + 10,
          tempY,
          signatureBoxWidth,
          signatureBoxHeight
        );
        pdf.text(
          "Verifie par:",
          leftMargin + signatureBoxWidth + 15,
          tempY + 8
        );
        pdf.text(
          `${procedure.info.reviewer}`,
          leftMargin + signatureBoxWidth + 15,
          tempY + 16
        );
        pdf.text(
          "Date: _______________",
          leftMargin + signatureBoxWidth + 15,
          tempY + 24
        );
      }

      yPosition += signatureBoxHeight + 15;

      // Signature approbation (pleine largeur)
      pdf.rect(
        leftMargin,
        yPosition,
        pageWidth - leftMargin - rightMargin,
        signatureBoxHeight
      );
      addText("Approuve par: Pharmacien titulaire", 10, true);
      addText("Date: _______________", 10);
      addText("Signature et cachet:", 10);

      yPosition += signatureBoxHeight + 10;

      // Add footer to all pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);

        // Page number on the left
        pdf.text(`Page ${i}/${totalPages}`, leftMargin, footerY);

        // PHARMA QMS reference on the right
        pdf.text(
          "PHARMA QMS - Systeme de Management de la Qualite",
          pageWidth - rightMargin,
          footerY,
          { align: "right" }
        );
      }

      // Generer le nom de fichier securise
      const safeProcedureTitle = procedure.info.title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const safePharmacyName = procedure.info.pharmacyName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const fileName = `procedure-${safeProcedureTitle}-${safePharmacyName}-v${procedure.info.version}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating procedure PDF:", error);
      throw new Error(
        `Erreur lors de la generation du PDF: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  }
}

export const procedureService = ProcedureService.getInstance();
