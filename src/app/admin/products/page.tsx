"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Edit, Eye, Plus, RotateCcw, Tag, Trash } from "lucide-react";

import {
  ActionMenu,
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  DeleteDialog,
  Filters,
  Pagination,
  Search,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addActivityLog, setProducts } from "@/redux/slices/admin-slice";
import { apiClient } from "@/services/api-client";
import { type Product } from "@/types/admin";

export default function ProductsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.admin.products);
  const categories = useAppSelector((state) => state.admin.categories);

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Toast Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ data: { data: any[] } }>("/products");
      if (res && res.data && Array.isArray(res.data.data)) {
        const mapped: Product[] = res.data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.productCategories?.[0]?.category?.name || "Uncategorized",
          price: Number(p.basePrice),
          salePrice: p.discountPrice ? Number(p.discountPrice) : undefined,
          stock: p.stock,
          status: p.status?.slug || "active",
          image:
            p.images?.[0]?.imageUrl ||
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
          description: p.description || "",
        }));
        dispatch(setProducts(mapped));
      }
    } catch (err) {
      console.error("Error fetching live products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // CRUD Delete Dialog
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleArchive = async (prod: Product) => {
    try {
      await apiClient(`/products/${prod.id}/archive`, {
        method: "PATCH",
      });
      await fetchProducts();
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Archived product listing: ${prod.name}`,
          module: "Products",
          status: "success",
        }),
      );
      showNotification(`Product "${prod.name}" has been archived.`, "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to archive product.", "error");
    }
  };

  const handleRestore = async (prod: Product) => {
    try {
      await apiClient(`/products/${prod.id}/restore`, {
        method: "PATCH",
      });
      await fetchProducts();
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Restored product listing: ${prod.name}`,
          module: "Products",
          status: "success",
        }),
      );
      showNotification(`Product "${prod.name}" has been restored.`, "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to restore product.", "error");
    }
  };

  const handleDeleteClick = (prod: Product) => {
    setSelectedProduct(prod);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await apiClient(`/products/${selectedProduct.id}`, {
          method: "DELETE",
        });
        await fetchProducts();
        dispatch(
          addActivityLog({
            user: "Admin Alex",
            action: `Permanently deleted product listing: ${selectedProduct.name}`,
            module: "Products",
            status: "success",
          }),
        );
        showNotification(
          `Product "${selectedProduct.name}" deleted successfully.`,
          "success",
        );
      } catch (err) {
        console.error(err);
        showNotification("Failed to delete product.", "error");
      }
    }
    setDeleteDialogOpen(false);
  };

  // Filter & Paginate
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Product details",
      render: (_, prod) => (
        <div className="flex items-center gap-3">
          <img
            src={prod.image}
            alt={prod.name}
            className="w-10 h-10 object-cover rounded-lg border border-border-custom bg-bg-secondary shrink-0"
          />
          <div>
            <p className="font-bold text-text-custom line-clamp-1">
              {prod.name}
            </p>
            <p className="text-3xs text-text-custom/50 font-bold uppercase tracking-wider font-mono">
              SKU: {prod.sku}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "price",
      label: "Price",
      render: (_, prod) => (
        <div>
          {prod.salePrice ? (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-text-custom">
                ${prod.salePrice.toFixed(2)}
              </span>
              <span className="text-3xs text-text-custom/40 line-through">
                ${prod.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="font-bold text-text-custom">
              ${prod.price.toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "salePrice",
      label: "Discount",
      render: (_, prod) => {
        if (!prod.salePrice)
          return <span className="text-text-custom/40">—</span>;
        const discountAmt = prod.price - prod.salePrice;
        const discountPct = Math.round((discountAmt / prod.price) * 100);
        return (
          <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-3xs border border-emerald-100">
            <Tag className="w-2.5 h-2.5" />
            {discountPct}% off
          </span>
        );
      },
    },
    {
      key: "stock",
      label: "Stock status",
      render: (val) => (
        <span
          className={`font-semibold ${val === 0 ? "text-red-500" : val <= 10 ? "text-amber-500" : "text-emerald-500"}`}
        >
          {val} available
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, prod) => (
        <ActionMenu
          items={[
            {
              label: "View Details",
              icon: <Eye className="w-3.5 h-3.5" />,
              onClick: () => router.push(`/admin/products/view/${prod.id}`),
            },
            {
              label: "Edit Listing",
              icon: <Edit className="w-3.5 h-3.5" />,
              onClick: () => router.push(`/admin/products/edit/${prod.id}`),
            },
            prod.status === "active"
              ? {
                  label: "Archive Product",
                  icon: <Archive className="w-3.5 h-3.5" />,
                  onClick: () => handleArchive(prod),
                }
              : {
                  label: "Restore Product",
                  icon: <RotateCcw className="w-3.5 h-3.5" />,
                  onClick: () => handleRestore(prod),
                },
            {
              label: "Delete Product",
              icon: <Trash className="w-3.5 h-3.5" />,
              onClick: () => handleDeleteClick(prod),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[{ label: "Products", href: "/admin/products" }]}
          />
          <h1 className="text-2xl font-bold text-text-custom mt-1">
            Product Catalog
          </h1>
        </div>
        <Button
          onClick={() => router.push("/admin/products/new")}
          className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Products Table Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search
                placeholder="Search products by title or SKU..."
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Filters
                onClearFilters={() => {
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                <Select
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "all", label: "All Categories" },
                    ...categories.map((c) => ({
                      value: c.name,
                      label: c.name,
                    })),
                  ]}
                />
                <Select
                  label="Listing Status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "draft", label: "Draft" },
                    { value: "out_of_stock", label: "Out of Stock" },
                  ]}
                />
              </Filters>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-custom/50">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <span className="text-xs font-semibold">
                Loading live product catalog...
              </span>
            </div>
          ) : (
            <DataTable columns={columns} data={paginatedProducts} />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedProduct?.name}
        title="Delete Product Listing"
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
