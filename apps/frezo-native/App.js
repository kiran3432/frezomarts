import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  NativeModules,
  RefreshControl,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

const DARK_STORE_COORDS = {
  latitude: 12.9716,
  longitude: 77.5946,
};

const TOP_FILTERS = [
  { id: 'all', label: 'All', icon: 'A' },
  { id: 'maxxsaver', label: 'Maxxsaver', icon: 'M' },
  { id: 'ramzan', label: 'Ramzan', icon: 'R' },
  { id: 'fresh', label: 'Fresh', icon: 'F' },
  { id: 'summer', label: 'Summer', icon: 'S' },
];

const BOTTOM_TABS = [
  { id: 'HOME', label: 'Home' },
  { id: 'CATEGORIES', label: 'Categories' },
  { id: 'REORDER', label: 'Reorder' },
  { id: 'PRINT', label: 'Print' },
];

const PLACEHOLDER_COLORS = [
  '#e9eef8',
  '#f8ecdf',
  '#e6f2e2',
  '#ece3f8',
  '#f8e8e8',
];

const colorAt = (index) => PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

const CATEGORY_GROUPS = [
  {
    title: 'Grocery & Kitchen',
    items: [
      'Fruits & Vegetables (fresh produce)',
      'Dairy & Eggs',
      'Bakery & Breads',
      'Staples & Grains',
      'Rice & Pulses',
      'Cooking Oil & Spices',
      'Packaged Foods & Instant Meals',
      'Frozen Foods & Ice-creams',
    ],
  },
  {
    title: 'Snacks & Drinks',
    items: ['Snacks & Namkeen', 'Beverages (Tea, Coffee, Juices, Soft Drinks)', 'Ready-to-Eat / Food & Beverages'],
  },
  {
    title: 'Daily Use & Household',
    items: [
      'Household Essentials (cleaning supplies, detergents)',
      'Personal Care & Hygiene (soaps, shampoos, toothpaste)',
      'Beauty & Grooming',
      'Baby Care Products',
    ],
  },
  {
    title: 'Health & Wellness',
    items: ['Medicines & Health Supplies (OTC meds, first-aid, vitamins)', 'Supplements & Nutrition'],
  },
  {
    title: 'Other Quick Commerce',
    items: [
      'Pet Supplies (food, grooming)',
      'Stationery & Office Supplies',
      'Flowers & Gifts',
      'Electronics & Accessories (chargers, headphones, small gadgets)',
    ],
  },
];

const HOME_FEATURED_PRODUCTS = [
  {
    id: 'h_1',
    name: 'Yumfills Chocolate Pie',
    qty: '242 g',
    price: 72,
    mrp: 136,
    rating: '4.5',
    color: colorAt(0),
    tags: ['all', 'maxxsaver'],
    category: 'Snacks & Namkeen',
  },
  {
    id: 'h_2',
    name: 'Digestive High-Fibre',
    qty: '960 g',
    price: 129,
    mrp: 198,
    rating: '4.6',
    color: colorAt(1),
    tags: ['all', 'fresh'],
    category: 'Snacks & Namkeen',
  },
  {
    id: 'h_3',
    name: 'Dark Fantasy Choco',
    qty: '300 g',
    price: 87,
    mrp: 150,
    rating: '4.4',
    color: colorAt(2),
    tags: ['all', 'ramzan'],
    category: 'Snacks & Namkeen',
  },
  {
    id: 'h_4',
    name: 'Amul Taaza Milk',
    qty: '1 L',
    price: 72,
    mrp: 78,
    rating: '4.6',
    color: colorAt(3),
    tags: ['all', 'fresh'],
    category: 'Dairy & Eggs',
  },
];

const HOME_NEEDS = [
  {
    id: 'n_1',
    name: 'Chicken',
    color: colorAt(0),
    product: {
      id: 'home-need-1',
      name: 'Chicken Curry Cut',
      qty: '500 g',
      price: 189,
      mrp: 220,
      rating: '4.3',
      category: 'Ready-to-Eat / Food & Beverages',
      color: colorAt(0),
    },
  },
  {
    id: 'n_2',
    name: 'Towels',
    color: colorAt(1),
    product: {
      id: 'home-need-2',
      name: 'Kitchen Towels Pack',
      qty: '6 sheets',
      price: 149,
      mrp: 178,
      rating: '4.2',
      category: 'Household Essentials (cleaning supplies, detergents)',
      color: colorAt(1),
    },
  },
  {
    id: 'n_3',
    name: 'Ghee',
    color: colorAt(2),
    product: {
      id: 'home-need-3',
      name: 'Cow Ghee',
      qty: '1 L',
      price: 579,
      mrp: 630,
      rating: '4.7',
      category: 'Cooking Oil & Spices',
      color: colorAt(2),
    },
  },
  {
    id: 'n_4',
    name: 'Fruits',
    color: colorAt(3),
    product: {
      id: 'home-need-4',
      name: 'Fresh Fruits Combo',
      qty: '1 pack',
      price: 229,
      mrp: 259,
      rating: '4.5',
      category: 'Fruits & Vegetables (fresh produce)',
      color: colorAt(3),
    },
  },
];

const FRESH_ITEMS = [
  {
    id: 'f_1',
    name: 'Fresh Vegetables',
    color: colorAt(4),
    product: {
      id: 'fresh-1',
      name: 'Farm Vegetables Box',
      qty: '1.5 kg',
      price: 199,
      mrp: 239,
      rating: '4.6',
      category: 'Fruits & Vegetables (fresh produce)',
      color: colorAt(4),
    },
  },
  {
    id: 'f_2',
    name: 'Fresh Fruits',
    color: colorAt(0),
    product: {
      id: 'fresh-2',
      name: 'Seasonal Fruits Basket',
      qty: '2 kg',
      price: 299,
      mrp: 349,
      rating: '4.6',
      category: 'Fruits & Vegetables (fresh produce)',
      color: colorAt(0),
    },
  },
  {
    id: 'f_3',
    name: 'Dairy, Bread and Eggs',
    color: colorAt(1),
    product: {
      id: 'fresh-3',
      name: 'Daily Breakfast Combo',
      qty: '1 combo',
      price: 229,
      mrp: 258,
      rating: '4.4',
      category: 'Dairy & Eggs',
      color: colorAt(1),
    },
  },
  {
    id: 'f_4',
    name: 'Meat and Seafood',
    color: colorAt(2),
    product: {
      id: 'fresh-4',
      name: 'Seafood Family Pack',
      qty: '800 g',
      price: 449,
      mrp: 510,
      rating: '4.3',
      category: 'Ready-to-Eat / Food & Beverages',
      color: colorAt(2),
    },
  },
];

const QUICK_CATEGORY_STRIP = [
  { id: 'qc_1', name: 'Biscuits and Cakes', color: colorAt(0), category: 'Snacks & Namkeen' },
  { id: 'qc_2', name: 'Tea, Coffee and Milk', color: colorAt(1), category: 'Beverages (Tea, Coffee, Juices, Soft Drinks)' },
  { id: 'qc_3', name: 'Sauces and Spreads', color: colorAt(2), category: 'Packaged Foods & Instant Meals' },
  { id: 'qc_4', name: 'Sweet Corner', color: colorAt(3), category: 'Snacks & Namkeen' },
  { id: 'qc_5', name: 'Noodles and Pasta', color: colorAt(4), category: 'Packaged Foods & Instant Meals' },
  { id: 'qc_6', name: 'Frozen Food', color: colorAt(0), category: 'Frozen Foods & Ice-creams' },
  { id: 'qc_7', name: 'Dry Fruits', color: colorAt(1), category: 'Supplements & Nutrition' },
  { id: 'qc_8', name: 'Paan Corner', color: colorAt(2), category: 'Ready-to-Eat / Food & Beverages' },
];

