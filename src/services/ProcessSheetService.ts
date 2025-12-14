import jsPDF from "jspdf";
import { ProcessSheet } from "../types/documents";
import { generateUploadAndDownloadPDF } from "../utils/pdfUploadHelper";
import { DocumentAccessLevel, DocumentStatus } from "../types/documents";

export class ProcessSheetService {
  static generatePDF(processSheet: ProcessSheet): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Header
    doc.setFillColor(0, 150, 136);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("FICHE DE PROCESSUS", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(16);
    doc.text(processSheet.processName, pageWidth / 2, 28, { align: "center" });

    yPos = 50;

    // Informations générales
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Informations Générales", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const info = [
      ["Pharmacie:", processSheet.pharmacyName],
      ["Code Processus:", processSheet.processCode],
      ["Version:", processSheet.version],
      [
        "Date de création:",
        new Date(processSheet.creationDate).toLocaleDateString("fr-FR"),
      ],
    ];

    if (processSheet.revisionDate) {
      info.push([
        "Date de révision:",
        new Date(processSheet.revisionDate).toLocaleDateString("fr-FR"),
      ]);
    }

    info.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 40, yPos);
      yPos += 6;
    });

    yPos += 4;

    // Objectif
    doc.setFont("helvetica", "bold");
    doc.text("Objectif:", margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    const objectiveLines = doc.splitTextToSize(
      processSheet.objective,
      contentWidth
    );
    doc.text(objectiveLines, margin, yPos);
    yPos += objectiveLines.length * 5 + 4;

    // Périmètre
    doc.setFont("helvetica", "bold");
    doc.text("Périmètre d'application:", margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    const scopeLines = doc.splitTextToSize(processSheet.scope, contentWidth);
    doc.text(scopeLines, margin, yPos);
    yPos += scopeLines.length * 5 + 8;

    // Check new page
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    // Étapes du processus
    doc.setFillColor(33, 150, 243);
    doc.rect(margin - 2, yPos - 5, contentWidth + 4, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ÉTAPES DU PROCESSUS", margin, yPos);
    yPos += 8;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);

    processSheet.steps.forEach((step) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`Étape ${step.order}:`, margin, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(
        step.description,
        contentWidth - 10
      );
      doc.text(descLines, margin + 5, yPos);
      yPos += descLines.length * 4 + 2;

      doc.setFont("helvetica", "italic");
      doc.text(`• Responsable: ${step.responsible}`, margin + 5, yPos);
      yPos += 4;

      if (step.duration) {
        doc.text(`• Durée estimée: ${step.duration}`, margin + 5, yPos);
        yPos += 4;
      }

      if (step.tools) {
        doc.text(`• Outils: ${step.tools}`, margin + 5, yPos);
        yPos += 4;
      }

      yPos += 3;
    });

    yPos += 5;

    // Responsabilités
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFillColor(156, 39, 176);
    doc.rect(margin - 2, yPos - 5, contentWidth + 4, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("RESPONSABILITÉS", margin, yPos);
    yPos += 8;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);

    processSheet.responsibilities.forEach((resp) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${resp.role} (${resp.person}):`, margin, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      resp.tasks.forEach((task) => {
        if (task.trim()) {
          const taskLines = doc.splitTextToSize(`• ${task}`, contentWidth - 10);
          doc.text(taskLines, margin + 5, yPos);
          yPos += taskLines.length * 4;
        }
      });

      yPos += 3;
    });

    yPos += 5;

    // Documents associés
    if (processSheet.associatedDocuments.length > 0) {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFillColor(255, 193, 7);
      doc.rect(margin - 2, yPos - 5, contentWidth + 4, 8, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("DOCUMENTS / FORMULAIRES ASSOCIÉS", margin, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      processSheet.associatedDocuments.forEach((doc_name) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(`• ${doc_name}`, margin, yPos);
        yPos += 5;
      });

      yPos += 5;
    }

    // KPIs
    if (processSheet.kpis.length > 0) {
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFillColor(76, 175, 80);
      doc.rect(margin - 2, yPos - 5, contentWidth + 4, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("INDICATEURS DE PERFORMANCE (KPI)", margin, yPos);
      yPos += 8;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);

      processSheet.kpis.forEach((kpi) => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = margin;
        }

        doc.setFont("helvetica", "bold");
        doc.text(kpi.name, margin, yPos);
        yPos += 5;

        doc.setFont("helvetica", "normal");
        if (kpi.description) {
          const descLines = doc.splitTextToSize(
            kpi.description,
            contentWidth - 10
          );
          doc.text(descLines, margin + 5, yPos);
          yPos += descLines.length * 4;
        }

        doc.setFont("helvetica", "italic");
        doc.text(
          `• Objectif: ${kpi.target} | Fréquence: ${kpi.frequency}`,
          margin + 5,
          yPos
        );
        yPos += 6;
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Fiche Processus ${processSheet.processCode} - ${processSheet.pharmacyName}`,
        margin,
        pageHeight - 10
      );
      doc.text(
        `Page ${i} / ${pageCount}`,
        pageWidth - margin - 20,
        pageHeight - 10
      );
    }

    // Save
    const fileName = `Fiche_Processus_${
      processSheet.processCode
    }_${processSheet.pharmacyName.replace(/\s+/g, "_")}.pdf`;

    // Upload and download PDF
    generateUploadAndDownloadPDF(doc, fileName, {
      title: `Fiche Processus - ${processSheet.processCode}`,
      type: "Fiche de processus",
      category: "Processus",
      description: `Fiche descriptive du processus ${processSheet.processName}`,
      author: "Système",
      version: processSheet.version || "1.0",
      accessLevel: DocumentAccessLevel.RESTRICTED,
      status: DocumentStatus.DRAFT,
      tags: ["processus", "fiche"],
    }).catch((error) => {
      console.error("Error uploading process sheet:", error);
    });
  }
}
