import {
  type ActivityLog,
  type Category,
  type Coupon,
  type Customer,
  type InventoryItem,
  type Order,
  type Product,
  type ShippingMethod,
} from "@/types/admin";

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Classic Leather Tote Bag",
    sku: "BG-LTH-01",
    category: "Bags",
    price: 189.0,
    salePrice: 159.0,
    stock: 45,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
    description:
      "A spacious tote handcrafted from premium full-grain Italian leather.",
  },
  {
    id: "prod-2",
    name: "Silk V-Neck Blouse",
    sku: "CL-SLK-02",
    category: "Apparel",
    price: 120.0,
    stock: 15,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&q=80",
    description:
      "100% pure Mulberry silk blouse with a tailored, modern silhouette.",
  },
  {
    id: "prod-3",
    name: "Minimalist Gold Ring",
    sku: "JW-GLD-03",
    category: "Jewelry",
    price: 250.0,
    salePrice: 220.0,
    stock: 8,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80",
    description: "18k solid gold band with a fine polished finish.",
  },
  {
    id: "prod-4",
    name: "Suede Chelsea Boots",
    sku: "SH-SUD-04",
    category: "Shoes",
    price: 210.0,
    stock: 0,
    status: "out_of_stock",
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&q=80",
    description:
      "Water-resistant suede boot featuring durable Goodyear welt construction.",
  },
  {
    id: "prod-5",
    name: "Linen Summer Dress",
    sku: "CL-LIN-05",
    category: "Apparel",
    price: 95.0,
    stock: 60,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80",
    description: "Breathable organic linen dress designed for warm sunny days.",
  },
  {
    id: "prod-6",
    name: "Urban Canvas Backpack",
    sku: "BG-CAN-06",
    category: "Bags",
    price: 85.0,
    stock: 3,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
    description:
      "Waterproof wax canvas roll-top backpack with a padded laptop compartment.",
  },
  {
    id: "prod-7",
    name: "Sterling Silver Bracelet",
    sku: "JW-SLV-07",
    category: "Jewelry",
    price: 135.0,
    stock: 24,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80",
    description:
      "Delicate 925 sterling silver chain bracelet with dynamic link loops.",
  },
  {
    id: "prod-8",
    name: "Active Runner Sneakers",
    sku: "SH-RUN-08",
    category: "Shoes",
    price: 145.0,
    stock: 0,
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
    description:
      "Responsive foam athletic sneaker with high breathability mesh.",
  },
];

export const initialCategories: Category[] = [
  {
    id: "a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1",
    name: "Apparel",
    slug: "apparel",
    description: "Stylish shirts, dresses, trousers and outerwear.",
    productCount: 24,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
  },
  {
    id: "b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2",
    name: "Bags",
    slug: "bags",
    description: "Handcrafted leather totes, wallets, and daily backpacks.",
    productCount: 15,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
  },
  {
    id: "c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3",
    name: "Jewelry",
    slug: "jewelry",
    description: "High-quality gold, sterling silver, and precious stones.",
    productCount: 10,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80",
  },
  {
    id: "d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4",
    name: "Shoes",
    slug: "shoes",
    description:
      "From casual sneakers to formal leather dress shoes and boots.",
    productCount: 12,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&q=80",
  },
  {
    id: "e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5",
    name: "Accessories",
    slug: "accessories",
    description: "Scarves, belts, sunglasses and small tech items.",
    productCount: 8,
    status: "inactive",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
  },
  {
    id: "cat-6",
    name: "Women's Apparel",
    slug: "womens-apparel",
    description: "Tailored blouses, dresses, and skirts.",
    parentId: "cat-1",
    productCount: 14,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80",
  },
  {
    id: "cat-7",
    name: "Men's Apparel",
    slug: "mens-apparel",
    description: "Suits, trousers, shirts and outerwear.",
    parentId: "cat-1",
    productCount: 10,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&q=80",
  },
  {
    id: "cat-8",
    name: "Leather Totes",
    slug: "leather-totes",
    description: "Italian leather daily handbags.",
    parentId: "cat-2",
    productCount: 9,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
  },
];

