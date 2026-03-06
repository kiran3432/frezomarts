import { randomUUID } from "node:crypto";
import type {
  CommerceCart,
  CommerceCartItem,
  CommerceCategorySummary,
  CommerceCoordinates,
  CommerceOrder,
  CommerceOrderItem,
  CommerceOrderStatus,
  CommerceOrderTimelineEvent,
  CommercePaymentMethod,
  CommercePricing,
  CommerceProduct
} from "../../contracts/commerce.js";

type ProductSort = "popular" | "price_low" | "price_high" | "fast_delivery";

interface ProductFilters {
  q?: string;
  category?: string;
  sort?: ProductSort;
}

interface CreateOrderInput {
  customerId: string;
  addressLine: string;
  paymentMethod: CommercePaymentMethod;
  tipAmount?: number;
  instructions?: string;
  customerLocation?: CommerceCoordinates;
}

type CartMutationError = "PRODUCT_NOT_FOUND" | "INVALID_QUANTITY" | "INSUFFICIENT_STOCK";
type CancelOrderError = "ORDER_NOT_FOUND" | "ORDER_NOT_CANCELLABLE";

interface CartState {
  quantities: Map<string, number>;
  updatedAt: Date;
}

interface StoredOrder {
  id: string;
  customerId: string;
  addressLine: string;
  paymentMethod: CommercePaymentMethod;
  instructions?: string;
  customerLocation: CommerceCoordinates;
  status: CommerceOrderStatus;
  statusUpdatedAt: Date;
  etaMinutes: number;
  items: CommerceOrderItem[];
  itemMrpTotal: number;
  pricing: CommercePricing;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
}

interface PricingLine {
  quantity: number;
  price: number;
  mrp: number;
}

const DARK_STORE_LOCATION: CommerceCoordinates = { lat: 12.9751, lng: 77.6056 };
const DEFAULT_CUSTOMER_LOCATION: CommerceCoordinates = { lat: 12.9716, lng: 77.5946 };
const cartStore = new Map<string, CartState>();
const orderStore = new Map<string, StoredOrder>();

