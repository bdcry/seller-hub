export type TAdCategory = 'auto' | 'real_estate' | 'electronics';

export type TAd = {
  id: number;
  category: TAdCategory;
  title: string;
  price: number | null;
  needsRevision: boolean;
};

export type TAds = {
  items: TAd[];
  total: number;
};

type TAutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

type TRealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

type TElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

type TAdDetailsParams = TAutoItemParams | TRealEstateItemParams | TElectronicsItemParams;

export type TAdDetails = TAd & {
  description?: string;
  createdAt: string;
  updatedAt: string;
  params: TAdDetailsParams;
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
