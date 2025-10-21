import { Procedure } from '../types/procedure';
import jsPDF from 'jspdf';

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

      const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = 'black', align: 'left' | 'center' | 'right' = 'left', lineSpacing: number = 1.15) => {
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
        const lines = pdf.splitTextToSize(text, textWidth);

        let xPosition = leftMargin;
        if (align === 'center') {
          xPosition = pageWidth / 2;
        } else if (align === 'right') {
          xPosition = pageWidth - rightMargin;
        }

        pdf.text(lines, xPosition, yPosition, { align: align === 'left' ? undefined : align });
        const lineHeight = fontSize * 0.35 * lineSpacing;
        yPosition += lines.length * lineHeight + 3;

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
        
        // Page number on the left
        const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
        pdf.text(`Page ${pageNum}`, leftMargin, footerY);
        
        // PHARMA QMS reference on the right
        pdf.text('PHARMA QMS - Systeme de Management de la Qualite', pageWidth - rightMargin, footerY, { align: 'right' });
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
      };

      const addSection = (title: string) => {
        yPosition += 8;
        const lineY = yPosition;
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        pdf.line(leftMargin, lineY, pageWidth - rightMargin, lineY);
        yPosition += 5;

        addText(title, 12, true, 'teal', 'left', 1.0);
        yPosition += 3;
      };

      const addSeparatorLine = () => {
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        pdf.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
        yPosition += 6;
      };

      // Initialize position
      yPosition = topMargin;

      // En-tete du document avec design ameliore
      addText('PROCEDURE OFFICINALE', 18, true, 'teal', 'center', 1.0);
      yPosition += 2;
      addText(procedure.info.pharmacyName.toUpperCase(), 14, true, 'black', 'center', 1.0);
      yPosition += 5;

      // Ligne decorative
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(1);
      pdf.line(leftMargin + 50, yPosition, pageWidth - rightMargin - 50, yPosition);
      yPosition += 10;

      // Informations du document
      addSection('INFORMATIONS DU DOCUMENT');
      
      // Tableau d'informations avec mise en forme amelioree
      const infoData = [
        ['Titre:', procedure.info.title],
        ['Version:', procedure.info.version],
        ['Date de creation:', new Date(procedure.info.creationDate).toLocaleDateString('fr-FR')],
        ['Duree de validite:', procedure.info.validityDuration],
        ['Auteur:', procedure.info.author]
      ];
      
      if (procedure.info.reviewer) {
        infoData.push(['Responsable de revision:', procedure.info.reviewer]);
      }
      
      infoData.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(label, leftMargin, yPosition);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const valueLines = pdf.splitTextToSize(value, pageWidth - leftMargin - rightMargin - 60);
        pdf.text(valueLines, leftMargin + 60, yPosition);
        yPosition += Math.max(6, valueLines.length * 5);
      });
      
      addSeparatorLine();

      // Objectif
      addSection('OBJECTIF');
      addText(procedure.info.objective, 10, false, 'black', 'left', 1.2);
      yPosition += 2;

      // Champ d'application
      addSection('CHAMP D\'APPLICATION');
      addText(procedure.info.scope, 10, false, 'black', 'left', 1.2);
      yPosition += 2;

      // Etapes de la procedure
      addSection('DESCRIPTION DETAILLEE');
      
      procedure.steps.forEach((step, index) => {
        addText(`ETAPE ${step.order}`, 11, true, 'teal', 'left', 1.0);
        yPosition -= 1;
        addText(step.description, 10, false, 'black', 'left', 1.2);

        if (step.responsible) {
          addText(`> Responsable: ${step.responsible}`, 10, false, 'gray', 'left', 1.1);
          yPosition -= 1;
        }

        if (step.duration) {
          addText(`> Duree estimee: ${step.duration}`, 10, false, 'gray', 'left', 1.1);
          yPosition -= 1;
        }

        if (step.documents.length > 0) {
          addText(`> Documents/Registres: ${step.documents.join(', ')}`, 10, false, 'gray', 'left', 1.1);
          yPosition -= 1;
        }

        yPosition += 5;
      });

      // Indicateurs de performance
      if (procedure.indicators.length > 0) {
        addSection('INDICATEURS DE PERFORMANCE');
        
        procedure.indicators.forEach((indicator, index) => {
          addText(`${index + 1}. ${indicator.name}`, 10, true, 'black', 'left', 1.15);
          yPosition -= 1;
          if (indicator.description) {
            addText(`   Description: ${indicator.description}`, 10, false, 'black', 'left', 1.15);
            yPosition -= 1;
          }
          if (indicator.target) {
            addText(`   Objectif: ${indicator.target}`, 10, false, 'black', 'left', 1.15);
            yPosition -= 1;
          }
          addText(`   Frequence: ${indicator.frequency}`, 10, false, 'black', 'left', 1.15);
          yPosition += 3;
        });
      }

      // Annexes
      if (procedure.annexes.length > 0) {
        addSection('ANNEXES');
        
        procedure.annexes.forEach((annex, index) => {
          const typeLabel = annex.type === 'document' ? 'Document' :
                          annex.type === 'form' ? 'Formulaire' : 'Reference reglementaire';

          addText(`Annexe ${index + 1}: ${annex.title}`, 10, true, 'black', 'left', 1.15);
          yPosition -= 1;
          addText(`   Type: ${typeLabel}`, 10, false, 'black', 'left', 1.15);
          yPosition -= 1;
          if (annex.description) {
            addText(`   Description: ${annex.description}`, 10, false, 'black', 'left', 1.15);
            yPosition -= 1;
          }
          if (annex.reference) {
            addText(`   Reference: ${annex.reference}`, 10, false, 'black', 'left', 1.15);
            yPosition -= 1;
          }
          yPosition += 3;
        });
      }

      // Informations de tracabilite
      addSection('TRACABILITE');
      addText(`Document genere le: ${new Date().toLocaleDateString('fr-FR')} a ${new Date().toLocaleTimeString('fr-FR')}`, 10, false, 'gray', 'left', 1.1);
      yPosition -= 1;
      addText(`Systeme: PHARMA QMS - Module Procedures v1.0`, 10, false, 'gray', 'left', 1.1);

      // Signature et validation
      addSection('SIGNATURES ET VALIDATION');
      
      // Cadres pour signatures avec design ameliore
      const signatureBoxHeight = 22;
      const signatureBoxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;

      // Signature auteur
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.rect(leftMargin, yPosition, signatureBoxWidth, signatureBoxHeight);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Rédigé par:', leftMargin + 3, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text(procedure.info.author, leftMargin + 3, yPosition + 10);
      pdf.text('Date: _______________', leftMargin + 3, yPosition + 15);
      pdf.text('Signature:', leftMargin + 3, yPosition + 20);

      // Reset position for second signature box
      const tempY = yPosition;

      if (procedure.info.reviewer) {
        pdf.rect(leftMargin + signatureBoxWidth + 10, tempY, signatureBoxWidth, signatureBoxHeight);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Vérifié par:', leftMargin + signatureBoxWidth + 13, tempY + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.text(procedure.info.reviewer, leftMargin + signatureBoxWidth + 13, tempY + 10);
        pdf.text('Date: _______________', leftMargin + signatureBoxWidth + 13, tempY + 15);
      }

      yPosition += signatureBoxHeight + 8;

      // Signature approbation (pleine largeur)
      pdf.rect(leftMargin, yPosition, pageWidth - leftMargin - rightMargin, signatureBoxHeight);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Approuvé par: Pharmacien titulaire', leftMargin + 3, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date: _______________', leftMargin + 3, yPosition + 10);
      pdf.text('Signature et cachet:', leftMargin + 3, yPosition + 15);
      
      yPosition += signatureBoxHeight + 10;
      
      // Add footer to all pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        
        // Page number on the left
        pdf.text(`Page ${i}/${totalPages}`, leftMargin, footerY);
        
        // PHARMA QMS reference on the right
        pdf.text('PHARMA QMS - Systeme de Management de la Qualite', pageWidth - rightMargin, footerY, { align: 'right' });
      }

      // Generer le nom de fichier securise
      const safeProcedureTitle = procedure.info.title
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      
      const safePharmacyName = procedure.info.pharmacyName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();

      const fileName = `procedure-${safeProcedureTitle}-${safePharmacyName}-v${procedure.info.version}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating procedure PDF:', error);
      throw new Error(`Erreur lors de la generation du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}

export const procedureService = ProcedureService.getInstance();