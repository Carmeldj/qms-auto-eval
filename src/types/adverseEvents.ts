export interface NotifierInfo {
  department: string;
  zs: string;
  commune: string;
  fs: string;
  fullName: string;
  qualification: 'medecin' | 'pharmacien' | 'dentiste' | 'sage-femme' | 'infirmier' | 'autre';
  qualificationOther?: string;
  specialty?: string;
  telephone: string;
  email: string;
  notificationDate: string;
}

export interface PatientInfo {
  lastName: string;
  firstName: string;
  sex: 'M' | 'F';
  ageYears?: number;
  ageMonths?: number;
  ageDays?: number;
  weight?: number;
  height?: number;
  address: string;
  houseNumber?: string;
  telephone?: string;
  neighborhood?: string;
  district?: string;

  isNewborn: boolean;
  productTakenBy?: 'patient' | 'breastfeeding' | 'motherDuringPregnancy';
  trimester?: number;
}

export interface MedicalHistory {
  pregnancy: boolean;
  alcoholism: boolean;
  hepatopathy: boolean;
  allergy: boolean;
  nephropathy: boolean;
  smoking: boolean;
  traditionalRemedy: boolean;
  chronicTreatment: boolean;
  previousReactionSameProduct: boolean;
  previousReactionOtherProduct: boolean;
  other?: string;
}

export interface AdverseEvent {
  fever: boolean;
  urticaria: boolean;
  localReactionSevere3Days: boolean;
  localReactionSevereLess3Days: boolean;
  localReactionBeyondJoint: boolean;
  febrileConvulsion: boolean;
  nonFebrileConvulsion: boolean;
  abscess: boolean;
  sepsis: boolean;
  encephalopathy: boolean;
  toxicShockSyndrome: boolean;
  thrombocytopenia: boolean;
  anaphylacticShock: boolean;
  lyellSyndrome: boolean;
  otherDescription?: string;

  administrationDate: string;
  eventDate: string;
  delayMinutes?: number;
  delayHours?: number;
  delayDays?: number;
  delayMonths?: number;
}

export interface SuspectProduct {
  id: string;
  productName: string;
  manufacturer: string;
  purchaseLocation: string;
  lotNumber: string;
  expirationDate: string;
  pcvStage?: string;
  administrationRoute: string;
  dosage: string;
  indication: string;
  treatmentDuration: string;
  totalQuantity: string;
  startDate: string;
  endDate: string;
}

export interface ProductContext {
  selfMedication: boolean;
  pharmacodependence: boolean;
  therapeuticError: boolean;
  medicalPrescription: boolean;

  acquisitionPlace: 'pharmacie' | 'formation_sanitaire' | 'rue' | 'autre';
  vaccinationPlace?: string;
  injectionSite?: string;
  plantPart?: 'racine' | 'ecorce' | 'feuille' | 'fleur';
}

export interface SeverityEvolution {
  hospitalization: boolean;
  prolongedHospitalization: boolean;
  permanentDisability: boolean;
  lifeThreatening: boolean;
  congenitalMalformation: boolean;
  death: boolean;

  recoveryWithoutSequelae: boolean;
  recoveryWithSequelae: boolean;
  notYetRecovered: boolean;
  complications: boolean;
  deceased: boolean;
  unknown: boolean;

  medicationStopped: boolean;
  effectDisappeared: boolean;
  effectDiminished: boolean;
  effectPersisted: boolean;

  dosageReduced: boolean;
  dosageEffectDisappeared: boolean;
  dosageEffectDiminished: boolean;
  dosageEffectPersisted: boolean;

  medicationReadministered: boolean;
  effectReappeared: boolean;
}

export interface AdverseEventReport {
  id: string;
  epidNumber: string;
  notifier: NotifierInfo;
  patient: PatientInfo;
  medicalHistory: MedicalHistory;
  adverseEvent: AdverseEvent;
  suspectProducts: SuspectProduct[];
  productContext: ProductContext;
  severityEvolution: SeverityEvolution;
  createdAt: string;
  updatedAt: string;
}
