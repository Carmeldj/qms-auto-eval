import { Procedure } from '../types/procedure';
import jsPDF from 'jspdf';
import { generateDocumentCode, getCategoryByCode, getProcessForCategory } from '../data/documentClassification';
import { procedureTemplates } from '../data/procedureTemplates';
import { signatureGenerator } from './SignatureGenerator';

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
          yPosition = 45; // Espace pour l'en-tête compacte sur les pages suivantes
        }
      };

      const addFooter = () => {
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        
        // Page number on the left
        const pageNum = (pdf as any).internal.getCurrentPageInfo().pageNumber;
        pdf.text(`Page ${pageNum}`, leftMargin, footerY);
        
        // PHARMA QMS reference on the right
        pdf.text('PHARMA QMS - Systeme de Management de la Qualite', pageWidth - rightMargin, footerY, { align: 'right' });
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
      };

      const addSection = (title: string) => {
        yPosition += 8;
        addText(title, 12, true, 'teal', 'left', 1.0);

        // Ligne verte APRÈS le titre
        const lineY = yPosition - 3;
        pdf.setDrawColor(0, 150, 136);
        pdf.setLineWidth(0.5);
        pdf.line(leftMargin, lineY, pageWidth - rightMargin, lineY);
        yPosition += 5;
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

      // ====== EN-TÊTE PROFESSIONNEL AVEC TABLEAU ======
      const tableStartY = topMargin;

      // Section gauche - Informations de l'entreprise
      const leftColWidth = 120;
      const rightColWidth = (pageWidth - leftMargin - rightMargin) - leftColWidth;

      // Titre principal du document avec "PROCEDURE" avant
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(60, 60, 60);
      const titleText = `PROCÉDURE : ${procedure.info.title.toUpperCase()}`;
      const titleLines = pdf.splitTextToSize(titleText, leftColWidth - 6);
      pdf.text(titleLines, leftMargin + 3, tableStartY + 8);

      // Ligne sous le titre (ajustée selon le nombre de lignes du titre)
      const titleHeight = titleLines.length * 4.9; // 14pt font * 0.35 line height
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(0.5);
      pdf.line(leftMargin + 3, tableStartY + 8 + titleHeight, leftMargin + leftColWidth - 3, tableStartY + 8 + titleHeight);

      // Informations de la pharmacie (positionnée après le titre multi-lignes)
      const pharmacyNameY = tableStartY + 8 + titleHeight + 9;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Nom de l\'officine', leftMargin + 3, pharmacyNameY);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(60, 60, 60);
      const pharmacyLines = pdf.splitTextToSize(procedure.info.pharmacyName, leftColWidth - 10);
      pdf.text(pharmacyLines, leftMargin + 3, pharmacyNameY + 5);

      // Zone Logo supprimée - pas de logo affiché

      // Tableau de métadonnées (5 colonnes) - positionné après le nom de la pharmacie
      const pharmacyTextHeight = pharmacyLines.length * 2.8; // 8pt font * 0.35 line height
      const metaTableY = pharmacyNameY + 5 + pharmacyTextHeight + 5;
      const col1Width = 30;
      const col2Width = 28;
      const col3Width = 28;
      const col4Width = 22;
      const col5Width = (pageWidth - leftMargin - rightMargin) - col1Width - col2Width - col3Width - col4Width;

      // En-têtes du tableau SANS REMPLISSAGE
      pdf.setDrawColor(100, 100, 100);

      // Colonne 1: PROCESSUS
      pdf.rect(leftMargin, metaTableY, col1Width, 8, 'S');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.setTextColor(0, 0, 0);
      pdf.text('PROCESSUS', leftMargin + 2, metaTableY + 5.5);

      // Colonne 2: DATE D'ENTRÉE EN VIGUEUR
      pdf.rect(leftMargin + col1Width, metaTableY, col2Width, 8, 'S');
      pdf.text('DATE D\'ENTREE', leftMargin + col1Width + 2, metaTableY + 3.5);
      pdf.text('EN VIGUEUR', leftMargin + col1Width + 2, metaTableY + 6.5);

      // Colonne 3: DATE D'EXPIRATION
      pdf.rect(leftMargin + col1Width + col2Width, metaTableY, col3Width, 8, 'S');
      pdf.text('DATE', leftMargin + col1Width + col2Width + 2, metaTableY + 3.5);
      pdf.text('D\'EXPIRATION', leftMargin + col1Width + col2Width + 2, metaTableY + 6.5);

      // Colonne 4: RÉFÉRENCE
      pdf.rect(leftMargin + col1Width + col2Width + col3Width, metaTableY, col4Width, 8, 'S');
      pdf.text('REFERENCE', leftMargin + col1Width + col2Width + col3Width + 2, metaTableY + 5.5);

      // Colonne 5: N° DE VERSION
      pdf.rect(leftMargin + col1Width + col2Width + col3Width + col4Width, metaTableY, col5Width, 8, 'S');
      pdf.text('N° VERSION', leftMargin + col1Width + col2Width + col3Width + col4Width + 2, metaTableY + 5);

      // Valeurs du tableau SANS REMPLISSAGE
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);

      const valueRowY = metaTableY + 8;
      const valueRowHeight = 12;

      // Ligne épaisse entre en-têtes et valeurs
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1.5);
      pdf.line(leftMargin, valueRowY, pageWidth - rightMargin, valueRowY);

      // Rétablir l'épaisseur normale pour les bordures des cellules
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.3);

      // Calculer la date d'expiration
      const effectiveDate = new Date(procedure.info.creationDate);
      let expirationDate: Date | null = null;

      if (procedure.info.validityDuration) {
        const durationMatch = procedure.info.validityDuration.match(/(\d+)\s*(an|année|ans|années|mois|month|months)/i);
        if (durationMatch) {
          const value = parseInt(durationMatch[1]);
          const unit = durationMatch[2].toLowerCase();
          expirationDate = new Date(effectiveDate);

          if (unit.startsWith('an') || unit === 'year' || unit === 'years') {
            expirationDate.setFullYear(expirationDate.getFullYear() + value);
          } else if (unit.startsWith('mois') || unit === 'month' || unit === 'months') {
            expirationDate.setMonth(expirationDate.getMonth() + value);
          }
        }
      }

      // Valeurs - Colonne 1: Nom du processus
      pdf.rect(leftMargin, valueRowY, col1Width, valueRowHeight, 'S');
      const processName = processInfo ? processInfo.name : 'N/A';
      const processText = pdf.splitTextToSize(processName, col1Width - 4);
      pdf.text(processText, leftMargin + 2, valueRowY + 8);

      // Colonne 2: Date d'entrée en vigueur
      pdf.rect(leftMargin + col1Width, valueRowY, col2Width, valueRowHeight, 'S');
      pdf.text(effectiveDate.toLocaleDateString('fr-FR'), leftMargin + col1Width + 2, valueRowY + 8);

      // Colonne 3: Date d'expiration
      pdf.rect(leftMargin + col1Width + col2Width, valueRowY, col3Width, valueRowHeight, 'S');
      const expirationText = expirationDate ? expirationDate.toLocaleDateString('fr-FR') : 'N/A';
      pdf.text(expirationText, leftMargin + col1Width + col2Width + 2, valueRowY + 8);

      // Colonne 4: Référence
      pdf.rect(leftMargin + col1Width + col2Width + col3Width, valueRowY, col4Width, valueRowHeight, 'S');
      pdf.text(classificationCode || 'N/A', leftMargin + col1Width + col2Width + col3Width + 2, valueRowY + 8);

      // Colonne 5: Version
      pdf.rect(leftMargin + col1Width + col2Width + col3Width + col4Width, valueRowY, col5Width, valueRowHeight, 'S');
      pdf.text(procedure.info.version, leftMargin + col1Width + col2Width + col3Width + col4Width + 2, valueRowY + 8);

      // Deuxième ligne - Auteur de la procédure (pleine largeur)
      const row2Y = valueRowY + valueRowHeight;
      const row2Height = 8;

      pdf.rect(leftMargin, row2Y, pageWidth - leftMargin - rightMargin, row2Height, 'S');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.setTextColor(0, 0, 0);
      pdf.text('AUTEUR DE LA PROCEDURE:', leftMargin + 2, row2Y + 5.5);
      pdf.setFont('helvetica', 'normal');
      pdf.text(procedure.info.author || 'N/A', leftMargin + 40, row2Y + 5.5);

      // Troisième ligne - Responsable de la révision (pleine largeur, avec bordure du bas)
      const row3Y = row2Y + row2Height;
      const row3Height = 8;

      // Dessiner le rectangle complet avec toutes les bordures
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.3);
      pdf.rect(leftMargin, row3Y, pageWidth - leftMargin - rightMargin, row3Height, 'S');

      pdf.setFont('helvetica', 'bold');
      pdf.text('RESPONSABLE DE LA REVISION:', leftMargin + 2, row3Y + 5.5);
      pdf.setFont('helvetica', 'normal');
      const reviewerText = procedure.info.reviewer || 'N/A';
      pdf.text(reviewerText, leftMargin + 50, row3Y + 5.5);

      // Calculer la hauteur dynamique de l'en-tête et dessiner le rectangle principal
      const headerHeight = row3Y + row3Height - tableStartY;
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.3);
      pdf.rect(leftMargin, tableStartY, pageWidth - leftMargin - rightMargin, headerHeight, 'S');

      // Mise à jour de la position Y après l'en-tête avec plus d'espacement
      yPosition = row3Y + row3Height + 15;

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

        if (step.concernedPersons && step.concernedPersons.length > 0) {
          addText(`> Personnes concernees: ${step.concernedPersons.join(', ')}`, 10, false, 'gray', 'left', 1.1);
          yPosition -= 1;
        }

        if (step.duration) {
          addText(`> QUAND?: ${step.duration}`, 10, false, 'gray', 'left', 1.1);
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
      if (procedure.annexes && procedure.annexes.length > 0) {
        addSection('ANNEXES');

        procedure.annexes.forEach((annex, index) => {
          const typeLabel = annex.type === 'document' ? 'Document' :
                          annex.type === 'form' ? 'Formulaire' : 'Reference reglementaire';

          addText(`Annexe ${index + 1}: ${annex.title || 'Sans titre'}`, 10, true, 'black', 'left', 1.15);
          yPosition -= 1;
          addText(`   Type: ${typeLabel}`, 10, false, 'black', 'left', 1.15);
          yPosition -= 1;
          if (annex.description && annex.description.trim()) {
            addText(`   Description: ${annex.description}`, 10, false, 'black', 'left', 1.15);
            yPosition -= 1;
          }
          if (annex.reference && annex.reference.trim()) {
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
      // Vérifier s'il y a assez d'espace pour les signatures
      if (yPosition > pageHeight - bottomMargin - 70) {
        addFooter();
        pdf.addPage();
        yPosition = 45; // Espace pour l'en-tête compacte
      }

      // Vérifier s'il y a assez d'espace pour la section signatures (environ 60mm nécessaires)
      const signatureSectionHeight = 60;
      if (yPosition + signatureSectionHeight > pageHeight - bottomMargin - 15) {
        addFooter();
        pdf.addPage();
        yPosition = 45; // Espace pour l'en-tête compacte
      }

      addSection('SIGNATURES ET VALIDATION');

      // Cadres pour signatures avec design ameliore
      const signatureBoxHeight = 22;
      const signatureBoxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;

      // Helper function to add signature or initials
      const addSignatureOrInitials = (x: number, y: number, name: string, signatureImage?: string, maxWidth: number = 30, maxHeight: number = 12) => {
        if (signatureImage) {
          // Add signature image provided by user
          try {
            pdf.addImage(signatureImage, 'PNG', x, y, maxWidth, maxHeight, undefined, 'FAST');
          } catch (error) {
            console.error('Failed to add signature image:', error);
            // Generate default signature as fallback
            const generatedSignature = signatureGenerator.generateSignature(name, maxWidth * 10, maxHeight * 10);
            try {
              pdf.addImage(generatedSignature, 'PNG', x, y, maxWidth, maxHeight, undefined, 'FAST');
            } catch (err) {
              console.error('Failed to generate signature:', err);
            }
          }
        } else {
          // Generate default manuscript-style signature
          try {
            const generatedSignature = signatureGenerator.generateSignature(name, maxWidth * 10, maxHeight * 10);
            pdf.addImage(generatedSignature, 'PNG', x, y, maxWidth, maxHeight, undefined, 'FAST');
          } catch (error) {
            console.error('Failed to generate signature:', error);
            // Ultimate fallback: simple text
            const nameParts = name.trim().split(/\s+/);
            let signatureText = '';
            if (nameParts.length >= 2) {
              const lastName = nameParts[nameParts.length - 1];
              const firstNameInitial = nameParts[0][0].toUpperCase();
              signatureText = `${lastName} ${firstNameInitial}`;
            } else {
              signatureText = name;
            }
            pdf.setFont('times', 'italic');
            pdf.setFontSize(11);
            pdf.setTextColor(26, 26, 26);
            pdf.text(signatureText, x + maxWidth / 2, y + maxHeight / 2 + 3, { align: 'center' });
          }
        }
      };

      const addStamp = (x: number, y: number, stampImage: string, maxWidth: number = 20, maxHeight: number = 20) => {
        try {
          pdf.addImage(stampImage, 'PNG', x, y, maxWidth, maxHeight, undefined, 'FAST');
        } catch (error) {
          console.error('Failed to add stamp image:', error);
        }
      };

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

      const authorDate = procedure.info.authorSignature?.date || procedure.info.creationDate;
      pdf.text(`Date: ${new Date(authorDate).toLocaleDateString('fr-FR')}`, leftMargin + 3, yPosition + 15);

      // Add signature
      const signatureX = leftMargin + 3;
      const signatureY = yPosition + 16;
      addSignatureOrInitials(
        signatureX,
        signatureY,
        procedure.info.author,
        procedure.info.authorSignature?.signatureImage,
        25,
        5
      );

      // Add stamp if provided
      if (procedure.info.authorSignature?.stampImage) {
        const stampX = leftMargin + signatureBoxWidth - 23;
        const stampY = yPosition + 2;
        addStamp(stampX, stampY, procedure.info.authorSignature.stampImage, 20, 20);
      }

      // Reset position for second signature box
      const tempY = yPosition;

      if (procedure.info.reviewer) {
        pdf.rect(leftMargin + signatureBoxWidth + 10, tempY, signatureBoxWidth, signatureBoxHeight);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Vérifié par:', leftMargin + signatureBoxWidth + 13, tempY + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.text(procedure.info.reviewer, leftMargin + signatureBoxWidth + 13, tempY + 10);

        const reviewerDate = procedure.info.reviewerSignature?.date || procedure.info.creationDate;
        pdf.text(`Date: ${new Date(reviewerDate).toLocaleDateString('fr-FR')}`, leftMargin + signatureBoxWidth + 13, tempY + 15);

        // Add signature
        const reviewerSignatureX = leftMargin + signatureBoxWidth + 13;
        const reviewerSignatureY = tempY + 16;
        addSignatureOrInitials(
          reviewerSignatureX,
          reviewerSignatureY,
          procedure.info.reviewer,
          procedure.info.reviewerSignature?.signatureImage,
          25,
          5
        );

        // Add stamp if provided
        if (procedure.info.reviewerSignature?.stampImage) {
          const reviewerStampX = leftMargin + signatureBoxWidth + 10 + signatureBoxWidth - 23;
          const reviewerStampY = tempY + 2;
          addStamp(reviewerStampX, reviewerStampY, procedure.info.reviewerSignature.stampImage, 20, 20);
        }
      }

      yPosition += signatureBoxHeight + 8;

      // Signature approbation (pleine largeur)
      pdf.rect(leftMargin, yPosition, pageWidth - leftMargin - rightMargin, signatureBoxHeight);
      pdf.setFont('helvetica', 'bold');
      const approverName = procedure.info.approverSignature?.name || 'Pharmacien titulaire';
      pdf.text(`Approuvé par: ${approverName}`, leftMargin + 3, yPosition + 5);
      pdf.setFont('helvetica', 'normal');

      const approverDate = procedure.info.approverSignature?.date || procedure.info.creationDate;
      pdf.text(`Date: ${new Date(approverDate).toLocaleDateString('fr-FR')}`, leftMargin + 3, yPosition + 10);

      // Add signature
      const approverSignatureX = leftMargin + 3;
      const approverSignatureY = yPosition + 11;
      addSignatureOrInitials(
        approverSignatureX,
        approverSignatureY,
        approverName,
        procedure.info.approverSignature?.signatureImage,
        30,
        6
      );

      // Add stamp if provided (cachet is recommended for approver)
      if (procedure.info.approverSignature?.stampImage) {
        const approverStampX = pageWidth - rightMargin - 25;
        const approverStampY = yPosition + 2;
        addStamp(approverStampX, approverStampY, procedure.info.approverSignature.stampImage, 22, 22);
      }
      
      yPosition += signatureBoxHeight + 10;

      // Instructions de travail - Format paysage - DERNIÈRE PAGE
      pdf.addPage('a4', 'landscape');

      const landscapeWidth = pdf.internal.pageSize.getWidth();
      const landscapeHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      yPosition = margin;

      // Titre
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('INSTRUCTIONS DE TRAVAIL', margin, yPosition);
      yPosition += 10;

      // Tableau des colonnes: QUOI / COMMENT / QUAND / QUI / MOYENS / KPI / RESPONSABLE
      const colWidths = [40, 60, 30, 35, 40, 35, 35]; // Total: ~275
      const tableHeaderHeight = 10;
      const rowHeight = 20;

      // En-têtes (SANS couleur, juste bordures noires)
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);

      let xPos = margin;
      const headers = ['QUOI', 'COMMENT', 'QUAND', 'QUI', 'MOYENS', 'KPI', 'RESPONSABLE'];

      headers.forEach((header, i) => {
        pdf.rect(xPos, yPosition, colWidths[i], tableHeaderHeight);
        pdf.text(header, xPos + colWidths[i] / 2, yPosition + 7, { align: 'center' });
        xPos += colWidths[i];
      });

      yPosition += tableHeaderHeight;

      // Lignes de données (SANS remplissage de couleur)
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(0, 0, 0);

      // Mapper les indicateurs aux étapes
      const stepIndicators = new Map<number, string>();
      procedure.indicators.forEach((indicator, idx) => {
        const stepIndex = idx % procedure.steps.length;
        if (!stepIndicators.has(stepIndex)) {
          // Combiner le nom et l'objectif cible pour afficher les deux
          const kpiText = indicator.target
            ? `${indicator.name}: ${indicator.target}`
            : indicator.name;
          stepIndicators.set(stepIndex, kpiText);
        }
      });

      procedure.steps.forEach((step, index) => {
        // Vérifier si on dépasse la page
        if (yPosition > landscapeHeight - margin - rowHeight) {
          return;
        }

        xPos = margin;

        // QUOI - Description de l'étape
        pdf.rect(xPos, yPosition, colWidths[0], rowHeight);
        const quoiLines = pdf.splitTextToSize(this.removeAccents(step.description), colWidths[0] - 3);
        pdf.text(quoiLines.slice(0, 4), xPos + 1.5, yPosition + 4);
        xPos += colWidths[0];

        // COMMENT - Instructions (champ howTo)
        pdf.rect(xPos, yPosition, colWidths[1], rowHeight);
        const commentText = step.howTo
          ? step.howTo
          : (step.documents.length > 0 ? step.documents.join(', ') : 'Selon procedure standard');
        const commentLines = pdf.splitTextToSize(this.removeAccents(commentText), colWidths[1] - 3);
        pdf.text(commentLines.slice(0, 4), xPos + 1.5, yPosition + 4);
        xPos += colWidths[1];

        // QUAND - Durée
        pdf.rect(xPos, yPosition, colWidths[2], rowHeight);
        const quandText = step.duration || 'Variable';
        pdf.text(this.removeAccents(quandText), xPos + 1.5, yPosition + 10);
        xPos += colWidths[2];

        // QUI - Personnes concernées
        pdf.rect(xPos, yPosition, colWidths[3], rowHeight);
        const quiText = step.concernedPersons && step.concernedPersons.length > 0
          ? step.concernedPersons.join(', ')
          : 'Tout le personnel';
        const quiLines = pdf.splitTextToSize(this.removeAccents(quiText), colWidths[3] - 3);
        pdf.text(quiLines.slice(0, 3), xPos + 1.5, yPosition + 4);
        xPos += colWidths[3];

        // MOYENS - Documents/Outils
        pdf.rect(xPos, yPosition, colWidths[4], rowHeight);
        const moyensText = step.documents.length > 0
          ? step.documents.slice(0, 2).join(', ')
          : 'Registres qualite';
        const moyensLines = pdf.splitTextToSize(this.removeAccents(moyensText), colWidths[4] - 3);
        pdf.text(moyensLines.slice(0, 3), xPos + 1.5, yPosition + 4);
        xPos += colWidths[4];

        // KPI - Indicateur
        pdf.rect(xPos, yPosition, colWidths[5], rowHeight);
        const kpiText = stepIndicators.get(index) || 'Conformite';
        const kpiLines = pdf.splitTextToSize(this.removeAccents(kpiText), colWidths[5] - 3);
        pdf.text(kpiLines.slice(0, 3), xPos + 1.5, yPosition + 4);
        xPos += colWidths[5];

        // RESPONSABLE
        pdf.rect(xPos, yPosition, colWidths[6], rowHeight);
        const respLines = pdf.splitTextToSize(this.removeAccents(step.responsible), colWidths[6] - 3);
        pdf.text(respLines.slice(0, 3), xPos + 1.5, yPosition + 4);
        xPos += colWidths[6];

        yPosition += rowHeight;
      });

      // Bas de page de la dernière page (instructions de travail)
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(100, 100, 100);

      const currentPageNumber = (pdf as any).internal.getNumberOfPages();
      const expirationTextFooter = expirationDate ? expirationDate.toLocaleDateString('fr-FR') : 'N/A';

      // Ligne 1: PROCEDURE [TITRE]
      const procedureTitle = `PROCEDURE ${procedure.info.title}`;
      pdf.text(procedureTitle, landscapeWidth / 2, landscapeHeight - 10, { align: 'center' });

      // Ligne 2: Référence complète: REF | VERSION | DATE | EXPIRE | Page X/X
      const footerRef = `Réf: ${classificationCode || 'N/A'} | Version: ${procedure.info.version} | Date: ${effectiveDate.toLocaleDateString('fr-FR')} | Expire: ${expirationTextFooter} | Page ${currentPageNumber}/${currentPageNumber}`;

      pdf.text(footerRef, landscapeWidth / 2, landscapeHeight - 5, { align: 'center' });

      // Add header and footer to all pages (effectiveDate et expirationDate déjà calculés plus haut)
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // En-tête compacte sur pages 2+ SAUF la dernière page (instructions de travail)
        if (i > 1 && i < totalPages) {
          const headerY = 15;
          const headerHeight = 25;

          // Rectangle de l'en-tête
          pdf.setDrawColor(100, 100, 100);
          pdf.setLineWidth(0.3);
          pdf.rect(leftMargin, headerY, pageWidth - leftMargin - rightMargin, headerHeight, 'S');

          // Logo avec initiales
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.setTextColor(60, 60, 60);
          pdf.text(pharmacyInitials, leftMargin + 5, headerY + 6);

          // Type de document
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(8);
          pdf.text('PROCEDURE', leftMargin + 5, headerY + 11);

          // Titre du document (tronqué si nécessaire)
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7);
          const maxTitleWidth = 60;
          const titleForHeader = pdf.splitTextToSize(procedure.info.title, maxTitleWidth)[0];
          pdf.text(titleForHeader, leftMargin + 5, headerY + 15);

          // Ligne verticale de séparation
          pdf.line(leftMargin + 70, headerY, leftMargin + 70, headerY + headerHeight);

          // Référence
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(7);
          pdf.text('REF:', leftMargin + 73, headerY + 6);
          pdf.setFont('helvetica', 'normal');
          pdf.text(classificationCode || 'N/A', leftMargin + 85, headerY + 6);

          // Version
          pdf.setFont('helvetica', 'bold');
          pdf.text('VERSION:', leftMargin + 73, headerY + 11);
          pdf.setFont('helvetica', 'normal');
          pdf.text(procedure.info.version, leftMargin + 91, headerY + 11);

          // Date d'approbation
          pdf.setFont('helvetica', 'bold');
          pdf.text('DATE:', leftMargin + 73, headerY + 16);
          pdf.setFont('helvetica', 'normal');
          pdf.text(effectiveDate.toLocaleDateString('fr-FR'), leftMargin + 87, headerY + 16);

          // Date d'expiration si disponible
          if (expirationDate) {
            pdf.setFont('helvetica', 'bold');
            pdf.text('EXPIRE:', leftMargin + 73, headerY + 21);
            pdf.setFont('helvetica', 'normal');
            pdf.text(expirationDate.toLocaleDateString('fr-FR'), leftMargin + 89, headerY + 21);
          }

          // Numéro de page à droite
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(8);
          pdf.text(`${i}/${totalPages}`, pageWidth - rightMargin - 5, headerY + 13, { align: 'right' });
        }

        // Footer sur toutes les pages SAUF la dernière (instructions de travail)
        if (i < totalPages) {
          const footerY = pageHeight - 15;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);

          // Page number on the left
          pdf.text(`Page ${i}/${totalPages}`, leftMargin, footerY);

          // PHARMA QMS reference on the right
          pdf.text('PHARMA QMS - Systeme de Management de la Qualite', pageWidth - rightMargin, footerY, { align: 'right' });
        }
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