const REORDER_DATA = [
  { id: 'r_1', label: 'Friday Basket', date: 'Feb 28', productIds: ['h_1', 'h_4'] },
  { id: 'r_2', label: 'Monthly Needs', date: 'Feb 26', productIds: ['h_2', 'h_3'] },
];

const INVOICE_DATA = [
  { id: 'INV-2014', amount: 564, date: 'Feb 28' },
  { id: 'INV-1987', amount: 1024, date: 'Feb 24' },
  { id: 'INV-1901', amount: 386, date: 'Feb 20' },
];

const DEFAULT_BANNERS = [
  {
    id: 'bnr_default_1',
    title: 'Limited Period Offer',
    subtitle: 'Up to 60% off on groceries',
    cta: 'Use code FREZO60 on checkout',
    code: 'FREZO60',
    bgColor: '#daf6df',
    textColor: '#0d6a2c',
  },
  {
    id: 'bnr_default_2',
    title: 'Fresh Fest',
    subtitle: 'Farm fresh picks in minutes',
    cta: 'Extra savings on produce',
    code: 'FRESH15',
    bgColor: '#e8f3ff',
    textColor: '#1c4770',
  },
  {
    id: 'bnr_default_3',
    title: 'Home Essentials Week',
    subtitle: 'Save big on daily needs',
    cta: 'Flat Rs 80 off above Rs 799',
    code: 'HOME80',
    bgColor: '#fff3dd',
    textColor: '#6a470f',
  },
];

const buildDefaultHomeSections = (categories, banners) => {
  const sections = [];
  let pointer = 0;

  for (let cycle = 0; cycle < 3; cycle += 1) {
    for (let index = 0; index < 3; index += 1) {
      const category = categories[pointer % categories.length] || categories[0] || '';
      sections.push({
        id: `default_${cycle + 1}_pre_${index + 1}`,
        type: 'PRODUCT_GRID',
        layout: 'HORIZONTAL',
        title: category,
        category,
        bannerId: '',
        limit: 6,
      });
      pointer += 1;
    }

    const banner = banners[cycle % banners.length];
    sections.push({
      id: `default_${cycle + 1}_banner`,
      type: 'BANNER',
      layout: 'HORIZONTAL',
      title: banner?.title || 'Promotion',
      category: '',
      bannerId: banner?.id || '',
      limit: 0,
    });

    for (let index = 0; index < 3; index += 1) {
      const category = categories[pointer % categories.length] || categories[0] || '';
      sections.push({
        id: `default_${cycle + 1}_post_${index + 1}`,
        type: 'PRODUCT_GRID',
        layout: 'HORIZONTAL',
        title: category,
        category,
        bannerId: '',
        limit: 6,
      });
      pointer += 1;
    }
  }

  return sections;
};

const DEFAULT_CATEGORIES = CATEGORY_GROUPS.flatMap((group) => group.items);

const DEFAULT_STUDIO_CONFIG = {
  app: {
    name: 'FREZO',
    subtitle: "india's next gen grocery app",
    tagline: '"fast fresh frezo"',
  },
  etaBaseMinutes: 7,
  topFilters: TOP_FILTERS,
  categories: DEFAULT_CATEGORIES,
  products: [...HOME_FEATURED_PRODUCTS, ...HOME_NEEDS.map((item) => item.product), ...FRESH_ITEMS.map((item) => item.product)].map((product, index) => ({
    ...product,
    stock: 50,
    status: 'ACTIVE',
    tags: Array.isArray(product.tags) && product.tags.length ? product.tags : ['all'],
    imageUrl: '',
    imageFit: 'cover',
    imageScale: 1,
    color: product.color || colorAt(index),
  })),
  quickCategories: QUICK_CATEGORY_STRIP,
  banners: DEFAULT_BANNERS,
  homeSections: buildDefaultHomeSections(DEFAULT_CATEGORIES, DEFAULT_BANNERS),
  recentlyViewedProductIds: HOME_NEEDS.map((item) => item.product.id),
  reorder: REORDER_DATA,
  invoices: INVOICE_DATA,
};

const PAYMENT_METHODS = ['UPI', 'Card', 'Cash'];

const extractHost = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  try {
    const parsed = new URL(value);
    return parsed.hostname || '';
  } catch (error) {
    const hostMatch = value.match(/(?:https?|exp):\/\/([^/:]+)/i);
    return hostMatch?.[1] || '';
  }
};

const resolveStudioApiCandidates = () => {
  const addresses = [];
  const addAddress = (host) => {
    if (!host) return;
    const normalized = host.trim().toLowerCase();
    if (!normalized || normalized === 'localhost' || normalized === '127.0.0.1') return;
    const next = `http://${normalized}:4000`;
    if (!addresses.includes(next)) {
      addresses.push(next);
    }
  };

  addAddress(extractHost(NativeModules?.SourceCode?.scriptURL || ''));
  addAddress('10.108.131.248');

  if (!addresses.includes('http://localhost:4000')) {
    addresses.push('http://localhost:4000');
  }

  return addresses;
};

const toNumber = (value, fallback) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

const normalizeProduct = (value, index, fallbackCategory) => {
  const product = value || {};
  return {
    id: product.id || `studio_product_${index + 1}`,
    name: product.name || `Product ${index + 1}`,
    qty: product.qty || '1 unit',
    price: Math.max(0, toNumber(product.price, 0)),
    mrp: Math.max(0, toNumber(product.mrp, toNumber(product.price, 0))),
    rating: String(product.rating || '4.5'),
    color: product.color || colorAt(index),
    tags: Array.isArray(product.tags) && product.tags.length ? product.tags : ['all'],
    category: product.category || fallbackCategory || 'General',
    imageUrl: typeof product.imageUrl === 'string' ? product.imageUrl : '',
    imageFit: product.imageFit === 'contain' ? 'contain' : 'cover',
    imageScale:
      typeof product.imageScale === 'number' && Number.isFinite(product.imageScale)
        ? Math.max(0.5, Math.min(2, product.imageScale))
        : 1,
    stock: Math.max(0, Math.floor(toNumber(product.stock, 0))),
    status: product.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
  };
};

