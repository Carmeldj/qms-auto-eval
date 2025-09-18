export interface PharmacyInfo {
  name: string;
  purchaseAuthNumber: string;
  openingQuitus: string;
  privateClienteleAuth: string;
  location: string;
  status: string;
  email: string;
}

export interface PharmacistInfo {
  firstName: string;
  lastName: string;
  orderNumber: string;
  email: string;
  phone: string;
}

export interface InspectionItem {
  id: string;
  category: string;
  subcategory?: string;
  description: string;
  requirement: string;
  isRequired: boolean;
}

export interface InspectionAnswer {
  itemId: string;
  status: 'compliant' | 'non-compliant' | 'not-applicable';
  comment?: string;
  gapType?: 'critical' | 'major' | 'minor';
}

export interface InspectionReport {
  id: string;
  date: string;
  pharmacyInfo: PharmacyInfo;
  pharmacistInfo: PharmacistInfo;
  answers: InspectionAnswer[];
  summary: {
    totalItems: number;
    compliant: number;
    nonCompliant: number;
    notApplicable: number;
    criticalGaps: number;
    majorGaps: number;
    minorGaps: number;
  };
}

export interface InspectionRecommendation {
  id: string;
  gapType: 'critical' | 'major' | 'minor';
  title: string;
  description: string;
  priority: 'immediate' | 'urgent' | 'planned';
  timeframe: string;
  responsible: string;
  category: string;
}