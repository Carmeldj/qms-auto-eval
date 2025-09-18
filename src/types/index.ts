export interface Principle {
  id: string;
  title: string;
  description: string;
  pmq: number;
  pmqTitle: string;
}

export interface Question {
  principleId: string;
  text: string;
  options: Array<{
    value: number;
    label: string;
  }>;
}

export interface Answer {
  principleId: string;
  score: number;
  comment?: string;
}

export interface Assessment {
  id: string;
  date: string;
  answers: Answer[];
  scores: {
    principles: Record<string, number>;
    pmqs: Record<number, number>;
    overall: number;
  };
}

export interface ActionItem {
  id: string;
  principleId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  responsible: string;
  category: string;
}

export * from './inspection';

export interface PMQCategory {
  id: number;
  title: string;
  description: string;
  principleCount: number;
}