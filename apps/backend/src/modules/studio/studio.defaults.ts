import type {
  StudioBanner,
  StudioConfig,
  StudioHomeSection,
  StudioProduct,
  StudioTopFilter
} from "./studio.types.js";

const CATEGORIES = [
  "Fruits & Vegetables (fresh produce)",
  "Dairy & Eggs",
  "Bakery & Breads",
  "Staples & Grains",
  "Rice & Pulses",
  "Cooking Oil & Spices",
  "Snacks & Namkeen",
  "Beverages (Tea, Coffee, Juices, Soft Drinks)",
  "Packaged Foods & Instant Meals",
  "Frozen Foods & Ice-creams",
  "Household Essentials (cleaning supplies, detergents)",
  "Personal Care & Hygiene (soaps, shampoos, toothpaste)",
  "Beauty & Grooming",
  "Baby Care Products",
  "Medicines & Health Supplies (OTC meds, first-aid, vitamins)",
  "Supplements & Nutrition",
  "Pet Supplies (food, grooming)",
  "Stationery & Office Supplies",
  "Flowers & Gifts",
  "Electronics & Accessories (chargers, headphones, small gadgets)",
  "Ready-to-Eat / Food & Beverages"
];

const TOP_FILTERS: StudioTopFilter[] = [
  { id: "all", label: "All", icon: "A" },
  { id: "maxxsaver", label: "MaxxSaver", icon: "M" },
  { id: "ramzan", label: "Ramzan", icon: "R" },
  { id: "fresh", label: "Fresh", icon: "F" },
  { id: "summer", label: "Summer", icon: "S" }
];

const PRODUCTS: StudioProduct[] = [
  {
    id: "p_milk_1",
    name: "Amul Taaza Milk",
    category: "Dairy & Eggs",
    qty: "1 L",
    price: 72,
    mrp: 78,
    stock: 85,
    rating: "4.6",
    tags: ["all", "fresh"],
    imageUrl: "https://picsum.photos/seed/frezo-milk/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#e9eef8",
    status: "ACTIVE"
  },
  {
    id: "p_banana_1",
    name: "Farm Fresh Banana",
    category: "Fruits & Vegetables (fresh produce)",
    qty: "1 dozen",
    price: 59,
    mrp: 66,
    stock: 42,
    rating: "4.5",
    tags: ["all", "maxxsaver"],
    imageUrl: "https://picsum.photos/seed/frezo-banana/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#f8ecdf",
    status: "ACTIVE"
  },
  {
    id: "p_rice_1",
    name: "Basmati Rice",
    category: "Rice & Pulses",
    qty: "5 kg",
    price: 429,
    mrp: 470,
    stock: 14,
    rating: "4.7",
    tags: ["all", "maxxsaver"],
    imageUrl: "https://picsum.photos/seed/frezo-rice/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#e6f2e2",
    status: "ACTIVE"
  },
  {
    id: "p_corn_1",
    name: "Frozen Corn",
    category: "Frozen Foods & Ice-creams",
    qty: "500 g",
    price: 76,
    mrp: 86,
    stock: 9,
    rating: "4.3",
    tags: ["all", "fresh"],
    imageUrl: "https://picsum.photos/seed/frezo-corn/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#ece3f8",
    status: "ACTIVE"
  },
  {
    id: "p_biscuit_1",
    name: "Digestive Biscuits",
    category: "Snacks & Namkeen",
    qty: "960 g",
    price: 129,
    mrp: 198,
    stock: 40,
    rating: "4.5",
    tags: ["all", "ramzan"],
    imageUrl: "https://picsum.photos/seed/frezo-biscuit/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#f8e8e8",
    status: "ACTIVE"
  },
  {
    id: "p_juice_1",
    name: "Orange Juice",
    category: "Beverages (Tea, Coffee, Juices, Soft Drinks)",
    qty: "1 L",
    price: 110,
    mrp: 130,
    stock: 55,
    rating: "4.4",
    tags: ["all", "summer"],
    imageUrl: "https://picsum.photos/seed/frezo-juice/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#e9eef8",
    status: "ACTIVE"
  },
  {
    id: "p_oil_1",
    name: "Sunflower Oil",
    category: "Cooking Oil & Spices",
    qty: "1 L",
    price: 169,
    mrp: 189,
    stock: 30,
    rating: "4.2",
    tags: ["all"],
    imageUrl: "https://picsum.photos/seed/frezo-oil/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#f8ecdf",
    status: "ACTIVE"
  },
  {
    id: "p_pasta_1",
    name: "Instant Pasta",
    category: "Packaged Foods & Instant Meals",
    qty: "350 g",
    price: 94,
    mrp: 120,
    stock: 61,
    rating: "4.2",
    tags: ["all", "maxxsaver"],
    imageUrl: "https://picsum.photos/seed/frezo-pasta/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#e6f2e2",
    status: "ACTIVE"
  },
  {
    id: "p_cleaner_1",
    name: "Floor Cleaner",
    category: "Household Essentials (cleaning supplies, detergents)",
    qty: "2 L",
    price: 179,
    mrp: 220,
    stock: 26,
    rating: "4.4",
    tags: ["all"],
    imageUrl: "https://picsum.photos/seed/frezo-cleaner/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#ece3f8",
    status: "ACTIVE"
  },
  {
    id: "p_shampoo_1",
    name: "Smooth Shampoo",
    category: "Personal Care & Hygiene (soaps, shampoos, toothpaste)",
    qty: "340 ml",
    price: 229,
    mrp: 280,
    stock: 48,
    rating: "4.4",
    tags: ["all"],
    imageUrl: "https://picsum.photos/seed/frezo-shampoo/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#f8e8e8",
    status: "ACTIVE"
  },
  {
    id: "p_meds_1",
    name: "Pain Relief Tablets",
    category: "Medicines & Health Supplies (OTC meds, first-aid, vitamins)",
    qty: "1 strip",
    price: 48,
    mrp: 60,
    stock: 73,
    rating: "4.3",
    tags: ["all"],
    imageUrl: "https://picsum.photos/seed/frezo-meds/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#e9eef8",
    status: "ACTIVE"
  },
  {
    id: "p_pet_1",
    name: "Dog Food Adult",
    category: "Pet Supplies (food, grooming)",
    qty: "1 kg",
    price: 299,
    mrp: 340,
    stock: 17,
    rating: "4.5",
    tags: ["all"],
    imageUrl: "https://picsum.photos/seed/frezo-pet/400/400",
    imageFit: "cover",
    imageScale: 1,
    color: "#f8ecdf",
    status: "ACTIVE"
  }
];