const catalog: CommerceProduct[] = [
  {
    id: "prd_banana_robusta",
    name: "Banana Robusta",
    brand: "Farm Fresh",
    category: "Fruits & Vegetables",
    unit: "500 g",
    description: "Naturally ripened bananas sourced from local farms.",
    imageTag: "BAN",
    price: 34,
    mrp: 45,
    rating: 4.6,
    deliveryMinutes: 8,
    stock: 80,
    isFeatured: true
  },
  {
    id: "prd_tomato_hybrid",
    name: "Tomato Hybrid",
    brand: "Green Basket",
    category: "Fruits & Vegetables",
    unit: "1 kg",
    description: "Firm and juicy tomatoes for daily cooking.",
    imageTag: "TOM",
    price: 42,
    mrp: 56,
    rating: 4.4,
    deliveryMinutes: 9,
    stock: 65,
    isFeatured: false
  },
  {
    id: "prd_milk_toned",
    name: "Toned Milk",
    brand: "Daily Day",
    category: "Dairy & Breakfast",
    unit: "1 L",
    description: "Pasteurized toned milk ideal for tea and cereal.",
    imageTag: "MLK",
    price: 62,
    mrp: 68,
    rating: 4.7,
    deliveryMinutes: 7,
    stock: 120,
    isFeatured: true
  },
  {
    id: "prd_eggs_classic",
    name: "Classic Eggs",
    brand: "Happy Hen",
    category: "Dairy & Breakfast",
    unit: "6 pcs",
    description: "Protein-rich eggs, cleaned and packed hygienically.",
    imageTag: "EGG",
    price: 54,
    mrp: 62,
    rating: 4.5,
    deliveryMinutes: 8,
    stock: 90,
    isFeatured: false
  },
  {
    id: "prd_bread_brown",
    name: "Brown Bread",
    brand: "Bake House",
    category: "Dairy & Breakfast",
    unit: "400 g",
    description: "Soft whole wheat bread baked fresh every day.",
    imageTag: "BRD",
    price: 48,
    mrp: 55,
    rating: 4.3,
    deliveryMinutes: 9,
    stock: 50,
    isFeatured: false
  },
  {
    id: "prd_chips_salted",
    name: "Salted Potato Chips",
    brand: "Crunchy Co",
    category: "Snacks & Munchies",
    unit: "120 g",
    description: "Classic salted potato chips with a crisp bite.",
    imageTag: "CHP",
    price: 59,
    mrp: 75,
    rating: 4.2,
    deliveryMinutes: 10,
    stock: 140,
    isFeatured: true
  },
  {
    id: "prd_nachos_peri",
    name: "Peri Peri Nachos",
    brand: "Snackaroo",
    category: "Snacks & Munchies",
    unit: "150 g",
    description: "Spicy corn nachos with peri-peri seasoning.",
    imageTag: "NCH",
    price: 89,
    mrp: 110,
    rating: 4.4,
    deliveryMinutes: 10,
    stock: 60,
    isFeatured: false
  },
  {
    id: "prd_coke_can",
    name: "Sparkling Cola",
    brand: "FizzUp",
    category: "Cold Drinks & Juices",
    unit: "330 ml",
    description: "Chilled sparkling cola can.",
    imageTag: "COL",
    price: 40,
    mrp: 45,
    rating: 4.1,
    deliveryMinutes: 8,
    stock: 200,
    isFeatured: true
  },
  {
    id: "prd_orange_juice",
    name: "Orange Juice",
    brand: "Juicy Lane",
    category: "Cold Drinks & Juices",
    unit: "1 L",
    description: "Fruit drink with refreshing orange flavor.",
    imageTag: "JCE",
    price: 110,
    mrp: 130,
    rating: 4.3,
    deliveryMinutes: 9,
    stock: 55,
    isFeatured: false
  },
  {
    id: "prd_rice_sona",
    name: "Sona Masoori Rice",
    brand: "Grain Story",
    category: "Staples",
    unit: "5 kg",
    description: "Premium quality rice for everyday meals.",
    imageTag: "RCE",
    price: 339,
    mrp: 410,
    rating: 4.7,
    deliveryMinutes: 12,
    stock: 38,
    isFeatured: true
  },
  {
    id: "prd_toor_dal",
    name: "Toor Dal",
    brand: "Grain Story",
    category: "Staples",
    unit: "1 kg",
    description: "Unpolished protein-rich toor dal.",
    imageTag: "DAL",
    price: 162,
    mrp: 190,
    rating: 4.6,
    deliveryMinutes: 11,
    stock: 42,
    isFeatured: false
  },
  {
    id: "prd_detergent_liquid",
    name: "Liquid Detergent",
    brand: "Spark Clean",
    category: "Home Care",
    unit: "1 L",
    description: "Gentle on clothes, tough on stains.",
    imageTag: "DET",
    price: 199,
    mrp: 240,
    rating: 4.5,
    deliveryMinutes: 12,
    stock: 35,
    isFeatured: false
  },
  {
    id: "prd_floor_cleaner",
    name: "Floor Cleaner",
    brand: "Fresh Home",
    category: "Home Care",
    unit: "2 L",
    description: "Citrus fragrance floor cleaner for all surfaces.",
    imageTag: "CLN",
    price: 179,
    mrp: 220,
    rating: 4.4,
    deliveryMinutes: 12,
    stock: 44,
    isFeatured: false
  },
  {
    id: "prd_shampoo_smooth",
    name: "Smooth Shampoo",
    brand: "GlowWell",
    category: "Personal Care",
    unit: "340 ml",
    description: "Nourishing shampoo with argan oil.",
    imageTag: "SHP",
    price: 229,
    mrp: 280,
    rating: 4.4,
    deliveryMinutes: 11,
    stock: 48,
    isFeatured: false
  },
  {
    id: "prd_toothpaste_mint",
    name: "Mint Toothpaste",
    brand: "Smile Pro",
    category: "Personal Care",
    unit: "200 g",
    description: "Strong cavity protection and fresh breath.",
    imageTag: "DEN",
    price: 95,
    mrp: 115,
    rating: 4.2,
    deliveryMinutes: 10,
    stock: 72,
    isFeatured: false
  },
  {
    id: "prd_icecream_vanilla",
    name: "Vanilla Ice Cream",
    brand: "Snow Cup",
    category: "Ice Creams",
    unit: "700 ml",
    description: "Creamy vanilla ice cream tub.",
    imageTag: "ICE",
    price: 185,
    mrp: 210,
    rating: 4.5,
    deliveryMinutes: 9,
    stock: 32,
    isFeatured: true
  },
  {
    id: "prd_chocolate_bar",
    name: "Almond Chocolate Bar",
    brand: "Cocoa Street",
    category: "Sweet Cravings",
    unit: "100 g",
    description: "Milk chocolate bar with roasted almonds.",
    imageTag: "CHO",
    price: 78,
    mrp: 95,
    rating: 4.6,
    deliveryMinutes: 8,
    stock: 99,
    isFeatured: true
  },
  {
    id: "prd_instant_noodles",
    name: "Instant Noodles",
    brand: "Masala Magic",
    category: "Instant Food",
    unit: "4 x 70 g",
    description: "Masala noodles ready in 2 minutes.",
    imageTag: "NOD",
    price: 68,
    mrp: 84,
    rating: 4.3,
    deliveryMinutes: 9,
    stock: 110,
    isFeatured: false
  }
];