export const initialCustomers: Customer[] = [];
export const initialOrders: Order[] = [];

export const initialInventory: InventoryItem[] = [
  {
    id: "inv-1",
    productName: "Classic Leather Tote Bag",
    sku: "BG-LTH-01",
    stock: 45,
    reserved: 5,
    available: 40,
    warehouse: "Warehouse East",
    alertLevel: 10,
    status: "in_stock",
  },
  {
    id: "inv-2",
    productName: "Silk V-Neck Blouse",
    sku: "CL-SLK-02",
    stock: 15,
    reserved: 2,
    available: 13,
    warehouse: "Warehouse West",
    alertLevel: 5,
    status: "in_stock",
  },
  {
    id: "inv-3",
    productName: "Minimalist Gold Ring",
    sku: "JW-GLD-03",
    stock: 8,
    reserved: 3,
    available: 5,
    warehouse: "Warehouse East",
    alertLevel: 10,
    status: "low_stock",
  },
  {
    id: "inv-4",
    productName: "Suede Chelsea Boots",
    sku: "SH-SUD-04",
    stock: 0,
    reserved: 0,
    available: 0,
    warehouse: "Warehouse Central",
    alertLevel: 5,
    status: "out_of_stock",
  },
  {
    id: "inv-5",
    productName: "Linen Summer Dress",
    sku: "CL-LIN-05",
    stock: 60,
    reserved: 10,
    available: 50,
    warehouse: "Warehouse East",
    alertLevel: 15,
    status: "in_stock",
  },
  {
    id: "inv-6",
    productName: "Urban Canvas Backpack",
    sku: "BG-CAN-06",
    stock: 3,
    reserved: 1,
    available: 2,
    warehouse: "Warehouse West",
    alertLevel: 5,
    status: "low_stock",
  },
];

export const initialCoupons: Coupon[] = [];

export const initialShippingMethods: ShippingMethod[] = [
  {
    id: "ship-1",
    name: "Standard Shipping",
    carrier: "DHL eCommerce",
    rate: 5.99,
    minDays: 3,
    maxDays: 5,
    status: "active",
  },
  {
    id: "ship-2",
    name: "Express Shipping",
    carrier: "FedEx Express",
    rate: 14.99,
    minDays: 1,
    maxDays: 2,
    status: "active",
  },
  {
    id: "ship-3",
    name: "Next-Day Courier",
    carrier: "UPS Premium",
    rate: 29.99,
    minDays: 1,
    maxDays: 1,
    status: "active",
  },
  {
    id: "ship-4",
    name: "Local Pickup (Warehouse)",
    carrier: "Self Collect",
    rate: 0.0,
    minDays: 0,
    maxDays: 1,
    status: "inactive",
  },
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    user: "Admin Sarah",
    action: "Updated inventory status for Classic Leather Tote Bag",
    module: "Inventory",
    timestamp: "2026-07-19T18:24:00Z",
    status: "success",
  },
  {
    id: "log-2",
    user: "System Cron",
    action: "Marked coupon VIPGOLD as expired",
    module: "Coupons",
    timestamp: "2026-07-19T18:00:00Z",
    status: "success",
  },
  {
    id: "log-3",
    user: "Admin Alex",
    action: "Created new product Active Runner Sneakers",
    module: "Products",
    timestamp: "2026-07-19T15:45:00Z",
    status: "success",
  },
  {
    id: "log-4",
    user: "Admin Alex",
    action: "Failed login attempt from IP 185.220.101.4",
    module: "Authentication",
    timestamp: "2026-07-19T14:12:00Z",
    status: "failed",
  },
  {
    id: "log-5",
    user: "Admin Sarah",
    action: "Updated shipping rate for Standard Shipping",
    module: "Shipping",
    timestamp: "2026-07-19T10:30:00Z",
    status: "success",
  },
  {
    id: "log-6",
    user: "System Webhook",
    action: "Order ORD-9834 placed successfully",
    module: "Orders",
    timestamp: "2026-07-19T18:45:00Z",
    status: "success",
  },
];