const QUICK_CATEGORIES = [
  { id: "qc_1", name: "Fruits", category: "Fruits & Vegetables (fresh produce)", color: "#e9eef8" },
  { id: "qc_2", name: "Dairy", category: "Dairy & Eggs", color: "#f8ecdf" },
  { id: "qc_3", name: "Breads", category: "Bakery & Breads", color: "#e6f2e2" },
  { id: "qc_4", name: "Snacks", category: "Snacks & Namkeen", color: "#ece3f8" },
  { id: "qc_5", name: "Drinks", category: "Beverages (Tea, Coffee, Juices, Soft Drinks)", color: "#f8e8e8" },
  { id: "qc_6", name: "Frozen", category: "Frozen Foods & Ice-creams", color: "#e9eef8" },
  { id: "qc_7", name: "Medicines", category: "Medicines & Health Supplies (OTC meds, first-aid, vitamins)", color: "#f8ecdf" },
  { id: "qc_8", name: "Pets", category: "Pet Supplies (food, grooming)", color: "#e6f2e2" }
];

const BANNERS: StudioBanner[] = [
  {
    id: "bnr_1",
    title: "Limited Period Offer",
    subtitle: "Up to 60% off on groceries",
    cta: "Use code FREZO60",
    code: "FREZO60",
    bgColor: "#daf6df",
    textColor: "#0d6a2c"
  },
  {
    id: "bnr_2",
    title: "Fresh Fest",
    subtitle: "Farm fresh picks delivered fast",
    cta: "Extra 15% off on produce",
    code: "FRESH15",
    bgColor: "#e9f5ff",
    textColor: "#17446d"
  },
  {
    id: "bnr_3",
    title: "Home Essentials",
    subtitle: "Stock up and save more",
    cta: "Flat Rs 80 off above Rs 799",
    code: "HOME80",
    bgColor: "#fff4de",
    textColor: "#6e4a09"
  }
];

