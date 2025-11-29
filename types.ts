export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon?: string; // Emoji or SVG string
  category: string;
  visits: number;
}

export interface Category {
  id: string;
  name: string;
}

export type Theme = 'dark' | 'light' | 'midnight';

export interface GeminiResponse {
  links: Omit<LinkItem, 'id' | 'visits'>[];
}