const normalizeStudioConfig = (value) => {
  const input = value && typeof value === 'object' ? value : {};
  const fallback = DEFAULT_STUDIO_CONFIG;

  const rawProducts = Array.isArray(input.products) && input.products.length ? input.products : fallback.products;
  const categories =
    Array.isArray(input.categories) && input.categories.length
      ? input.categories
      : Array.from(new Set(rawProducts.map((product) => product.category).filter(Boolean)));
  const safeCategories = categories.length ? categories : fallback.categories;

  const products = rawProducts.map((product, index) =>
    normalizeProduct(product, index, safeCategories[index % safeCategories.length])
  );

  const banners =
    Array.isArray(input.banners) && input.banners.length
      ? input.banners.map((banner, index) => ({
          id: banner?.id || `banner_${index + 1}`,
          title: banner?.title || `Promotion ${index + 1}`,
          subtitle: banner?.subtitle || 'Fast fresh frezo',
          cta: banner?.cta || 'Tap to explore',
          code: banner?.code || '',
          bgColor: banner?.bgColor || '#daf6df',
          textColor: banner?.textColor || '#0d6a2c',
        }))
      : fallback.banners;

  const homeSections =
    Array.isArray(input.homeSections) && input.homeSections.length
      ? input.homeSections.map((section, index) => ({
          id: section?.id || `section_${index + 1}`,
          type: section?.type === 'BANNER' ? 'BANNER' : 'PRODUCT_GRID',
          layout: section?.layout === 'VERTICAL' ? 'VERTICAL' : 'HORIZONTAL',
          title: section?.title || '',
          category: section?.category || '',
          bannerId: section?.bannerId || '',
          limit: Math.max(1, Math.min(24, Math.floor(toNumber(section?.limit, 6)))),
        }))
      : fallback.homeSections;

  const topFilters =
    Array.isArray(input.topFilters) && input.topFilters.length
      ? input.topFilters.map((filter, index) => ({
          id: filter?.id || `filter_${index + 1}`,
          label: filter?.label || `Filter ${index + 1}`,
          icon: filter?.icon || 'F',
        }))
      : fallback.topFilters;

  const quickCategories =
    Array.isArray(input.quickCategories) && input.quickCategories.length
      ? input.quickCategories.map((item, index) => ({
          id: item?.id || `quick_${index + 1}`,
          name: item?.name || displayCategoryName(item?.category || safeCategories[index % safeCategories.length]),
          category: item?.category || safeCategories[index % safeCategories.length],
          color: item?.color || colorAt(index),
        }))
      : fallback.quickCategories;

  const recentlyViewedProductIds =
    Array.isArray(input.recentlyViewedProductIds) && input.recentlyViewedProductIds.length
      ? input.recentlyViewedProductIds
      : fallback.recentlyViewedProductIds;

  const reorder = Array.isArray(input.reorder) && input.reorder.length ? input.reorder : fallback.reorder;
  const invoices = Array.isArray(input.invoices) && input.invoices.length ? input.invoices : fallback.invoices;

  return {
    app: {
      name: input.app?.name || fallback.app.name,
      subtitle: input.app?.subtitle || fallback.app.subtitle,
      tagline: input.app?.tagline || fallback.app.tagline,
    },
    etaBaseMinutes: Math.max(1, Math.min(60, Math.floor(toNumber(input.etaBaseMinutes, fallback.etaBaseMinutes)))),
    categories: safeCategories,
    topFilters,
    products,
    quickCategories,
    banners,
    homeSections,
    recentlyViewedProductIds,
    reorder,
    invoices,
  };
};

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const shortCategoryName = (value) =>
  value
    .replace(/\(.*?\)/g, '')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const CATEGORY_PRODUCTS = CATEGORY_GROUPS.reduce((acc, group, groupIndex) => {
  group.items.forEach((item, itemIndex) => {
    const cleaned = shortCategoryName(item);
    const base = cleaned.split('&')[0].trim();
    const baseId = `${slug(item)}-${groupIndex}-${itemIndex}`;
    acc[item] = [
      {
        id: `${baseId}-1`,
        name: `${base} Prime`,
        qty: '1 unit',
        price: 79 + groupIndex * 9 + itemIndex * 3,
        mrp: 89 + groupIndex * 9 + itemIndex * 4,
        rating: '4.5',
        color: colorAt(groupIndex + itemIndex),
        category: item,
      },
      {
        id: `${baseId}-2`,
        name: `${base} Value Pack`,
        qty: '500 g',
        price: 99 + groupIndex * 8 + itemIndex * 2,
        mrp: 119 + groupIndex * 8 + itemIndex * 2,
        rating: '4.6',
        color: colorAt(groupIndex + itemIndex + 1),
        category: item,
      },
      {
        id: `${baseId}-3`,
        name: `${base} Fresh`,
        qty: '1 kg',
        price: 129 + groupIndex * 7 + itemIndex * 3,
        mrp: 149 + groupIndex * 7 + itemIndex * 3,
        rating: '4.4',
        color: colorAt(groupIndex + itemIndex + 2),
        category: item,
      },
    ];
  });
  return acc;
}, {});

const TILE_PRODUCTS = [...HOME_NEEDS.map((item) => item.product), ...FRESH_ITEMS.map((item) => item.product)];

const ALL_PRODUCTS = [...HOME_FEATURED_PRODUCTS, ...TILE_PRODUCTS, ...Object.values(CATEGORY_PRODUCTS).flat()];

const PRODUCT_BY_ID = ALL_PRODUCTS.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

const toRadians = (value) => (value * Math.PI) / 180;

const haversineDistanceKm = (from, to) => {
  const radius = 6371;
  const latDiff = toRadians(to.latitude - from.latitude);
  const lonDiff = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2) * Math.cos(lat1) * Math.cos(lat2);

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const estimateEtaFromDistance = (distanceKm) => {
  const dynamic = 7 + Math.round(distanceKm * 2.2);
  return Math.max(7, Math.min(28, dynamic));
};

const formatAddress = (record) => {
  if (!record) {
    return 'Current location';
  }

  const lineOne = record.name || record.street || record.city || 'Current location';
  const lineTwo = record.city || record.district || record.subregion || record.region;
  return lineTwo && lineTwo !== lineOne ? `${lineOne}, ${lineTwo}` : lineOne;
};

const displayCategoryName = (name) => {
  const cleaned = shortCategoryName(name);
  if (cleaned.length <= 24) {
    return cleaned;
  }

  return `${cleaned.slice(0, 22)}...`;
};

