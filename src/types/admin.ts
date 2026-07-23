export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  salePrice?: number | undefined;
  stock: number;
  status: "active" | "draft" | "out_of_stock";
  image: string;
  description?: string | undefined;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | undefined;
  parentId?: string | undefined;
  image?: string | undefined;
  productCount: number;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  itemsCount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded";
  date: string;
  shippingMethod: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string | undefined;
  phone?: string | undefined;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "suspended";
  dateJoined: string;
}

export interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  stock: number;
  reserved: number;
  available: number;
  warehouse: string;
  alertLevel: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minSpend?: number | undefined;
  usageLimit?: number | undefined;
  usageCount: number;
  expiryDate: string;
  status: "active" | "expired" | "disabled";
}

export interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  rate: number;
  minDays: number;
  maxDays: number;
  status: "active" | "inactive";
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  status: "success" | "failed" | "warning";
}

export interface ReportItem {
  id: string;
  date: string;
  sales: number;
  orders: number;
  revenue: number;
  expenses: number;
}
