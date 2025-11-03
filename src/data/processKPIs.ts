export interface ProcessKPI {
  id: string;
  name: string;
  target: string;
  unit: string;
  frequency: string;
  description: string;
}

export const processKPIs: Record<string, ProcessKPI[]> = {
  'direction': [
    {
      id: 'dir-1',
      name: 'Taux de réalisation des objectifs qualité',
      target: 'Supérieur ou égal à 80%',
      unit: '%',
      frequency: 'Annuelle',
      description: 'Pourcentage d\'objectifs qualité atteints sur l\'année'
    },
    {
      id: 'dir-2',
      name: 'Nombre de revues de direction réalisées',
      target: 'Supérieur ou égal à 2',
      unit: 'nombre',
      frequency: 'Annuelle',
      description: 'Nombre de revues de direction effectuées dans l\'année'
    },
    {
      id: 'dir-3',
      name: 'Taux de communication des décisions stratégiques',
      target: '100%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Pourcentage de décisions communiquées à l\'équipe'
    }
  ],
  'qualite': [
    {
      id: 'qual-1',
      name: 'Taux de conformité des audits internes',
      target: 'Supérieur ou égal à 85%',
      unit: '%',
      frequency: 'Annuelle',
      description: 'Pourcentage de conformité lors des auto-inspections'
    },
    {
      id: 'qual-2',
      name: 'Nombre d\'actions CAPA ouvertes',
      target: 'À suivre',
      unit: 'nombre',
      frequency: 'Mensuelle',
      description: 'Nombre d\'actions correctives et préventives initiées'
    },
    {
      id: 'qual-3',
      name: 'Délai moyen de clôture des CAPA',
      target: 'Inférieur ou égal à 30 jours',
      unit: 'jours',
      frequency: 'Mensuelle',
      description: 'Temps moyen entre ouverture et clôture des CAPA'
    },
    {
      id: 'qual-4',
      name: 'Taux de récurrence des non-conformités',
      target: 'Inférieur ou égal à 10%',
      unit: '%',
      frequency: 'Trimestrielle',
      description: 'Pourcentage de non-conformités récurrentes'
    },
    {
      id: 'qual-5',
      name: 'Nombre de documents mis à jour',
      target: 'À suivre',
      unit: 'nombre',
      frequency: 'Mensuelle',
      description: 'Nombre de procédures et documents révisés'
    }
  ],
  'approvisionnement': [
    {
      id: 'appro-1',
      name: 'Taux de rupture de stock',
      target: 'Inférieur ou égal à 2%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Pourcentage de références en rupture'
    },
    {
      id: 'appro-2',
      name: 'Taux de rotation des stocks',
      target: 'Supérieur ou égal à 6',
      unit: 'fois/an',
      frequency: 'Trimestrielle',
      description: 'Nombre de fois où le stock est renouvelé dans l\'année'
    },
    {
      id: 'appro-3',
      name: 'Taux de périmés',
      target: 'Inférieur ou égal à 1%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Pourcentage de produits périmés sur le stock total'
    },
    {
      id: 'appro-4',
      name: 'Délai moyen de livraison fournisseurs',
      target: 'Inférieur ou égal à 24h',
      unit: 'heures',
      frequency: 'Mensuelle',
      description: 'Temps moyen entre commande et réception'
    },
    {
      id: 'appro-5',
      name: 'Taux de conformité des réceptions',
      target: 'Supérieur ou égal à 98%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Pourcentage de livraisons conformes aux commandes'
    }
  ],
  'dispensation': [
    {
      id: 'disp-1',
      name: 'Nombre d\'erreurs de dispensation',
      target: '0',
      unit: 'nombre',
      frequency: 'Mensuelle',
      description: 'Nombre d\'erreurs détectées ou signalées'
    },
    {
      id: 'disp-2',
      name: 'Taux d\'analyse pharmaceutique des ordonnances',
      target: '100%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Pourcentage d\'ordonnances analysées par le pharmacien'
    },
    {
      id: 'disp-3',
      name: 'Nombre d\'interventions pharmaceutiques',
      target: 'À suivre',
      unit: 'nombre',
      frequency: 'Mensuelle',
      description: 'Nombre d\'interventions du pharmacien sur les ordonnances'
    },
    {
      id: 'disp-4',
      name: 'Temps moyen d\'attente patient',
      target: 'Inférieur ou égal à 10 min',
      unit: 'minutes',
      frequency: 'Hebdomadaire',
      description: 'Temps d\'attente moyen avant dispensation'
    },
    {
      id: 'disp-5',
      name: 'Taux de satisfaction client',
      target: 'Supérieur ou égal à 90%',
      unit: '%',
      frequency: 'Trimestrielle',
      description: 'Pourcentage de clients satisfaits (enquête)'
    }
  ],
  'retours': [
    {
      id: 'ret-1',
      name: 'Nombre de réclamations clients',
      target: 'À minimiser',
      unit: 'nombre',
      frequency: 'Mensuelle',
      description: 'Nombre de réclamations reçues'
    },
    {
      id: 'ret-2',
      name: 'Délai moyen de traitement des réclamations',
      target: 'Inférieur ou égal à 7 jours',
      unit: 'jours',
      frequency: 'Mensuelle',
      description: 'Temps moyen de résolution des réclamations'
    },
    {
      id: 'ret-3',
      name: 'Taux de rappels de lots traités',
      target: '100%',
      unit: '%',
      frequency: 'Par événement',
      description: 'Pourcentage de rappels de lots gérés dans les délais'
    },
    {
      id: 'ret-4',
      name: 'Nombre de retours fournisseurs',
      target: 'À suivre',
      unit: 'nombre',
      frequency: 'Mensuelle',
      description: 'Nombre de produits retournés aux fournisseurs'
    }
  ],
  'dechets': [
    {
      id: 'dech-1',
      name: 'Volume de déchets pharmaceutiques collectés',
      target: 'À suivre',
      unit: 'kg',
      frequency: 'Mensuelle',
      description: 'Quantité de déchets pharmaceutiques éliminés'
    },
    {
      id: 'dech-2',
      name: 'Taux de conformité du tri des déchets',
      target: '100%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Conformité du tri selon la réglementation'
    },
    {
      id: 'dech-3',
      name: 'Fréquence de collecte Cyclamed',
      target: 'Supérieur ou égal à 1 par mois',
      unit: 'fois/mois',
      frequency: 'Mensuelle',
      description: 'Nombre de collectes Cyclamed effectuées'
    },
    {
      id: 'dech-4',
      name: 'Taux de traçabilité des destructions',
      target: '100%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Pourcentage de destructions tracées et documentées'
    }
  ],
  'rh': [
    {
      id: 'rh-1',
      name: 'Taux de réalisation du plan de formation',
      target: 'Supérieur ou égal à 80%',
      unit: '%',
      frequency: 'Annuelle',
      description: 'Pourcentage de formations prévues réalisées'
    },
    {
      id: 'rh-2',
      name: 'Nombre d\'heures de formation par collaborateur',
      target: 'Supérieur ou égal à 14h',
      unit: 'heures',
      frequency: 'Annuelle',
      description: 'Moyenne d\'heures de formation par personne'
    },
    {
      id: 'rh-3',
      name: 'Taux d\'absentéisme',
      target: 'Inférieur ou égal à 5%',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Pourcentage d\'absences sur temps de travail'
    },
    {
      id: 'rh-4',
      name: 'Taux de turn-over',
      target: 'Inférieur ou égal à 15%',
      unit: '%',
      frequency: 'Annuelle',
      description: 'Pourcentage de renouvellement du personnel'
    },
    {
      id: 'rh-5',
      name: 'Taux de satisfaction du personnel',
      target: 'Supérieur ou égal à 80%',
      unit: '%',
      frequency: 'Annuelle',
      description: 'Pourcentage de satisfaction (enquête interne)'
    }
  ],
  'infrastructures': [
    {
      id: 'infra-1',
      name: 'Taux de conformité de la chaîne du froid',
      target: '100%',
      unit: '%',
      frequency: 'Quotidienne',
      description: 'Pourcentage de relevés de température conformes'
    },
    {
      id: 'infra-2',
      name: 'Nombre d\'incidents de maintenance',
      target: 'À minimiser',
      unit: 'nombre',
      frequency: 'Mensuelle',
      description: 'Nombre de pannes ou dysfonctionnements'
    },
    {
      id: 'infra-3',
      name: 'Taux de réalisation des maintenances préventives',
      target: '100%',
      unit: '%',
      frequency: 'Annuelle',
      description: 'Pourcentage de maintenances planifiées réalisées'
    },
    {
      id: 'infra-4',
      name: 'Délai moyen de résolution des pannes',
      target: 'Inférieur ou égal à 48h',
      unit: 'heures',
      frequency: 'Mensuelle',
      description: 'Temps moyen pour réparer un équipement'
    }
  ],
  'finances': [
    {
      id: 'fin-1',
      name: 'Marge brute moyenne',
      target: 'Selon objectifs',
      unit: '%',
      frequency: 'Mensuelle',
      description: 'Marge commerciale moyenne sur les ventes'
    },
    {
      id: 'fin-2',
      name: 'Valeur du stock',
      target: 'À optimiser',
      unit: '€',
      frequency: 'Mensuelle',
      description: 'Valeur totale du stock en officine'
    },
    {
      id: 'fin-3',
      name: 'Taux de couverture des stocks',
      target: '30-45 jours',
      unit: 'jours',
      frequency: 'Mensuelle',
      description: 'Nombre de jours de vente couverts par le stock'
    },
    {
      id: 'fin-4',
      name: 'Démarque inconnue',
      target: 'Inférieur ou égal à 0.5%',
      unit: '%',
      frequency: 'Annuelle',
      description: 'Pourcentage de pertes non identifiées'
    }
  ],
  'sous-traitance': [
    {
      id: 'st-1',
      name: 'Nombre de prestataires qualifiés',
      target: 'À suivre',
      unit: 'nombre',
      frequency: 'Annuelle',
      description: 'Nombre de prestataires évalués et validés'
    },
    {
      id: 'st-2',
      name: 'Taux de conformité des prestations',
      target: 'Supérieur ou égal à 95%',
      unit: '%',
      frequency: 'Trimestrielle',
      description: 'Pourcentage de prestations conformes au cahier des charges'
    },
    {
      id: 'st-3',
      name: 'Délai moyen de réalisation des prestations',
      target: 'Selon contrat',
      unit: 'jours',
      frequency: 'Mensuelle',
      description: 'Respect des délais contractuels'
    },
    {
      id: 'st-4',
      name: 'Nombre d\'audits de prestataires réalisés',
      target: 'Supérieur ou égal à 1 par an par prestataire',
      unit: 'nombre',
      frequency: 'Annuelle',
      description: 'Nombre d\'évaluations de prestataires'
    }
  ]
};

export function getKPIsForProcess(processId: string): ProcessKPI[] {
  return processKPIs[processId] || [];
}
