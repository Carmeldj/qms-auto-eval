import jsPDF from 'jspdf';

export class RegisterListService {
  private static instance: RegisterListService;

  private constructor() {}

  public static getInstance(): RegisterListService {
    if (!RegisterListService.instance) {
      RegisterListService.instance = new RegisterListService();
    }
    return RegisterListService.instance;
  }

  /**
   * Génère la liste des registres/documents de gestion prévus
   */
  public generateManagementRegistersList(pharmacyName: string): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // En-tête
    doc.setFillColor(0, 150, 136);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LISTE DES REGISTRES/DOCUMENTS', pageWidth / 2, 15, { align: 'center' });
    doc.text('DE GESTION PRÉVUS', pageWidth / 2, 25, { align: 'center' });

    // Informations pharmacie
    yPos = 45;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pharmacie : ${pharmacyName}`, margin, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, margin, yPos);

    yPos += 15;

    // Introduction
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const introText = "Liste des registres et documents de gestion conformément au Système de Management de la Qualité (SMQ).";
    doc.text(introText, margin, yPos, { maxWidth: pageWidth - 2 * margin });

    yPos += 15;

    // Registres de gestion
    const managementRegisters = [
      {
        category: '00 - ADMINISTRATION GÉNÉRALE DE LA QUALITÉ',
        items: [
          '00.01 - Politique Qualité et Engagement',
          '00.02 - Objectifs Qualité',
          '00.03 - Manuel Qualité',
          '00.04 - Lettre de désignation RMQ (Responsable Management Qualité)',
          '00.05 - Planning annuel Qualité',
          '00.06 - Revue de direction',
          '00.07 - Communication interne qualité'
        ]
      },
      {
        category: '01 - PROCÉDURES ET DOCUMENTS DE RÉFÉRENCE',
        items: [
          '01.01 - Procédures générales (37 procédures du SMQ)',
          '01.02 - Instructions de travail',
          '01.03 - Fiches techniques',
          '01.04 - Modèles de documents',
          '01.05 - Fiches de vie documentaire'
        ]
      },
      {
        category: '02 - GESTION DES RISQUES ET AMÉLIORATION CONTINUE',
        items: [
          '02.01 - Registre d\'audit interne / auto-inspections',
          '02.02 - Registre des non-conformités',
          '02.03 - Registre des actions correctives et préventives (CAPA)',
          '02.04 - Registre de gestion des incidents / Événements indésirables',
          '02.05 - Plan de gestion des risques'
        ]
      },
      {
        category: '03 - BONNES PRATIQUES OFFICINALES (BPO)',
        items: [
          '03.01 - Référentiels et guides BPO',
          '03.02 - Checklists de conformité BPO',
          '03.03 - Grilles d\'évaluation BPO',
          '03.04 - Fiches de suivi des pratiques',
          '03.05 - Preuves de mise en œuvre des BPO'
        ]
      },
      {
        category: '04 - FORMATION ET COMPÉTENCES',
        items: [
          '04.01 - Registre des formations',
          '04.02 - Plan de formation annuel',
          '04.03 - Fiches de présence / Attestations',
          '04.04 - Évaluations des compétences',
          '04.05 - Fiches de poste'
        ]
      },
      {
        category: '06 - GESTION DU PERSONNEL',
        items: [
          '06.01 - Règles de gestion du personnel',
          '06.02 - Champ d\'action du Pharmacien',
          '06.03 - Formation du personnel',
          '06.04 - Hygiène du personnel',
          '06.05 - Fiches d\'intégration'
        ]
      },
      {
        category: '07 - GESTION DES LOCAUX ET ÉQUIPEMENTS',
        items: [
          '07.01 - Locaux (plans, conformité, nettoyage)',
          '07.02 - Équipements biomédicaux et balances',
          '07.03 - Maintenance et vérification périodique',
          '07.04 - Matériels de sécurité'
        ]
      },
      {
        category: '08 - APPROVISIONNEMENT & STOCKAGE',
        items: [
          '08.01 - Préparation des commandes',
          '08.02 - Réception des commandes',
          '08.03 - Stockage des produits de santé',
          '08.04 - Registre des produits périmés / détruits',
          '08.05 - Fiches de traçabilité du stock'
        ]
      },
      {
        category: '11 - MAÎTRISE DOCUMENTAIRE',
        items: [
          '11.01 - Gestion documentaire',
          '11.02 - Documents obligatoires du SMQ',
          '11.03 - Documents internes de fonctionnement',
          '11.04 - Documents destinés aux patients',
          '11.05 - Fiches de mise à jour documentaire',
          '11.06 - Registre des versions et codification'
        ]
      },
      {
        category: '12 - COMMUNICATION ET SATISFACTION CLIENT',
        items: [
          '12.01 - Enquêtes de satisfaction',
          '12.02 - Réclamations clients',
          '12.03 - Actions de sensibilisation',
          '12.04 - Affichage obligatoire',
          '12.05 - Documents d\'information patients'
        ]
      },
      {
        category: '13 - ARCHIVAGE ET DOCUMENTS OBSOLÈTES',
        items: [
          '13.01 - Registre des documents archivés',
          '13.02 - Versions obsolètes (barrées, tamponnées)',
          '13.03 - Destruction des documents (preuves)'
        ]
      }
    ];

    doc.setFontSize(11);

    managementRegisters.forEach((section) => {
      // Vérifier si on a assez d'espace pour la section
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      // Titre de catégorie
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(0, 96, 88);
      doc.text(section.category, margin + 2, yPos + 1);
      yPos += 10;

      // Items
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      section.items.forEach((item) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = margin;
        }

        doc.text(`• ${item}`, margin + 5, yPos);
        yPos += 6;
      });

      yPos += 5;
    });

    // Pied de page sur toutes les pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} / ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'Système de Management de la Qualité - Conformité SMQ',
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    doc.save(`Registres_Gestion_${pharmacyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  /**
   * Génère la liste des registres de traçabilité des dispensations et surveillance des événements indésirables
   */
  public generateDispensationAndVigilanceRegistersList(pharmacyName: string): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // En-tête
    doc.setFillColor(0, 96, 88);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LISTE DES REGISTRES/DOCUMENTS', pageWidth / 2, 12, { align: 'center' });
    doc.text('DE TRAÇABILITÉ DES DISPENSATIONS', pageWidth / 2, 20, { align: 'center' });
    doc.text('ET SURVEILLANCE DES ÉVÉNEMENTS INDÉSIRABLES', pageWidth / 2, 28, { align: 'center' });

    // Informations pharmacie
    yPos = 45;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pharmacie : ${pharmacyName}`, margin, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, margin, yPos);

    yPos += 15;

    // Introduction
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const introText = "Liste des registres obligatoires de traçabilité pharmaceutique et de surveillance des événements indésirables conformément aux Bonnes Pratiques Officinales (BPO).";
    doc.text(introText, margin, yPos, { maxWidth: pageWidth - 2 * margin });

    yPos += 20;

    // Registres de traçabilité
    const traceabilityRegisters = [
      {
        category: '05 - DOCUMENTS DE TRAÇABILITÉ PHARMACEUTIQUE',
        color: [0, 150, 136],
        items: [
          {
            code: '05.01',
            title: 'Registre de dispensation (Ordonnancier)',
            description: 'Enregistrement chronologique de toutes les dispensations sur prescription médicale',
            obligation: 'OBLIGATOIRE',
            retention: '3 ans minimum'
          },
          {
            code: '05.02',
            title: 'Registre des stupéfiants',
            description: 'Traçabilité complète des substances vénéneuses (entrées/sorties, prescripteur, patient)',
            obligation: 'OBLIGATOIRE',
            retention: '10 ans minimum'
          },
          {
            code: '05.02',
            title: 'Registre des psychotropes',
            description: 'Traçabilité des médicaments assimilés stupéfiants',
            obligation: 'OBLIGATOIRE',
            retention: '10 ans minimum'
          },
          {
            code: '05.01',
            title: 'Registre des préparations magistrales et officinales',
            description: 'Composition, lot, date, prescripteur, patient',
            obligation: 'OBLIGATOIRE (si activité)',
            retention: '5 ans minimum'
          },
          {
            code: '05.03',
            title: 'Registre des retours clients/fournisseurs',
            description: 'Traçabilité des retours de produits',
            obligation: 'RECOMMANDÉ',
            retention: '3 ans'
          },
          {
            code: '05.04',
            title: 'Relevés de température',
            description: 'Surveillance quotidienne des conditions de conservation (réfrigérateurs, locaux)',
            obligation: 'OBLIGATOIRE',
            retention: '3 ans minimum'
          },
          {
            code: '05.05',
            title: 'Registre des médicaments non utilisés (MNU)',
            description: 'Traçabilité des retours patients pour destruction',
            obligation: 'RECOMMANDÉ',
            retention: '3 ans'
          },
          {
            code: '05.06',
            title: 'Registre des rappels de lots / Alertes sanitaires',
            description: 'Notifications des autorités sanitaires et actions entreprises',
            obligation: 'OBLIGATOIRE',
            retention: '5 ans minimum'
          }
        ]
      },
      {
        category: '09 - DISPENSATION ET VIGILANCE',
        color: [220, 53, 69],
        items: [
          {
            code: '09.06',
            title: 'Registre de Pharmacovigilance',
            description: 'Déclaration des effets indésirables médicamenteux (EIM)',
            obligation: 'OBLIGATOIRE',
            retention: '10 ans minimum'
          },
          {
            code: '09.06',
            title: 'Registre de Matériovigilance',
            description: 'Déclaration des incidents liés aux dispositifs médicaux',
            obligation: 'OBLIGATOIRE',
            retention: '10 ans minimum'
          },
          {
            code: '09.02',
            title: 'Registre des erreurs de dispensation',
            description: 'Enregistrement et analyse des erreurs pour amélioration continue',
            obligation: 'FORTEMENT RECOMMANDÉ',
            retention: '5 ans'
          }
        ]
      },
      {
        category: '10 - GESTION DES RETOURS, RÉCLAMATIONS, RETRAITS',
        color: [255, 159, 64],
        items: [
          {
            code: '10.01',
            title: 'Registre des retours clients',
            description: 'Enregistrement des retours de produits par les patients',
            obligation: 'RECOMMANDÉ',
            retention: '3 ans'
          },
          {
            code: '10.02',
            title: 'Registre des réclamations patients et traçabilité',
            description: 'Enregistrement systématique des réclamations et suivi',
            obligation: 'OBLIGATOIRE',
            retention: '3 ans minimum'
          },
          {
            code: '10.03',
            title: 'Registre des rappels de lots',
            description: 'Traçabilité complète des rappels de lots (notification, actions, preuves)',
            obligation: 'OBLIGATOIRE',
            retention: '5 ans minimum'
          },
          {
            code: '10.04',
            title: 'Registre des retraits de produits',
            description: 'Notification Agence nationale/DPML, lot concerné, action entreprise',
            obligation: 'OBLIGATOIRE',
            retention: '5 ans minimum'
          },
          {
            code: '10.05',
            title: 'Registre des mesures correctives associées',
            description: 'Actions correctives suite aux retraits et rappels',
            obligation: 'OBLIGATOIRE',
            retention: '5 ans'
          }
        ]
      }
    ];

    doc.setFontSize(10);

    traceabilityRegisters.forEach((section) => {
      // Vérifier si on a assez d'espace pour la section
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = margin;
      }

      // Titre de catégorie avec couleur
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(section.color[0], section.color[1], section.color[2]);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text(section.category, margin + 3, yPos + 1);
      yPos += 12;

      // Items détaillés
      section.items.forEach((item) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = margin;
        }

        // Code de classification
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 96, 88);
        doc.text(`[${item.code}]`, margin + 2, yPos);

        // Titre du registre
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(item.title, margin + 18, yPos);
        yPos += 5;

        // Description
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(64, 64, 64);
        doc.text(item.description, margin + 18, yPos, { maxWidth: pageWidth - margin - 25 });
        yPos += 5;

        // Obligation et conservation
        doc.setFontSize(8);
        const obligationColor = item.obligation.includes('OBLIGATOIRE') ? [220, 53, 69] : [255, 159, 64];
        doc.setTextColor(obligationColor[0], obligationColor[1], obligationColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.obligation}`, margin + 18, yPos);

        doc.setTextColor(64, 64, 64);
        doc.setFont('helvetica', 'italic');
        doc.text(`• Conservation : ${item.retention}`, margin + 100, yPos);

        yPos += 8;
      });

      yPos += 5;
    });

    // Encadré récapitulatif
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    yPos += 10;
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');
    doc.setDrawColor(0, 96, 88);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 96, 88);
    doc.text('RÉCAPITULATIF', margin + 3, yPos);

    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('• Total registres obligatoires : 14 registres', margin + 5, yPos);
    yPos += 6;
    doc.text('• Registres de traçabilité pharmaceutique : 8 registres', margin + 5, yPos);
    yPos += 6;
    doc.text('• Registres de vigilance et événements indésirables : 3 registres', margin + 5, yPos);
    yPos += 6;
    doc.text('• Registres de retours et réclamations : 5 registres', margin + 5, yPos);

    // Pied de page sur toutes les pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} / ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'Traçabilité Pharmaceutique - Conformité BPO',
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    doc.save(`Registres_Tracabilite_Dispensation_EI_${pharmacyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}

export const registerListService = RegisterListService.getInstance();
