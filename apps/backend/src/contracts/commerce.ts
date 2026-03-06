export type CommercePaymentMethod = "COD" | "UPI" | "CARD";

export type CommerceOrderStatus =
  | "PLACED"
  | "PACKING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface CommerceCoordinates {
  lat: number;
  lng: number;
}

export interface CommerceProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  description: string;
  imageTag: string;
  price: number;
  mrp: number;
  rating: number;
  deliveryMinutes: number;
  stock: number;
  isFeatured: boolean;
}

export interface CommerceCategorySummary {
  id: string;
  label: string;
  productCount: number;
}

export interface CommerceCartItem {
  productId: string;
  productName: string;
  imageTag: string;
  unit: string;
  quantity: number;
  price: number;
  mrp: number;
  lineTotal: number;
  lineMrpTotal: number;
}

export interface CommercePricing {
  itemCount: number;
  itemTotal: number;
  itemMrpTotal: number;
  savings: number;
  deliveryFee: number;
  handlingFee: number;
  surgeFee: number;
  gst: number;
  tipAmount: number;
  totalPayable: number;
}

export interface CommerceCart {
  customerId: string;
  items: CommerceCartItem[];
  pricing: CommercePricing;
  updatedAt: string;
}

export interface CommerceOrderItem {
  productId: string;
  productName: string;
  imageTag: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type CommerceTimelineState = "DONE" | "CURRENT" | "UPCOMING";

export interface CommerceOrderTimelineEvent {
  status: CommerceOrderStatus;
  label: string;
  timestamp: string;
  state: CommerceTimelineState;
}

export interface CommerceOrder {
  id: string;
  customerId: string;
  addressLine: string;
  paymentMethod: CommercePaymentMethod;
  instructions?: string;
  status: CommerceOrderStatus;
  etaMinutes: number;
  itemCount: number;
  items: CommerceOrderItem[];
  pricing: CommercePricing;
  timeline: CommerceOrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
