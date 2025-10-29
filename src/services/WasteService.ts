import { PharmaceuticalWasteDocument } from '../types/waste';

const STORAGE_KEY = 'pharmaceutical_waste_documents';

export const WasteService = {
  getAllDocuments: (): PharmaceuticalWasteDocument[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveDocument: (document: PharmaceuticalWasteDocument): void => {
    const documents = WasteService.getAllDocuments();
    const newDocument = {
      ...document,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    documents.push(newDocument);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  },

  deleteDocument: (id: string): void => {
    const documents = WasteService.getAllDocuments();
    const filtered = documents.filter(doc => doc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getDocumentById: (id: string): PharmaceuticalWasteDocument | undefined => {
    const documents = WasteService.getAllDocuments();
    return documents.find(doc => doc.id === id);
  }
};
