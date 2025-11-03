import jsPDF from 'jspdf';
import { InspectionReport, InspectionAnswer } from '../types/inspection';
import { inspectionItems } from '../data/inspectionItems';

export interface ActionPlanItem {
  gap: string;
  gapType: 'critical' | 'major' | 'minor';
  establishmentResponse: string;
  completionDate: string;
  responsible: string;
  inspectorComment: string;
  responseAccepted: 'OUI' | 'NON' | '';
}

export interface ActionPlanData {
  pharmacyName: string;
  dateCreation: string;
  inspectionDate: string;
  responsableQualite: string;
  items: ActionPlanItem[];
}

class ActionPlanService {
  generateActionPlan(report: InspectionReport, actionPlanData: ActionPlanData): void {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    const logoWidth = 25;
    const logoHeight = 25;
    const logoX = margin;
    const logoY = yPosition;

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(logoX, logoY, logoWidth, logoHeight);

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('LOGO', logoX + logoWidth / 2, logoY + logoHeight / 2, { align: 'center' });

    const titleX = logoX + logoWidth + 5;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('PLAN D\'ACTION CORRECTIVE ET PRÉVENTIVE', titleX, logoY + 8);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(actionPlanData.pharmacyName, titleX, logoY + 16);

    yPosition = logoY + logoHeight + 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);

    const infoLeftX = margin;
    const infoRightX = pageWidth / 2 + 5;

    pdf.text('Date de création:', infoLeftX, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(actionPlanData.dateCreation, infoLeftX + 35, yPosition);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Date d\'inspection:', infoRightX, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(actionPlanData.inspectionDate, infoRightX + 40, yPosition);

    yPosition += 7;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Responsable Qualité:', infoLeftX, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(actionPlanData.responsableQualite, infoLeftX + 45, yPosition);

    yPosition += 12;

    const colWidths = [45, 55, 30, 30, 45, 25];
    const rowHeight = 10;
    const headerHeight = 15;

    const gapsByType = {
      critical: actionPlanData.items.filter(item => item.gapType === 'critical'),
      major: actionPlanData.items.filter(item => item.gapType === 'major'),
      minor: actionPlanData.items.filter(item => item.gapType === 'minor')
    };

    const gapTypeLabels = {
      critical: 'ÉCARTS CRITIQUES',
      major: 'ÉCARTS MAJEURS',
      minor: 'ÉCARTS MINEURS'
    };

    ['critical', 'major', 'minor'].forEach(gapType => {
      const items = gapsByType[gapType as keyof typeof gapsByType];

      if (items.length === 0) return;

      if (yPosition > pageHeight - margin - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(gapTypeLabels[gapType as keyof typeof gapTypeLabels], margin, yPosition);
      yPosition += 8;

      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);

      const headers = [
        'ÉCART IDENTIFIÉ',
        'RÉPONSE ÉTABLISSEMENT\n(Corrections, cause première,\nactions correctives/préventives)',
        'DATE\nD\'ACHÈVEMENT\nPROPOSÉE',
        'RESPONSABLE',
        'COMMENTAIRE\nDE L\'INSPECTEUR',
        'RÉPONSE\nACCEPTÉE\nOUI/NON'
      ];

      let xPos = margin;
      headers.forEach((header, i) => {
        pdf.setDrawColor(0, 0, 0);
        pdf.rect(xPos, yPosition, colWidths[i], headerHeight, 'S');

        const lines = header.split('\n');
        const lineHeight = 4;
        const startY = yPosition + (headerHeight - lines.length * lineHeight) / 2 + 3;

        lines.forEach((line, lineIndex) => {
          pdf.text(line, xPos + colWidths[i] / 2, startY + lineIndex * lineHeight, { align: 'center' });
        });

        xPos += colWidths[i];
      });

      yPosition += headerHeight;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(0, 0, 0);

      items.forEach((item) => {
        if (yPosition + rowHeight > pageHeight - margin - 20) {
          pdf.addPage();
          yPosition = margin;
        }

        xPos = margin;
        const rowData = [
          item.gap,
          item.establishmentResponse,
          item.completionDate,
          item.responsible,
          item.inspectorComment,
          item.responseAccepted
        ];

        rowData.forEach((text, i) => {
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(xPos, yPosition, colWidths[i], rowHeight, 'S');

          const lines = pdf.splitTextToSize(text || '-', colWidths[i] - 2);
          pdf.text(lines.slice(0, 3), xPos + 1, yPosition + 4);

          xPos += colWidths[i];
        });

        yPosition += rowHeight;
      });

      yPosition += 8;
    });

    yPosition += 10;

    if (yPosition + 30 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VALIDATION', margin, yPosition);

    yPosition += 8;

    const signatureBoxWidth = (pageWidth - 2 * margin - 10) / 2;
    const signatureBoxHeight = 20;

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.3);
    pdf.rect(margin, yPosition, signatureBoxWidth, signatureBoxHeight);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Responsable Qualité:', margin + 2, yPosition + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Date: ________________', margin + 2, yPosition + 11);
    pdf.text('Signature:', margin + 2, yPosition + 17);

