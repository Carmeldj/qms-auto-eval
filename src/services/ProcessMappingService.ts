import jsPDF from 'jspdf';
import { processes, documentCategories } from '../data/documentClassification';
import { processKPIs } from '../data/processKPIs';

class ProcessMappingService {
  generateProcessMapping(): void {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Page 1 : Cartographie visuelle
    this.generateMappingPage(pdf);

    // Pages suivantes : Détails de chaque processus
    processes.forEach((process, index) => {
      pdf.addPage();
      this.generateProcessDetailPage(pdf, process);
    });

    // Télécharger le PDF
    const fileName = `Cartographie_Processus_Detaillee_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  private generateMappingPage(pdf: jsPDF): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Titre principal
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(0, 102, 102);
    pdf.text('CARTOGRAPHIE DES PROCESSUS', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Système de Management de la Qualité', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    const dateStr = `Généré le ${new Date().toLocaleDateString('fr-FR')}`;
    pdf.text(dateStr, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 12;

    // Parties prenantes externes - Horizontal
    const contentWidth = pageWidth - 2 * margin;
    const externalBoxWidth = 55;
    const externalBoxHeight = 15;

    // Écoute du marché (gauche)
    pdf.setFillColor(240, 248, 255);
    pdf.setDrawColor(50, 50, 50);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(margin, yPosition, externalBoxWidth, externalBoxHeight, 2, 2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    const ecoute1 = 'Écoute du marché,';
    const ecoute2 = 'des exigences,';
    const ecoute3 = 'risques et opportunités';
    pdf.text(ecoute1, margin + externalBoxWidth / 2, yPosition + 5, { align: 'center' });
    pdf.text(ecoute2, margin + externalBoxWidth / 2, yPosition + 9, { align: 'center' });
    pdf.text(ecoute3, margin + externalBoxWidth / 2, yPosition + 12.5, { align: 'center' });

    // Flèche descendante depuis Écoute du marché
    this.drawArrow(pdf, margin + externalBoxWidth / 2, yPosition + externalBoxHeight, 'down', 6, 'blue');

    // Satisfaction client (droite)
    pdf.setFillColor(240, 248, 255);
    pdf.setDrawColor(50, 50, 50);
    pdf.roundedRect(pageWidth - margin - externalBoxWidth, yPosition, externalBoxWidth, externalBoxHeight, 2, 2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Satisfaction client', pageWidth - margin - externalBoxWidth / 2, yPosition + externalBoxHeight / 2 + 1.5, { align: 'center' });

    // Flèche ascendante vers Satisfaction client
    this.drawArrow(pdf, pageWidth - margin - externalBoxWidth / 2, yPosition + externalBoxHeight, 'up', 6, 'blue');

    yPosition += externalBoxHeight + 6;

    // Conteneur principal des processus
    const mainBoxY = yPosition;
    const mainBoxHeight = 140;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(50, 50, 50);
    pdf.setLineWidth(1.2);
    pdf.roundedRect(margin, mainBoxY, contentWidth, mainBoxHeight, 3, 3, 'FD');

    yPosition = mainBoxY + 8;

    // PROCESSUS DE MANAGEMENT
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(25, 118, 210);
    pdf.text('PROCESSUS DE MANAGEMENT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    const mgmtProcesses = processes.filter(p => ['direction', 'qualite'].includes(p.id));
    const boxHeight = 12;

    mgmtProcesses.forEach(process => {
      this.drawProcessBoxCompact(pdf, margin + 10, yPosition, contentWidth - 20, boxHeight, process, '#E3F2FD', '#1976D2');
      yPosition += boxHeight + 3;
    });

    // Flèche vers processus opérationnels
    this.drawArrow(pdf, pageWidth / 2, yPosition, 'down', 6, 'gray');
    yPosition += 8;

    // PROCESSUS OPÉRATIONNELS
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(56, 142, 60);
    pdf.text('PROCESSUS OPÉRATIONNELS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    const operationalProcesses = processes.filter(p =>
      ['approvisionnement', 'dispensation', 'retours', 'dechets'].includes(p.id)
    );

    const opColWidth = (contentWidth - 30) / 2;
    let opXPos = margin + 10;
    let opYPos = yPosition;

    operationalProcesses.forEach((process, index) => {
      this.drawProcessBoxCompact(pdf, opXPos, opYPos, opColWidth, boxHeight, process, '#E8F5E9', '#388E3C');

      if (index % 2 === 0) {
        opXPos += opColWidth + 10;
      } else {
        opXPos = margin + 10;
        opYPos += boxHeight + 3;
      }
    });

    yPosition = opYPos + boxHeight + 3;

    // Flèche vers processus support
    this.drawArrow(pdf, pageWidth / 2, yPosition, 'down', 6, 'gray');
    yPosition += 8;

    // PROCESSUS SUPPORT
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(194, 24, 91);
    pdf.text('PROCESSUS SUPPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    const supportProcesses = processes.filter(p =>
      ['rh', 'infrastructures', 'finances', 'sous-traitance'].includes(p.id)
    );

    const supportColWidth = (contentWidth - 40) / 2;
    let supportXPos = margin + 10;
    let supportYPos = yPosition;

    supportProcesses.forEach((process, index) => {
      this.drawProcessBoxCompact(pdf, supportXPos, supportYPos, supportColWidth, boxHeight, process, '#FCE4EC', '#C2185B');

      if (index % 2 === 0) {
        supportXPos += supportColWidth + 10;
      } else {
        supportXPos = margin + 10;
        supportYPos += boxHeight + 3;
      }
    });

    // Légende
    yPosition = mainBoxY + mainBoxHeight + 8;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Légende:', margin, yPosition);
    yPosition += 5;

    const legendItems = [
      { color: '#E3F2FD', border: '#1976D2', text: 'Processus de management' },
      { color: '#E8F5E9', border: '#388E3C', text: 'Processus opérationnels' },
      { color: '#FCE4EC', border: '#C2185B', text: 'Processus support' }
    ];

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    legendItems.forEach((item) => {
      const fillRgb = this.hexToRgb(item.color);
      const borderRgb = this.hexToRgb(item.border);

      pdf.setFillColor(fillRgb.r, fillRgb.g, fillRgb.b);
      pdf.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
      pdf.rect(margin + 2, yPosition - 2, 4, 3, 'FD');

      pdf.setTextColor(0, 0, 0);
      pdf.text(item.text, margin + 8, yPosition);
      yPosition += 5;
    });

    // Pied de page
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text('PHARMA QMS - Cartographie des Processus', margin, pageHeight - 10);
    pdf.text('Page 1', pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  private generateProcessDetailPage(pdf: jsPDF, process: any): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // En-tête du processus
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 102);
    const titleText = `P${process.code} - ${process.name}`;
    const titleLines = pdf.splitTextToSize(titleText, pageWidth - 2 * margin - 10);
    const titleStartY = titleLines.length > 1 ? yPosition + 5 : yPosition + 8;
    pdf.text(titleLines, pageWidth / 2, titleStartY, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    const descY = titleLines.length > 1 ? yPosition + 15 : yPosition + 14;
    pdf.text(process.description, pageWidth / 2, descY, { align: 'center' });

    yPosition += 26;

    // Section 1: ENTRÉES (Procédures et documents)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('ENTRÉES', margin, yPosition);
    yPosition += 7;

    // Flèche d'entrée
    pdf.setFillColor(70, 130, 180);
    pdf.triangle(margin, yPosition, margin + 5, yPosition - 2, margin + 5, yPosition + 2, 'F');
    pdf.setDrawColor(70, 130, 180);
    pdf.setLineWidth(1);
    pdf.line(margin + 5, yPosition, margin + 30, yPosition);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(70, 130, 180);
    pdf.text('Procédures applicables', margin + 32, yPosition + 1);

    yPosition += 5;

    // Liste des procédures
    const procedures = documentCategories.filter(doc => doc.processCode === process.code);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);

    if (procedures.length > 0) {
      procedures.slice(0, 8).forEach((proc) => {
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 6, 1, 1, 'FD');

        pdf.text(`• ${proc.code} - ${proc.name}`, margin + 8, yPosition + 4);
        yPosition += 7;
      });
    } else {
      pdf.setTextColor(100, 100, 100);
      pdf.text('Aucune procédure spécifique identifiée', margin + 8, yPosition + 4);
      yPosition += 7;
    }

    yPosition += 5;

    // Section 2: TRAITEMENT (Activités du processus)
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('TRAITEMENT - ACTIVITÉS DU PROCESSUS', margin + 5, yPosition + 7);

    yPosition += 12;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const activityText = this.getProcessActivities(process.id);
    const lines = pdf.splitTextToSize(activityText, pageWidth - 2 * margin - 15);
    pdf.text(lines, margin + 8, yPosition);
    yPosition += lines.length * 4 + 10;

    yPosition += 8;

    // Section 3: KPI (Indicateurs de performance)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('INDICATEURS DE PERFORMANCE (KPI)', margin, yPosition);
    yPosition += 7;

    const kpis = processKPIs[process.id] || [];

    if (kpis.length > 0) {
      pdf.setFontSize(8);

      kpis.slice(0, 5).forEach((kpi) => {
        pdf.setFillColor(255, 252, 240);
        pdf.setDrawColor(255, 193, 7);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 10, 1, 1, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`KPI: ${kpi.name}`, margin + 8, yPosition + 4);

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text(`Objectif: ${kpi.target} - Fréquence: ${kpi.frequency}`, margin + 8, yPosition + 8);

        yPosition += 12;
      });
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Aucun KPI spécifique défini', margin + 8, yPosition + 4);
      yPosition += 10;
    }

    yPosition += 5;

    // Section 4: SORTIES (Résultats attendus)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('SORTIES', margin, yPosition);
    yPosition += 7;

    // Flèche de sortie
    pdf.setDrawColor(76, 175, 80);
    pdf.setLineWidth(1);
    pdf.line(margin, yPosition, margin + 25, yPosition);
    pdf.setFillColor(76, 175, 80);
    pdf.triangle(margin + 25, yPosition, margin + 30, yPosition - 2, margin + 30, yPosition + 2, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(76, 175, 80);
    pdf.text('Résultats attendus', margin + 32, yPosition + 1);

    yPosition += 5;

    const outputs = this.getProcessOutputs(process.id);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);

    outputs.forEach((output) => {
      pdf.setFillColor(232, 245, 233);
      pdf.setDrawColor(76, 175, 80);
      pdf.roundedRect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 6, 1, 1, 'FD');

      pdf.text(`> ${output}`, margin + 8, yPosition + 4);
      yPosition += 7;
    });

    // Pied de page
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Détail du processus P${process.code}`, margin, pageHeight - 10);
    const pageNum = pdf.getCurrentPageInfo().pageNumber;
    pdf.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  private getProcessActivities(processId: string): string {
    const activities: Record<string, string> = {
      'direction': 'Définir la politique qualité, fixer les objectifs, allouer les ressources, effectuer les revues de direction, prendre les décisions stratégiques, communiquer avec les parties prenantes.',
      'qualite': 'Planifier les audits internes, gérer les non-conformités, piloter les actions CAPA, mettre à jour la documentation qualité, suivre les indicateurs qualité, assurer la veille réglementaire.',
      'approvisionnement': 'Identifier les besoins, sélectionner les fournisseurs, passer les commandes, réceptionner les produits, contrôler les livraisons, gérer les stocks, optimiser les approvisionnements.',
      'dispensation': 'Accueillir les patients, analyser les ordonnances, délivrer les médicaments, effectuer le conseil pharmaceutique, assurer la traçabilité, gérer les interactions médicamenteuses.',
      'retours': 'Recevoir les réclamations clients, traiter les retours produits, gérer les rappels de lots, analyser les causes, mettre en œuvre les actions correctives, informer les parties concernées.',
      'dechets': 'Trier les produits périmés, séparer les déchets selon leur nature, stocker temporairement les déchets, faire appel aux prestataires de destruction, assurer la traçabilité des destructions.',
      'rh': 'Recruter le personnel, définir les fiches de poste, évaluer les compétences, élaborer le plan de formation, organiser les formations, évaluer la satisfaction du personnel.',
      'infrastructures': 'Maintenir les locaux, entretenir les équipements, surveiller la chaîne du froid, assurer la conformité des installations, planifier les maintenances préventives, gérer les réparations.',
      'finances': 'Gérer la comptabilité, suivre la trésorerie, optimiser les marges, contrôler les stocks financiers, établir les budgets, analyser la rentabilité.',
      'sous-traitance': 'Identifier les besoins de sous-traitance, qualifier les prestataires, rédiger les cahiers des charges, évaluer les prestations, auditer les prestataires, gérer les contrats.'
    };
    return activities[processId] || 'Activités à définir pour ce processus.';
  }

