import jsPDF from "jspdf";
import { ProcessReview } from "../types/processReview";
import { generateUploadAndDownloadPDF } from "../utils/pdfUploadHelper";
import { DocumentAccessLevel, DocumentStatus } from "../types/documents";

class ProcessReviewService {
  async generatePDF(review: ProcessReview): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    const addText = (
      text: string,
      fontSize: number = 10,
      isBold: boolean = false
    ) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.35) + 3;

      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    const addSection = (title: string) => {
      yPosition += 5;
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      addText(title, 12, true);
      yPosition += 2;
    };

    // En-tête
    pdf.setFillColor(0, 150, 136);
    pdf.rect(0, 0, pageWidth, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("COMPTE-RENDU DE REVUE DE PROCESSUS", pageWidth / 2, 15, {
      align: "center",
    });
    pdf.setFontSize(12);
    pdf.text(review.processName, pageWidth / 2, 23, { align: "center" });

    yPosition = 40;
    pdf.setTextColor(0, 0, 0);

    // Informations générales
    addText(
      `Date de la revue: ${new Date(review.reviewDate).toLocaleDateString(
        "fr-FR"
      )}`,
      10,
      true
    );
    addText(`Année: ${review.reviewYear}`, 10);
    addText(`Pilote du processus: ${review.pilotName}`, 10);
    addText(`Participants: ${review.participants.join(", ")}`, 10);
    yPosition += 5;

    // 1. Suivi des actions précédentes
    addSection("1. SUIVI DES ACTIONS DE LA REVUE PRÉCÉDENTE");
    if (review.previousActions.length > 0) {
      review.previousActions.forEach((action, index) => {
        addText(`Action ${index + 1}: ${action.description}`, 9, true);
        addText(
          `Responsable: ${action.responsible} | Échéance: ${action.deadline}`,
          9
        );
        addText(`Statut: ${this.getStatusLabel(action.status)}`, 9);
        if (action.comments) {
          addText(`Commentaires: ${action.comments}`, 9);
        }
        yPosition += 2;
      });
    } else {
      addText("Aucune action de revue précédente à suivre.", 9);
    }

    // 2. Analyse de la satisfaction des bénéficiaires
    addSection("2. ANALYSE DE LA SATISFACTION DES BÉNÉFICIAIRES");
    addText(
      `Note de satisfaction: ${review.beneficiarySatisfaction.rating}/10`,
      10
    );
    addText(
      `Enquêtes réalisées: ${review.beneficiarySatisfaction.surveysCompleted}`,
      10
    );
    addText(`Commentaires: ${review.beneficiarySatisfaction.comments}`, 10);

    // 3. Analyse des indicateurs
    addSection("3. ANALYSE DES INDICATEURS");
    if (review.indicators.length > 0) {
      review.indicators.forEach((indicator, index) => {
        addText(`Indicateur ${index + 1}: ${indicator.name}`, 9, true);
        addText(
          `Objectif: ${indicator.target} | Réalisé: ${indicator.actual}`,
          9
        );
        addText(`Statut: ${this.getIndicatorStatusLabel(indicator.status)}`, 9);
        if (indicator.comments) {
          addText(`Commentaires: ${indicator.comments}`, 9);
        }
        yPosition += 2;
      });
    } else {
      addText("Aucun indicateur défini.", 9);
    }

    // 4. Réalisation des activités
    addSection("4. RÉALISATION DES ACTIVITÉS");
    addText(
      `Activités planifiées: ${review.activitiesRealization.plannedActivities}`,
      9
    );
    addText(
      `Activités réalisées: ${review.activitiesRealization.completedActivities}`,
      9
    );
    addText(
      `Retards ou difficultés: ${review.activitiesRealization.delaysOrIssues}`,
      9
    );

    // 5. Analyse du système documentaire
    addSection("5. ANALYSE DU SYSTÈME DOCUMENTAIRE");
    addText(
      `Documents à jour: ${
        review.documentarySystem.documentsUpToDate ? "Oui" : "Non"
      }`,
      9
    );
    addText(
      `Documents manquants: ${
        review.documentarySystem.missingDocuments || "Aucun"
      }`,
      9
    );
    addText(
      `Besoins d'amélioration: ${
        review.documentarySystem.improvementNeeds || "Aucun"
      }`,
      9
    );

    // 6. Analyse des ressources
    addSection("6. ANALYSE DES RESSOURCES");
    addText(`Ressources humaines: ${review.resources.humanResources}`, 9);
    addText(`Ressources matérielles: ${review.resources.materialResources}`, 9);
    addText(
      `Ressources financières: ${review.resources.financialResources}`,
      9
    );
    addText(`Besoins en formation: ${review.resources.trainingNeeds}`, 9);

    // 7. Analyse et maîtrise des risques et opportunités
    addSection("7. ANALYSE ET MAÎTRISE DES RISQUES ET OPPORTUNITÉS");

    addText("Risques identifiés:", 10, true);
    if (review.risksAndOpportunities.identifiedRisks.length > 0) {
      review.risksAndOpportunities.identifiedRisks.forEach((risk, index) => {
        addText(`Risque ${index + 1}: ${risk.description}`, 9, true);
        addText(
          `Gravité: ${this.getSeverityLabel(
            risk.severity
          )} | Probabilité: ${this.getProbabilityLabel(risk.probability)}`,
          9
        );
        addText(`Actions de mitigation: ${risk.mitigationActions}`, 9);
        yPosition += 2;
      });
    } else {
      addText("Aucun risque identifié.", 9);
    }

    yPosition += 3;
    addText("Opportunités identifiées:", 10, true);
    if (review.risksAndOpportunities.identifiedOpportunities.length > 0) {
      review.risksAndOpportunities.identifiedOpportunities.forEach(
        (opp, index) => {
          addText(`Opportunité ${index + 1}: ${opp.description}`, 9, true);
          addText(`Bénéfice potentiel: ${opp.potentialBenefit}`, 9);
          addText(`Plan d'action: ${opp.actionPlan}`, 9);
          yPosition += 2;
        }
      );
    } else {
      addText("Aucune opportunité identifiée.", 9);
    }

    // 8. Identification des actions d'amélioration
    addSection("8. IDENTIFICATION DES ACTIONS D'AMÉLIORATION");
    if (review.improvementActions.length > 0) {
      review.improvementActions.forEach((action, index) => {
        addText(`Action ${index + 1}: ${action.description}`, 9, true);
        addText(
          `Responsable: ${action.responsible} | Échéance: ${action.deadline}`,
          9
        );
        addText(`Priorité: ${this.getPriorityLabel(action.priority)}`, 9);
        addText(`Résultat attendu: ${action.expectedResult}`, 9);
        yPosition += 2;
      });
    } else {
      addText("Aucune action d'amélioration identifiée.", 9);
    }

    // 9. Bilan des actions d'amélioration
    addSection("9. BILAN DES ACTIONS D'AMÉLIORATION");
    addText(`Actions terminées: ${review.actionsBilan.completedActions}`, 9);
    addText(`Actions en cours: ${review.actionsBilan.inProgressActions}`, 9);
    addText(
      `Actions non démarrées: ${review.actionsBilan.notStartedActions}`,
      9
    );
    addText(`Commentaires: ${review.actionsBilan.comments}`, 9);

    // 10. Décisions prises par le pilote du processus
    addSection("10. DÉCISIONS PRISES PAR LE PILOTE DU PROCESSUS");
    if (review.pilotDecisions.length > 0) {
      review.pilotDecisions.forEach((decision, index) => {
        addText(`${index + 1}. ${decision}`, 9);
      });
    } else {
      addText("Aucune décision particulière.", 9);
    }

    // 11. Propositions à mettre à l'ODJ de la revue de direction
    addSection("11. PROPOSITIONS À METTRE À L'ODJ DE LA REVUE DE DIRECTION");
    if (review.directionReviewProposals.length > 0) {
      review.directionReviewProposals.forEach((proposal, index) => {
        addText(`${index + 1}. ${proposal}`, 9);
      });
    } else {
      addText("Aucune proposition pour la revue de direction.", 9);
    }

    // 12. Évaluation de l'efficacité globale
    addSection("12. ÉVALUATION DE L'EFFICACITÉ GLOBALE DU PROCESSUS");
    addText(
      `Évaluation: ${this.getEfficiencyLabel(review.overallEfficiency.rating)}`,
      10,
      true
    );
    addText(`Justification: ${review.overallEfficiency.justification}`, 9);

    // Pied de page
    yPosition = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    pdf.text(
      "Ce document constitue le compte-rendu officiel de la revue de processus.",
      margin,
      yPosition
    );
    yPosition += 4;
    pdf.text(
      `Signé par: ${review.pilotName}, Pilote du processus`,
      margin,
      yPosition
    );
    yPosition += 4;
    pdf.text(
      `Date: ${new Date(review.reviewDate).toLocaleDateString("fr-FR")}`,
      margin,
      yPosition
    );

    const fileName = `revue-processus-${review.processName.replace(
      /\s+/g,
      "-"
    )}-${review.reviewYear}.pdf`;

    // Upload and download PDF
    await generateUploadAndDownloadPDF(pdf, fileName, {
      title: `Revue de processus - ${review.processName}`,
      type: "Revue de processus",
      category: "Processus",
      description: `Revue du processus ${review.processName} pour l'année ${review.reviewYear}`,
      author: review.pilotName || "Système",
      version: "1.0",
      accessLevel: DocumentAccessLevel.RESTRICTED,
      status: DocumentStatus.DRAFT,
      tags: ["revue", "processus", review.reviewYear.toString()],
    });
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      completed: "Terminée",
      "in-progress": "En cours",
      delayed: "En retard",
      "not-started": "Non démarrée",
    };
    return labels[status] || status;
  }

  private getIndicatorStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      achieved: "Objectif atteint",
      partially: "Partiellement atteint",
      "not-achieved": "Non atteint",
    };
    return labels[status] || status;
  }

  private getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
      low: "Faible",
      medium: "Moyenne",
      high: "Élevée",
      critical: "Critique",
    };
    return labels[severity] || severity;
  }

  private getProbabilityLabel(probability: string): string {
    const labels: Record<string, string> = {
      rare: "Rare",
      possible: "Possible",
      probable: "Probable",
      frequent: "Fréquente",
    };
    return labels[probability] || probability;
  }

  private getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      high: "Haute",
      medium: "Moyenne",
      low: "Basse",
    };
    return labels[priority] || priority;
  }

  private getEfficiencyLabel(rating: string): string {
    const labels: Record<string, string> = {
      excellent: "Excellent",
      good: "Bon",
      satisfactory: "Satisfaisant",
      insufficient: "Insuffisant",
    };
    return labels[rating] || rating;
  }
}

export const processReviewService = new ProcessReviewService();
