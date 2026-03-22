export type TAdCategory = 'auto' | 'real_estate' | 'electronics';

export type TAd = {
  id: number;
  category: TAdCategory;
  title: string;
  price: number;
  needsRevision: boolean;
};

export type TAds = {
  items: TAd[];
  total: number;
};

export type TSortValue = 'createdAt-desc' | 'createdAt-asc' | 'title-asc' | 'title-desc';

type TSortColumn = 'createdAt' | 'title';
type TSortDirection = 'asc' | 'desc';

export type TSortParams = {
  sortColumn: TSortColumn;
  sortDirection: TSortDirection;
};

export type TGetAdsParams = {
  q?: string;
  sortColumn?: TSortColumn;
  sortDirection?: TSortDirection;
  needsRevision?: boolean;
  categories?: string;
  limit?: number;
  skip?: number;
};
