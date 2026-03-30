export interface Term {
  id: string;
  word: string;
  definition: string;
  etymology?: string;
  example: string;
  synonyms: string[];
  category: string;
  isCustom?: boolean;
}

export type Category = 'General' | 'Civil' | 'Penal' | 'Mercantil' | 'Romano' | 'Laboral' | 'Constitucional';

export const CATEGORIES: Category[] = ['General', 'Civil', 'Penal', 'Mercantil', 'Romano', 'Laboral', 'Constitucional'];

export interface LegalResource {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'Constitution' | 'Code' | 'Procedural' | 'Special';
  importantArticles?: {
    number: string;
    summary: string;
  }[];
}

export interface HistoricalEra {
  id: string;
  name: string;
  period: string;
  description: string;
  keyContribution: string;
  detailedInfo?: string;
  legacy?: string[];
}

export interface Organization {
  name: string;
  fullName: string;
  description: string;
  importance: string;
}