  private getProcessOutputs(processId: string): string[] {
    const outputs: Record<string, string[]> = {
      'direction': [
        'Politique qualité validée',
        'Objectifs qualité définis et communiqués',
        'Ressources allouées aux processus',
        'Compte-rendu de revue de direction'
      ],
      'qualite': [
        'Rapports d\'audit interne',
        'Fiches de non-conformité',
        'Plan d\'actions CAPA',
        'Documents qualité à jour',
        'Tableaux de bord qualité'
      ],
      'approvisionnement': [
        'Stock disponible et conforme',
        'Produits réceptionnés et contrôlés',
        'Traçabilité des approvisionnements',
        'Optimisation des coûts d\'achat',
        'Taux de service fournisseur optimal'
      ],
      'dispensation': [
        'Médicaments dispensés de manière sécurisée',
        'Ordonnances analysées et validées',
        'Conseil pharmaceutique délivré',
        'Traçabilité assurée (ordonnancier)',
        'Satisfaction patient optimale'
      ],
      'retours': [
        'Réclamations traitées et clôturées',
        'Produits retournés aux fournisseurs',
        'Lots rappelés identifiés et retirés',
        'Actions correctives mises en place',
        'Analyses des causes effectuées'
      ],
      'dechets': [
        'Déchets triés conformément à la réglementation',
        'Traçabilité des destructions documentée',
        'Bordereaux de destruction archivés',
        'Conformité environnementale assurée'
      ],
      'rh': [
        'Personnel qualifié et compétent',
        'Plan de formation réalisé',
        'Évaluations de compétences effectuées',
        'Fiches de poste à jour',
        'Personnel satisfait et motivé'
      ],
      'infrastructures': [
        'Locaux conformes et entretenus',
        'Équipements fonctionnels et étalonnés',
        'Chaîne du froid maîtrisée',
        'Maintenances préventives réalisées',
        'Environnement de travail sécurisé'
      ],
      'finances': [
        'Comptabilité tenue à jour',
        'Marges optimisées',
        'Trésorerie maîtrisée',
        'Budgets respectés',
        'Indicateurs financiers suivis'
      ],
      'sous-traitance': [
        'Prestataires qualifiés',
        'Prestations conformes aux attentes',
        'Contrats et cahiers des charges validés',
        'Audits de prestataires réalisés',
        'Traçabilité des prestations assurée'
      ]
    };
    return outputs[processId] || ['Résultats à définir pour ce processus'];
  }

