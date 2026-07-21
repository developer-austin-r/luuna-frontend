import { 
  Product, 
  Category, 
  Order, 
  Customer, 
  InventoryItem, 
  Coupon, 
  ShippingMethod, 
  ActivityLog, 
  ReportItem 
} from '@/types/admin';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic Leather Tote Bag',
    sku: 'BG-LTH-01',
    category: 'Bags',
    price: 189.00,
    salePrice: 159.00,
    stock: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80',
    description: 'A spacious tote handcrafted from premium full-grain Italian leather.'
  },
  {
    id: 'prod-2',
    name: 'Silk V-Neck Blouse',
    sku: 'CL-SLK-02',
    category: 'Apparel',
    price: 120.00,
    stock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&q=80',
    description: '100% pure Mulberry silk blouse with a tailored, modern silhouette.'
  },
  {
    id: 'prod-3',
    name: 'Minimalist Gold Ring',
    sku: 'JW-GLD-03',
    category: 'Jewelry',
    price: 250.00,
    salePrice: 220.00,
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80',
    description: '18k solid gold band with a fine polished finish.'
  },
  {
    id: 'prod-4',
    name: 'Suede Chelsea Boots',
    sku: 'SH-SUD-04',
    category: 'Shoes',
    price: 210.00,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&q=80',
    description: 'Water-resistant suede boot featuring durable Goodyear welt construction.'
  },
  {
    id: 'prod-5',
    name: 'Linen Summer Dress',
    sku: 'CL-LIN-05',
    category: 'Apparel',
    price: 95.00,
    stock: 60,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80',
    description: 'Breathable organic linen dress designed for warm sunny days.'
  },
  {
    id: 'prod-6',
    name: 'Urban Canvas Backpack',
    sku: 'BG-CAN-06',
    category: 'Bags',
    price: 85.00,
    stock: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80',
    description: 'Waterproof wax canvas roll-top backpack with a padded laptop compartment.'
  },
  {
    id: 'prod-7',
    name: 'Sterling Silver Bracelet',
    sku: 'JW-SLV-07',
    category: 'Jewelry',
    price: 135.00,
    stock: 24,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80',
    description: 'Delicate 925 sterling silver chain bracelet with dynamic link loops.'
  },
  {
    id: 'prod-8',
    name: 'Active Runner Sneakers',
    sku: 'SH-RUN-08',
    category: 'Shoes',
    price: 145.00,
    stock: 0,
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
    description: 'Responsive foam athletic sneaker with high breathability mesh.'
  }
];

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Apparel',
    slug: 'apparel',
    description: 'Stylish shirts, dresses, trousers and outerwear.',
    productCount: 24,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80'
  },
  {
    id: 'cat-2',
    name: 'Bags',
    slug: 'bags',
    description: 'Handcrafted leather totes, wallets, and daily backpacks.',
    productCount: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80'
  },
  {
    id: 'cat-3',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'High-quality gold, sterling silver, and precious stones.',
    productCount: 10,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80'
  },
  {
    id: 'cat-4',
    name: 'Shoes',
    slug: 'shoes',
    description: 'From casual sneakers to formal leather dress shoes and boots.',
    productCount: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&q=80'
  },
  {
    id: 'cat-5',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Scarves, belts, sunglasses and small tech items.',
    productCount: 8,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80'
  },
  {
    id: 'cat-6',
    name: "Women's Apparel",
    slug: 'womens-apparel',
    description: 'Tailored blouses, dresses, and skirts.',
    parentId: 'cat-1',
    productCount: 14,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80'
  },
  {
    id: 'cat-7',
    name: "Men's Apparel",
    slug: 'mens-apparel',
    description: 'Suits, trousers, shirts and outerwear.',
    parentId: 'cat-1',
    productCount: 10,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&q=80'
  },
  {
    id: 'cat-8',
    name: 'Leather Totes',
    slug: 'leather-totes',
    description: 'Italian leather daily handbags.',
    parentId: 'cat-2',
    productCount: 9,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Emma Watson',
    email: 'emma.watson@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    phone: '+1 (555) 019-2834',
    ordersCount: 4,
    totalSpent: 620.00,
    status: 'active',
    dateJoined: '2026-02-15'
  },
  {
    id: 'cust-2',
    name: 'Liam Neeson',
    email: 'liam.neeson@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    phone: '+1 (555) 012-3847',
    ordersCount: 2,
    totalSpent: 395.00,
    status: 'active',
    dateJoined: '2026-03-01'
  },
  {
    id: 'cust-3',
    name: 'Sarah Connor',
    email: 'sconnor@cyberdyne.org',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    phone: '+1 (555) 017-9832',
    ordersCount: 7,
    totalSpent: 1450.00,
    status: 'active',
    dateJoined: '2025-11-10'
  },
  {
    id: 'cust-4',
    name: 'Bruce Wayne',
    email: 'bruce@waynecorp.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    phone: '+1 (555) 018-9999',
    ordersCount: 1,
    totalSpent: 250.00,
    status: 'active',
    dateJoined: '2026-05-12'
  },
  {
    id: 'cust-5',
    name: 'Diana Prince',
    email: 'diana@themyscira.gov',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    phone: '+1 (555) 011-8888',
    ordersCount: 12,
    totalSpent: 3120.00,
    status: 'active',
    dateJoined: '2025-08-20'
  },
  {
    id: 'cust-6',
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    phone: '+1 (555) 015-3000',
    ordersCount: 0,
    totalSpent: 0.00,
    status: 'suspended',
    dateJoined: '2026-06-25'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-9832',
    customerName: 'Emma Watson',
    email: 'emma.watson@gmail.com',
    itemsCount: 2,
    total: 318.00,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2026-07-15T14:32:00Z',
    shippingMethod: 'Express Shipping'
  },
  {
    id: 'ORD-9833',
    customerName: 'Liam Neeson',
    email: 'liam.neeson@outlook.com',
    itemsCount: 1,
    total: 189.00,
    status: 'processing',
    paymentStatus: 'paid',
    date: '2026-07-18T09:15:00Z',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-9834',
    customerName: 'Bruce Wayne',
    email: 'bruce@waynecorp.com',
    itemsCount: 1,
    total: 250.00,
    status: 'pending',
    paymentStatus: 'unpaid',
    date: '2026-07-19T18:45:00Z',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-9835',
    customerName: 'Diana Prince',
    email: 'diana@themyscira.gov',
    itemsCount: 4,
    total: 580.00,
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2026-07-17T11:24:00Z',
    shippingMethod: 'Next-Day Courier'
  },
  {
    id: 'ORD-9836',
    customerName: 'Sarah Connor',
    email: 'sconnor@cyberdyne.org',
    itemsCount: 3,
    total: 440.00,
    status: 'cancelled',
    paymentStatus: 'refunded',
    date: '2026-07-10T16:00:00Z',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-9837',
    customerName: 'Diana Prince',
    email: 'diana@themyscira.gov',
    itemsCount: 2,
    total: 270.00,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2026-07-12T10:10:00Z',
    shippingMethod: 'Express Shipping'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    productName: 'Classic Leather Tote Bag',
    sku: 'BG-LTH-01',
    stock: 45,
    reserved: 5,
    available: 40,
    warehouse: 'Warehouse East',
    alertLevel: 10,
    status: 'in_stock'
  },
  {
    id: 'inv-2',
    productName: 'Silk V-Neck Blouse',
    sku: 'CL-SLK-02',
    stock: 15,
    reserved: 2,
    available: 13,
    warehouse: 'Warehouse West',
    alertLevel: 5,
    status: 'in_stock'
  },
  {
    id: 'inv-3',
    productName: 'Minimalist Gold Ring',
    sku: 'JW-GLD-03',
    stock: 8,
    reserved: 3,
    available: 5,
    warehouse: 'Warehouse East',
    alertLevel: 10,
    status: 'low_stock'
  },
  {
    id: 'inv-4',
    productName: 'Suede Chelsea Boots',
    sku: 'SH-SUD-04',
    stock: 0,
    reserved: 0,
    available: 0,
    warehouse: 'Warehouse Central',
    alertLevel: 5,
    status: 'out_of_stock'
  },
  {
    id: 'inv-5',
    productName: 'Linen Summer Dress',
    sku: 'CL-LIN-05',
    stock: 60,
    reserved: 10,
    available: 50,
    warehouse: 'Warehouse East',
    alertLevel: 15,
    status: 'in_stock'
  },
  {
    id: 'inv-6',
    productName: 'Urban Canvas Backpack',
    sku: 'BG-CAN-06',
    stock: 3,
    reserved: 1,
    available: 2,
    warehouse: 'Warehouse West',
    alertLevel: 5,
    status: 'low_stock'
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minSpend: 100,
    usageLimit: 500,
    usageCount: 243,
    expiryDate: '2026-08-31',
    status: 'active'
  },
  {
    id: 'coup-2',
    code: 'WELCOME10',
    type: 'fixed_amount',
    value: 10,
    minSpend: 50,
    usageCount: 154,
    expiryDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'coup-3',
    code: 'VIPGOLD',
    type: 'percentage',
    value: 15,
    minSpend: 200,
    usageLimit: 50,
    usageCount: 50,
    expiryDate: '2026-06-30',
    status: 'expired'
  },
  {
    id: 'coup-4',
    code: 'FREESHIP',
    type: 'fixed_amount',
    value: 15,
    minSpend: 75,
    usageCount: 12,
    expiryDate: '2026-09-15',
    status: 'disabled'
  }
];

