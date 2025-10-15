export interface DocumentTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedTime: string;
  fields: DocumentField[];
}

export interface DocumentField {
  id: string;
  label: string;
  type:
    | "text"
    | "date"
    | "datetime-local"
    | "textarea"
    | "select"
    | "number"
    | "email"
    | "tel";
  required: boolean;
  options?: string[];
  placeholder?: string;
  rows?: number;
}

export interface DocumentData {
  id: string;
  templateId: string;
  data: Record<string, string>;
  createdAt: string;
}

export interface OrganizationChart {
  pharmacyName: string;
  positions: Position[];
  relationships: Relationship[];
}

export interface Position {
  id: string;
  title: string;
  holder: string;
  level: number;
  responsibilities: string[];
}

export interface Relationship {
  from: string;
  to: string;
  type: "reports_to" | "collaborates_with";
}
