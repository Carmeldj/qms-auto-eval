export interface MedicineEntry {
  id: string;
  date: string;
  supplier: string;
  deliveryNoteNumber: string;
  controlResponsible: string;
  recordingResponsible: string;
  destination: string;
  signature: string;
  createdAt: string;
}

export interface ComplaintDestruction {
  id: string;
  date: string;
  product: string;
  lot: string;
  reason: string;
  destroyedQuantity: string;
  supplier: string;
  signature: string;
  createdAt: string;
}

export interface NonConformity {
  id: string;
  date: string;
  description: string;
  cause: string;
  correctiveActions: string;
  responsible: string;
  createdAt: string;
}

export interface TemperatureRecord {
  id: string;
  date: string;
  equipment: string;
  minTemperature: string;
  maxTemperature: string;
  operator: string;
  createdAt: string;
}

export interface TrainingRecord {
  id: string;
  date: string;
  theme: string;
  participants: string;
  trainer: string;
  createdAt: string;
}

export interface PharmaceuticalIncident {
  id: string;
  incidentNumber: string;
  dateTime: string;
  location: string;
  detailedDescription: string;
  incidentType: string;
  involvedPersons: string;
  consequences: string;
  immediateActions: string;
  rootCauseAnalysis: string;
  actionPlan: string;
  createdAt: string;
}

export type TraceabilityRecord = 
  | MedicineEntry 
  | ComplaintDestruction 
  | NonConformity 
  | TemperatureRecord 
  | TrainingRecord 
  | PharmaceuticalIncident;

export interface TraceabilityTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  classification?: string;
  processCode?: string;
  fields: TraceabilityField[];
}

export interface TraceabilityField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'datetime-local' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}