function buildHomeSections(categories: string[], banners: StudioBanner[]): StudioHomeSection[] {
  const sections: StudioHomeSection[] = [];
  let pointer = 0;

  for (let cycle = 0; cycle < 3; cycle += 1) {
    for (let index = 0; index < 3; index += 1) {
      const category = categories[pointer % categories.length] || categories[0] || "";
      sections.push({
        id: `section_${cycle + 1}_pre_${index + 1}`,
        type: "PRODUCT_GRID",
        layout: "HORIZONTAL",
        title: category,
        category,
        bannerId: "",
        limit: 6
      });
      pointer += 1;
    }

    const banner = banners[cycle % banners.length];
    sections.push({
      id: `section_${cycle + 1}_banner`,
      type: "BANNER",
      layout: "HORIZONTAL",
      title: banner?.title || "Promotion",
      category: "",
      bannerId: banner?.id || "",
      limit: 0
    });

    for (let index = 0; index < 3; index += 1) {
      const category = categories[pointer % categories.length] || categories[0] || "";
      sections.push({
        id: `section_${cycle + 1}_post_${index + 1}`,
        type: "PRODUCT_GRID",
        layout: "HORIZONTAL",
        title: category,
        category,
        bannerId: "",
        limit: 6
      });
      pointer += 1;
    }
  }

  return sections;
}

export function buildDefaultStudioConfig(): StudioConfig {
  const nowIso = new Date().toISOString();

  return {
    version: 1,
    updatedAt: nowIso,
    app: {
      name: "FREZO",
      subtitle: "india's next gen grocery app",
      tagline: "\"fast fresh frezo\""
    },
    etaBaseMinutes: 7,
    categories: CATEGORIES,
    topFilters: TOP_FILTERS,
    products: PRODUCTS,
    quickCategories: QUICK_CATEGORIES,
    banners: BANNERS,
    homeSections: buildHomeSections(CATEGORIES, BANNERS),
    recentlyViewedProductIds: PRODUCTS.slice(0, 8).map((product) => product.id),
    reorder: [
      { id: "r_1", label: "Friday Basket", date: "Mar 1", productIds: ["p_milk_1", "p_banana_1"] },
      { id: "r_2", label: "Monthly Needs", date: "Feb 27", productIds: ["p_rice_1", "p_oil_1", "p_pasta_1"] }
    ],
    invoices: [
      { id: "INV-2014", amount: 564, date: "Mar 1" },
      { id: "INV-1987", amount: 1024, date: "Feb 24" },
      { id: "INV-1901", amount: 386, date: "Feb 20" }
    ],
    orders: [
      { id: "O-501", user: "Aarav", city: "Bangalore", amount: 386, payment: "UPI", status: "DELIVERED", createdAt: "2026-03-01T09:30:00.000Z" },
      { id: "O-502", user: "Isha", city: "Hyderabad", amount: 564, payment: "CARD", status: "OUT_FOR_DELIVERY", createdAt: "2026-03-01T10:05:00.000Z" },
      { id: "O-503", user: "Kabir", city: "Pune", amount: 224, payment: "COD", status: "PACKING", createdAt: "2026-03-01T10:15:00.000Z" },
      { id: "O-504", user: "Nisha", city: "Chennai", amount: 942, payment: "UPI", status: "PLACED", createdAt: "2026-03-01T10:40:00.000Z" },
      { id: "O-505", user: "Rudra", city: "Delhi", amount: 188, payment: "UPI", status: "CANCELLED", createdAt: "2026-03-01T11:00:00.000Z" }
    ],
    coupons: [
      { id: "C-1", code: "FREZO50", type: "FLAT", value: 50, minCart: 299, active: true },
      { id: "C-2", code: "FAST10", type: "PERCENT", value: 10, minCart: 199, active: true }
    ],
    users: [
      { id: "U-1", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 9900112233", city: "Bangalore", status: "ACTIVE" },
      { id: "U-2", name: "Isha Verma", email: "isha@example.com", phone: "+91 9911223344", city: "Hyderabad", status: "ACTIVE" },
      { id: "U-3", name: "Kabir Khan", email: "kabir@example.com", phone: "+91 9922334455", city: "Pune", status: "BLOCKED" }
    ],
    logs: [{ id: "L-1", text: "Frezo studio booted" }]
  };
}
