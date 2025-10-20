import { Procedure } from '../types/procedures';
import jsPDF from 'jspdf';
import { generateDocumentCode, getCategoryByCode, getProcessForCategory } from '../data/documentClassification';
import { procedureTemplates } from '../data/procedureTemplates';

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

      // Generate classification code FIRST (before header)
      let classificationCode = '';
      let pharmacyInitials = '';
      let categoryInfo = null;
      let processInfo = null;

      const template = procedureTemplates.find(t => t.id === procedure.templateId);

      if (template?.classificationCode && procedure.info.pharmacyName) {
        // Use stored initials if available, otherwise extract from pharmacy name
        if ((procedure.info as any)._pharmacyInitials) {
          pharmacyInitials = (procedure.info as any)._pharmacyInitials;
        } else {
          const words = procedure.info.pharmacyName.trim().split(/\s+/);
          pharmacyInitials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
        }

        // Get process code
        categoryInfo = getCategoryByCode(template.classificationCode);
        processInfo = categoryInfo ? getProcessForCategory(template.classificationCode) : undefined;

        if (processInfo) {
          classificationCode = generateDocumentCode(pharmacyInitials, processInfo.code, template.classificationCode);
        }
      }

      // En-tete du document avec design ameliore
      addText('PROCEDURE OFFICINALE', 18, true, 'teal', 'center', 1.0);
      yPosition += 2;
      addText(procedure.info.pharmacyName.toUpperCase(), 14, true, 'black', 'center', 1.0);
      yPosition += 5;

      // Classification Badge and Description
      if (classificationCode && categoryInfo && processInfo) {
        // Badge with classification code
        pdf.setFillColor(224, 242, 241);
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        const badgeWidth = 70;
        const badgeHeight = 12;
        const badgeX = (pageWidth - badgeWidth) / 2;
        pdf.roundedRect(badgeX, yPosition, badgeWidth, badgeHeight, 2, 2, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(0, 150, 136);
        pdf.text(classificationCode, pageWidth / 2, yPosition + 8, { align: 'center' });
        yPosition += badgeHeight + 5;

        // Description of classification
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);
        const descLine1 = `Processus ${processInfo.code}: ${this.removeAccents(processInfo.name)}`;
        pdf.text(descLine1, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;

        const descLine2 = `${this.removeAccents(categoryInfo.name)}`;
        pdf.text(descLine2, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 7;

        pdf.setTextColor(0, 0, 0);
      }

      // Ligne decorative
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(1);
      pdf.line(leftMargin + 50, yPosition, pageWidth - rightMargin - 50, yPosition);
      yPosition += 10;

      // Informations du document
      addSection('INFORMATIONS DU DOCUMENT');

      const pharmacyDisplayName = procedure.info.pharmacyName
        ? (classificationCode ? `${procedure.info.pharmacyName} [${classificationCode}]` : procedure.info.pharmacyName)
        : procedure.info.pharmacyName;

      // Tableau d'informations avec mise en forme amelioree
      const infoData = [
        ['Titre:', procedure.info.title],
        ['Pharmacie:', pharmacyDisplayName],
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

      // Instructions de travail - Nouvelle page dédiée
      addFooter();
      pdf.addPage();
      yPosition = topMargin;

      addSection('INSTRUCTIONS DE TRAVAIL - FLUX DE PROCESSUS');

      yPosition += 5;

      // Tableau avec les étapes de la procédure
      const tableStartY = yPosition;
      const colWidths = [10, 55, 45, 55]; // N°, ETAPE, RESPONSABLE, KPI+DOCS
      const rowHeight = 22;
      const tableX = leftMargin;

      // En-têtes du tableau avec double ligne
      pdf.setFillColor(0, 150, 136);
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(0.5);

      // Première ligne: QUOI, QUI, COMMENT (hauteur augmentée pour meilleure visibilité)
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);

      // Première colonne vide (N°)
      pdf.rect(tableX, yPosition, colWidths[0], 7, 'FD');

      // QUOI - au-dessus de ETAPE (blanc)
      pdf.rect(tableX + colWidths[0], yPosition, colWidths[1], 7, 'FD');
      pdf.setTextColor(255, 255, 255);
      pdf.text('QUOI', tableX + colWidths[0] + colWidths[1] / 2, yPosition + 5, { align: 'center' });

      // QUI - au-dessus de RESPONSABLE (noir)
      pdf.rect(tableX + colWidths[0] + colWidths[1], yPosition, colWidths[2], 7, 'FD');
      pdf.setTextColor(0, 0, 0);
      pdf.text('QUI', tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, yPosition + 5, { align: 'center' });

      // COMMENT - au-dessus de KPI/DOCUMENTS (noir sur fond blanc)
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(0, 150, 136);
      pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], yPosition, colWidths[3], 7, 'FD');
      pdf.setTextColor(0, 0, 0);
      pdf.text('COMMENT', tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, yPosition + 5, { align: 'center' });

      // Restaurer le fond teal pour la suite
      pdf.setFillColor(0, 150, 136);

      yPosition += 7;

      // Deuxième ligne: détails
      let xPos = tableX;
      const subHeaders = ['N°', 'ETAPE', 'RESPONSABLE', 'KPI / DOCUMENTS'];

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.setTextColor(255, 255, 255);

      subHeaders.forEach((header, i) => {
        pdf.rect(xPos, yPosition, colWidths[i], 6, 'FD');
        pdf.text(header, xPos + colWidths[i] / 2, yPosition + 4.5, { align: 'center' });
        xPos += colWidths[i];
      });

      yPosition += 6;

      // Corps du tableau - utiliser les étapes de la procédure
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);

      // Mapper les indicateurs aux étapes
      const stepIndicators = new Map<number, string>();
      procedure.indicators.forEach((indicator, idx) => {
        const stepIndex = idx % procedure.steps.length;
        if (!stepIndicators.has(stepIndex)) {
          stepIndicators.set(stepIndex, indicator.name || indicator.target);
        }
      });

      procedure.steps.forEach((step, index) => {
        // Vérifier si on dépasse la page
        if (yPosition > pageHeight - bottomMargin - rowHeight - 15) {
          return; // Ne pas dépasser
        }

        xPos = tableX;

        // Couleur alternée pour les lignes
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
        } else {
          pdf.setFillColor(255, 255, 255);
        }

        // Dessiner toute la ligne avec couleur de fond
        pdf.rect(xPos, yPosition, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], rowHeight, 'F');

        // Bordures
        colWidths.forEach((width) => {
          pdf.rect(xPos, yPosition, width, rowHeight);
          xPos += width;
        });

        xPos = tableX;

        // Colonne 1: N° (numéro dans cercle)
        pdf.setFillColor(0, 150, 136);
        pdf.circle(xPos + 5, yPosition + rowHeight / 2, 4, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${step.order}`, xPos + 5, yPosition + rowHeight / 2 + 2.5, { align: 'center' });
        xPos += colWidths[0];

        // Colonne 2: ETAPE (description)
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        const stepLines = pdf.splitTextToSize(this.removeAccents(step.description), colWidths[1] - 4);
        const stepText = stepLines.slice(0, 3).join(' '); // Max 3 lignes
        pdf.text(stepText, xPos + 2, yPosition + 6, { maxWidth: colWidths[1] - 4 });
        xPos += colWidths[1];

        // Colonne 3: RESPONSABLE
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(0, 100, 100);
        const respLines = pdf.splitTextToSize(this.removeAccents(step.responsible), colWidths[2] - 4);
        respLines.slice(0, 2).forEach((line: string, i: number) => {
          pdf.text(line, xPos + 2, yPosition + 8 + (i * 5));
        });
        xPos += colWidths[2];

        // Colonne 4: INDICATEUR + DOCUMENTS
        let kpiYPos = yPosition + 5;

        // KPI
        const kpi = stepIndicators.get(index) || 'Conformite';
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(0, 100, 100);
        pdf.text('KPI:', xPos + 2, kpiYPos);

        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(7);
        pdf.setTextColor(60, 60, 60);
        const kpiText = pdf.splitTextToSize(this.removeAccents(kpi), colWidths[3] - 18);
        pdf.text(kpiText[0] || kpi, xPos + 12, kpiYPos);

        kpiYPos += 5;

        // Documents/Registres
        if (step.documents && step.documents.length > 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(7);
          pdf.setTextColor(0, 100, 100);
          pdf.text('Doc:', xPos + 2, kpiYPos);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(6);
          pdf.setTextColor(40, 40, 40);
          const docsText = step.documents.slice(0, 2).join(', ');
          const docLines = pdf.splitTextToSize(this.removeAccents(docsText), colWidths[3] - 18);
          docLines.slice(0, 2).forEach((line: string, i: number) => {
            pdf.text(line, xPos + 12, kpiYPos + (i * 4));
          });
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(6);
          pdf.setTextColor(120, 120, 120);
          pdf.text('Registre qualite', xPos + 2, kpiYPos);
        }

        yPosition += rowHeight;
      });

      yPosition += 8;

      // Légende compacte
      if (yPosition < pageHeight - bottomMargin - 30) {
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(0, 150, 136);
        pdf.text('NOTES IMPORTANTES', leftMargin, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(0, 0, 0);

        const notes = [
          'Respecter ordre chronologique des etapes',
          'Chaque responsable valide avant passage etape suivante',
          'Documenter tout ecart ou deviation dans registre qualite'
        ];

        notes.forEach((note) => {
          if (yPosition < pageHeight - bottomMargin - 8) {
            pdf.setFillColor(0, 150, 136);
            pdf.circle(leftMargin + 3, yPosition - 1, 0.8, 'F');
            pdf.text(note, leftMargin + 7, yPosition);
            yPosition += 5;
          }
        });
      }

      yPosition += 5;

      // Signature et validation
      // Vérifier s'il y a assez d'espace pour les signatures
      if (yPosition > pageHeight - bottomMargin - 70) {
        addFooter();
        pdf.addPage();
        yPosition = topMargin;
      }

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