const RowHeader = ({ title, onPress }) => {
  return (
    <View style={styles.rowHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress ? (
        <Pressable onPress={onPress}>
          <Text style={styles.sectionAction}>See all</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default function App() {
  const navBottomOffset = 14;

  const [activeTab, setActiveTab] = useState('HOME');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const [studioConfig, setStudioConfig] = useState(DEFAULT_STUDIO_CONFIG);
  const [etaMinutes, setEtaMinutes] = useState(DEFAULT_STUDIO_CONFIG.etaBaseMinutes);
  const [locationAddress, setLocationAddress] = useState('Detecting current location...');

  const [cartItems, setCartItems] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('UPI');
  const [systemNote, setSystemNote] = useState('Pull down to refresh latest location and ETA.');
  const [profileName, setProfileName] = useState('Frezo User');
  const [profileDob, setProfileDob] = useState('01/01/2000');
  const [profileEmail, setProfileEmail] = useState('user@frezo.app');
  const [studioSyncStatus, setStudioSyncStatus] = useState('Syncing studio...');
  const studioApiCandidates = useMemo(resolveStudioApiCandidates, []);
  const [studioApiBase, setStudioApiBase] = useState(studioApiCandidates[0] || 'http://10.108.131.248:4000');

  const activeProducts = useMemo(() => {
    const products = Array.isArray(studioConfig.products) ? studioConfig.products : [];
    return products.filter((product) => product.status !== 'INACTIVE');
  }, [studioConfig.products]);

  const productById = useMemo(() => {
    return activeProducts.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [activeProducts]);

  const categories = useMemo(() => {
    const base = Array.isArray(studioConfig.categories) ? studioConfig.categories : [];
    if (base.length) {
      return base;
    }
    return Array.from(new Set(activeProducts.map((product) => product.category).filter(Boolean)));
  }, [studioConfig.categories, activeProducts]);

  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = activeProducts.filter((product) => product.category === category);
      return acc;
    }, {});
  }, [categories, activeProducts]);

  const topFilters = useMemo(() => {
    if (Array.isArray(studioConfig.topFilters) && studioConfig.topFilters.length) {
      return studioConfig.topFilters;
    }
    return TOP_FILTERS;
  }, [studioConfig.topFilters]);

  const quickCategoryStrip = useMemo(() => {
    if (Array.isArray(studioConfig.quickCategories) && studioConfig.quickCategories.length) {
      return studioConfig.quickCategories;
    }
    return QUICK_CATEGORY_STRIP;
  }, [studioConfig.quickCategories]);

  const reorderData = useMemo(() => {
    if (Array.isArray(studioConfig.reorder) && studioConfig.reorder.length) {
      return studioConfig.reorder;
    }
    return REORDER_DATA;
  }, [studioConfig.reorder]);

  const invoiceData = useMemo(() => {
    if (Array.isArray(studioConfig.invoices) && studioConfig.invoices.length) {
      return studioConfig.invoices;
    }
    return INVOICE_DATA;
  }, [studioConfig.invoices]);

  const banners = useMemo(() => {
    if (Array.isArray(studioConfig.banners) && studioConfig.banners.length) {
      return studioConfig.banners;
    }
    return DEFAULT_BANNERS;
  }, [studioConfig.banners]);

  const bannersById = useMemo(() => {
    return banners.reduce((acc, banner) => {
      acc[banner.id] = banner;
      return acc;
    }, {});
  }, [banners]);

  const homeSections = useMemo(() => {
    if (Array.isArray(studioConfig.homeSections) && studioConfig.homeSections.length) {
      return studioConfig.homeSections;
    }
    return buildDefaultHomeSections(categories.length ? categories : DEFAULT_CATEGORIES, banners);
  }, [studioConfig.homeSections, categories, banners]);

  const recentlyViewedTiles = useMemo(() => {
    const ids =
      Array.isArray(studioConfig.recentlyViewedProductIds) && studioConfig.recentlyViewedProductIds.length
        ? studioConfig.recentlyViewedProductIds
        : HOME_NEEDS.map((item) => item.product.id);

    const mapped = ids
      .map((id, index) => {
        const product = productById[id];
        if (!product) {
          return null;
        }
        return {
          id: `recent-${product.id}`,
          name: product.name,
          color: product.color || colorAt(index),
          product,
        };
      })
      .filter(Boolean);

    if (mapped.length) {
      return mapped;
    }

    return HOME_NEEDS;
  }, [studioConfig.recentlyViewedProductIds, productById]);

  const categoryGroups = useMemo(() => {
    if (!categories.length) {
      return CATEGORY_GROUPS;
    }

    return [
      {
        title: 'All Categories',
        items: categories,
      },
    ];
  }, [categories]);

  const loadStudioConfig = useCallback(async () => {
    const candidates = Array.from(new Set([studioApiBase, ...studioApiCandidates].filter(Boolean)));

    for (const candidate of candidates) {
      try {
        const response = await fetch(`${candidate}/studio/config`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        const normalized = normalizeStudioConfig(payload);
        setStudioConfig(normalized);
        setStudioApiBase(candidate);
        setStudioSyncStatus(`Studio sync: ${candidate}`);
        setSystemNote(`Studio connected. Data synced from ${candidate}.`);
        return;
      } catch (error) {
        // keep trying next candidate
      }
    }

    setStudioSyncStatus('Studio sync: offline (showing local defaults)');
    setSystemNote('Studio backend not reachable. Showing local default data.');
    setStudioConfig(DEFAULT_STUDIO_CONFIG);
  }, [studioApiBase, studioApiCandidates]);

  useEffect(() => {
    if (!topFilters.length) {
      return;
    }
    if (!topFilters.some((filter) => filter.id === activeFilter)) {
      setActiveFilter(topFilters[0].id);
    }
  }, [topFilters, activeFilter]);

  const detectLocation = useCallback(async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setLocationAddress('Location permission is required for auto-detect');
        setEtaMinutes(studioConfig.etaBaseMinutes || 7);
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const reverse = await Location.reverseGeocodeAsync(current.coords);
      setLocationAddress(formatAddress(reverse[0]));

      const distance = haversineDistanceKm(current.coords, DARK_STORE_COORDS);
      const computedEta = estimateEtaFromDistance(distance);
      const baseEta = studioConfig.etaBaseMinutes || 7;
      setEtaMinutes(Math.max(baseEta, computedEta));
    } catch (error) {
      setLocationAddress('Unable to detect location right now');
      setEtaMinutes(studioConfig.etaBaseMinutes || 7);
    }
  }, [studioConfig.etaBaseMinutes]);

  useEffect(() => {
    loadStudioConfig();
  }, [loadStudioConfig]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadStudioConfig();
    }, 12000);

    return () => clearInterval(timer);
  }, [loadStudioConfig]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([detectLocation(), loadStudioConfig()]);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setRefreshing(false);
  }, [detectLocation, loadStudioConfig]);

  const visibleHomeProducts = useMemo(() => {
    const filteredByTag =
      activeFilter === 'all'
        ? activeProducts
        : activeProducts.filter((product) => Array.isArray(product.tags) && product.tags.includes(activeFilter));

    if (!searchText.trim()) {
      return filteredByTag.slice(0, 18);
    }

    const q = searchText.toLowerCase();
    return filteredByTag.filter(
      (product) =>
        product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q)
    );
  }, [activeFilter, searchText, activeProducts]);

  const categoryPool = useMemo(() => categories, [categories]);

  const cartEntries = useMemo(() => {
    return Object.entries(cartItems)
      .map(([id, quantity]) => {
        const product = productById[id];
        if (!product || quantity <= 0) {
          return null;
        }

        return {
          ...product,
          quantity,
          lineTotal: quantity * product.price,
        };
      })
      .filter(Boolean);
  }, [cartItems, productById]);

  const cartCount = useMemo(
    () => cartEntries.reduce((sum, item) => sum + item.quantity, 0),
    [cartEntries]
  );

  const cartSubtotal = useMemo(
    () => cartEntries.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartEntries]
  );

  useEffect(() => {
    if (!cartCount) {
      setShowCart(false);
    }
  }, [cartCount]);

  const couponDiscount = couponCode.trim().toUpperCase() === 'FREZO50' ? 50 : 0;
  const finalTotal = Math.max(0, cartSubtotal - couponDiscount);

  const navigateTab = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const addToCart = (product) => {
    setCartItems((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1,
    }));
    setSystemNote(`${product.name} added to cart.`);
  };

  const changeCartQuantity = (productId, delta) => {
    setCartItems((current) => {
      const nextValue = (current[productId] || 0) + delta;
      if (nextValue <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }

      return {
        ...current,
        [productId]: nextValue,
      };
    });
  };

  const onPressReorder = (order) => {
    setCartItems((current) => {
      const next = { ...current };
      order.productIds.forEach((id) => {
        if (productById[id]) {
          next[id] = (next[id] || 0) + 1;
        }
      });
      return next;
    });
    setShowCart(true);
    setSystemNote(`${order.label} added to cart.`);
  };

  const placeOrder = () => {
    if (!cartCount) {
      setSystemNote('Add items to cart before placing order.');
      return;
    }

    setCartItems({});
    setCouponCode('');
    setShowCart(false);
    setSystemNote(`Order placed with ${selectedPayment}. Live tracking started.`);
  };

  const saveProfile = () => {
    setShowProfile(false);
    setSystemNote('Profile details saved.');
  };

  const renderTopHeader = () => {
    return (
      <View style={styles.topHeaderWrap}>
        <View style={styles.brandingBlock}>
          <Text style={styles.brandingName}>{studioConfig.app?.name || 'FREZO'}</Text>
          <Text style={styles.brandingSubtitle}>{studioConfig.app?.subtitle || "india's next gen grocery app"}</Text>
          <Text style={styles.brandingTagline}>{studioConfig.app?.tagline || '"fast fresh frezo"'}</Text>
          <Text style={styles.syncStatusText}>{studioSyncStatus}</Text>
        </View>

        <View style={styles.deliveryRow}>
          <View style={styles.deliveryTextBlock}>
            <Text style={styles.deliveryTimeText}>{etaMinutes} mins</Text>
            <Text style={styles.deliveryAddressText} numberOfLines={1}>
              To {locationAddress}
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => {
              setShowCart(false);
              setShowProfile(true);
            }}
          >
            <Text style={styles.profileButtonText}>U</Text>
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search for Atta, Tshirt..."
              placeholderTextColor="#7a7f86"
              style={styles.searchInput}
            />
          </View>

          <Pressable style={styles.searchAction} onPress={() => setSystemNote('Search filter clicked.')}> 
            <Text style={styles.searchActionText}>Q</Text>
          </Pressable>

          <Pressable style={styles.searchAction} onPress={() => setSystemNote('Bookmark clicked.')}> 
            <Text style={styles.searchActionText}>B</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {topFilters.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <Pressable
                key={filter.id}
                style={[styles.filterItem, active && styles.filterItemActive]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <View style={[styles.filterIconCircle, active && styles.filterIconCircleActive]}>
                  <Text style={[styles.filterIconText, active && styles.filterIconTextActive]}>{filter.icon}</Text>
                </View>
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{filter.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderProductCard = (product) => {
    return (
      <Pressable key={product.id} style={styles.productCard} onPress={() => setSelectedProduct(product)}>
        <View style={[styles.productImageMock, { backgroundColor: product.color || '#e7ecf2' }]}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={[styles.productImageAsset, { transform: [{ scale: product.imageScale || 1 }] }]}
              resizeMode={product.imageFit || 'cover'}
            />
          ) : null}
          <Pressable
            style={styles.cardAddButton}
            onPress={(event) => {
              event.stopPropagation();
              addToCart(product);
            }}
          >
            <Text style={styles.cardAddButtonText}>+</Text>
          </Pressable>
          <Text style={styles.productImageText}>{product.qty}</Text>
        </View>

        <Text numberOfLines={2} style={styles.productNameText}>
          {product.name}
        </Text>

        <Text style={styles.ratingText}>* {product.rating}</Text>

        <Text style={styles.priceLabel}>Price Drop</Text>

        <View style={styles.productPriceRow}>
          <Text style={styles.productPriceText}>Rs {product.price}</Text>
          <Text style={styles.productMrpText}>Rs {product.mrp}</Text>
        </View>
      </Pressable>
    );
  };

  const renderCategoryTile = (name, onPress) => {
    return (
      <Pressable key={name} style={styles.categoryTile} onPress={onPress}>
        <View style={[styles.categoryIconMock, { backgroundColor: colorAt(name.length) }]}>
          <Text style={styles.categoryIconText}>{displayCategoryName(name).charAt(0)}</Text>
        </View>
        <Text numberOfLines={2} style={styles.categoryTileText}>
          {displayCategoryName(name)}
        </Text>
      </Pressable>
    );
  };

  const renderHomeSection = (title, products, keyPrefix, layout = 'HORIZONTAL') => {
    const isVertical = layout === 'VERTICAL';

    return (
      <View key={keyPrefix} style={styles.generatedSectionBlock}>
        <RowHeader title={title} />
        {isVertical ? (
          <View style={styles.verticalHomeSectionList}>
            {products.map((product) => (
              <Pressable
                key={`${keyPrefix}-${product.id}`}
                style={styles.productLineCard}
                onPress={() => setSelectedProduct(product)}
              >
                <View style={[styles.productLineImage, { backgroundColor: product.color || '#e7ecf2' }]}>
                  {product.imageUrl ? (
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={[styles.productLineAsset, { transform: [{ scale: product.imageScale || 1 }] }]}
                      resizeMode={product.imageFit || 'cover'}
                    />
                  ) : null}
                </View>
                <View style={styles.productLineInfo}>
                  <Text style={styles.productLineName}>{product.name}</Text>
                  <Text style={styles.productLineMeta}>{product.qty}</Text>
                </View>
                <Pressable
                  style={styles.lineAddButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <Text style={styles.lineAddButtonText}>ADD</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
            {products.map((product) => renderProductCard(product))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderHome = () => {
    if (selectedProduct) {
      return renderProductDetails(() => setSelectedProduct(null));
    }

    const primaryBanner = banners[0] || DEFAULT_BANNERS[0];

    return (
      <ScrollView
        contentContainerStyle={styles.screenContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {renderTopHeader()}

        <Pressable
          style={[styles.homePromoBanner, { backgroundColor: primaryBanner.bgColor || '#daf6df' }]}
          onPress={() => setSystemNote(`${primaryBanner.title} opened.`)}
        >
          <Text style={[styles.homePromoCaption, { color: primaryBanner.textColor || '#0d6a2c' }]}>
            {primaryBanner.title}
          </Text>
          <Text style={[styles.homePromoTitle, { color: primaryBanner.textColor || '#0d6a2c' }]}>
            {primaryBanner.subtitle}
          </Text>
          <Text style={[styles.homePromoSubText, { color: primaryBanner.textColor || '#0d6a2c' }]}>
            {primaryBanner.cta}
          </Text>
        </Pressable>

        <RowHeader title="Popular right now" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {visibleHomeProducts.map((product) => renderProductCard(product))}
        </ScrollView>

        {visibleHomeProducts.length === 0 ? (
          <Text style={styles.emptyText}>No products in this filter. Try another top section.</Text>
        ) : null}

        <RowHeader title="Recently viewed" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roundTileRow}>
          {recentlyViewedTiles.map((item) => (
            <Pressable key={item.id} style={styles.roundTile} onPress={() => setSelectedProduct(item.product)}>
              <View style={[styles.roundTileImage, { backgroundColor: item.color }]} />
              <Text style={styles.roundTileText}>{item.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.generatedCycleWrap}>
          {homeSections.map((section, index) => {
            if (section.type === 'BANNER') {
              const banner = bannersById[section.bannerId] || banners[index % banners.length];
              if (!banner) {
                return null;
              }

              return (
                <Pressable
                  key={section.id || `banner-${index}`}
                  style={[styles.cycleBanner, { backgroundColor: banner.bgColor || '#daf6df' }]}
                  onPress={() => setSystemNote(`${banner.title} opened.`)}
                >
                  <Text style={[styles.cycleBannerCaption, { color: banner.textColor || '#0d6a2c' }]}>
                    {banner.title}
                  </Text>
                  <Text style={[styles.cycleBannerTitle, { color: banner.textColor || '#0d6a2c' }]}>
                    {banner.subtitle}
                  </Text>
                  <Text style={[styles.cycleBannerSubText, { color: banner.textColor || '#0d6a2c' }]}>
                    {banner.cta}
                  </Text>
                </Pressable>
              );
            }

            const fallbackCategory = categoryPool[index % Math.max(1, categoryPool.length)];
            const categoryName = section.category || fallbackCategory;
            const products = (productsByCategory[categoryName] || []).slice(
              0,
              Math.max(1, section.limit || 6)
            );

            if (!products.length) {
              return null;
            }

            return renderHomeSection(
              section.title || displayCategoryName(categoryName),
              products,
              section.id || `section-${index}`,
              section.layout || 'HORIZONTAL'
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderCategories = () => {
    if (selectedProduct) {
      return renderProductDetails(() => setSelectedProduct(null));
    }

    if (selectedCategory) {
      const products = productsByCategory[selectedCategory] || [];
      return (
        <ScrollView
          contentContainerStyle={styles.screenContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          {renderTopHeader()}

          <Pressable style={styles.backChip} onPress={() => setSelectedCategory(null)}>
            <Text style={styles.backChipText}>Back to categories</Text>
          </Pressable>

          <Text style={styles.sectionTitle}>{displayCategoryName(selectedCategory)}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
            {products.map((product) => renderProductCard(product))}
          </ScrollView>

            <View style={styles.productListColumn}>
              {products.map((product) => (
                <Pressable key={`${product.id}-list`} style={styles.productLineCard} onPress={() => setSelectedProduct(product)}>
                <View style={[styles.productLineImage, { backgroundColor: product.color || '#e7ecf2' }]}>
                  {product.imageUrl ? (
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={[styles.productLineAsset, { transform: [{ scale: product.imageScale || 1 }] }]}
                      resizeMode={product.imageFit || 'cover'}
                    />
                  ) : null}
                </View>
                <View style={styles.productLineInfo}>
                  <Text style={styles.productLineName}>{product.name}</Text>
                  <Text style={styles.productLineMeta}>{product.qty}</Text>
                </View>
                <Pressable
                  style={styles.lineAddButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <Text style={styles.lineAddButtonText}>ADD</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.screenContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {renderTopHeader()}

        <View style={styles.quickCategoryStripWrap}>
          {quickCategoryStrip.map((tile) => (
            <Pressable
              key={tile.id}
              style={styles.quickCategoryTile}
              onPress={() => setSelectedCategory(tile.category)}
            >
              <View style={[styles.quickCategoryImage, { backgroundColor: tile.color }]} />
              <Text numberOfLines={2} style={styles.quickCategoryText}>{tile.name}</Text>
            </Pressable>
          ))}
        </View>

        {categoryGroups.map((group) => (
          <View key={group.title} style={styles.categoryGroupWrap}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            <View style={styles.categoryGrid}>
              {group.items.map((item) => renderCategoryTile(item, () => setSelectedCategory(item)))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderReorder = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.screenContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {renderTopHeader()}

        <RowHeader title="Reorder" />

        <View style={styles.verticalList}>
          {reorderData.map((item) => (
            <View key={item.id} style={styles.reorderCard}>
              <View>
                <Text style={styles.reorderTitle}>{item.label}</Text>
                <Text style={styles.reorderMeta}>{item.date}</Text>
              </View>
              <Pressable style={styles.reorderButton} onPress={() => onPressReorder(item)}>
                <Text style={styles.reorderButtonText}>Add Again</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderPrint = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.screenContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {renderTopHeader()}

        <RowHeader title="Print" />

        <View style={styles.verticalList}>
          {invoiceData.map((invoice) => (
            <View key={invoice.id} style={styles.invoiceCard}>
              <View>
                <Text style={styles.invoiceId}>{invoice.id}</Text>
                <Text style={styles.invoiceMeta}>{invoice.date}</Text>
              </View>

              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>Rs {invoice.amount}</Text>
                <Pressable
                  style={styles.invoiceButton}
                  onPress={() => setSystemNote(`Invoice ${invoice.id} ready for print.`)}
                >
                  <Text style={styles.invoiceButtonText}>Print Bill</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderProductDetails = (onBack) => {
    if (!selectedProduct) {
      return null;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.screenContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {renderTopHeader()}

        <Pressable style={styles.backChip} onPress={onBack}>
          <Text style={styles.backChipText}>Back</Text>
        </Pressable>

        <View style={styles.detailsCard}>
          <View style={[styles.detailsImage, { backgroundColor: selectedProduct.color || '#e5edf4' }]}>
            {selectedProduct.imageUrl ? (
              <Image
                source={{ uri: selectedProduct.imageUrl }}
                style={[styles.detailsImageAsset, { transform: [{ scale: selectedProduct.imageScale || 1 }] }]}
                resizeMode={selectedProduct.imageFit || 'cover'}
              />
            ) : null}
          </View>
          <Text style={styles.detailsTitle}>{selectedProduct.name}</Text>
          <Text style={styles.detailsMeta}>{selectedProduct.qty}</Text>
          <Text style={styles.detailsMeta}>{displayCategoryName(selectedProduct.category)}</Text>
          <Text style={styles.detailsPrice}>Rs {selectedProduct.price}</Text>
          <Text style={styles.detailsMrp}>MRP Rs {selectedProduct.mrp}</Text>
          <Text style={styles.detailsBody}>Fast fresh delivery based on your current distance. ETA now {etaMinutes} mins.</Text>
          <Pressable style={styles.detailsAddButton} onPress={() => addToCart(selectedProduct)}>
            <Text style={styles.detailsAddButtonText}>Add to Cart</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  };

  const renderMain = () => {
    if (activeTab === 'HOME') {
      return renderHome();
    }

    if (activeTab === 'CATEGORIES') {
      return renderCategories();
    }

    if (activeTab === 'REORDER') {
      return renderReorder();
    }

    return renderPrint();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <View style={styles.container}>{renderMain()}</View>

      <View style={[styles.deliveryStrip, { bottom: navBottomOffset + 56 }]}>
        <Text style={styles.deliveryStripText}>FREE DELIVERY on orders above Rs 149</Text>
      </View>

      {cartCount > 0 ? (
        <Pressable style={[styles.floatingCart, { bottom: navBottomOffset + 62 }]} onPress={() => setShowCart(true)}>
          <Text style={styles.floatingCartLabel}>CART</Text>
          <Text style={styles.floatingCartCount}>{cartCount} ITEM{cartCount > 1 ? 'S' : ''}</Text>
          <Text style={styles.floatingCartTotal}>Rs {finalTotal}</Text>
        </Pressable>
      ) : null}

      <View style={[styles.bottomNav, { bottom: navBottomOffset }]}>
        {BOTTOM_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.bottomNavItem, active && styles.bottomNavItemActive]}
              onPress={() => navigateTab(tab.id)}
            >
              <Text style={[styles.bottomNavText, active && styles.bottomNavTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {showProfile ? (
        <View style={styles.profileOverlay}>
          <SafeAreaView style={styles.profileSheet} edges={['bottom']}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>User Profile</Text>
              <Pressable onPress={() => setShowProfile(false)}>
                <Text style={styles.profileClose}>Close</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.profileBody} keyboardShouldPersistTaps="handled">
              <Text style={styles.profileLabel}>Name</Text>
              <TextInput
                value={profileName}
                onChangeText={setProfileName}
                placeholder="Enter name"
                placeholderTextColor="#8a929b"
                style={styles.profileInput}
              />

              <Text style={styles.profileLabel}>DOB</Text>
              <TextInput
                value={profileDob}
                onChangeText={setProfileDob}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#8a929b"
                style={styles.profileInput}
              />

              <Text style={styles.profileLabel}>Email</Text>
              <TextInput
                value={profileEmail}
                onChangeText={setProfileEmail}
                placeholder="Enter email"
                placeholderTextColor="#8a929b"
                style={styles.profileInput}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Pressable style={styles.profileSaveButton} onPress={saveProfile}>
                <Text style={styles.profileSaveText}>Save Profile</Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </View>
      ) : null}

      {showCart ? (
        <View style={styles.cartOverlay}>
          <SafeAreaView style={styles.cartSheet} edges={['bottom']}>
            <View style={styles.cartHeader}>
              <View>
                <Text style={styles.cartTitle}>Cart Review</Text>
                <Text style={styles.cartSubtitle}>{systemNote}</Text>
              </View>
              <Pressable onPress={() => setShowCart(false)}>
                <Text style={styles.cartClose}>Close</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.cartBody}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              keyboardShouldPersistTaps="handled"
            >
              {cartEntries.length ? (
                cartEntries.map((item) => (
                  <View key={item.id} style={styles.cartItemRow}>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemMeta}>Rs {item.price} each</Text>
                    </View>
                    <View style={styles.cartQtyWrap}>
                      <Pressable style={styles.qtyButton} onPress={() => changeCartQuantity(item.id, -1)}>
                        <Text style={styles.qtyButtonText}>-</Text>
                      </Pressable>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <Pressable style={styles.qtyButton} onPress={() => changeCartQuantity(item.id, 1)}>
                        <Text style={styles.qtyButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Your cart is empty.</Text>
              )}

              <TextInput
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Coupon code (try FREZO50)"
                placeholderTextColor="#889196"
                style={styles.couponInput}
                autoCapitalize="characters"
              />

              <Text style={styles.summaryLine}>Subtotal: Rs {cartSubtotal}</Text>
              <Text style={styles.summaryLine}>Discount: Rs {couponDiscount}</Text>
              <Text style={styles.summaryTotal}>Final Total: Rs {finalTotal}</Text>

              <Text style={styles.paymentLabel}>Select payment</Text>
              <View style={styles.paymentWrap}>
                {PAYMENT_METHODS.map((method) => {
                  const active = selectedPayment === method;
                  return (
                    <Pressable
                      key={method}
                      style={[styles.paymentChip, active && styles.paymentChipActive]}
                      onPress={() => setSelectedPayment(method)}
                    >
                      <Text style={[styles.paymentChipText, active && styles.paymentChipTextActive]}>{method}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable style={styles.placeOrderButton} onPress={placeOrder}>
                <Text style={styles.placeOrderButtonText}>Place Order</Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  container: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 210,
    gap: 10,
  },
  topHeaderWrap: {
    gap: 9,
    backgroundColor: '#f7f8fb',
  },
  brandingBlock: {
    gap: 1,
    paddingHorizontal: 2,
  },
  brandingName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0a8d2a',
    letterSpacing: 0.4,
  },
  brandingSubtitle: {
    fontSize: 12,
    color: '#2f343a',
    fontWeight: '700',
  },
  brandingTagline: {
    fontSize: 11,
    color: '#4a525c',
    fontWeight: '500',
  },
  syncStatusText: {
    fontSize: 10,
    color: '#56606d',
    marginTop: 1,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  deliveryTextBlock: {
    flex: 1,
    paddingRight: 8,
  },
  deliveryTimeText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f1114',
    lineHeight: 30,
  },
  deliveryAddressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#21252a',
    lineHeight: 18,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7c8086',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafbff',
  },
  profileButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2f3338',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  searchInputWrap: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d6dbe1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    fontSize: 12,
    color: '#1a1f24',
    fontWeight: '500',
    paddingVertical: 0,
  },
  searchAction: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111318',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  searchActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1b1f25',
  },
  filterBar: {
    paddingRight: 8,
    gap: 5,
  },
  filterItem: {
    width: 66,
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 4,
    borderRadius: 14,
  },
  filterItemActive: {
    borderWidth: 1,
    borderColor: '#13171c',
    backgroundColor: '#ffffff',
  },
  filterIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#edf1f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  filterIconCircleActive: {
    backgroundColor: '#121519',
  },
  filterIconText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#555b63',
  },
  filterIconTextActive: {
    color: '#ffffff',
  },
  filterLabel: {
    fontSize: 10,
    color: '#474d56',
    fontWeight: '600',
  },
  filterLabelActive: {
    color: '#0f1218',
    fontWeight: '800',
  },
  homePromoBanner: {
    backgroundColor: '#2f1c78',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  homePromoCaption: {
    fontSize: 10,
    color: '#d9c8ff',
    fontWeight: '700',
  },
  homePromoTitle: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '900',
  },
  homePromoSubText: {
    fontSize: 11,
    color: '#e9dbff',
    fontWeight: '600',
  },
  promoSlimCard: {
    backgroundColor: '#6424b6',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  promoSlimTitle: {
    fontSize: 10,
    color: '#f4ddff',
    fontWeight: '700',
    marginBottom: 3,
  },
  promoSlimText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1f25',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f68d3',
  },
  horizontalRow: {
    paddingRight: 8,
    gap: 8,
  },
  productCard: {
    width: 148,
    backgroundColor: '#ffffff',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#dce3ea',
    padding: 8,
    gap: 5,
  },
  productImageMock: {
    height: 98,
    borderRadius: 11,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 6,
    overflow: 'hidden',
  },
  productImageAsset: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cardAddButton: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#f6fbff',
    borderWidth: 1,
    borderColor: '#4b89ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAddButtonText: {
    fontSize: 16,
    color: '#2f68d3',
    fontWeight: '800',
    lineHeight: 17,
  },
  productImageText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#4065a5',
    backgroundColor: '#ffffffa8',
    borderRadius: 5,
    paddingVertical: 1,
  },
  productNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#20252b',
    minHeight: 34,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1f8b46',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4a4f57',
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  productPriceText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#151a20',
  },
  productMrpText: {
    fontSize: 11,
    color: '#727a84',
    textDecorationLine: 'line-through',
  },
  roundTileRow: {
    paddingRight: 10,
    gap: 10,
  },
  roundTile: {
    width: 92,
    alignItems: 'center',
    gap: 4,
  },
  roundTileImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e7ee',
  },
  roundTileText: {
    fontSize: 11,
    color: '#2d333a',
    textAlign: 'center',
    fontWeight: '600',
  },
  generatedCycleWrap: {
    gap: 10,
  },
  generatedSectionBlock: {
    gap: 6,
  },
  verticalHomeSectionList: {
    gap: 8,
  },
  cycleBanner: {
    backgroundColor: '#2f1c78',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 3,
  },
  cycleBannerCaption: {
    fontSize: 10,
    color: '#d9c8ff',
    fontWeight: '700',
  },
  cycleBannerTitle: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '900',
  },
  cycleBannerSubText: {
    fontSize: 11,
    color: '#e9dbff',
    fontWeight: '600',
  },
  bigPromoCard: {
    backgroundColor: '#2f1c78',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 10,
  },
  bigPromoTitle: {
    fontSize: 16,
    color: '#f4f5ff',
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  bigPromoTagsRow: {
    flexDirection: 'row',
    gap: 7,
  },
  bigPromoTag: {
    borderRadius: 999,
    backgroundColor: '#4a35a8',
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  bigPromoTagText: {
    fontSize: 11,
    color: '#f8f8ff',
    fontWeight: '700',
  },
  freshRow: {
    paddingRight: 10,
    gap: 9,
  },
  freshTile: {
    width: 84,
    gap: 5,
    alignItems: 'center',
  },
  freshImage: {
    width: 78,
    height: 78,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dde5ee',
  },
  freshText: {
    fontSize: 11,
    lineHeight: 13,
    color: '#2d333a',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryGroupWrap: {
    gap: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTile: {
    width: '23%',
    minHeight: 114,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfe5ec',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    paddingHorizontal: 6,
    gap: 6,
  },
  categoryIconMock: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#e9f2fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2e4c79',
  },
  categoryTileText: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    color: '#2c3138',
    fontWeight: '600',
  },
  quickCategoryStripWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    padding: 8,
  },
  quickCategoryTile: {
    width: '23%',
    gap: 5,
    alignItems: 'center',
  },
  quickCategoryImage: {
    width: 62,
    height: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dde5ee',
  },
  quickCategoryText: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    color: '#2f343a',
    fontWeight: '600',
  },
  backChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#eef3fb',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backChipText: {
    fontSize: 11,
    color: '#244981',
    fontWeight: '700',
  },
  productListColumn: {
    gap: 8,
  },
  productLineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dde5ed',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productLineImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
  },
  productLineAsset: {
    width: '100%',
    height: '100%',
  },
  productLineInfo: {
    flex: 1,
  },
  productLineName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e2329',
  },
  productLineMeta: {
    fontSize: 10,
    color: '#5a636e',
    marginTop: 2,
  },
  lineAddButton: {
    borderRadius: 8,
    backgroundColor: '#2f68d3',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lineAddButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  verticalList: {
    gap: 8,
  },
  reorderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dce4ec',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reorderTitle: {
    fontSize: 13,
    color: '#1e2329',
    fontWeight: '700',
  },
  reorderMeta: {
    fontSize: 11,
    color: '#5f6975',
    marginTop: 2,
  },
  reorderButton: {
    borderRadius: 8,
    backgroundColor: '#2f68d3',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  reorderButtonText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '800',
  },
  invoiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dce4ec',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e2329',
  },
  invoiceMeta: {
    fontSize: 10,
    color: '#5f6975',
    marginTop: 2,
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  invoiceAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1c2128',
  },
  invoiceButton: {
    borderRadius: 8,
    backgroundColor: '#eef3fb',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  invoiceButtonText: {
    fontSize: 10,
    color: '#2b578d',
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe3eb',
    padding: 12,
    gap: 6,
  },
  detailsImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
  },
  detailsImageAsset: {
    width: '100%',
    height: '100%',
  },
  detailsTitle: {
    fontSize: 16,
    color: '#1a2027',
    fontWeight: '800',
  },
  detailsMeta: {
    fontSize: 11,
    color: '#4d5660',
  },
  detailsPrice: {
    fontSize: 20,
    color: '#141a21',
    fontWeight: '900',
  },
  detailsMrp: {
    fontSize: 11,
    color: '#727b87',
  },
  detailsBody: {
    fontSize: 11,
    color: '#30363d',
    lineHeight: 16,
  },
  detailsAddButton: {
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: '#2f68d3',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailsAddButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 11,
    color: '#5e6873',
  },
  deliveryStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 34,
    backgroundColor: '#eaf9f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#d6ecea',
    zIndex: 9,
  },
  deliveryStripText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30373e',
  },
  floatingCart: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 14,
    backgroundColor: '#1f66f2',
    minWidth: 170,
    paddingHorizontal: 22,
    paddingVertical: 7,
    alignItems: 'center',
    zIndex: 12,
    borderWidth: 1,
    borderColor: '#1049b8',
  },
  floatingCartLabel: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  floatingCartCount: {
    fontSize: 9,
    color: '#dce8ff',
    fontWeight: '700',
  },
  floatingCartTotal: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '800',
    marginTop: 1,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#dce3ea',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 2,
    zIndex: 13,
  },
  bottomNavItem: {
    minWidth: 74,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bottomNavItemActive: {
    backgroundColor: '#edf2fb',
  },
  bottomNavText: {
    fontSize: 11,
    color: '#757d86',
    fontWeight: '700',
  },
  bottomNavTextActive: {
    color: '#1f2328',
  },
  cartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    zIndex: 20,
  },
  profileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    zIndex: 25,
  },
  profileSheet: {
    flex: 1,
    marginTop: 110,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  profileHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e9ef',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#151b22',
  },
  profileClose: {
    fontSize: 11,
    color: '#2f68d3',
    fontWeight: '700',
  },
  profileBody: {
    padding: 12,
    gap: 8,
    paddingBottom: 28,
  },
  profileLabel: {
    fontSize: 11,
    color: '#222930',
    fontWeight: '700',
  },
  profileInput: {
    borderWidth: 1,
    borderColor: '#d8e0e8',
    borderRadius: 9,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 11,
    color: '#1b2026',
  },
  profileSaveButton: {
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#111722',
    alignItems: 'center',
    paddingVertical: 11,
  },
  profileSaveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  cartSheet: {
    flex: 1,
    marginTop: 72,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  cartHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e9ef',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#151b22',
  },
  cartSubtitle: {
    marginTop: 1,
    fontSize: 10,
    color: '#5e6873',
  },
  cartClose: {
    fontSize: 11,
    color: '#2f68d3',
    fontWeight: '700',
  },
  cartBody: {
    padding: 12,
    gap: 9,
    paddingBottom: 30,
  },
  cartItemRow: {
    backgroundColor: '#f6f8fc',
    borderRadius: 10,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartItemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  cartItemName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1b2026',
  },
  cartItemMeta: {
    marginTop: 2,
    fontSize: 10,
    color: '#5f6973',
  },
  cartQtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  qtyButton: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#2f68d3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '900',
    lineHeight: 13,
  },
  qtyText: {
    minWidth: 11,
    textAlign: 'center',
    fontSize: 11,
    color: '#1b2026',
    fontWeight: '700',
  },
  couponInput: {
    borderWidth: 1,
    borderColor: '#d8e0e8',
    borderRadius: 9,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 11,
    color: '#1b2026',
  },
  summaryLine: {
    fontSize: 11,
    color: '#313941',
  },
  summaryTotal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#131a21',
  },
  paymentLabel: {
    marginTop: 3,
    fontSize: 11,
    color: '#222930',
    fontWeight: '700',
  },
  paymentWrap: {
    flexDirection: 'row',
    gap: 7,
  },
  paymentChip: {
    borderWidth: 1,
    borderColor: '#ccd6e0',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  paymentChipActive: {
    backgroundColor: '#2f68d3',
    borderColor: '#2f68d3',
  },
  paymentChipText: {
    fontSize: 10,
    color: '#394049',
    fontWeight: '700',
  },
  paymentChipTextActive: {
    color: '#ffffff',
  },
  placeOrderButton: {
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: '#111722',
    alignItems: 'center',
    paddingVertical: 11,
  },
  placeOrderButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
});