export const initialShippingMethods: ShippingMethod[] = [
  {
    id: 'ship-1',
    name: 'Standard Shipping',
    carrier: 'DHL eCommerce',
    rate: 5.99,
    minDays: 3,
    maxDays: 5,
    status: 'active'
  },
  {
    id: 'ship-2',
    name: 'Express Shipping',
    carrier: 'FedEx Express',
    rate: 14.99,
    minDays: 1,
    maxDays: 2,
    status: 'active'
  },
  {
    id: 'ship-3',
    name: 'Next-Day Courier',
    carrier: 'UPS Premium',
    rate: 29.99,
    minDays: 1,
    maxDays: 1,
    status: 'active'
  },
  {
    id: 'ship-4',
    name: 'Local Pickup (Warehouse)',
    carrier: 'Self Collect',
    rate: 0.00,
    minDays: 0,
    maxDays: 1,
    status: 'inactive'
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    user: 'Admin Sarah',
    action: 'Updated inventory status for Classic Leather Tote Bag',
    module: 'Inventory',
    timestamp: '2026-07-19T18:24:00Z',
    status: 'success'
  },
  {
    id: 'log-2',
    user: 'System Cron',
    action: 'Marked coupon VIPGOLD as expired',
    module: 'Coupons',
    timestamp: '2026-07-19T18:00:00Z',
    status: 'success'
  },
  {
    id: 'log-3',
    user: 'Admin Alex',
    action: 'Created new product Active Runner Sneakers',
    module: 'Products',
    timestamp: '2026-07-19T15:45:00Z',
    status: 'success'
  },
  {
    id: 'log-4',
    user: 'Admin Alex',
    action: 'Failed login attempt from IP 185.220.101.4',
    module: 'Authentication',
    timestamp: '2026-07-19T14:12:00Z',
    status: 'failed'
  },
  {
    id: 'log-5',
    user: 'Admin Sarah',
    action: 'Updated shipping rate for Standard Shipping',
    module: 'Shipping',
    timestamp: '2026-07-19T10:30:00Z',
    status: 'success'
  },
  {
    id: 'log-6',
    user: 'System Webhook',
    action: 'Order ORD-9834 placed successfully',
    module: 'Orders',
    timestamp: '2026-07-19T18:45:00Z',
    status: 'success'
  }
];

export const mockReportData: ReportItem[] = [
  { id: 'rep-1', date: '2026-07-13', sales: 450, orders: 3, revenue: 890, expenses: 310 },
  { id: 'rep-2', date: '2026-07-14', sales: 620, orders: 4, revenue: 1200, expenses: 400 },
  { id: 'rep-3', date: '2026-07-15', sales: 980, orders: 6, revenue: 1980, expenses: 620 },
  { id: 'rep-4', date: '2026-07-16', sales: 510, orders: 3, revenue: 1050, expenses: 350 },
  { id: 'rep-5', date: '2026-07-17', sales: 780, orders: 5, revenue: 1540, expenses: 510 },
  { id: 'rep-6', date: '2026-07-18', sales: 1100, orders: 7, revenue: 2200, expenses: 730 },
  { id: 'rep-7', date: '2026-07-19', sales: 1450, orders: 9, revenue: 2900, expenses: 950 }
];
