import { DocumentTemplate, DocumentData } from '../types/documents';
import jsPDF from 'jspdf';
import { generateDocumentCode, getCategoryByCode, getProcessForCategory } from '../data/documentClassification';

export class DocumentService {
  private static instance: DocumentService;

  private constructor() {}

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
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

  public async generatePDF(template: DocumentTemplate, document: DocumentData): Promise<void> {
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
        
        const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
        pdf.text(`Page ${pageNum}`, leftMargin, footerY);
        pdf.text('PHARMA QMS - Systeme de Management de la Qualite', pageWidth - rightMargin, footerY, { align: 'right' });
        
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

      // Generate classification code FIRST (before header)
      let classificationCode = '';
      let pharmacyInitials = '';
      let categoryInfo = null;
      let processInfo = null;

      if (template.classificationCode && document.data.pharmacyName) {
        // Use stored initials if available, otherwise extract from pharmacy name
        if (document.data._pharmacyInitials) {
          pharmacyInitials = document.data._pharmacyInitials;
        } else {
          const words = document.data.pharmacyName.trim().split(/\s+/);
          pharmacyInitials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
        }

        // Get process code
        categoryInfo = getCategoryByCode(template.classificationCode);
        processInfo = categoryInfo ? getProcessForCategory(template.classificationCode) : undefined;

        if (processInfo) {
          classificationCode = generateDocumentCode(pharmacyInitials, processInfo.code, template.classificationCode);
        }
      }

      // En-tête du document
      yPosition = topMargin;
      addText('DOCUMENT OFFICIEL PHARMA QMS', 18, true, 'teal', 'center', 1.0);
      yPosition += 2;
      const documentTitle = document.data._customTitle || template.title;
      addText(documentTitle.toUpperCase(), 14, true, 'black', 'center', 1.0);
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

      // Ligne décorative
      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(1);
      pdf.line(leftMargin + 50, yPosition, pageWidth - rightMargin - 50, yPosition);
      yPosition += 15;

      // Informations du document
      addSection('INFORMATIONS DU DOCUMENT');

      const pharmacyDisplayName = document.data.pharmacyName
        ? (classificationCode ? `${document.data.pharmacyName} [${classificationCode}]` : document.data.pharmacyName)
        : 'Non renseigne';

      const docInfo = [
        ['Type de document:', template.title],
        ['Categorie:', template.category],
        ['Date de creation:', new Date(document.createdAt).toLocaleDateString('fr-FR')],
        ['Heure de creation:', new Date(document.createdAt).toLocaleTimeString('fr-FR')],
        ['Numero de document:', document.id],
        ['Pharmacie:', pharmacyDisplayName]
      ];
      
      docInfo.forEach(([label, value]) => {
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

      // Contenu spécifique selon le type de document
      if (template.id === 'organization-chart') {
        await this.generateOrganizationChart(pdf, document, addText, addSection);
      } else {
        // Contenu générique pour les autres documents
        addSection('CONTENU DU DOCUMENT');
        
        template.fields.forEach(field => {
          const value = document.data[field.id] || 'Non renseigne';
          
          // Encadré pour chaque champ important
          if (field.type === 'textarea' || field.required) {
            pdf.setDrawColor(240, 240, 240);
            pdf.setFillColor(250, 250, 250);
            
            const fieldHeight = field.type === 'textarea' ? 25 : 15;
            pdf.roundedRect(leftMargin - 5, yPosition - 5, pageWidth - leftMargin - rightMargin + 10, fieldHeight, 3, 3, 'F');
          }
          
          addText(`${field.label}:`, 11, true, 'teal', 'left', 1.0);
          yPosition -= 1;

          if (field.type === 'textarea') {
            addText(value, 10, false, 'black', 'left', 1.2);
          } else {
            addText(value, 10, false, 'black', 'left', 1.2);
          }

          yPosition += 5;
        });
      }

      // Section de validation
      addSection('VALIDATION ET SIGNATURES');
      
      // Cadres pour signatures
      const signatureBoxHeight = 22;
      const signatureBoxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;

      // Signature responsable
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.rect(leftMargin, yPosition, signatureBoxWidth, signatureBoxHeight);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('\u00c9tabli par:', leftMargin + 3, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date: _______________', leftMargin + 3, yPosition + 10);
      pdf.text('Signature:', leftMargin + 3, yPosition + 15);

      // Signature vérificateur
      pdf.rect(leftMargin + signatureBoxWidth + 10, yPosition, signatureBoxWidth, signatureBoxHeight);
      pdf.setFont('helvetica', 'bold');
      pdf.text('V\u00e9rifi\u00e9 par:', leftMargin + signatureBoxWidth + 13, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date: _______________', leftMargin + signatureBoxWidth + 13, yPosition + 10);
      pdf.text('Signature:', leftMargin + signatureBoxWidth + 13, yPosition + 15);
      
      yPosition += signatureBoxHeight + 15;

      // Informations de traçabilité
      addSection('TRACABILIT\u00c9');
      addText(`Document g\u00e9n\u00e9r\u00e9 le: ${new Date().toLocaleDateString('fr-FR')} \u00e0 ${new Date().toLocaleTimeString('fr-FR')}`, 10, false, 'gray', 'left', 1.1);
      yPosition -= 1;
      addText(`Syst\u00e8me: PHARMA QMS - Module Documents v1.0`, 10, false, 'gray', 'left', 1.1);
      yPosition -= 1;
      addText(`Identifiant unique: ${document.id}`, 10, false, 'gray', 'left', 1.1);

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

      const fileName = `document-${safeTemplateTitle}-${new Date().toISOString().split('T')[0]}-${document.id}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating document PDF:', error);
      throw new Error(`Erreur lors de la generation du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  private async generateOrganizationChart(pdf: any, document: DocumentData, addText: Function, addSection: Function): Promise<void> {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const data = document.data;

    addSection('ORGANIGRAMME DE L\'OFFICINE');

    pdf.addPage();

    const centerX = pageWidth / 2;
    let currentY = 30;

    const drawBox = (x: number, y: number, width: number, height: number, title: string, name: string, color: string = '#009688') => {
      const cleanTitle = this.removeAccents(title);
      const cleanName = this.removeAccents(name);

      pdf.setDrawColor(0, 150, 136);
      pdf.setLineWidth(1);

      if (color === '#009688') {
        pdf.setFillColor(0, 150, 136);
      } else if (color === '#00bcd4') {
        pdf.setFillColor(0, 188, 212);
      } else if (color === '#4caf50') {
        pdf.setFillColor(76, 175, 80);
      } else if (color === '#ff9800') {
        pdf.setFillColor(255, 152, 0);
      } else {
        pdf.setFillColor(158, 158, 158);
      }

      pdf.roundedRect(x - width/2, y, width, height, 2, 2, 'FD');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text(cleanTitle, x, y + 5, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      const nameLines = pdf.splitTextToSize(cleanName, width - 6);
      pdf.text(nameLines, x, y + 10, { align: 'center' });

      pdf.setTextColor(0, 0, 0);
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.5);
      pdf.line(x1, y1, x2, y2);
    };

    const drawVerticalLine = (x: number, y1: number, y2: number) => {
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.5);
      pdf.line(x, y1, x, y2);
    };

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 150, 136);
    pdf.text('ORGANIGRAMME DE L\'OFFICINE', centerX, 20, { align: 'center' });

    const boxWidth = 55;
    const boxHeight = 16;
    const adminBoxWidth = 38;
    const subAdminBoxWidth = 28;
    const verticalSpacing = 18;
    const horizontalSpacing = 65;

    const technicalStaff = [];
    if (data.preparateur1) {
      technicalStaff.push({
        name: data.preparateur1,
        subs: [
          data.sousAdmin1_1 || null,
          data.sousAdmin1_2 || null
        ].filter(Boolean)
      });
    }
    if (data.preparateur2) {
      technicalStaff.push({
        name: data.preparateur2,
        subs: [
          data.sousAdmin2_1 || null,
          data.sousAdmin2_2 || null
        ].filter(Boolean)
      });
    }

    const salesStaff = [];
    for (let i = 1; i <= 12; i++) {
      if (data[`auxiliaire${i}`]) {
        salesStaff.push(data[`auxiliaire${i}`]);
      }
    }

    const getInitials = (fullName: string): string => {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length === 0) return '';
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return parts.map(p => p[0]).join('').toUpperCase();
    };

    const auxiliaireMap: { [key: string]: string } = {};

    if (salesStaff.length > 2) {
      salesStaff.forEach((staff) => {
        const initials = getInitials(staff);
        auxiliaireMap[initials] = staff;
      });
    }

    const titulaireY = currentY;

    const legendPosItems = [
      { color: '#009688', label: 'Direction' },
      { color: '#00bcd4', label: 'Pharmaciens' },
      { color: '#4caf50', label: 'Administration' },
      { color: '#ff9800', label: 'Auxiliaire' },
      { color: '#9e9e9e', label: 'Fonctions Transversales' }
    ];

    let leftLegendY = titulaireY + 5;
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('LEGENDE POSTES:', 15, leftLegendY);
    leftLegendY += 5;

    legendPosItems.forEach((item) => {
      if (item.color === '#009688') {
        pdf.setFillColor(0, 150, 136);
      } else if (item.color === '#00bcd4') {
        pdf.setFillColor(0, 188, 212);
      } else if (item.color === '#4caf50') {
        pdf.setFillColor(76, 175, 80);
      } else if (item.color === '#ff9800') {
        pdf.setFillColor(255, 152, 0);
      } else {
        pdf.setFillColor(158, 158, 158);
      }

      pdf.rect(15, leftLegendY - 2, 5, 3, 'F');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(0, 0, 0);
      pdf.text(item.label, 22, leftLegendY);

      leftLegendY += 4;
    });

    if (data.titulaire) {
      drawBox(centerX, currentY, boxWidth, boxHeight, 'PHARMACIEN TITULAIRE', data.titulaire, '#009688');
      currentY += boxHeight;
    }

    if (Object.keys(auxiliaireMap).length > 0) {
      let rightLegendY = titulaireY + 5;
      const rightLegendX = pageWidth - 15;

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 150, 136);
      pdf.text('AUXILIAIRES:', rightLegendX, rightLegendY, { align: 'right' });
      rightLegendY += 5;

      Object.entries(auxiliaireMap).forEach(([initials, fullName]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6);
        pdf.setTextColor(255, 152, 0);
        const text = `${initials}: ${this.removeAccents(fullName)}`;
        pdf.text(text, rightLegendX, rightLegendY, { align: 'right' });
        rightLegendY += 4;
      });
    }

    const titulaireBottomY = currentY;

    let adminStartY = titulaireBottomY;
    let adjointStartY = titulaireBottomY;

    const hasAdmin = technicalStaff.length > 0;
    const hasAdjoint = data.adjoint;
    const hasAdjoint2 = data.adjoint2;
    const hasAuxiliaires = salesStaff.length > 0;

    if (hasAdmin || hasAdjoint || hasAuxiliaires) {
      drawVerticalLine(centerX, titulaireBottomY, titulaireBottomY + 8);
      const branchStartY = titulaireBottomY + 8;

      if (hasAdmin && hasAdjoint) {
        drawLine(centerX - horizontalSpacing/2, branchStartY, centerX + horizontalSpacing/2, branchStartY);

        const adminX = centerX - horizontalSpacing/2;
        drawVerticalLine(adminX, branchStartY, branchStartY + 6);
        adminStartY = branchStartY + 6;

        const adjointX = centerX + horizontalSpacing/2;
        drawVerticalLine(adjointX, branchStartY, branchStartY + 6);
        adjointStartY = branchStartY + 6;
        drawBox(adjointX, adjointStartY, adminBoxWidth, boxHeight, 'PHARMACIEN ADJOINT 1', data.adjoint, '#00bcd4');

        if (hasAdjoint2) {
          const adjoint2Y = adjointStartY + boxHeight;
          const adjoint2X = adjointX + 8;
          drawVerticalLine(adjointX, adjoint2Y, adjoint2Y + 3);
          drawLine(adjointX, adjoint2Y + 3, adjoint2X, adjoint2Y + 3);
          drawVerticalLine(adjoint2X, adjoint2Y + 3, adjoint2Y + 5);
          drawBox(adjoint2X, adjoint2Y + 5, adminBoxWidth, boxHeight, 'PHARMACIEN ADJOINT 2', data.adjoint2, '#00bcd4');
        }

      } else if (hasAdmin && !hasAdjoint && hasAuxiliaires) {
        drawLine(centerX - horizontalSpacing/2, branchStartY, centerX + horizontalSpacing/2, branchStartY);

        const adminX = centerX - horizontalSpacing/2;
        drawVerticalLine(adminX, branchStartY, branchStartY + 6);
        adminStartY = branchStartY + 6;

      } else if (hasAdmin) {
        const adminX = centerX;
        drawVerticalLine(adminX, branchStartY, branchStartY + 6);
        adminStartY = branchStartY + 6;

      } else if (hasAdjoint) {
        drawBox(centerX, branchStartY + 6, adminBoxWidth, boxHeight, 'PHARMACIEN ADJOINT 1', data.adjoint, '#00bcd4');
        adjointStartY = branchStartY + 6;

        if (hasAdjoint2) {
          const adjoint2Y = adjointStartY + boxHeight;
          const adjoint2X = centerX + 8;
          drawVerticalLine(centerX, adjoint2Y, adjoint2Y + 3);
          drawLine(centerX, adjoint2Y + 3, adjoint2X, adjoint2Y + 3);
          drawVerticalLine(adjoint2X, adjoint2Y + 3, adjoint2Y + 5);
          drawBox(adjoint2X, adjoint2Y + 5, adminBoxWidth, boxHeight, 'PHARMACIEN ADJOINT 2', data.adjoint2, '#00bcd4');
        }
      }
    }

    if (technicalStaff.length > 0) {
      const techX = hasAdjoint ? centerX - horizontalSpacing/2 : centerX;

      if (technicalStaff.length === 1) {
        const admin = technicalStaff[0];
        drawBox(techX, adminStartY, adminBoxWidth, boxHeight, 'ADMINISTRATION', admin.name, '#4caf50');

        if (admin.subs.length > 0) {
          const adminBoxY = adminStartY + boxHeight;
          drawVerticalLine(techX, adminBoxY, adminBoxY + 5);

          if (admin.subs.length === 1) {
            drawBox(techX, adminBoxY + 5, subAdminBoxWidth, boxHeight - 3, 'SOUS-ADMIN', admin.subs[0], '#66bb6a');
          } else {
            const subY = adminBoxY + 5;
            drawLine(techX - 16, subY, techX + 16, subY);

            drawVerticalLine(techX - 16, subY, subY + 4);
            drawBox(techX - 16, subY + 4, subAdminBoxWidth, boxHeight - 3, 'SOUS-ADMIN', admin.subs[0], '#66bb6a');

            drawVerticalLine(techX + 16, subY, subY + 4);
            drawBox(techX + 16, subY + 4, subAdminBoxWidth, boxHeight - 3, 'SOUS-ADMIN', admin.subs[1], '#66bb6a');
          }
        }
      } else if (technicalStaff.length === 2) {
        drawLine(techX - 28, adminStartY, techX + 28, adminStartY);

        const admin1X = techX - 28;
        drawVerticalLine(admin1X, adminStartY, adminStartY + 5);
        drawBox(admin1X, adminStartY + 5, adminBoxWidth, boxHeight, 'ADMINISTRATION', technicalStaff[0].name, '#4caf50');

        if (technicalStaff[0].subs.length > 0) {
          const admin1BoxY = adminStartY + 5 + boxHeight;
          drawVerticalLine(admin1X, admin1BoxY, admin1BoxY + 4);

          if (technicalStaff[0].subs.length === 1) {
            drawBox(admin1X, admin1BoxY + 4, subAdminBoxWidth, boxHeight - 3, 'SOUS-ADMIN', technicalStaff[0].subs[0], '#66bb6a');
          } else {
            const subY = admin1BoxY + 4;
            drawLine(admin1X - 16, subY, admin1X + 16, subY);

            drawVerticalLine(admin1X - 16, subY, subY + 3);
            drawBox(admin1X - 16, subY + 3, subAdminBoxWidth, boxHeight - 4, 'SOUS-ADMIN', technicalStaff[0].subs[0], '#66bb6a');

            drawVerticalLine(admin1X + 16, subY, subY + 3);
            drawBox(admin1X + 16, subY + 3, subAdminBoxWidth, boxHeight - 4, 'SOUS-ADMIN', technicalStaff[0].subs[1], '#66bb6a');
          }
        }

        const admin2X = techX + 28;
        drawVerticalLine(admin2X, adminStartY, adminStartY + 5);
        drawBox(admin2X, adminStartY + 5, adminBoxWidth, boxHeight, 'ADMINISTRATION', technicalStaff[1].name, '#4caf50');

        if (technicalStaff[1].subs.length > 0) {
          const admin2BoxY = adminStartY + 5 + boxHeight;
          drawVerticalLine(admin2X, admin2BoxY, admin2BoxY + 4);

          if (technicalStaff[1].subs.length === 1) {
            drawBox(admin2X, admin2BoxY + 4, subAdminBoxWidth, boxHeight - 3, 'SOUS-ADMIN', technicalStaff[1].subs[0], '#66bb6a');
          } else {
            const subY = admin2BoxY + 4;
            drawLine(admin2X - 16, subY, admin2X + 16, subY);

            drawVerticalLine(admin2X - 16, subY, subY + 3);
            drawBox(admin2X - 16, subY + 3, subAdminBoxWidth, boxHeight - 4, 'SOUS-ADMIN', technicalStaff[1].subs[0], '#66bb6a');

            drawVerticalLine(admin2X + 16, subY, subY + 3);
            drawBox(admin2X + 16, subY + 3, subAdminBoxWidth, boxHeight - 4, 'SOUS-ADMIN', technicalStaff[1].subs[1], '#66bb6a');
          }
        }
      }
    }

    if (salesStaff.length > 0) {
      const salesX = hasAdjoint ? centerX + horizontalSpacing/2 : centerX;
      const adjointTotalHeight = hasAdjoint2 ? boxHeight + 5 + boxHeight : boxHeight;
      const auxStartY = hasAdjoint ? adjointStartY + adjointTotalHeight : titulaireBottomY + boxHeight;

      const extraStartSpace = technicalStaff.length > 0 && technicalStaff.some(admin => admin.subs.length > 0) ? 12 : 0;

      drawVerticalLine(salesX, auxStartY, auxStartY + 8 + extraStartSpace);
      let auxY = auxStartY + 8 + extraStartSpace;

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 150, 136);

      if (Object.keys(auxiliaireMap).length > 0 && salesStaff.length < 3) {
        const initialsText = Object.keys(auxiliaireMap).join(', ');
        pdf.text(`AUXILIAIRES: ${this.removeAccents(initialsText)}`, salesX, auxY - 2, { align: 'center' });
      }

      if (salesStaff.length <= 2) {
        if (salesStaff.length === 1) {
          drawBox(salesX, auxY, boxWidth, boxHeight, 'AUXILIAIRE', salesStaff[0], '#ff9800');
        } else {
          drawLine(salesX - 28, auxY, salesX + 28, auxY);

          drawVerticalLine(salesX - 28, auxY, auxY + 5);
          drawBox(salesX - 28, auxY + 5, boxWidth - 10, boxHeight, 'AUXILIAIRE', salesStaff[0], '#ff9800');

          drawVerticalLine(salesX + 28, auxY, auxY + 5);
          drawBox(salesX + 28, auxY + 5, boxWidth - 10, boxHeight, 'AUXILIAIRE', salesStaff[1], '#ff9800');
        }
      } else {
        const itemsPerRow = 3;
        const smallBoxWidth = 12;
        const smallBoxHeight = 10;
        const spacing = 3;
        const rowSpacing = 12;

        const totalRows = Math.ceil(salesStaff.length / itemsPerRow);

        for (let row = 0; row < totalRows; row++) {
          const startIdx = row * itemsPerRow;
          const endIdx = Math.min(startIdx + itemsPerRow, salesStaff.length);
          const itemsInRow = endIdx - startIdx;

          const totalWidth = itemsInRow * smallBoxWidth + (itemsInRow - 1) * spacing;
          const startX = salesX - totalWidth / 2;
          const y = auxY + row * rowSpacing;

          if (row > 0) {
            drawVerticalLine(salesX, auxY + (row - 1) * rowSpacing + smallBoxHeight + 3, y);
          }

          if (itemsInRow > 1) {
            drawLine(startX + smallBoxWidth/2, y, startX + totalWidth - smallBoxWidth/2, y);
          }

          for (let col = 0; col < itemsInRow; col++) {
            const idx = startIdx + col;
            const x = startX + col * (smallBoxWidth + spacing) + smallBoxWidth / 2;

            drawVerticalLine(x, y, y + 3);

            const initials = getInitials(salesStaff[idx]);

            pdf.setDrawColor(0, 150, 136);
            pdf.setLineWidth(0.8);
            pdf.setFillColor(255, 152, 0);
            pdf.roundedRect(x - smallBoxWidth/2, y + 3, smallBoxWidth, smallBoxHeight, 1.5, 1.5, 'FD');

            pdf.setTextColor(255, 255, 255);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(6);
            pdf.text(initials, x, y + 3 + smallBoxHeight/2 + 1.5, { align: 'center' });
          }
        }
      }
    }

