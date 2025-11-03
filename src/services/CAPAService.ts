import jsPDF from 'jspdf';

export interface CAPAAction {
  id: string;
  probleme: string;
  cause: string;
  actionCorrective: string;
  actionPreventive: string;
  responsable: string;
  delai: string;
  statut: string;
  verification: string;
}

export interface CAPAFormData {
  pharmacyName: string;
  dateCreation: string;
  responsableQualite: string;
  periode: string;
  actions: CAPAAction[];
}

class CAPAService {
  generateCAPA(data: CAPAFormData): void {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // En-tête avec logo
    const logoWidth = 25;
    const logoHeight = 25;
    const logoX = margin;
    const logoY = yPosition;

    // Dessiner le rectangle pour le logo
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(logoX, logoY, logoWidth, logoHeight);

    // Texte "LOGO" au centre
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('LOGO', logoX + logoWidth / 2, logoY + logoHeight / 2, { align: 'center' });

    // Titre à droite du logo
    const titleX = logoX + logoWidth + 5;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('PLAN CAPA', titleX, logoY + 8);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('(Actions Correctives et Préventives)', titleX, logoY + 14);

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(data.pharmacyName, titleX, logoY + 20);

    yPosition = logoY + logoHeight + 10;

    // Informations générales
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);

    const infoLeftX = margin;
    const infoRightX = pageWidth / 2 + 5;

    pdf.text('Date de création:', infoLeftX, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.dateCreation, infoLeftX + 35, yPosition);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Période concernée:', infoRightX, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.periode, infoRightX + 40, yPosition);

    yPosition += 7;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Responsable Qualité:', infoLeftX, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.responsableQualite, infoLeftX + 45, yPosition);

    yPosition += 12;

    // Tableau des actions CAPA
    const tableStartY = yPosition;
    const colWidths = [25, 30, 30, 30, 25, 20, 20, 20];
    const rowHeight = 8;
    const headerHeight = 12;

    // En-têtes du tableau
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);

    const headers = [
      'PROBLÈME\nIDENTIFIÉ',
      'CAUSE\nRACINE',
      'ACTION\nCORRECTIVE',
      'ACTION\nPRÉVENTIVE',
      'RESPONSABLE',
      'DÉLAI',
      'STATUT',
      'VÉRIFICATION'
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

    // Lignes de données
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(0, 0, 0);

    data.actions.forEach((action, index) => {
      // Vérifier si on dépasse la page
      if (yPosition + rowHeight > pageHeight - margin - 20) {
        pdf.addPage();
        yPosition = margin;
      }

      xPos = margin;
      const rowData = [
        action.probleme,
        action.cause,
        action.actionCorrective,
        action.actionPreventive,
        action.responsable,
        action.delai,
        action.statut,
        action.verification
      ];

      rowData.forEach((text, i) => {
        pdf.setDrawColor(0, 0, 0);
        pdf.rect(xPos, yPosition, colWidths[i], rowHeight, 'S');

        const lines = pdf.splitTextToSize(text || '-', colWidths[i] - 2);
        pdf.text(lines.slice(0, 2), xPos + 1, yPosition + 4);

        xPos += colWidths[i];
      });

      yPosition += rowHeight;
    });

    // Section Signature
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

    // Signature Responsable Qualité
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

    // Signature Pharmacien Titulaire
    const signatureRightX = margin + signatureBoxWidth + 10;
    pdf.rect(signatureRightX, yPosition, signatureBoxWidth, signatureBoxHeight);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Pharmacien Titulaire:', signatureRightX + 2, yPosition + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Date: ________________', signatureRightX + 2, yPosition + 11);
    pdf.text('Signature:', signatureRightX + 2, yPosition + 17);

    // Pied de page
    const footerY = pageHeight - margin + 5;
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, footerY);
    pdf.text('PHARMA QMS - Module Documents', pageWidth - margin, footerY, { align: 'right' });

    // Télécharger le PDF
    const fileName = `Plan_CAPA_${data.pharmacyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }
}

export const capaService = new CAPAService();