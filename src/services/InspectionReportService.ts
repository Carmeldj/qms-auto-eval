import {
  InspectionReport,
  PharmacyInfo,
  PharmacistInfo,
  InspectionAnswer,
} from "../types/inspection";
import {
  inspectionItems,
  getAllCategories,
  getItemsByCategory,
} from "../data/inspectionItems";
import { generateRecommendations } from "../data/inspectionRecommendations";
import jsPDF from "jspdf";

export class InspectionReportService {
  private static instance: InspectionReportService;
  private currentReport: InspectionReport | null = null;

  private constructor() {}

  public static getInstance(): InspectionReportService {
    if (!InspectionReportService.instance) {
      InspectionReportService.instance = new InspectionReportService();
    }
    return InspectionReportService.instance;
  }

  public createReport(
    pharmacyInfo: PharmacyInfo,
    pharmacistInfo: PharmacistInfo,
    answers: InspectionAnswer[]
  ): InspectionReport {
    console.log(
      "InspectionReportService: Creating report with answers:",
      answers
    );

    const summary = this.calculateSummary(answers);

    this.currentReport = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      pharmacyInfo,
      pharmacistInfo,
      answers,
      summary,
    };

    console.log("InspectionReportService: Created report:", this.currentReport);
    return this.currentReport;
  }

  public getCurrentReport(): InspectionReport | null {
    return this.currentReport;
  }

  public calculateSummary(answers: InspectionAnswer[]) {
    console.log(
      "InspectionReportService: Calculating summary for answers:",
      answers
    );

    const summary = {
      totalItems: inspectionItems.length,
      compliant: 0,
      nonCompliant: 0,
      notApplicable: 0,
      criticalGaps: 0,
      majorGaps: 0,
      minorGaps: 0,
    };

    answers.forEach((answer) => {
      switch (answer.status) {
        case "compliant":
          summary.compliant++;
          break;
        case "non-compliant":
          summary.nonCompliant++;
          if (answer.gapType === "critical") summary.criticalGaps++;
          else if (answer.gapType === "major") summary.majorGaps++;
          else if (answer.gapType === "minor") summary.minorGaps++;
          break;
        case "not-applicable":
          summary.notApplicable++;
          break;
      }
    });

    console.log("InspectionReportService: Calculated summary:", summary);
    return summary;
  }

  public calculateRealTimeStats(answers: InspectionAnswer[]) {
    const answeredItems = answers.filter((a) => a.status !== undefined);

    const stats = {
      totalItems: answeredItems.length,
      totalPossibleItems: inspectionItems.length,
      compliant: answeredItems.filter((a) => a.status === "compliant").length,
      nonCompliant: answeredItems.filter((a) => a.status === "non-compliant")
        .length,
      notApplicable: answeredItems.filter((a) => a.status === "not-applicable")
        .length,
      criticalGaps: answeredItems.filter(
        (a) => a.status === "non-compliant" && a.gapType === "critical"
      ).length,
      majorGaps: answeredItems.filter(
        (a) => a.status === "non-compliant" && a.gapType === "major"
      ).length,
      minorGaps: answeredItems.filter(
        (a) => a.status === "non-compliant" && a.gapType === "minor"
      ).length,
      unanswered: inspectionItems.length - answeredItems.length,
    };

    console.log("InspectionReportService: Real-time stats:", stats);
    return stats;
  }

  public getComplianceRate(answers: InspectionAnswer[]): number {
    const answeredItems = answers.filter((a) => a.status !== undefined);
    const compliant = answeredItems.filter(
      (a) => a.status === "compliant"
    ).length;
    return answeredItems.length > 0
      ? Math.round((compliant / answeredItems.length) * 100)
      : 0;
  }

  public getComplianceLevel(rate: number) {
    if (rate >= 90) return { level: "Excellent", color: "green" };
    if (rate >= 75) return { level: "Satisfaisant", color: "yellow" };
    if (rate >= 60) return { level: "Acceptable", color: "orange" };
    return { level: "Critique", color: "red" };
  }

  public async generatePDF(report: InspectionReport): Promise<any> {
    try {
      console.log(
        "InspectionReportService: Starting PDF generation for report:",
        report
      );

      // Validation des données avant génération
      if (!report || !report.pharmacyInfo || !report.pharmacistInfo) {
        throw new Error("Données du rapport manquantes");
      }

      if (!report.answers || report.answers.length === 0) {
        console.warn(
          "InspectionReportService: No answers found, generating empty report"
        );
      }

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      const addText = (
        text: string,
        fontSize: number = 12,
        isBold: boolean = false,
        color: string = "black",
        lineSpacing: number = 1.15
      ) => {
        try {
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

          const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
          pdf.text(lines, margin, yPosition);
          const lineHeight = fontSize * 0.35 * lineSpacing;
          yPosition += lines.length * lineHeight + 3;

          if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            yPosition = margin;
          }
        } catch (error) {
          console.error("Error adding text to PDF:", error);
        }
      };

      const addSection = (title: string) => {
        yPosition += 8;
        const lineY = yPosition;
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        pdf.line(margin, lineY, pageWidth - margin, lineY);
        yPosition += 5;
        addText(title, 12, true, "teal", 1.0);
        yPosition += 3;
      };

      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      // En-tête
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 150, 136);
      const titleWidth = pdf.getTextWidth(
        "RAPPORT D'AUTO-INSPECTION PHARMA QMS"
      );
      pdf.text(
        "RAPPORT D'AUTO-INSPECTION PHARMA QMS",
        (pageWidth - titleWidth) / 2,
        yPosition
      );
      yPosition += 8;

      // Informations generales
      addSection("INFORMATIONS GENERALES");
      addText(`Officine: ${report.pharmacyInfo.name}`, 12, true);
      addText(`Date d'inspection: ${formatDate(report.date)}`, 12);
      addText(`Localisation: ${report.pharmacyInfo.location}`, 12);
      addText(`Statut: ${report.pharmacyInfo.status}`, 12);
      addText(`Email: ${report.pharmacyInfo.email}`, 12);
      yPosition += 5;

      addText(
        `Pharmacien titulaire: ${report.pharmacistInfo.firstName} ${report.pharmacistInfo.lastName}`,
        12,
        true
      );
      addText(`N Ordre: ${report.pharmacistInfo.orderNumber}`, 12);
      addText(
        `Contact: ${report.pharmacistInfo.email} - ${report.pharmacistInfo.phone}`,
        12
      );

      // Resume executif
      addSection("RESUME EXECUTIF");
      const realTimeStats = this.calculateRealTimeStats(report.answers);
      const complianceRate = this.getComplianceRate(report.answers);
      const complianceLevel = this.getComplianceLevel(complianceRate);

      addText(
        `Taux de conformite global: ${complianceRate}% - Niveau: ${complianceLevel.level}`,
        14,
        true
      );
      addText(
        `Elements evalues: ${realTimeStats.totalItems} sur ${realTimeStats.totalPossibleItems} possibles`,
        12
      );

      if (realTimeStats.unanswered > 0) {
        addText(
          `Elements non evalues: ${realTimeStats.unanswered} (consideres conformes par defaut)`,
          12
        );
      }

      addText(
        `Conformes: ${realTimeStats.compliant} | Non conformes: ${realTimeStats.nonCompliant} | Non applicables: ${realTimeStats.notApplicable}`,
        12
      );

      if (realTimeStats.nonCompliant > 0) {
        addText(
          `Classification des ecarts: Critiques: ${realTimeStats.criticalGaps} | Majeurs: ${realTimeStats.majorGaps} | Mineurs: ${realTimeStats.minorGaps}`,
          12
        );
      }

      // Analyse detaillee par categorie
      addSection("ANALYSE DETAILLEE PAR CATEGORIE");

      const categories = getAllCategories();
      categories.forEach((category) => {
        const categoryItems = getItemsByCategory(category);
        const categoryAnswers = report.answers.filter((a) =>
          categoryItems.some((item) => item.id === a.itemId)
        );

        const compliantCount = categoryAnswers.filter(
          (a) => a.status === "compliant"
        ).length;
        const nonCompliantCount = categoryAnswers.filter(
          (a) => a.status === "non-compliant"
        ).length;
        const notApplicableCount = categoryAnswers.filter(
          (a) => a.status === "not-applicable"
        ).length;
        const categoryAnsweredCount = categoryAnswers.length;
        const unansweredCount = categoryItems.length - categoryAnsweredCount;

        const categoryComplianceRate =
          categoryAnsweredCount > 0
            ? Math.round((compliantCount / categoryAnsweredCount) * 100)
            : 0;

        addText(`${category}:`, 12, true);
        if (categoryAnsweredCount > 0) {
          addText(
            `Taux de conformite: ${categoryComplianceRate}% (${compliantCount}/${categoryAnsweredCount} evalues conformes)`,
            11
          );
          addText(
            `Repartition: Conformes: ${compliantCount} | Non conformes: ${nonCompliantCount} | Non applicables: ${notApplicableCount}`,
            10
          );
          if (unansweredCount > 0) {
            addText(
              `Elements non evalues: ${unansweredCount} (consideres conformes par defaut)`,
              10
            );
          }
        } else {
          addText(
            `Aucun element evalue dans cette categorie (${categoryItems.length} elements disponibles)`,
            11
          );
        }

        // Detail des elements non conformes
        const nonCompliantItems = categoryAnswers.filter(
          (a) => a.status === "non-compliant"
        );
        if (nonCompliantItems.length > 0) {
          addText("Ecarts identifies:", 11, true);
          nonCompliantItems.forEach((answer) => {
            const item = inspectionItems.find((i) => i.id === answer.itemId);
            const gapTypeLabel =
              answer.gapType === "critical"
                ? "CRITIQUE"
                : answer.gapType === "major"
                ? "MAJEUR"
                : "MINEUR";
            addText(`• ${item?.description} [ECART ${gapTypeLabel}]`, 10, true);
            addText(`  Exigence: ${item?.requirement}`, 9);
            if (answer.comment && answer.comment.trim()) {
              addText(`  Observation: ${answer.comment.trim()}`, 9);
            }
          });
        }

        yPosition += 5;
      });

      // Recommandations
      const recommendations = generateRecommendations(report.answers);
      if (recommendations.length > 0) {
        addSection("RECOMMANDATIONS PRIORITAIRES");
        recommendations.forEach((rec, index) => {
          addText(`${index + 1}. ${rec.title}`, 11, true);
          addText(`${rec.description}`, 10);
          addText(
            `Delai: ${rec.timeframe} | Responsable: ${rec.responsible}`,
            9
          );
          yPosition += 3;
        });
      }

      // Section detaillee des ecarts et non-conformites
      const nonCompliantAnswers = report.answers.filter(
        (a) => a.status === "non-compliant"
      );
      if (nonCompliantAnswers.length > 0) {
        addSection("ANALYSE DETAILLEE DES ECARTS ET NON-CONFORMITES");

        // Grouper par type d'ecart
        const criticalGaps = nonCompliantAnswers.filter(
          (a) => a.gapType === "critical"
        );
        const majorGaps = nonCompliantAnswers.filter(
          (a) => a.gapType === "major"
        );
        const minorGaps = nonCompliantAnswers.filter(
          (a) => a.gapType === "minor"
        );
        const unclassifiedGaps = nonCompliantAnswers.filter((a) => !a.gapType);

        if (criticalGaps.length > 0) {
          addText("ECARTS CRITIQUES (Action immediate requise)", 13, true);
          criticalGaps.forEach((answer, index) => {
            const item = inspectionItems.find((i) => i.id === answer.itemId);
            addText(`${index + 1}. ${item?.description}`, 11, true);
            addText(`Exigence reglementaire: ${item?.requirement}`, 10);
            addText(
              `Categorie: ${item?.category}${
                item?.subcategory ? ` - ${item.subcategory}` : ""
              }`,
              10
            );
            if (answer.comment && answer.comment.trim()) {
              addText(`Observation terrain: ${answer.comment.trim()}`, 10);
            }
            addText(
              `Impact: Risque significatif pour la securite des patients et la conformite reglementaire`,
              10
            );
            addText(`Action requise: Correction immediate dans les 24-48h`, 10);
            yPosition += 3;
          });
        }

        if (majorGaps.length > 0) {
          addText("RISQUES MAJEURS (Action urgente requise)", 13, true);
          majorGaps.forEach((answer, index) => {
            const item = inspectionItems.find((i) => i.id === answer.itemId);
            addText(`${index + 1}. ${item?.description}`, 11, true);
            addText(`Exigence reglementaire: ${item?.requirement}`, 10);
            addText(
              `Categorie: ${item?.category}${
                item?.subcategory ? ` - ${item.subcategory}` : ""
              }`,
              10
            );
            if (answer.comment && answer.comment.trim()) {
              addText(`Observation terrain: ${answer.comment.trim()}`, 10);
            }
            addText(
              `Impact: Peut conduire a la dispensation de produits non conformes`,
              10
            );
            addText(`Action requise: Correction dans les 1-2 semaines`, 10);
            yPosition += 3;
          });
        }

        if (minorGaps.length > 0) {
          addText("ECARTS MINEURS (Amelioration continue)", 13, true);
          minorGaps.forEach((answer, index) => {
            const item = inspectionItems.find((i) => i.id === answer.itemId);
            addText(`${index + 1}. ${item?.description}`, 11, true);
            addText(`Exigence reglementaire: ${item?.requirement}`, 10);
            addText(
              `Categorie: ${item?.category}${
                item?.subcategory ? ` - ${item.subcategory}` : ""
              }`,
              10
            );
            if (answer.comment && answer.comment.trim()) {
              addText(`Observation terrain: ${answer.comment.trim()}`, 10);
            }
            addText(
              `Impact: Ecart aux bonnes pratiques sans impact immediat sur la securite`,
              10
            );
            addText(
              `Action requise: Integration dans le plan d'amelioration continue (1-3 mois)`,
              10
            );
            yPosition += 3;
          });
        }

        if (unclassifiedGaps.length > 0) {
          addText("AUTRES NON-CONFORMITES", 13, true);
          unclassifiedGaps.forEach((answer, index) => {
            const item = inspectionItems.find((i) => i.id === answer.itemId);
            addText(`${index + 1}. ${item?.description}`, 11, true);
            addText(`Exigence reglementaire: ${item?.requirement}`, 10);
            addText(
              `Categorie: ${item?.category}${
                item?.subcategory ? ` - ${item.subcategory}` : ""
              }`,
              10
            );
            if (answer.comment && answer.comment.trim()) {
              addText(`Observation terrain: ${answer.comment.trim()}`, 10);
            }
            addText(
              `Action requise: Evaluation et classification necessaires`,
              10
            );
            yPosition += 3;
          });
        }
      }

      // Plan CAPA (Corrective and Preventive Actions)
      if (nonCompliantAnswers.length > 0) {
        addSection("PLAN CAPA (ACTIONS CORRECTIVES ET PREVENTIVES)");

        addText(
          "Le plan CAPA suivant doit etre mis en oeuvre pour corriger les non-conformites identifiees et prevenir leur recurrence:",
          11
        );
        yPosition += 5;

        // Actions correctives immediates
        const immediateActions = recommendations.filter(
          (r) => r.priority === "immediate"
        );
        if (immediateActions.length > 0) {
          addText("A. ACTIONS CORRECTIVES IMMEDIATES (24-48h)", 12, true);
          immediateActions.forEach((action, index) => {
            addText(`${index + 1}. ${action.title}`, 11, true);
            addText(`Objectif: ${action.description}`, 10);
            addText(`Responsable: ${action.responsible}`, 10);
            addText(`Delai: ${action.timeframe}`, 10);
            addText(
              `Criteres de validation: Verification documentaire et controle terrain`,
              10
            );
            addText(
              `Suivi: Controle quotidien jusqu'a resolution complete`,
              10
            );
            yPosition += 3;
          });
        }

        // Actions correctives urgentes
        const urgentActions = recommendations.filter(
          (r) => r.priority === "urgent"
        );
        if (urgentActions.length > 0) {
          addText("B. ACTIONS CORRECTIVES URGENTES (1-2 semaines)", 12, true);
          urgentActions.forEach((action, index) => {
            addText(`${index + 1}. ${action.title}`, 11, true);
            addText(`Objectif: ${action.description}`, 10);
            addText(`Responsable: ${action.responsible}`, 10);
            addText(`Delai: ${action.timeframe}`, 10);
            addText(
              `Criteres de validation: Audit de conformite et test d'efficacite`,
              10
            );
            addText(
              `Suivi: Contrôle hebdomadaire avec rapport d'avancement`,
              10
            );
            yPosition += 3;
          });
        }

        // Actions preventives planifiees
        const plannedActions = recommendations.filter(
          (r) => r.priority === "planned"
        );
        if (plannedActions.length > 0) {
          addText("C. ACTIONS PREVENTIVES PLANIFIEES (1-3 mois)", 12, true);
          plannedActions.forEach((action, index) => {
            addText(`${index + 1}. ${action.title}`, 11, true);
            addText(`Objectif: ${action.description}`, 10);
            addText(`Responsable: ${action.responsible}`, 10);
            addText(`Delai: ${action.timeframe}`, 10);
            addText(
              `Criteres de validation: Evaluation d'efficacite et mesure d'amelioration`,
              10
            );
            addText(
              `Suivi: Contrôle mensuel avec indicateurs de performance`,
              10
            );
            yPosition += 3;
          });
        }

        // Matrice de suivi CAPA
        addText("D. MATRICE DE SUIVI CAPA", 12, true);
        addText(
          "Le tableau de suivi suivant doit etre utilise pour monitorer l'avancement des actions:",
          10
        );
        yPosition += 3;

        addText(
          "| Action | Responsable | Delai | Statut | Date de cloture | Efficacite |",
          10
        );
        addText(
          "|--------|-------------|-------|--------|-----------------|------------|",
          10
        );

        recommendations.slice(0, 10).forEach((action) => {
          addText(
            `| ${action.title.substring(0, 20)}... | ${action.responsible} | ${
              action.timeframe
            } | A faire | ___/___/___ | A evaluer |`,
            9
          );
        });

        yPosition += 5;

        // Indicateurs de suivi
        addText("E. INDICATEURS DE SUIVI DU PLAN CAPA", 12, true);
        addText(
          "Les indicateurs suivants doivent etre suivis mensuellement:",
          10
        );
        addText("• Taux de realisation des actions dans les delais: ____%", 10);
        addText("• Nombre d'ecarts recurrents: ____", 10);
        addText("• Taux de conformite global post-CAPA: ____%", 10);
        addText("• Satisfaction du personnel sur les ameliorations: ____%", 10);
        addText("• Nombre de nouvelles non-conformites detectees: ____", 10);
        yPosition += 5;

        // Processus de revue CAPA
        addText("F. PROCESSUS DE REVUE ET VALIDATION CAPA", 12, true);
        addText("1. Revue hebdomadaire des actions immediates et urgentes", 10);
        addText(
          "2. Revue mensuelle des actions preventives et indicateurs",
          10
        );
        addText(
          "3. Validation de l'efficacite des actions par audit interne",
          10
        );
        addText(
          "4. Cloture des actions apres verification de l'efficacite",
          10
        );
        addText("5. Capitalisation des bonnes pratiques pour prevention", 10);
        yPosition += 5;

        // Responsabilites CAPA
        addText("G. RESPONSABILITES DANS LE PLAN CAPA", 12, true);
        addText("Pharmacien titulaire:", 11, true);
        addText("• Validation du plan CAPA et allocation des ressources", 10);
        addText("• Suivi des actions critiques et urgentes", 10);
        addText("• Revue mensuelle de l'efficacite du plan", 10);
        yPosition += 2;

        addText("Responsable qualite (si designe):", 11, true);
        addText("• Coordination du plan CAPA et suivi operationnel", 10);
        addText("• Animation des revues hebdomadaires", 10);
        addText("• Reporting des indicateurs de performance", 10);
        yPosition += 2;

        addText("Personnel d'officine:", 11, true);
        addText("• Mise en oeuvre des actions correctives", 10);
        addText("• Remontee des difficultes et suggestions d'amelioration", 10);
        addText("• Respect des nouvelles procedures", 10);
      }

      // Tableau récapitulatif des points
      addSection("TABLEAU RECAPITULATIF DES POINTS");

      // Calcul des scores par catégorie
      const categoryScores: {
        category: string;
        score: number;
        total: number;
        percentage: number;
      }[] = [];

      categories.forEach((category) => {
        const categoryItems = getItemsByCategory(category);
        const categoryAnswers = report.answers.filter((a) =>
          categoryItems.some((item) => item.id === a.itemId)
        );

        const compliantCount = categoryAnswers.filter(
          (a) => a.status === "compliant"
        ).length;
        const totalAnswered = categoryAnswers.length;
        const totalPossible = categoryItems.length;

        // Score = conformes + non-évalués (considérés conformes)
        const score = compliantCount + (totalPossible - totalAnswered);
        const percentage =
          totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;

        categoryScores.push({
          category,
          score,
          total: totalPossible,
          percentage,
        });
      });

      // Vérifier si nouvelle page nécessaire
      if (yPosition > pdf.internal.pageSize.getHeight() - 100) {
        pdf.addPage();
        yPosition = margin;
      }

      // En-tête du tableau
      const colWidths = [90, 25, 25, 30];
      const cellHeight = 8;

      // Dessiner l'en-tête sans remplissage
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(
        margin,
        yPosition,
        colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        cellHeight,
        "S"
      );

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);

      pdf.text("CATEGORIE", margin + 2, yPosition + 6);
      pdf.text("SCORE", margin + colWidths[0] + 5, yPosition + 6);
      pdf.text(
        "TOTAL",
        margin + colWidths[0] + colWidths[1] + 5,
        yPosition + 6
      );
      pdf.text(
        "TAUX %",
        margin + colWidths[0] + colWidths[1] + colWidths[2] + 5,
        yPosition + 6
      );

      yPosition += cellHeight;

      // Lignes du tableau
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);

      categoryScores.forEach((cat, index) => {
        // Vérifier si nouvelle page nécessaire
        if (yPosition > pdf.internal.pageSize.getHeight() - margin - 20) {
          pdf.addPage();
          yPosition = margin;
        }

        // Bordures uniquement
        pdf.setDrawColor(0, 0, 0);
        pdf.rect(margin, yPosition, colWidths[0], cellHeight, "S");
        pdf.rect(
          margin + colWidths[0],
          yPosition,
          colWidths[1],
          cellHeight,
          "S"
        );
        pdf.rect(
          margin + colWidths[0] + colWidths[1],
          yPosition,
          colWidths[2],
          cellHeight,
          "S"
        );
        pdf.rect(
          margin + colWidths[0] + colWidths[1] + colWidths[2],
          yPosition,
          colWidths[3],
          cellHeight,
          "S"
        );

        // Contenu
        pdf.setFontSize(9);
        const categoryText = pdf.splitTextToSize(
          cat.category,
          colWidths[0] - 4
        );
        pdf.text(categoryText[0], margin + 2, yPosition + 6);

        pdf.text(
          cat.score.toString(),
          margin + colWidths[0] + 8,
          yPosition + 6
        );
        pdf.text(
          cat.total.toString(),
          margin + colWidths[0] + colWidths[1] + 8,
          yPosition + 6
        );

        // Texte du pourcentage sans couleur
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `${cat.percentage}%`,
          margin + colWidths[0] + colWidths[1] + colWidths[2] + 8,
          yPosition + 6
        );
        pdf.setFont("helvetica", "normal");

        yPosition += cellHeight;
      });

      // Ligne de total
      yPosition += 2;
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(
        margin,
        yPosition,
        colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        cellHeight,
        "S"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);

      const totalScore = categoryScores.reduce(
        (sum, cat) => sum + cat.score,
        0
      );
      const totalPossible = categoryScores.reduce(
        (sum, cat) => sum + cat.total,
        0
      );
      const overallPercentage =
        totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

      pdf.text("SCORE GLOBAL", margin + 2, yPosition + 6);
      pdf.text(totalScore.toString(), margin + colWidths[0] + 8, yPosition + 6);
      pdf.text(
        totalPossible.toString(),
        margin + colWidths[0] + colWidths[1] + 8,
        yPosition + 6
      );
      pdf.text(
        `${overallPercentage}%`,
        margin + colWidths[0] + colWidths[1] + colWidths[2] + 8,
        yPosition + 6
      );

      yPosition += cellHeight + 10;

      // Légende
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        "Note : Les elements non evalues sont consideres comme conformes dans le calcul du score.",
        margin,
        yPosition
      );
      yPosition += 8;

      // Recommandation professionnelle
      addSection("RECOMMANDATION PROFESSIONNELLE");
      addText(
        "Les resultats de cette auto-inspection montrent qu'un systeme qualite solide ne peut s'improviser : il exige methode, suivi et outils adaptes. Pour transformer vos efforts en veritables resultats mesurables, adoptez PharmaQMS, la solution digitale concue pour les officines africaines et alignee sur la norme ISO 9001.",
        11,
        false,
        "teal"
      );

      // Sauvegarde du PDF
      const safeName = report.pharmacyInfo.name
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .toLowerCase();
      const fileName = `auto-inspection-${safeName}-${
        new Date(report.date).toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
      const pdfBlob = pdf.output("blob");
      return { blob: pdfBlob, fileName };

      console.log(
        "InspectionReportService: PDF generated successfully:",
        fileName
      );
    } catch (error) {
      console.error("InspectionReportService: Error generating PDF:", error);
      throw new Error(
        `Erreur lors de la generation du PDF: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  }

  public clearReport(): void {
    this.currentReport = null;
  }
}

export const inspectionReportService = InspectionReportService.getInstance();