    let maxAdminHeight = titulaireBottomY + boxHeight;

    if (technicalStaff.length > 0) {
      technicalStaff.forEach((admin) => {
        let adminHeight = adminStartY + boxHeight;
        if (admin.subs.length > 0) {
          const subHeight = admin.subs.length === 1 ? boxHeight - 3 : boxHeight - 4;
          adminHeight = adminStartY + boxHeight + 5 + 4 + subHeight;
        }
        maxAdminHeight = Math.max(maxAdminHeight, adminHeight);
      });
    }

    let maxAuxHeight = titulaireBottomY + boxHeight;
    if (salesStaff.length > 0) {
      const adjointTotalHeight = hasAdjoint2 ? boxHeight + 5 + boxHeight : boxHeight;
      const auxStartY = hasAdjoint ? adjointStartY + adjointTotalHeight : titulaireBottomY + boxHeight;

      const extraStartSpace = technicalStaff.length > 0 && technicalStaff.some(admin => admin.subs.length > 0) ? 12 : 0;

      if (salesStaff.length > 2) {
        const itemsPerRow = 3;
        const totalRows = Math.ceil(salesStaff.length / itemsPerRow);
        const smallBoxHeight = 10;
        const rowSpacing = 12;
        maxAuxHeight = auxStartY + 8 + extraStartSpace + (totalRows * rowSpacing) + smallBoxHeight + 3;
      } else {
        maxAuxHeight = auxStartY + 8 + extraStartSpace + boxHeight + 5;
      }
    }

    currentY = Math.max(maxAdminHeight, maxAuxHeight) + 10;

    if (data.responsableQualite || data.stagiaire) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 150, 136);
      pdf.text('FONCTIONS TRANSVERSALES', centerX, currentY, { align: 'center' });
      currentY += 7;

      if (data.responsableQualite && data.stagiaire) {
        const leftX = centerX - 30;
        const rightX = centerX + 30;

        drawBox(leftX, currentY, boxWidth - 10, boxHeight, 'RESPONSABLE QUALITE', data.responsableQualite, '#9e9e9e');
        drawBox(rightX, currentY, boxWidth - 10, boxHeight, 'STAGIAIRE', data.stagiaire, '#9e9e9e');
        currentY += boxHeight + 5;
      } else if (data.responsableQualite) {
        drawBox(centerX, currentY, boxWidth, boxHeight, 'RESPONSABLE QUALITE', data.responsableQualite, '#9e9e9e');
        currentY += boxHeight + 5;
      } else if (data.stagiaire) {
        drawBox(centerX, currentY, boxWidth, boxHeight, 'STAGIAIRE', data.stagiaire, '#9e9e9e');
        currentY += boxHeight + 5;
      }
    }

  }
}

export const documentService = DocumentService.getInstance();