export interface ProcedureTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  isRequired: boolean;
  estimatedTime: string;
  classificationCode?: string;
}

export interface ProcedureInfo {
  title: string;
  pharmacyName: string;
  author: string;
  reviewer: string;
  creationDate: string;
  validityDuration: string;
  version: string;
  objective: string;
  scope: string;
}

export interface ProcedureStep {
  id: string;
  order: number;
  description: string;
  responsible: string;
  concernedPersons: string[];
  documents: string[];
  duration?: string;
}

export interface ProcedureIndicator {
  id: string;
  name: string;
  description: string;
  target: string;
  frequency: string;
}

export interface ProcedureAnnex {
  id: string;
  title: string;
  type: 'document' | 'form' | 'regulation';
  description: string;
  reference?: string;
}

export interface Procedure {
  id: string;
  templateId: string;
  info: ProcedureInfo;
  steps: ProcedureStep[];
  indicators: ProcedureIndicator[];
  annexes: ProcedureAnnex[];
  createdAt: string;
  updatedAt: string;
}