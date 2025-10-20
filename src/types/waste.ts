export interface PharmaceuticalWasteEntry {
  id?: string;
  structureName: string;
  structureAddress: string;
  responsibleName: string;
  productName: string;
  internationalName: string;
  batchNumber: string;
  manufacturer: string;
  manufacturerCountry: string;
  productNature: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: string;
}

export interface PharmaceuticalWasteDocument {
  id?: string;
  structureName: string;
  structureAddress: string;
  responsibleName: string;
  entries: PharmaceuticalWasteEntry[];
  createdAt: string;
  updatedAt?: string;
}
