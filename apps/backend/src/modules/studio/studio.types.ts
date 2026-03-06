export type StudioProductStatus = "ACTIVE" | "INACTIVE";
export type StudioImageFit = "cover" | "contain";
export type StudioSectionLayout = "HORIZONTAL" | "VERTICAL";

export interface StudioAppMeta {
  name: string;
  subtitle: string;
  tagline: string;
}

export interface StudioTopFilter {
  id: string;
  label: string;
  icon: string;
}

export interface StudioProduct {
  id: string;
  name: string;
  category: string;
  qty: string;
  price: number;
  mrp: number;
  stock: number;
  rating: string;
  tags: string[];
  imageUrl: string;
  imageFit: StudioImageFit;
  imageScale: number;
  color: string;
  status: StudioProductStatus;
}

export interface StudioQuickCategory {
  id: string;
  name: string;
  category: string;
  color: string;
}

export interface StudioBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  code: string;
  bgColor: string;
  textColor: string;
}

export type StudioHomeSectionType = "PRODUCT_GRID" | "BANNER";

export interface StudioHomeSection {
  id: string;
  type: StudioHomeSectionType;
  layout: StudioSectionLayout;
  title: string;
  category: string;
  bannerId: string;
  limit: number;
}

export interface StudioReorder {
  id: string;
  label: string;
  date: string;
  productIds: string[];
}

export interface StudioInvoice {
  id: string;
  amount: number;
  date: string;
}

export interface StudioOrder {
  id: string;
  user: string;
  city: string;
  amount: number;
  payment: string;
  status: string;
  createdAt: string;
}

export interface StudioCoupon {
  id: string;
  code: string;
  type: "FLAT" | "PERCENT";
  value: number;
  minCart: number;
  active: boolean;
}

export interface StudioUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: "ACTIVE" | "BLOCKED";
}

export interface StudioLog {
  id: string;
  text: string;
}

export interface StudioConfig {
  version: number;
  updatedAt: string;
  app: StudioAppMeta;
  etaBaseMinutes: number;
  categories: string[];
  topFilters: StudioTopFilter[];
  products: StudioProduct[];
  quickCategories: StudioQuickCategory[];
  banners: StudioBanner[];
  homeSections: StudioHomeSection[];
  recentlyViewedProductIds: string[];
  reorder: StudioReorder[];
  invoices: StudioInvoice[];
  orders: StudioOrder[];
  coupons: StudioCoupon[];
  users: StudioUser[];
  logs: StudioLog[];
}
