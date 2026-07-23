import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  initialActivityLogs,
  initialCategories,
  initialCoupons,
  initialCustomers,
  initialInventory,
  initialOrders,
  initialProducts,
  initialShippingMethods,
  mockReportData,
} from "@/dummy-data/admin";
import {
  type ActivityLog,
  type Category,
  type Coupon,
  type Customer,
  type InventoryItem,
  type Order,
  type Product,
  type ReportItem,
  type ShippingMethod,
} from "@/types/admin";

interface AdminSettings {
  storeName: string;
  storeEmail: string;
  currency: string;
  taxRate: number;
  lowStockAlert: number;
}

interface AdminState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  inventory: InventoryItem[];
  coupons: Coupon[];
  shippingMethods: ShippingMethod[];
  activityLogs: ActivityLog[];
  reportData: ReportItem[];
  settings: AdminSettings;
}

const initialState: AdminState = {
  products: initialProducts,
  categories: initialCategories,
  orders: initialOrders,
  customers: initialCustomers,
  inventory: initialInventory,
  coupons: initialCoupons,
  shippingMethods: initialShippingMethods,
  activityLogs: initialActivityLogs,
  reportData: mockReportData,
  settings: {
    storeName: "Luuna Luxury E-Commerce",
    storeEmail: "admin@luuna.com",
    currency: "USD",
    taxRate: 8,
    lowStockAlert: 10,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Products
    addProduct: (state, action: PayloadAction<Omit<Product, "id">>) => {
      const newProduct: Product = {
        ...action.payload,
        id: `prod-${Date.now()}`,
      };
      state.products.unshift(newProduct);

      // Also add to inventory automatically
      const newInventory: InventoryItem = {
        id: `inv-${Date.now()}`,
        productName: newProduct.name,
        sku: newProduct.sku,
        stock: newProduct.stock,
        reserved: 0,
        available: newProduct.stock,
        warehouse: "Warehouse East",
        alertLevel: state.settings.lowStockAlert,
        status:
          newProduct.stock === 0
            ? "out_of_stock"
            : newProduct.stock <= state.settings.lowStockAlert
              ? "low_stock"
              : "in_stock",
      };
      state.inventory.unshift(newInventory);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1 && state.products[index]) {
        state.products[index] = action.payload;
        // Keep inventory in sync
        const invIndex = state.inventory.findIndex(
          (inv) =>
            inv.sku === action.payload.sku ||
            inv.productName === action.payload.name,
        );
        if (invIndex !== -1 && state.inventory[invIndex]) {
          const invItem = state.inventory[invIndex];
          invItem.productName = action.payload.name;
          invItem.sku = action.payload.sku;
          invItem.stock = action.payload.stock;
          invItem.available = action.payload.stock - invItem.reserved;
          invItem.status =
            action.payload.stock === 0
              ? "out_of_stock"
              : action.payload.stock <= invItem.alertLevel
                ? "low_stock"
                : "in_stock";
        }
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.inventory = state.inventory.filter(
          (inv) => inv.sku !== product.sku,
        );
      }
    },

    // Categories
    addCategory: (
      state,
      action: PayloadAction<Omit<Category, "id" | "productCount">>,
    ) => {
      const newCategory: Category = {
        ...action.payload,
        id: `cat-${Date.now()}`,
        productCount: 0,
      };
      state.categories.unshift(newCategory);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index !== -1 && state.categories[index]) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload,
      );
    },

    // Orders
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order["status"] }>,
    ) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1 && state.orders[index]) {
        state.orders[index].status = action.payload.status;
      }
    },
    updateOrderPaymentStatus: (
      state,
      action: PayloadAction<{
        id: string;
        paymentStatus: Order["paymentStatus"];
      }>,
    ) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1 && state.orders[index]) {
        state.orders[index].paymentStatus = action.payload.paymentStatus;
      }
    },

    // Inventory
    updateInventoryStock: (
      state,
      action: PayloadAction<{
        id: string;
        stock: number;
        reserved?: number;
        warehouse?: string;
      }>,
    ) => {
      const index = state.inventory.findIndex(
        (i) => i.id === action.payload.id,
      );
      if (index !== -1 && state.inventory[index]) {
        const item = state.inventory[index];
        item.stock = action.payload.stock;
        if (action.payload.reserved !== undefined) {
          item.reserved = action.payload.reserved;
        }
        if (action.payload.warehouse !== undefined) {
          item.warehouse = action.payload.warehouse;
        }
        item.available = item.stock - item.reserved;
        item.status =
          item.stock === 0
            ? "out_of_stock"
            : item.stock <= item.alertLevel
              ? "low_stock"
              : "in_stock";

        // Also update product stock
        const pIndex = state.products.findIndex((p) => p.sku === item.sku);
        if (pIndex !== -1 && state.products[pIndex]) {
          state.products[pIndex].stock = action.payload.stock;
          state.products[pIndex].status =
            action.payload.stock === 0
              ? "out_of_stock"
              : state.products[pIndex].status === "draft"
                ? "draft"
                : "active";
        }
      }
    },

    // Coupons
    addCoupon: (
      state,
      action: PayloadAction<Omit<Coupon, "id" | "usageCount">>,
    ) => {
      const newCoupon: Coupon = {
        ...action.payload,
        id: `coup-${Date.now()}`,
        usageCount: 0,
      };
      state.coupons.unshift(newCoupon);
    },
    updateCoupon: (state, action: PayloadAction<Coupon>) => {
      const index = state.coupons.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    },
    deleteCoupon: (state, action: PayloadAction<string>) => {
      state.coupons = state.coupons.filter((c) => c.id !== action.payload);
    },

    // Shipping
    addShippingMethod: (
      state,
      action: PayloadAction<Omit<ShippingMethod, "id">>,
    ) => {
      const newMethod: ShippingMethod = {
        ...action.payload,
        id: `ship-${Date.now()}`,
      };
      state.shippingMethods.push(newMethod);
    },
    updateShippingMethod: (state, action: PayloadAction<ShippingMethod>) => {
      const index = state.shippingMethods.findIndex(
        (s) => s.id === action.payload.id,
      );
      if (index !== -1) {
        state.shippingMethods[index] = action.payload;
      }
    },
    deleteShippingMethod: (state, action: PayloadAction<string>) => {
      state.shippingMethods = state.shippingMethods.filter(
        (s) => s.id !== action.payload,
      );
    },

    // Settings
    updateSettings: (state, action: PayloadAction<AdminSettings>) => {
      state.settings = action.payload;
    },

    // Log Activity
    addActivityLog: (
      state,
      action: PayloadAction<Omit<ActivityLog, "id" | "timestamp">>,
    ) => {
      const newLog: ActivityLog = {
        ...action.payload,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      state.activityLogs.unshift(newLog);
      if (state.activityLogs.length > 50) {
        state.activityLogs.pop(); // limit size
      }
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
  updateOrderPaymentStatus,
  updateInventoryStock,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  addShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  updateSettings,
  addActivityLog,
} = adminSlice.actions;

export const adminReducer = adminSlice.reducer;
export type { AdminSettings, AdminState };
