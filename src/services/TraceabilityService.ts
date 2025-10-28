import { TraceabilityTemplate } from '../types/traceability';
import { traceabilityRecordService, TraceabilityRecord } from './TracabilityRecordService';
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

  private generateInitials(pharmacyName: string): string {
    if (!pharmacyName) return 'XXX';

    const words = pharmacyName
      .toUpperCase()
      .replace(/[^A-Z\s]/g, '')
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);

    if (words.length === 1) {
      return words[0].substring(0, 3);
    }

    if (words.length === 2) {
      return words[0].charAt(0) + words[1].substring(0, 2);
    }

    return words.slice(0, 3).map(word => word.charAt(0)).join('');
  }

  public async generatePDF(template: TraceabilityTemplate, record: any): Promise<void> {
    try {
      // Sauvegarder dans Supabase
      const savedRecord: TraceabilityRecord = {
        template_id: template.id,
        template_title: template.title,
        template_category: template.category,
        classification: template.classification,
        process_code: template.processCode,
        pharmacy_name: record.data.pharmacyName || 'Non renseigné',
        record_data: record.data,
        created_by: 'Utilisateur'
      };

      await traceabilityRecordService.saveRecord(savedRecord);

      // Générer le PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();          
      const margin = 15;
      let yPos = margin;

      const pharmacyInitials = this.generateInitials(record.data.pharmacyName || '');
      const fullClassificationCode = template.classification && template.processCode
        ? `${pharmacyInitials}/${template.processCode}/${template.classification}`
        : 'Non classifie';

      // En-tête - SANS FOND DE COULEUR
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('REGISTRE OFFICIEL DE TRAÇABILITE', pageWidth / 2, 15, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(template.title.toUpperCase(), pageWidth / 2, 23, { align: 'center' });

      pdf.setFontSize(9);
      pdf.text(`Code: ${fullClassificationCode}`, pageWidth / 2, 30, { align: 'center' });

      yPos = 38;

      // Informations en haut
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');

      const infoLine1 = `Pharmacie: ${record.data.pharmacyName || 'Non renseigne'}`;
      const infoLine2 = `Date: ${new Date(record.createdAt).toLocaleDateString('fr-FR')} - Heure: ${new Date(record.createdAt).toLocaleTimeString('fr-FR')}`;
      const infoLine3 = `No enregistrement: ${record.id}`;

      pdf.text(infoLine1, margin, yPos);
      pdf.text(infoLine2, pageWidth / 2, yPos, { align: 'center' });
      pdf.text(infoLine3, pageWidth - margin, yPos, { align: 'right' });

      yPos += 8;

      // Ligne séparatrice
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Filtrer les champs (exclure pharmacyName qui est déjà affiché)
      const fieldsToDisplay = template.fields.filter(f => f.id !== 'pharmacyName');

      // Format tableau horizontal comme la compilation mensuelle
      const tableWidth = pageWidth - 2 * margin;
      const colWidth = tableWidth / fieldsToDisplay.length;
      const headerRowHeight = 10;
      const dataRowHeight = 7;

      // En-têtes du tableau (TITRES DES COLONNES) - SANS FOND
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');

      let xPos = margin;

      fieldsToDisplay.forEach((field) => {
        pdf.rect(xPos, yPos, colWidth, headerRowHeight);

        // Diviser le texte pour qu'il tienne dans la cellule
        const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);

        // Afficher jusqu'à 2 lignes de texte
        if (labelLines.length === 1) {
          pdf.text(labelLines[0], xPos + colWidth / 2, yPos + 6, { align: 'center', maxWidth: colWidth - 3 });
        } else {
          pdf.text(labelLines[0], xPos + colWidth / 2, yPos + 3.5, { align: 'center', maxWidth: colWidth - 3 });
          if (labelLines[1]) {
            pdf.text(labelLines[1], xPos + colWidth / 2, yPos + 7.5, { align: 'center', maxWidth: colWidth - 3 });
          }
        }
        xPos += colWidth;
      });

      yPos += headerRowHeight;

      // Ligne de données - SANS FOND
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);

      xPos = margin;

      fieldsToDisplay.forEach((field) => {
        pdf.rect(xPos, yPos, colWidth, dataRowHeight);

        const value = record.data[field.id] || '';
        const valueStr = String(value).substring(0, 50);
        pdf.text(valueStr, xPos + 1.5, yPos + 4.5, { maxWidth: colWidth - 3 });
        xPos += colWidth;
      });

      yPos += dataRowHeight + 10;

      // Section signatures
      if (yPos > pageHeight - 40) {
        pdf.addPage('a4', 'landscape');
        yPos = margin;
      }

      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('VALIDATION ET SIGNATURES', margin, yPos);
      yPos += 8;

      const signatureBoxWidth = (pageWidth - 2 * margin - 20) / 3;
      const signatureBoxHeight = 25;

      // Trois zones de signature
      const signatureLabels = [
        'Enregistre par:',
        'Verifie par:',
        'Approuve par:'
      ];

      xPos = margin;
      signatureLabels.forEach(label => {
        pdf.setDrawColor(150, 150, 150);
        pdf.setLineWidth(0.3);
        pdf.rect(xPos, yPos, signatureBoxWidth, signatureBoxHeight);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, xPos + 3, yPos + 5);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text('Date: ___/___/______', xPos + 3, yPos + 12);
        pdf.text('Nom:', xPos + 3, yPos + 18);
        pdf.text('Signature:', xPos + 3, yPos + 23);

        xPos += signatureBoxWidth + 10;
      });

      yPos += signatureBoxHeight + 10;

      // Pied de page
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(120, 120, 120);
      pdf.text('Ce document est conforme au Systeme de Management de la Qualite (SMQ) de l\'officine', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(`PHARMA QMS v1.0 - Page 1 - ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Générer le nom de fichier
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

  public async generateMonthlyCompilation(
    template: TraceabilityTemplate,
    year: number,
    month: number,
    pharmacyName?: string
  ): Promise<void> {
    try {
      // Récupérer tous les enregistrements du mois
      const records = await traceabilityRecordService.getRecordsByMonth(template.id, year, month);

      if (records.length === 0) {
        alert('Aucun enregistrement trouvé pour cette période');
        return;
      }

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      const pharmacyInitials = this.generateInitials(pharmacyName || records[0].pharmacy_name);
      const fullClassificationCode = template.classification && template.processCode
        ? `${pharmacyInitials}/${template.processCode}/${template.classification}`
        : 'Non classifie';

      // En-tête - SANS FOND DE COULEUR
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('COMPILATION MENSUELLE - REGISTRE DE TRAÇABILITE', pageWidth / 2, 15, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(template.title.toUpperCase(), pageWidth / 2, 23, { align: 'center' });

      pdf.setFontSize(9);
      const monthName = new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      pdf.text(`Periode: ${monthName} | Code: ${fullClassificationCode}`, pageWidth / 2, 30, { align: 'center' });

      yPos = 38;

      // Informations
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Pharmacie: ${pharmacyName || records[0].pharmacy_name}`, margin, yPos);
      pdf.text(`Nombre d'enregistrements: ${records.length}`, pageWidth - margin, yPos, { align: 'right' });

      yPos += 8;

      // Ligne séparatrice
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Préparer les données du tableau
      const fieldsToDisplay = template.fields.filter(f => f.id !== 'pharmacyName');
      const tableWidth = pageWidth - 2 * margin;
      const colWidth = tableWidth / (fieldsToDisplay.length + 1); // +1 pour la colonne date
      const headerRowHeight = 10;
      const dataRowHeight = 7;

      // En-têtes du tableau - SANS FOND DE COULEUR
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');

      let xPos = margin;

      // Colonne Date
      pdf.rect(xPos, yPos, colWidth, headerRowHeight);
      pdf.text('DATE', xPos + colWidth / 2, yPos + 6, { align: 'center' });
      xPos += colWidth;

      // Autres colonnes avec titres complets
      fieldsToDisplay.forEach((field) => {
        pdf.rect(xPos, yPos, colWidth, headerRowHeight);

        // Diviser le texte pour qu'il tienne dans la cellule
        const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);

        // Afficher jusqu'à 2 lignes de texte
        if (labelLines.length === 1) {
          pdf.text(labelLines[0], xPos + colWidth / 2, yPos + 6, { align: 'center', maxWidth: colWidth - 3 });
        } else {
          pdf.text(labelLines[0], xPos + colWidth / 2, yPos + 3.5, { align: 'center', maxWidth: colWidth - 3 });
          if (labelLines[1]) {
            pdf.text(labelLines[1], xPos + colWidth / 2, yPos + 7.5, { align: 'center', maxWidth: colWidth - 3 });
          }
        }
        xPos += colWidth;
      });

      yPos += headerRowHeight;

      // Lignes de données - SANS FOND DE COULEUR
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);

      records.forEach((record, recordIndex) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage('a4', 'landscape');
          yPos = margin;

          // Réafficher les en-têtes sur la nouvelle page - SANS FOND
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.3);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'bold');

          xPos = margin;
          pdf.rect(xPos, yPos, colWidth, headerRowHeight);
          pdf.text('DATE', xPos + colWidth / 2, yPos + 6, { align: 'center' });
          xPos += colWidth;

          fieldsToDisplay.forEach((field) => {
            pdf.rect(xPos, yPos, colWidth, headerRowHeight);
            const labelLines = pdf.splitTextToSize(field.label, colWidth - 3);

            if (labelLines.length === 1) {
              pdf.text(labelLines[0], xPos + colWidth / 2, yPos + 6, { align: 'center', maxWidth: colWidth - 3 });
            } else {
              pdf.text(labelLines[0], xPos + colWidth / 2, yPos + 3.5, { align: 'center', maxWidth: colWidth - 3 });
              if (labelLines[1]) {
                pdf.text(labelLines[1], xPos + colWidth / 2, yPos + 7.5, { align: 'center', maxWidth: colWidth - 3 });
              }
            }
            xPos += colWidth;
          });

          yPos += headerRowHeight;
        }

        xPos = margin;

        // Définir le texte noir pour les données - SANS FOND
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);

        // Date
        pdf.rect(xPos, yPos, colWidth, dataRowHeight);
        const dateStr = new Date(record.created_at!).toLocaleDateString('fr-FR');
        pdf.text(dateStr, xPos + 1.5, yPos + 4.5);
        xPos += colWidth;

        // Données
        fieldsToDisplay.forEach((field) => {
          pdf.rect(xPos, yPos, colWidth, dataRowHeight);

          const value = record.record_data[field.id] || '';
          const valueStr = String(value).substring(0, 50);
          pdf.text(valueStr, xPos + 1.5, yPos + 4.5, { maxWidth: colWidth - 3 });
          xPos += colWidth;
        });

        yPos += dataRowHeight;
      });

      // Pied de page
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(120, 120, 120);
        pdf.text(`Compilation mensuelle - ${monthName}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text(`PHARMA QMS v1.0 - Page ${i}/${totalPages} - ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
      }

      const fileName = `compilation-${template.id}-${year}-${String(month).padStart(2, '0')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating monthly compilation:', error);
      throw error;
    }
  }
}

export const traceabilityService = TraceabilityService.getInstance();