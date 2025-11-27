export interface RegisterItem {
  id: string;
  title: string;
  description?: string;
  code?: string;
  location?: string;
  obligation?: string;
  reference?: string;
  retention?: string;
  enabled: boolean;
}

export interface RegisterCategory {
  id: string;
  category: string;
  description?: string;
  color: [number, number, number];
  items: RegisterItem[];
  enabled: boolean;
}

export type RegisterListType = 'management' | 'dispensation' | 'information';

export interface RegisterListData {
  categories: RegisterCategory[];
}

export interface RegisterList {
  id: string;
  user_email: string;
  list_type: RegisterListType;
  list_data: RegisterListData;
  created_at: string;
  updated_at: string;
}
