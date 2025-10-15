export interface OrdonnancierEntry {
  id: string;
  numeroOrdre: number;
  dateDelivrance: string;
  prescripteur: {
    nomPrenoms: string;
    numeroOrdre: string;
  };
  patient: {
    nomPrenoms: string;
    adresse: string;
  };
  produit: {
    nature: string;
    dose: string;
    quantite: number;
  };
  prixVente: number;
  pharmacien: {
    nom: string;
    signature: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrdonnancierFilter {
  dateDebut?: string;
  dateFin?: string;
  trimestre?: number;
  annee?: number;
}

export interface TrimestrialReport {
  id: string;
  trimestre: number;
  annee: number;
  dateDebut: string;
  dateFin: string;
  entries: OrdonnancierEntry[];
  totalEntries: number;
  pharmacie: string;
  dateGeneration: string;
  envoye: boolean;
  dateEnvoi?: string;
}

export const PRODUITS_SOUS_CONTROLE = [
  'Morphine',
  'Codéine',
  'Méthadone',
  'Fentanyl',
  'Tramadol',
  'Benzodiazépines',
  'Barbituriques',
  'Amphétamines',
  'Autres stupéfiants'
];

export const TRIMESTRES = [
  { numero: 1, label: '1er Trimestre', mois: [1, 2, 3] },
  { numero: 2, label: '2ème Trimestre', mois: [4, 5, 6] },
  { numero: 3, label: '3ème Trimestre', mois: [7, 8, 9] },
  { numero: 4, label: '4ème Trimestre', mois: [10, 11, 12] }
];
