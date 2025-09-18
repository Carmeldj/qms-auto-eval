import { TraceabilityTemplate } from '../types/traceability';
import jsPDF from 'jspdf';

export class TraceabilityService {
  private static instance: TraceabilityService;

  private constructor() {}

  public static getInstance(): TraceabilityService {
    if (!TraceabilityService.instance) {
      TraceabilityService.instance = new TraceabilityService();
    }
    return TraceabilityService.instance;
  }

  private removeAccents(text: string): string {
    return text
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[ÀÁÂÃÄÅ]/g, 'A')
      .replace(/[ÈÉÊË]/g, 'E')
      .replace(/[ÌÍÎÏ]/g, 'I')
      .replace(/[ÒÓÔÕÖ]/g, 'O')
      .replace(/[ÙÚÛÜ]/g, 'U')
      .replace(/[ÝŸ]/g, 'Y')
      .replace(/[Ç]/g, 'C')
      .replace(/[Ñ]/g, 'N')
      .replace(/'/g, "'")
      .replace(/[""]/g, '"')
      .replace(/[–—]/g, '-');
  }

  public async generatePDF(template: TraceabilityTemplate, record: any): Promise<void> {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const leftMargin = 25;
      const rightMargin = 20;
      const topMargin = 25;
      const bottomMargin = 30;
      let yPosition = topMargin;

      const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = 'black', align: 'left' | 'center' | 'right' = 'left') => {
        const cleanText = this.removeAccents(text);
        
        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }
        
        if (color === 'teal') {
          pdf.setTextColor(0, 150, 136);
        } else if (color === 'gray') {
          pdf.setTextColor(100, 100, 100);
        } else {
          pdf.setTextColor(0, 0, 0);
        }
        
        const textWidth = pageWidth - leftMargin - rightMargin;
        const lines = pdf.splitTextToSize(cleanText, textWidth);
        
        let xPosition = leftMargin;
        if (align === 'center') {
          xPosition = pageWidth / 2;
        } else if (align === 'right') {
          xPosition = pageWidth - rightMargin;
        }
        
        pdf.text(lines, xPosition, yPosition, { align: align === 'left' ? undefined : align });
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
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        
        const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
        pdf.text(`Page ${pageNum}`, leftMargin, footerY);
        pdf.text('PHARMA QMS - Systeme de Management de la Qualite', pageWidth - rightMargin, footerY, { align: 'right' });
        
        pdf.setTextColor(0, 0, 0);
      };

      const addSection = (title: string) => {
        yPosition += 15;
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        pdf.line(leftMargin, yPosition - 5, pageWidth - rightMargin, yPosition - 5);
        
        addText(title, 16, true, 'teal');
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
      addText('REGISTRE OFFICIEL DE TRACABILITE', 24, true, 'teal', 'center');
      yPosition += 5;
      addText(template.title.toUpperCase(), 18, true, 'black', 'center');
      yPosition += 10;
      
      // Ligne décorative
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(1);
      pdf.line(leftMargin + 50, yPosition, pageWidth - rightMargin - 50, yPosition);
      yPosition += 15;

      // Informations du document
      addSection('INFORMATIONS DU DOCUMENT');
      
      const docInfo = [
        ['Pharmacie:', record.data.pharmacyName || 'Non renseigne'],
        ['Type de registre:', template.title],
        ['Categorie:', template.category],
        ['Date de creation:', new Date(record.createdAt).toLocaleDateString('fr-FR')],
        ['Heure de creation:', new Date(record.createdAt).toLocaleTimeString('fr-FR')],
        ['Numero d\'enregistrement:', record.id]
      ];
      
      docInfo.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(label, leftMargin, yPosition);
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, leftMargin + 60, yPosition);
        yPosition += 8;
      });
      
      addSeparatorLine();

      // Données du formulaire
      addSection('DONNEES ENREGISTREES');
      
      template.fields.forEach(field => {
        const value = record.data[field.id] || 'Non renseigne';
        
        // Encadré pour chaque champ
        pdf.setDrawColor(240, 240, 240);
        pdf.setFillColor(250, 250, 250);
        
        const fieldHeight = field.type === 'textarea' ? 25 : 15;
        pdf.roundedRect(leftMargin - 5, yPosition - 5, pageWidth - leftMargin - rightMargin + 10, fieldHeight, 3, 3, 'F');
        
        addText(`${field.label}:`, 12, true, 'teal');
        
        if (field.type === 'textarea') {
          addText(value, 11);
        } else {
          addText(value, 11);
        }
        
        yPosition += 10;
      });

      // Section de validation
      addSection('VALIDATION ET SIGNATURES');
      
      // Cadres pour signatures
      const signatureBoxHeight = 30;
      const signatureBoxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;
      
      // Signature responsable
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(leftMargin, yPosition, signatureBoxWidth, signatureBoxHeight);
      pdf.text('Responsable de l\'enregistrement:', leftMargin + 5, yPosition + 10);
      pdf.text('Date: _______________', leftMargin + 5, yPosition + 18);
      pdf.text('Signature:', leftMargin + 5, yPosition + 26);
      
      // Signature vérificateur
      pdf.rect(leftMargin + signatureBoxWidth + 10, yPosition, signatureBoxWidth, signatureBoxHeight);
      pdf.text('Verifie par:', leftMargin + signatureBoxWidth + 15, yPosition + 10);
      pdf.text('Date: _______________', leftMargin + signatureBoxWidth + 15, yPosition + 18);
      pdf.text('Signature:', leftMargin + signatureBoxWidth + 15, yPosition + 26);
      
      yPosition += signatureBoxHeight + 15;

      // Informations de traçabilité
      addSection('TRACABILITE');
      addText(`Document genere le: ${new Date().toLocaleDateString('fr-FR')} a ${new Date().toLocaleTimeString('fr-FR')}`, 10, false, 'gray');
      addText(`Systeme: PHARMA QMS - Module Tracabilite v1.0`, 10, false, 'gray');
      addText(`Identifiant unique: ${record.id}`, 10, false, 'gray');

      // Ajouter le pied de page à toutes les pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        
        pdf.text(`Page ${i}/${totalPages}`, leftMargin, footerY);
        pdf.text('PHARMA QMS - Systeme de Management de la Qualite', pageWidth - rightMargin, footerY, { align: 'right' });
      }

      // Générer le nom de fichier sécurisé
      const safeTemplateTitle = template.title
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();

      const fileName = `registre-${safeTemplateTitle}-${new Date().toISOString().split('T')[0]}-${record.id}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating traceability PDF:', error);
      throw new Error(`Erreur lors de la generation du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}

export const traceabilityService = TraceabilityService.getInstance();