  private drawProcessBoxCompact(
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    process: any,
    fillColor: string,
    borderColor: string
  ): void {
    const fill = this.hexToRgb(fillColor);
    const border = this.hexToRgb(borderColor);

    pdf.setFillColor(fill.r, fill.g, fill.b);
    pdf.setDrawColor(border.r, border.g, border.b);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(x, y, width, height, 2, 2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(border.r, border.g, border.b);
    pdf.text(`P${process.code}`, x + 2, y + 4);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(process.name, width - 4);
    const textY = y + height / 2 + 1.5;
    pdf.text(lines, x + width / 2, textY, { align: 'center', maxWidth: width - 4 });
  }

  private drawArrow(pdf: jsPDF, x: number, y: number, direction: 'down' | 'up' | 'right', length: number, color: string): void {
    const colorMap: Record<string, number[]> = {
      'blue': [70, 130, 180],
      'gray': [100, 100, 100],
      'green': [76, 175, 80]
    };

    const rgb = colorMap[color] || [100, 100, 100];
    pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
    pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
    pdf.setLineWidth(1);

    if (direction === 'down') {
      pdf.line(x, y, x, y + length);
      pdf.triangle(x, y + length, x - 2, y + length - 3, x + 2, y + length - 3, 'F');
    } else if (direction === 'up') {
      pdf.line(x, y, x, y + length);
      pdf.triangle(x, y + length, x - 2, y + length + 3, x + 2, y + length + 3, 'F');
    } else if (direction === 'right') {
      pdf.line(x, y, x + length, y);
      pdf.triangle(x + length, y, x + length - 3, y - 2, x + length - 3, y + 2, 'F');
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  private triangle(pdf: jsPDF, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string): void {
    pdf.lines([[x2 - x1, y2 - y1], [x3 - x2, y3 - y2], [x1 - x3, y1 - y3]], x1, y1, [1, 1], style);
  }
}

export const processMappingService = new ProcessMappingService();