    const signatureRightX = margin + signatureBoxWidth + 10;
    pdf.rect(signatureRightX, yPosition, signatureBoxWidth, signatureBoxHeight);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Pharmacien Titulaire:', signatureRightX + 2, yPosition + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Date: ________________', signatureRightX + 2, yPosition + 11);
    pdf.text('Signature:', signatureRightX + 2, yPosition + 17);

    const footerY = pageHeight - margin + 5;
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, footerY);
    pdf.text('PHARMA QMS - Module Inspection', pageWidth - margin, footerY, { align: 'right' });

    const fileName = `Plan_Action_${actionPlanData.pharmacyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  private generateDefaultResponse(gapDescription: string, gapType: 'critical' | 'major' | 'minor'): string {
    const corrections = `Corrections immédiates : Mise en conformité de ${gapDescription.toLowerCase()}`;
    const rootCause = `Cause première identifiée : Absence de procédure formalisée / Défaut de suivi / Formation insuffisante`;
    const correctiveActions = `Actions correctives : Élaboration et mise en place de la procédure / Formation du personnel / Audit de vérification`;
    const preventiveActions = `Actions préventives : Intégration dans le système qualité / Revue périodique / Sensibilisation continue de l'équipe`;
    const evidence = `Preuves objectives fournies : Documentation disponible dans le logiciel PharmaQMS (procédures, registres, formations, audits)`;

    return `${corrections}\n\n${rootCause}\n\n${correctiveActions}\n\n${preventiveActions}\n\n${evidence}`;
  }

  private calculateCompletionDate(gapType: 'critical' | 'major' | 'minor'): string {
    const today = new Date();
    let monthsToAdd = 0;

    switch (gapType) {
      case 'critical':
        monthsToAdd = 2;
        break;
      case 'major':
        monthsToAdd = 4;
        break;
      case 'minor':
        monthsToAdd = 6;
        break;
    }

    const completionDate = new Date(today);
    completionDate.setMonth(completionDate.getMonth() + monthsToAdd);

    const year = completionDate.getFullYear();
    const month = String(completionDate.getMonth() + 1).padStart(2, '0');
    const day = String(completionDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getDefaultResponsible(gapType: 'critical' | 'major' | 'minor'): string {
    switch (gapType) {
      case 'critical':
        return 'Pharmacien Titulaire';
      case 'major':
      case 'minor':
        return 'Pharmacien Assistant / Responsable Qualité';
    }
  }

  prepareActionPlanItems(report: InspectionReport): ActionPlanItem[] {
    const nonCompliantAnswers = report.answers.filter(a => a.status === 'non-compliant');

    return nonCompliantAnswers.map(answer => {
      const item = inspectionItems.find(i => i.id === answer.itemId);
      const gapType = answer.gapType || 'minor';
      const gapDescription = item?.description || 'Écart non identifié';

      return {
        gap: gapDescription,
        gapType,
        establishmentResponse: this.generateDefaultResponse(gapDescription, gapType),
        completionDate: this.calculateCompletionDate(gapType),
        responsible: this.getDefaultResponsible(gapType),
        inspectorComment: answer.comment || '',
        responseAccepted: ''
      };
    });
  }
}

export const actionPlanService = new ActionPlanService();