const productById = new Map(catalog.map((product) => [product.id, product]));

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}

function getOrCreateCart(customerId: string) {
  const existing = cartStore.get(customerId);
  if (existing) {
    return existing;
  }
  const created: CartState = { quantities: new Map(), updatedAt: new Date() };
  cartStore.set(customerId, created);
  return created;
}

function normalizeText(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function haversineKm(a: CommerceCoordinates, b: CommerceCoordinates) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const radiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return radiusKm * y;
}

function estimateEtaMinutes(customerLocation: CommerceCoordinates, itemCount: number) {
  const distanceKm = haversineKm(DARK_STORE_LOCATION, customerLocation);
  const congestionFactor = new Date().getHours() >= 18 && new Date().getHours() <= 22 ? 1.2 : 1;
  const eta = 7 + distanceKm * 3.4 * congestionFactor + itemCount * 0.45;
  return Math.max(8, Math.min(24, Math.round(eta)));
}

function computePricing(lines: PricingLine[], tipAmount = 0): CommercePricing {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const itemTotal = roundMoney(lines.reduce((sum, line) => sum + line.price * line.quantity, 0));
  const itemMrpTotal = roundMoney(lines.reduce((sum, line) => sum + line.mrp * line.quantity, 0));
  const savings = roundMoney(Math.max(0, itemMrpTotal - itemTotal));
  const deliveryFee = itemTotal >= 299 ? 0 : 25;
  const handlingFee = itemCount === 0 ? 0 : roundMoney(6 + Math.min(12, itemCount * 1.2));
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 22);
  const surgeFee = itemTotal === 0 ? 0 : isPeakHour ? 12 : 0;
  const gst = itemTotal === 0 ? 0 : roundMoney(itemTotal * 0.05);
  const safeTip = roundMoney(Math.max(0, tipAmount));
  const totalPayable = roundMoney(itemTotal + deliveryFee + handlingFee + surgeFee + gst + safeTip);

  return {
    itemCount,
    itemTotal,
    itemMrpTotal,
    savings,
    deliveryFee,
    handlingFee,
    surgeFee,
    gst,
    tipAmount: safeTip,
    totalPayable
  };
}

function mapCartItems(quantities: Map<string, number>): CommerceCartItem[] {
  const items: CommerceCartItem[] = [];
  for (const [productId, quantity] of quantities.entries()) {
    const product = productById.get(productId);
    if (!product || quantity <= 0) {
      continue;
    }
    items.push({
      productId: product.id,
      productName: product.name,
      imageTag: product.imageTag,
      unit: product.unit,
      quantity,
      price: product.price,
      mrp: product.mrp,
      lineTotal: roundMoney(product.price * quantity),
      lineMrpTotal: roundMoney(product.mrp * quantity)
    });
  }
  items.sort((left, right) => left.productName.localeCompare(right.productName));
  return items;
}

function getMilestoneTimes(order: StoredOrder) {
  const placedAt = order.createdAt;
  const packingAt = new Date(placedAt.getTime() + 2 * 60 * 1000);
  const outForDeliveryAt = new Date(
    placedAt.getTime() + Math.max(6, Math.round(order.etaMinutes * 0.45)) * 60 * 1000
  );
  const deliveredAt = new Date(placedAt.getTime() + order.etaMinutes * 60 * 1000);
  return { placedAt, packingAt, outForDeliveryAt, deliveredAt };
}

