import jsPDF from 'jspdf';
import { AdverseEventReport } from '../types/adverseEvents';

export class AdverseEventPDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 10;
  private currentY: number = 10;
  private readonly lineHeight = 5;

  constructor() {
    this.pdf = new jsPDF('landscape', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
  }

  generate(report: AdverseEventReport): jsPDF {
    this.drawHeader(report);
    this.drawPatientSection(report);
    this.drawProductsTable(report);
    this.drawBatimeSection(report);
    this.drawEvolutionSection(report);
    this.drawNotifierSection(report);

    return this.pdf;
  }

  private drawHeader(report: AdverseEventReport) {
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');

    const title = 'FICHE DE NOTIFICATION DES EFFETS/EVENEMENTS INDESIRABLES (OBSERVES APRES L\'UTILISATION DE PRODUIT DE SANTE';
    this.pdf.text(title, this.pageWidth / 2, 8, { align: 'center' });

    this.pdf.setFontSize(7);
    this.pdf.text('A compléter par le professionnel de santé et à adresser au centre national ou régional de pharmacovigilance et de matériovigilance', this.pageWidth / 2, 12, { align: 'center' });

    this.pdf.setFontSize(8);
    const dateText = `Date: __________ NUMERO: BEN _______ / ______ / ______ / ______`;
    this.pdf.text(dateText, this.pageWidth / 2, 17, { align: 'center' });

    this.currentY = 20;
  }

  private drawPatientSection(report: AdverseEventReport) {
    const startY = this.currentY;
    const sectionHeight = 35;

    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, sectionHeight);

    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PATIENT', this.margin + 2, startY + 5);

    const col1X = this.margin + 2;
    const col2X = this.pageWidth - this.margin - 80;
    let lineY = startY + 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(7);

    this.pdf.text(`Nom: ${report.patient.lastName || '________'}`, col1X, lineY);
    this.pdf.text(`Prénom: ${report.patient.firstName || '________'}`, col1X + 40, lineY);
    this.pdf.text(`Sexe: ${report.patient.sex === 'M' ? 'M' : 'F'} ____`, col1X + 80, lineY);
    lineY += 5;

    this.pdf.text(`Age: ${report.patient.ageYears || '__'} Ans`, col1X, lineY);
    this.pdf.text(`Poids: ${report.patient.weight || '__'} Kg`, col1X + 30, lineY);
    this.pdf.text(`Taille: ${report.patient.height || '__'} Cm`, col1X + 55, lineY);
    lineY += 6;

    this.pdf.text('Adresse (Pays, Commune, Quartier):', col1X, lineY);
    lineY += 5;
    this.pdf.text(report.patient.address || '________________________________', col1X, lineY);
    lineY += 6;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ANTECEDENTS / FACTEURS FAVORISANTS:', col1X, lineY);
    lineY += 5;
    this.pdf.setFont('helvetica', 'normal');

    const antecedents = [
      { key: 'pregnancy', label: 'Grossesse' },
      { key: 'alcoholism', label: 'Alcoolisme' },
      { key: 'hepatopathy', label: 'Hépatopathie' },
      { key: 'allergy', label: 'Allergie' },
      { key: 'nephropathy', label: 'Néphropathie' }
    ];

    let antX = col1X;
    antecedents.forEach((ant, idx) => {
      const checked = report.medicalHistory[ant.key as keyof typeof report.medicalHistory];
      this.pdf.rect(antX, lineY - 3, 3, 3);
      if (checked) {
        this.pdf.text('X', antX + 0.8, lineY - 0.5);
      }
      this.pdf.text(ant.label, antX + 4, lineY);
      antX += 30;
    });

    this.pdf.setLineWidth(0.3);
    this.pdf.line(col2X - 5, startY, col2X - 5, startY + sectionHeight);

    let rightY = startY + 8;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(7);
    this.pdf.text('Date de prise/vaccination', col2X, rightY);
    rightY += 4;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`${report.adverseEvent.administrationDate || '__ / __ / ____'}`, col2X, rightY);
    rightY += 6;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Date d\'apparition de l\'effet', col2X, rightY);
    rightY += 4;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`${report.adverseEvent.eventDate || '__ / __ / ____'}`, col2X, rightY);
    rightY += 6;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Nouveau-né (à la naissance)', col2X, rightY);
    rightY += 4;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.rect(col2X, rightY - 3, 3, 3);
    if (report.patient.isNewborn) {
      this.pdf.text('X', col2X + 0.8, rightY - 0.5);
    }
    this.pdf.text('Oui', col2X + 4, rightY);
    this.pdf.rect(col2X + 15, rightY - 3, 3, 3);
    this.pdf.text('Non', col2X + 19, rightY);

    this.currentY = startY + sectionHeight + 2;
  }

  private drawProductsTable(report: AdverseEventReport) {
    const startY = this.currentY;
    const tableWidth = this.pageWidth - 2 * this.margin;

    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margin, startY, tableWidth, 8);

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(8);
    this.pdf.text('PRODUIT(S) SUSPECTE(S): médicaments, vaccins, solvants et plantes médicinales', this.margin + 2, startY + 5);

    const headerY = startY + 8;
    const rowHeight = 6;

    const columns = [
      { label: 'NOM DU PRODUIT', width: 35 },
      { label: 'NOM DU FABRICANT', width: 35 },
      { label: 'N° DE LOT', width: 20 },
      { label: 'VOIE D\'ADM.', width: 20 },
      { label: 'DATE DE DEBUT', width: 22 },
      { label: 'DATE DE FIN', width: 22 },
      { label: 'POSOLOGIE', width: 25 },
      { label: 'DATE DE PEREMPTION', width: 28 },
      { label: 'INDICATION', width: 30 }
    ];

    let currentX = this.margin;

    columns.forEach(col => {
      this.pdf.rect(currentX, headerY, col.width, rowHeight);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(6);
      const lines = this.pdf.splitTextToSize(col.label, col.width - 2);
      const textY = headerY + (rowHeight / 2) + 1;
      this.pdf.text(lines, currentX + col.width / 2, textY, { align: 'center' });
      currentX += col.width;
    });

    let dataY = headerY + rowHeight;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(7);

    const maxRows = Math.max(5, report.suspectProducts.length);

    for (let i = 0; i < maxRows; i++) {
      const product = report.suspectProducts[i];
      currentX = this.margin;

      const values = product ? [
        product.productName || '',
        product.manufacturer || '',
        product.lotNumber || '',
        product.administrationRoute || '',
        product.startDate || '',
        product.endDate || '',
        product.dosage || '',
        product.expirationDate || '',
        product.indication || ''
      ] : Array(9).fill('');

      columns.forEach((col, idx) => {
        this.pdf.rect(currentX, dataY, col.width, rowHeight);
        if (values[idx]) {
          const text = this.pdf.splitTextToSize(values[idx], col.width - 2);
          this.pdf.text(text, currentX + 1, dataY + 4);
        }
        currentX += col.width;
      });

      dataY += rowHeight;
    }

    const contextY = dataY;
    this.pdf.rect(this.margin, contextY, tableWidth, 15);

    let ctxY = contextY + 5;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(7);
    this.pdf.text('Préciser si: contexte d\'utilisation (entourer)', this.margin + 2, ctxY);
    ctxY += 5;

    this.pdf.setFont('helvetica', 'normal');
    const contexts = [
      { key: 'selfMedication', label: 'Automédication' },
      { key: 'pharmacodependence', label: 'Pharmacodépendance' },
      { key: 'therapeuticError', label: 'Erreur thérapeutique' },
      { key: 'medicalPrescription', label: 'Prescription médicale' }
    ];

    let ctxX = this.margin + 5;
    contexts.forEach(ctx => {
      const checked = report.productContext[ctx.key as keyof typeof report.productContext];
      if (checked) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.circle(ctxX - 2, ctxY - 1, 2);
      }
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(ctx.label, ctxX, ctxY);
      ctxX += 40;
    });

    ctxY += 5;
    this.pdf.text(`Lieu d'acquisition du produit suspect: ${report.productContext.acquisitionPlace || '________'}`, this.margin + 5, ctxY);

    this.currentY = contextY + 15 + 2;
  }

  private drawBatimeSection(report: AdverseEventReport) {
    const startY = this.currentY;
    const sectionHeight = 28;

    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, sectionHeight);

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(8);
    this.pdf.text('BATIME', this.margin + 2, startY + 5);

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(7);
    let batY = startY + 10;

    this.pdf.text('Décrire les signes et/ou symptômes (apparition brutale ou progressive?) Examen(s) biologique(s) et anatomo-pathologique', this.margin + 2, batY);
    batY += 5;

    const description = report.adverseEvent.otherDescription || '';
    if (description) {
      const lines = this.pdf.splitTextToSize(description, this.pageWidth - 2 * this.margin - 10);
      lines.forEach((line: string) => {
        this.pdf.text(line, this.margin + 5, batY);
        batY += 4;
      });
    } else {
      for (let i = 0; i < 3; i++) {
        this.pdf.text('_'.repeat(150), this.margin + 5, batY);
        batY += 4;
      }
    }

    this.currentY = startY + sectionHeight + 2;
  }

  private drawEvolutionSection(report: AdverseEventReport) {
    const startY = this.currentY;
    const sectionHeight = 35;
    const col1Width = (this.pageWidth - 2 * this.margin) / 2;

    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, sectionHeight);

    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margin + col1Width, startY, this.margin + col1Width, startY + sectionHeight);

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(8);
    this.pdf.text('GRAVITE', this.margin + 2, startY + 5);

    let gravY = startY + 10;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(7);

    const gravity = [
      { key: 'hospitalization', label: 'Hospitalisation' },
      { key: 'prolongedHospitalization', label: 'Prolongation d\'hospitalisation' },
      { key: 'permanentDisability', label: 'Incapacité/invalidité permanente' },
      { key: 'lifeThreatening', label: 'Mise en jeu du pronostic vital' },
      { key: 'congenitalMalformation', label: 'Malformation congénitale' },
      { key: 'death', label: 'Décès' }
    ];

    gravity.forEach(item => {
      const checked = report.severityEvolution[item.key as keyof typeof report.severityEvolution];
      this.pdf.rect(this.margin + 2, gravY - 3, 3, 3);
      if (checked) {
        this.pdf.text('X', this.margin + 2.8, gravY - 0.5);
      }
      this.pdf.text(item.label, this.margin + 6, gravY);
      gravY += 5;
    });

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('EVOLUTION', this.margin + col1Width + 2, startY + 5);

    let evolY = startY + 10;
    this.pdf.setFont('helvetica', 'normal');

    const evolution = [
      { key: 'recoveryWithoutSequelae', label: 'Guérison sans séquelle' },
      { key: 'recoveryWithSequelae', label: 'Guérison avec séquelle' },
      { key: 'notYetRecovered', label: 'Pas encore guéri' },
      { key: 'complications', label: 'En cours d\'évolution avec complication' },
      { key: 'deceased', label: 'Décédé(e)' },
      { key: 'unknown', label: 'Non connu' }
    ];

    evolution.forEach(item => {
      const checked = report.severityEvolution[item.key as keyof typeof report.severityEvolution];
      this.pdf.rect(this.margin + col1Width + 2, evolY - 3, 3, 3);
      if (checked) {
        this.pdf.text('X', this.margin + col1Width + 2.8, evolY - 0.5);
      }
      this.pdf.text(item.label, this.margin + col1Width + 6, evolY);
      evolY += 5;
    });

    this.currentY = startY + sectionHeight + 2;
  }

  private drawNotifierSection(report: AdverseEventReport) {
    const startY = this.currentY;
    const availableHeight = this.pageHeight - startY - 10;

    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margin, startY, this.pageWidth - 2 * this.margin, availableHeight);

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(8);
    this.pdf.text('NOTIFICATEUR:', this.margin + 2, startY + 5);

    let notY = startY + 10;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(7);

    this.pdf.text(`Département: ${report.notifier.department || '________'}`, this.margin + 2, notY);
    this.pdf.text(`ZS: ${report.notifier.zs || '________'}`, this.margin + 60, notY);
    this.pdf.text(`Commune: ${report.notifier.commune || '________'}`, this.margin + 100, notY);
    notY += 5;

    this.pdf.text(`Formation sanitaire: ${report.notifier.fs || '________'}`, this.margin + 2, notY);
    notY += 5;

    this.pdf.text(`Nom/Prénom: ${report.notifier.fullName || '________'}`, this.margin + 2, notY);
    this.pdf.text(`Qualification: ${report.notifier.qualification || '________'}`, this.margin + 80, notY);
    notY += 5;

    this.pdf.text(`Téléphone: ${report.notifier.telephone || '________'}`, this.margin + 2, notY);
    this.pdf.text(`Email: ${report.notifier.email || '________'}`, this.margin + 60, notY);
    notY += 5;

    this.pdf.text(`Date de notification: ${report.notifier.notificationDate || '__ / __ / ____'}`, this.margin + 2, notY);
    notY += 8;

    this.pdf.text('Signature et cachet: ____________________', this.margin + 2, notY);

    const footerY = this.pageHeight - 5;
    this.pdf.setFontSize(6);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Pour les éléments de la fiche de notification: (BN) = Bon à savoir – (O) = Obligatoire', this.pageWidth / 2, footerY, { align: 'center' });
  }
}
