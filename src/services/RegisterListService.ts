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

  /**
   * Génère la liste des documents d'informations pharmaceutiques prévus pour une officine
   */
  public generatePharmaceuticalInformationDocumentsList(pharmacyName: string): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // En-tête
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LISTE DES DOCUMENTS', pageWidth / 2, 12, { align: 'center' });
    doc.text('D\'INFORMATIONS PHARMACEUTIQUES PRÉVUS', pageWidth / 2, 20, { align: 'center' });
    doc.text('POUR UNE OFFICINE', pageWidth / 2, 28, { align: 'center' });

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
    const introText = "Liste exhaustive des documents d'information destinés aux patients, professionnels de santé et affichages obligatoires conformément aux Bonnes Pratiques Officinales (BPO).";
    doc.text(introText, margin, yPos, { maxWidth: pageWidth - 2 * margin });

    yPos += 20;

    // Documents d'information pharmaceutique
    const informationDocuments = [
      {
        category: 'AFFICHAGES OBLIGATOIRES À L\'OFFICINE',
        color: [239, 68, 68],
        description: 'Documents devant être visibles par le public (Code de la santé publique)',
        items: [
          {
            title: 'Diplôme du pharmacien titulaire',
            description: 'Diplôme d\'État de Docteur en Pharmacie du titulaire',
            location: 'Visible dans l\'espace de dispensation',
            obligation: 'OBLIGATOIRE',
            reference: 'Art. L.4221-1 CSP'
          },
          {
            title: 'Horaires d\'ouverture',
            description: 'Horaires d\'ouverture et de fermeture de l\'officine',
            location: 'Vitrine extérieure visible de la rue',
            obligation: 'OBLIGATOIRE',
            reference: 'Art. R.5125-9 CSP'
          },
          {
            title: 'Pharmacies de garde',
            description: 'Liste des pharmacies de garde du secteur (mise à jour mensuelle)',
            location: 'Vitrine extérieure',
            obligation: 'OBLIGATOIRE',
            reference: 'Art. R.5125-9 CSP'
          },
          {
            title: 'Tarifs des honoraires de dispensation',
            description: 'Grille tarifaire des honoraires pharmaceutiques',
            location: 'Visible à l\'intérieur de l\'officine',
            obligation: 'OBLIGATOIRE',
            reference: 'Art. R.5125-9 CSP'
          },
          {
            title: 'Information sur les médicaments génériques',
            description: 'Affiche explicative sur le droit de substitution et les génériques',
            location: 'Espace de dispensation',
            obligation: 'OBLIGATOIRE',
            reference: 'Art. L.5125-23 CSP'
          },
          {
            title: 'Coordonnées de l\'Ordre des Pharmaciens',
            description: 'Coordonnées du Conseil national et du Conseil régional de l\'Ordre',
            location: 'Visible dans l\'officine',
            obligation: 'OBLIGATOIRE',
            reference: 'Code de déontologie'
          },
          {
            title: 'Information Dossier Pharmaceutique (DP)',
            description: 'Affiche explicative sur le Dossier Pharmaceutique et consentement patient',
            location: 'Espace de dispensation',
            obligation: 'OBLIGATOIRE',
            reference: 'Art. R.1111-20-1 CSP'
          },
          {
            title: 'Recyclage des médicaments (Cyclamed)',
            description: 'Affiche sur la collecte des médicaments non utilisés',
            location: 'Espace de vente',
            obligation: 'OBLIGATOIRE',
            reference: 'Obligation environnementale'
          },
          {
            title: 'Interdiction de fumer',
            description: 'Signalétique d\'interdiction de fumer dans les locaux',
            location: 'Entrée et espaces intérieurs',
            obligation: 'OBLIGATOIRE',
            reference: 'Décret n°2006-1386'
          }
        ]
      },
      {
        category: 'DOCUMENTS D\'INFORMATION PATIENTS (DISPENSATION)',
        color: [34, 197, 94],
        description: 'Supports d\'information remis ou mis à disposition des patients',
        items: [
          {
            title: 'Fiches conseils médicaments',
            description: 'Fiches explicatives sur le bon usage des médicaments courants',
            location: 'Comptoir de dispensation / Présentoir',
            obligation: 'FORTEMENT RECOMMANDÉ',
            reference: 'Conseil pharmaceutique'
          },
          {
            title: 'Notices d\'utilisation dispositifs médicaux',
            description: 'Modes d\'emploi : aérosols, autopiqueurs, lecteurs de glycémie, tensiomètres, etc.',
            location: 'Remis avec le dispositif',
            obligation: 'OBLIGATOIRE',
            reference: 'Réglementation DM'
          },
          {
            title: 'Fiches posologie pédiatrique',
            description: 'Tableaux de posologie selon l\'âge et le poids pour enfants',
            location: 'Dispensation pédiatrique',
            obligation: 'RECOMMANDÉ',
            reference: 'Sécurité pédiatrique'
          },
          {
            title: 'Guide d\'utilisation des inhalateurs',
            description: 'Fiches illustrées sur la technique d\'inhalation (aérosols doseurs, poudres)',
            location: 'Dispensation avec inhalateurs',
            obligation: 'FORTEMENT RECOMMANDÉ',
            reference: 'Éducation thérapeutique'
          },
          {
            title: 'Fiches pathologies courantes',
            description: 'Informations sur diabète, hypertension, asthme, allergies, etc.',
            location: 'Présentoir libre-service',
            obligation: 'RECOMMANDÉ',
            reference: 'Prévention santé publique'
          },
          {
            title: 'Carnet de suivi patient',
            description: 'Carnets de suivi pour traitements chroniques (diabète, anticoagulants, etc.)',
            location: 'Remis au patient concerné',
            obligation: 'RECOMMANDÉ',
            reference: 'Suivi thérapeutique'
          },
          {
            title: 'Information sur l\'automédication responsable',
            description: 'Brochure sur les risques et bonnes pratiques de l\'automédication',
            location: 'Espace OTC / Présentoir',
            obligation: 'RECOMMANDÉ',
            reference: 'ANSM'
          },
          {
            title: 'Pilulier et schéma de prise',
            description: 'Modèles de piluliers et schémas personnalisés de prise médicamenteuse',
            location: 'Dispensation polymédication',
            obligation: 'RECOMMANDÉ',
            reference: 'Observance thérapeutique'
          }
        ]
      },
      {
        category: 'CAMPAGNES DE PRÉVENTION ET SANTÉ PUBLIQUE',
        color: [168, 85, 247],
        description: 'Affichages et documents dans le cadre de missions de santé publique',
        items: [
          {
            title: 'Campagnes de vaccination',
            description: 'Affiches sur calendrier vaccinal, vaccination grippe, Covid-19, etc.',
            location: 'Espace d\'attente',
            obligation: 'RECOMMANDÉ',
            reference: 'Santé publique'
          },
          {
            title: 'Prévention des addictions',
            description: 'Documents sur tabac, alcool, drogues, numéros d\'aide',
            location: 'Présentoir / Affichage',
            obligation: 'RECOMMANDÉ',
            reference: 'MILDECA'
          },
          {
            title: 'Dépistage et prévention IST/VIH',
            description: 'Brochures sur prévention IST, dépistage VIH, hépatites',
            location: 'Présentoir confidentiel',
            obligation: 'RECOMMANDÉ',
            reference: 'Santé publique'
          },
          {
            title: 'Contraception d\'urgence',
            description: 'Information sur la contraception d\'urgence et sa délivrance gratuite pour mineures',
            location: 'Espace confidentiel',
            obligation: 'OBLIGATOIRE',
            reference: 'Art. L.5134-1 CSP'
          },
          {
            title: 'Prévention canicule / grand froid',
            description: 'Affiches saisonnières sur comportements à adopter (été/hiver)',
            location: 'Espace d\'attente',
            obligation: 'RECOMMANDÉ (saisonnier)',
            reference: 'Santé publique'
          },
          {
            title: 'Bon usage des antibiotiques',
            description: 'Campagne "Les antibiotiques, c\'est pas automatique"',
            location: 'Espace de dispensation',
            obligation: 'RECOMMANDÉ',
            reference: 'ANSM / Assurance Maladie'
          },
          {
            title: 'Prévention chutes personnes âgées',
            description: 'Conseils de prévention des chutes et aménagement du domicile',
            location: 'Présentoir',
            obligation: 'RECOMMANDÉ',
            reference: 'Gérontologie'
          }
        ]
      },
      {
        category: 'DOCUMENTS DESTINÉS AUX PROFESSIONNELS DE SANTÉ',
        color: [249, 115, 22],
        description: 'Informations professionnelles pour médecins, infirmiers, pharmaciens',
        items: [
          {
            title: 'Vidal ou base de données médicamenteuse',
            description: 'Référentiel des spécialités pharmaceutiques (papier ou numérique)',
            location: 'Bureau du pharmacien',
            obligation: 'OBLIGATOIRE',
            reference: 'Exercice professionnel'
          },
          {
            title: 'Thériaque (ou équivalent)',
            description: 'Base de données d\'aide à la décision thérapeutique',
            location: 'Poste informatique',
            obligation: 'FORTEMENT RECOMMANDÉ',
            reference: 'Aide à la dispensation'
          },
          {
            title: 'Protocoles de coopération',
            description: 'Protocoles locaux avec médecins, IDE pour renouvellements, vaccinations, etc.',
            location: 'Classeur professionnel',
            obligation: 'SI APPLICABLE',
            reference: 'Art. L.4011-1 CSP'
          },
          {
            title: 'Conduite à tenir urgences',
            description: 'Fiches réflexes : AVC, infarctus, réaction anaphylactique, convulsions, etc.',
            location: 'Bureau pharmacien / Espace dispensation',
            obligation: 'FORTEMENT RECOMMANDÉ',
            reference: 'Sécurité'
          },
          {
            title: 'Annuaire des professionnels de santé du secteur',
            description: 'Coordonnées médecins, infirmiers, SAMU, centre antipoison, pharmacovigilance',
            location: 'Bureau du pharmacien',
            obligation: 'OBLIGATOIRE',
            reference: 'BPO'
          },
          {
            title: 'Référentiels BPO et BPD',
            description: 'Bonnes Pratiques Officinales et de Distribution (version à jour)',
            location: 'Classeur qualité',
            obligation: 'OBLIGATOIRE',
            reference: 'Réglementation'
          },
          {
            title: 'Veille réglementaire et alertes sanitaires',
            description: 'Classeur des alertes ANSM, rappels de lots, modifications AMM',
            location: 'Bureau pharmacien',
            obligation: 'OBLIGATOIRE',
            reference: 'Pharmacovigilance'
          }
        ]
      },
      {
        category: 'DOCUMENTS INTERNES DE COMMUNICATION',
        color: [20, 184, 166],
        description: 'Supports de communication interne pour le personnel',
        items: [
          {
            title: 'Consignes de sécurité et évacuation',
            description: 'Plans d\'évacuation, localisation extincteurs, consignes incendie',
            location: 'Réserve et espace de travail',
            obligation: 'OBLIGATOIRE',
            reference: 'Code du travail'
          },
          {
            title: 'Procédures d\'hygiène du personnel',
            description: 'Protocole de lavage des mains, port des équipements de protection',
            location: 'Près du point d\'eau',
            obligation: 'OBLIGATOIRE',
            reference: 'BPO'
          },
          {
            title: 'Protocoles d\'urgence (Premiers secours)',
            description: 'Conduite à tenir en cas d\'accident, malaise client ou personnel',
            location: 'Bureau + réserve',
            obligation: 'OBLIGATOIRE',
            reference: 'Sécurité au travail'
          },
          {
            title: 'Numéros d\'urgence',
            description: 'SAMU (15), Pompiers (18), Police (17), Centre antipoison, Pharmacovigilance',
            location: 'À proximité du téléphone',
            obligation: 'OBLIGATOIRE',
            reference: 'Sécurité'
          },
          {
            title: 'Planning de garde et astreintes',
            description: 'Planning des pharmacies de garde du secteur (mise à jour mensuelle)',
            location: 'Bureau du pharmacien',
            obligation: 'OBLIGATOIRE',
            reference: 'Organisation'
          },
          {
            title: 'Cahier de liaison',
            description: 'Support de transmission d\'informations entre équipes',
            location: 'Bureau du pharmacien',
            obligation: 'FORTEMENT RECOMMANDÉ',
            reference: 'Communication interne'
          }
        ]
      },
      {
        category: 'DOCUMENTS QUALITÉ ET TRAÇABILITÉ',
        color: [100, 116, 139],
        description: 'Documents liés au système qualité devant être accessibles',
        items: [
          {
            title: 'Politique Qualité de l\'officine',
            description: 'Document décrivant l\'engagement qualité du titulaire',
            location: 'Classeur qualité visible',
            obligation: 'OBLIGATOIRE (SMQ)',
            reference: 'ISO 9001 / BPO'
          },
          {
            title: 'Organigramme de l\'officine',
            description: 'Structure hiérarchique et responsabilités du personnel',
            location: 'Bureau / Affichage personnel',
            obligation: 'OBLIGATOIRE (SMQ)',
            reference: 'Documentation qualité'
          },
          {
            title: 'Liste des procédures applicables',
            description: 'Index des 37 procédures du SMQ avec codes de classification',
            location: 'Classeur des procédures',
            obligation: 'OBLIGATOIRE (SMQ)',
            reference: 'Maîtrise documentaire'
          },
          {
            title: 'Fiches de poste du personnel',
            description: 'Descriptions de fonctions pour chaque membre de l\'équipe',
            location: 'Dossier RH',
            obligation: 'OBLIGATOIRE (SMQ)',
            reference: 'Code 04.05'
          },
          {
            title: 'Registre des formations',
            description: 'Traçabilité des formations suivies par le personnel',
            location: 'Classeur qualité',
            obligation: 'OBLIGATOIRE',
            reference: 'Code 04.01'
          }
        ]
      }
    ];

    doc.setFontSize(10);

    informationDocuments.forEach((section) => {
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
      doc.text(section.category, pageWidth / 2, yPos + 1, { align: 'center' });
      yPos += 8;

      // Description de la catégorie
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(section.description, pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;

      // Items détaillés
      section.items.forEach((item, index) => {
        if (yPos > pageHeight - 35) {
          doc.addPage();
          yPos = margin;
        }

        // Numéro et titre du document
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${item.title}`, margin + 2, yPos);
        yPos += 5;

        // Description
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(64, 64, 64);
        doc.text(item.description, margin + 5, yPos, { maxWidth: pageWidth - margin - 10 });
        yPos += 4;

        // Localisation
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(`Localisation : ${item.location}`, margin + 5, yPos);
        yPos += 4;

        // Obligation et référence
        const obligationColor = item.obligation.includes('OBLIGATOIRE') ? [220, 53, 69] : [249, 115, 22];
        doc.setTextColor(obligationColor[0], obligationColor[1], obligationColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text(item.obligation, margin + 5, yPos);

        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'italic');
        doc.text(`• Référence : ${item.reference}`, margin + 70, yPos);

        yPos += 6;
      });

      yPos += 3;
    });

    // Encadré récapitulatif
    if (yPos > pageHeight - 65) {
      doc.addPage();
      yPos = margin;
    }

    yPos += 5;
    doc.setFillColor(239, 246, 255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 50, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 50);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('RÉCAPITULATIF', margin + 3, yPos);

    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('• Total documents d\'information : 47 documents', margin + 5, yPos);
    yPos += 5;
    doc.text('• Affichages obligatoires : 9 documents', margin + 5, yPos);
    yPos += 5;
    doc.text('• Documents information patients : 8 documents', margin + 5, yPos);
    yPos += 5;
    doc.text('• Campagnes prévention santé publique : 7 documents', margin + 5, yPos);
    yPos += 5;
    doc.text('• Documents professionnels de santé : 7 documents', margin + 5, yPos);
    yPos += 5;
    doc.text('• Documents communication interne : 6 documents', margin + 5, yPos);
    yPos += 5;
    doc.text('• Documents qualité et traçabilité : 5 documents', margin + 5, yPos);

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
        'Documents d\'Information Pharmaceutique - Conformité BPO',
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    doc.save(`Documents_Information_Pharmaceutique_${pharmacyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}

export const registerListService = RegisterListService.getInstance();