function getDerivedOrderStatus(order: StoredOrder) {
  if (order.status === "CANCELLED" || order.status === "DELIVERED") {
    return order.status;
  }
  const now = new Date();
  const elapsedMinutes = (now.getTime() - order.createdAt.getTime()) / (60 * 1000);
  if (elapsedMinutes >= order.etaMinutes) {
    return "DELIVERED" as CommerceOrderStatus;
  }
  if (elapsedMinutes >= Math.max(6, Math.round(order.etaMinutes * 0.45))) {
    return "OUT_FOR_DELIVERY" as CommerceOrderStatus;
  }
  if (elapsedMinutes >= 2) {
    return "PACKING" as CommerceOrderStatus;
  }
  return "PLACED";
}

function labelForStatus(status: CommerceOrderStatus) {
  switch (status) {
    case "PLACED":
      return "Order placed";
    case "PACKING":
      return "Items being packed";
    case "OUT_FOR_DELIVERY":
      return "Rider is nearby";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Order cancelled";
    default:
      return status;
  }
}

function buildTimeline(order: StoredOrder): CommerceOrderTimelineEvent[] {
  const milestones = getMilestoneTimes(order);
  const flow: Array<{ status: CommerceOrderStatus; at: Date }> = [
    { status: "PLACED", at: milestones.placedAt },
    { status: "PACKING", at: milestones.packingAt },
    { status: "OUT_FOR_DELIVERY", at: milestones.outForDeliveryAt },
    { status: "DELIVERED", at: milestones.deliveredAt }
  ];
  const statusOrder: CommerceOrderStatus[] = ["PLACED", "PACKING", "OUT_FOR_DELIVERY", "DELIVERED"];

  if (order.status === "CANCELLED") {
    const cancelledAt = order.cancelledAt ?? order.updatedAt;
    const timeline: CommerceOrderTimelineEvent[] = flow.map((event) => ({
      status: event.status,
      label: labelForStatus(event.status),
      timestamp: event.at.toISOString(),
      state: event.at.getTime() <= cancelledAt.getTime() ? "DONE" : "UPCOMING"
    }));
    timeline.push({
      status: "CANCELLED",
      label: labelForStatus("CANCELLED"),
      timestamp: cancelledAt.toISOString(),
      state: "CURRENT"
    });
    return timeline;
  }

  const currentIndex = statusOrder.indexOf(order.status);
  return flow.map((event, index) => ({
    status: event.status,
    label: labelForStatus(event.status),
    timestamp: event.at.toISOString(),
    state: index < currentIndex ? "DONE" : index === currentIndex ? "CURRENT" : "UPCOMING"
  }));
}

function buildOrderResponse(order: StoredOrder): CommerceOrder {
  const derivedStatus = getDerivedOrderStatus(order);
  if (derivedStatus !== order.status) {
    order.status = derivedStatus;
    order.statusUpdatedAt = new Date();
    order.updatedAt = new Date();
  }

  return {
    id: order.id,
    customerId: order.customerId,
    addressLine: order.addressLine,
    paymentMethod: order.paymentMethod,
    instructions: order.instructions,
    status: order.status,
    etaMinutes: order.etaMinutes,
    itemCount: order.pricing.itemCount,
    items: order.items,
    pricing: order.pricing,
    timeline: buildTimeline(order),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString()
  };
}

