import jsPDF from 'jspdf';

interface QualityManualData {
  pharmacyName: string;
  address: string;
  phone: string;
  email: string;
  titulaire: string;
  qualifications: string;
  qualityManager: string;
  qualityPolicy: string;
  qualityObjectives: string;
  organizationalStructure: string;
  rolesResponsibilities: string;
  documentControl: string;
  recordsManagement: string;
  humanResources: string;
  trainingProgram: string;
  infrastructure: string;
  equipmentMaintenance: string;
  receptionControl: string;
  storageConditions: string;
  dispensingProcess: string;
  pharmacovigilance: string;
  complaints: string;
  internalAudits: string;
  nonConformities: string;
  capaProcess: string;
  kpis: string;
  managementReview: string;
  continuousImprovement: string;
}

export class QualityManualService {
  static generatePDF(data: QualityManualData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    let yPos = margin;

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', style);
      doc.setTextColor(color[0], color[1], color[2]);

      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        addNewPageIfNeeded(lineHeight);
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });
    };

    const addSection = (title: string, content: string) => {
      if (!content || content.trim() === '') return;

      addNewPageIfNeeded(15);
      yPos += 5;

      doc.setFillColor(0, 150, 136);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 3, yPos + 2);

      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const lines = doc.splitTextToSize(content, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        addNewPageIfNeeded(lineHeight);
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });

      yPos += 3;
    };

    // Page de garde
    doc.setFillColor(0, 150, 136);
    doc.rect(0, 0, pageWidth, 80, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('MANUEL QUALITÉ', pageWidth / 2, 35, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Système de Management de la Qualité', pageWidth / 2, 50, { align: 'center' });

    doc.setFontSize(14);
    doc.text(data.pharmacyName || 'Pharmacie', pageWidth / 2, 65, { align: 'center' });

    yPos = 100;

    // Informations générales
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS GÉNÉRALES', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (data.address) {
      doc.text(`Adresse : ${data.address}`, margin, yPos);
      yPos += 7;
    }
    if (data.phone) {
      doc.text(`Téléphone : ${data.phone}`, margin, yPos);
      yPos += 7;
    }
    if (data.email) {
      doc.text(`Email : ${data.email}`, margin, yPos);
      yPos += 7;
    }
    if (data.titulaire) {
      doc.text(`Pharmacien titulaire : ${data.titulaire}`, margin, yPos);
      yPos += 7;
    }
    if (data.qualifications) {
      doc.text(`Qualifications : ${data.qualifications}`, margin, yPos);
      yPos += 7;
    }
    if (data.qualityManager) {
      doc.text(`Responsable qualité : ${data.qualityManager}`, margin, yPos);
      yPos += 7;
    }

    yPos += 5;
    doc.setDrawColor(0, 150, 136);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, margin, yPos);
    yPos += 7;
    doc.text(`Version : 1.0`, margin, yPos);
    yPos += 15;

    // Table des matières
    doc.addPage();
    yPos = margin;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TABLE DES MATIÈRES', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const chapters = [
      '1. Politique et Objectifs Qualité',
      '2. Organisation et Responsabilités',
      '3. Gestion Documentaire',
      '4. Ressources Humaines',
      '5. Infrastructures et Équipements',
      '6. Processus de Réalisation',
      '7. Surveillance et Vigilance',
      '8. Audits et Non-conformités',
      '9. Mesure et Amélioration Continue'
    ];

    chapters.forEach(chapter => {
      doc.text(chapter, margin + 5, yPos);
      yPos += 8;
    });

    // Contenu du manuel
    doc.addPage();
    yPos = margin;

    // Chapitre 1
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 1', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('POLITIQUE ET OBJECTIFS QUALITÉ', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('1.1 Politique Qualité', data.qualityPolicy);
    addSection('1.2 Objectifs Qualité', data.qualityObjectives);

    // Chapitre 2
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 2', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('ORGANISATION ET RESPONSABILITÉS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('2.1 Structure Organisationnelle', data.organizationalStructure);
    addSection('2.2 Rôles et Responsabilités', data.rolesResponsibilities);

    // Chapitre 3
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 3', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('GESTION DOCUMENTAIRE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('3.1 Contrôle des Documents', data.documentControl);
    addSection('3.2 Gestion des Enregistrements', data.recordsManagement);

    // Chapitre 4
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 4', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('RESSOURCES HUMAINES', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('4.1 Gestion du Personnel', data.humanResources);
    addSection('4.2 Programme de Formation', data.trainingProgram);

    // Chapitre 5
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 5', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('INFRASTRUCTURES ET ÉQUIPEMENTS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('5.1 Locaux et Infrastructure', data.infrastructure);
    addSection('5.2 Maintenance des Équipements', data.equipmentMaintenance);

    // Chapitre 6
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 6', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('PROCESSUS DE RÉALISATION', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('6.1 Réception et Contrôle', data.receptionControl);
    addSection('6.2 Conditions de Stockage', data.storageConditions);
    addSection('6.3 Processus de Dispensation', data.dispensingProcess);

    // Chapitre 7
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 7', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('SURVEILLANCE ET VIGILANCE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('7.1 Pharmacovigilance', data.pharmacovigilance);
    addSection('7.2 Gestion des Réclamations', data.complaints);

    // Chapitre 8
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 8', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('AUDITS ET NON-CONFORMITÉS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('8.1 Audits Internes', data.internalAudits);
    addSection('8.2 Gestion des Non-conformités', data.nonConformities);
    addSection('8.3 Actions Correctives et Préventives', data.capaProcess);

    // Chapitre 9
    addNewPageIfNeeded(30);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text('CHAPITRE 9', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('MESURE ET AMÉLIORATION CONTINUE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    addSection('9.1 Indicateurs de Performance', data.kpis);
    addSection('9.2 Revue de Direction', data.managementReview);
    addSection('9.3 Amélioration Continue', data.continuousImprovement);

    // Page finale - Approbation
    doc.addPage();
    yPos = margin + 40;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('APPROBATION ET VALIDATION', pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ce Manuel Qualité a été rédigé, vérifié et approuvé conformément aux exigences', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('des Bonnes Pratiques de Pharmacie et du Système de Management de la Qualité.', pageWidth / 2, yPos, { align: 'center' });
    yPos += 30;

    doc.line(margin, yPos, margin + 70, yPos);
    yPos += 5;
    doc.text('Date', margin + 35, yPos, { align: 'center' });
    yPos += 15;

    doc.line(margin, yPos, margin + 70, yPos);
    yPos += 5;
    doc.text('Pharmacien Titulaire', margin + 35, yPos, { align: 'center' });
    yPos += 3;
    doc.setFont('helvetica', 'bold');
    doc.text(data.titulaire || '', margin + 35, yPos, { align: 'center' });

    yPos -= 23;
    const rightMargin = pageWidth - margin - 70;
    doc.setFont('helvetica', 'normal');
    doc.line(rightMargin, yPos, rightMargin + 70, yPos);
    yPos += 5;
    doc.text('Date', rightMargin + 35, yPos, { align: 'center' });
    yPos += 15;

    doc.line(rightMargin, yPos, rightMargin + 70, yPos);
    yPos += 5;
    doc.text('Responsable Qualité', rightMargin + 35, yPos, { align: 'center' });
    yPos += 3;
    doc.setFont('helvetica', 'bold');
    doc.text(data.qualityManager || '', rightMargin + 35, yPos, { align: 'center' });

    // Numérotation des pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);

      if (i > 1) {
        doc.text(
          `Manuel Qualité - ${data.pharmacyName}`,
          margin,
          pageHeight - 10
        );
      }

      doc.text(
        `Page ${i} / ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    doc.save(`Manuel_Qualite_${data.pharmacyName.replace(/\s+/g, '_')}.pdf`);
  }
}
