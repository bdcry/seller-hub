export type TAdCategory = 'auto' | 'real_estate' | 'electronics';

export type TAd = {
  category: TAdCategory;
  title: string;
  price: number;
  needsRevision: boolean;
};

export type TAds = {
  items: TAd[];
  total: number;
};
