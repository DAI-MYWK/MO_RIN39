export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  category: string;
  source: string;
  isRecommended?: boolean;
}

export type UIPattern = 'category-focused' | 'photo-focused' | 'recommended-focused' | 'grid-layout';