export const commerceService = {
  listCategories(): CommerceCategorySummary[] {
    const counts = new Map<string, number>();
    for (const product of catalog) {
      const current = counts.get(product.category) ?? 0;
      counts.set(product.category, current + 1);
    }
    return Array.from(counts.entries())
      .sort((left, right) => left[0].localeCompare(right[0]))
      .map(([label, productCount]) => ({
        id: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        label,
        productCount
      }));
  },

  listProducts(filters: ProductFilters): CommerceProduct[] {
    const q = normalizeText(filters.q);
    const category = normalizeText(filters.category);
    const sortMode = filters.sort ?? "popular";

    const filtered = catalog.filter((product) => {
      if (category && normalizeText(product.category) !== category) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
      return haystack.includes(q);
    });

    const sorted = [...filtered];
    if (sortMode === "price_low") {
      sorted.sort((left, right) => left.price - right.price);
    } else if (sortMode === "price_high") {
      sorted.sort((left, right) => right.price - left.price);
    } else if (sortMode === "fast_delivery") {
      sorted.sort((left, right) => left.deliveryMinutes - right.deliveryMinutes);
    } else {
      sorted.sort((left, right) => {
        if (left.isFeatured !== right.isFeatured) {
          return left.isFeatured ? -1 : 1;
        }
        if (left.rating !== right.rating) {
          return right.rating - left.rating;
        }
        return left.price - right.price;
      });
    }
    return sorted;
  },

  getProduct(productId: string) {
    return productById.get(productId) ?? null;
  },

  getCart(customerId: string): CommerceCart {
    const state = getOrCreateCart(customerId);
    const items = mapCartItems(state.quantities);
    const pricing = computePricing(
      items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        mrp: item.mrp
      }))
    );
    return {
      customerId,
      items,
      pricing,
      updatedAt: state.updatedAt.toISOString()
    };
  },

  setCartItem(customerId: string, productId: string, quantity: number): { cart: CommerceCart | null; error?: CartMutationError } {
    if (!Number.isFinite(quantity) || quantity < 0 || quantity > 20) {
      return { cart: null, error: "INVALID_QUANTITY" };
    }
    const product = productById.get(productId);
    if (!product) {
      return { cart: null, error: "PRODUCT_NOT_FOUND" };
    }
    if (quantity > product.stock) {
      return { cart: null, error: "INSUFFICIENT_STOCK" };
    }

    const cart = getOrCreateCart(customerId);
    if (quantity === 0) {
      cart.quantities.delete(productId);
    } else {
      cart.quantities.set(productId, quantity);
    }
    cart.updatedAt = new Date();
    return { cart: this.getCart(customerId) };
  },

  removeCartItem(customerId: string, productId: string): CommerceCart {
    const cart = getOrCreateCart(customerId);
    cart.quantities.delete(productId);
    cart.updatedAt = new Date();
    return this.getCart(customerId);
  },

  createOrder(input: CreateOrderInput): { order: CommerceOrder | null; error?: "CART_EMPTY" } {
    const cart = this.getCart(input.customerId);
    if (!cart.items.length) {
      return { order: null, error: "CART_EMPTY" };
    }

    const safeTip = Math.max(0, roundMoney(input.tipAmount ?? 0));
    const pricing = computePricing(
      cart.items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        mrp: item.mrp
      })),
      safeTip
    );
    const customerLocation = input.customerLocation ?? DEFAULT_CUSTOMER_LOCATION;
    const etaMinutes = estimateEtaMinutes(customerLocation, pricing.itemCount);

    const order: StoredOrder = {
      id: `ord_${randomUUID().replace(/-/g, "").slice(0, 12)}`,
      customerId: input.customerId,
      addressLine: input.addressLine,
      paymentMethod: input.paymentMethod,
      instructions: input.instructions,
      customerLocation,
      status: "PLACED",
      statusUpdatedAt: new Date(),
      etaMinutes,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        imageTag: item.imageTag,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.lineTotal
      })),
      itemMrpTotal: cart.pricing.itemMrpTotal,
      pricing,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orderStore.set(order.id, order);
    const liveCart = getOrCreateCart(input.customerId);
    liveCart.quantities.clear();
    liveCart.updatedAt = new Date();
    return { order: buildOrderResponse(order) };
  },

  getOrder(orderId: string) {
    const stored = orderStore.get(orderId);
    if (!stored) {
      return null;
    }
    return buildOrderResponse(stored);
  },

  listOrders(customerId: string) {
    return Array.from(orderStore.values())
      .filter((order) => order.customerId === customerId)
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .map(buildOrderResponse);
  },

  cancelOrder(orderId: string): { order: CommerceOrder | null; error?: CancelOrderError } {
    const stored = orderStore.get(orderId);
    if (!stored) {
      return { order: null, error: "ORDER_NOT_FOUND" };
    }

    const liveStatus = getDerivedOrderStatus(stored);
    if (liveStatus === "OUT_FOR_DELIVERY" || liveStatus === "DELIVERED" || liveStatus === "CANCELLED") {
      return { order: null, error: "ORDER_NOT_CANCELLABLE" };
    }
    stored.status = "CANCELLED";
    stored.cancelledAt = new Date();
    stored.updatedAt = new Date();
    return { order: buildOrderResponse(stored) };
  },

  resetState() {
    cartStore.clear();
    orderStore.clear();
  }
};
