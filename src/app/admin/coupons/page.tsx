"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Plus, Tag, Trash } from "lucide-react";

import {
  ActionMenu,
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  DeleteDialog,
  Filters,
  Input,
  Modal,
  Pagination,
  Search,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useToast } from "@/providers/toast-provider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addActivityLog,
  addCoupon,
  deleteCoupon,
  setCoupons,
  updateCoupon,
} from "@/redux/slices/admin-slice";
import { apiClient } from "@/services/api-client";
import { type Coupon } from "@/types/admin";

export default function CouponsPage() {
  const dispatch = useAppDispatch();
  const coupons = useAppSelector((state) => state.admin.coupons) || [];
  const { success: toastSuccess, error: toastError } = useToast();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // CRUD Modal States
  const [isAddMode, setIsAddMode] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Coupon, "id" | "redeemedCount">>();

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await apiClient<{ data: Coupon[] }>("/coupons");
        dispatch(setCoupons(res.data || []));
      } catch (err: any) {
        console.warn(err);
        toastError(err.message || "Failed to load coupons from backend.");
      }
    }
    loadCoupons();
  }, [dispatch]);

  const handleAddClick = () => {
    setIsAddMode(true);
    reset({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minimumOrderAmount: 0,
      redemptionLimit: null,
      activeDate: new Date().toISOString().substring(0, 10),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 10),
      status: "ACTIVE",
      description: "",
    });
    setModalOpen(true);
  };

  const handleEditClick = (coup: Coupon) => {
    setIsAddMode(false);
    setSelectedCoupon(coup);
    reset({
      code: coup.code,
      discountType: coup.discountType,
      discountValue: coup.discountValue,
      minimumOrderAmount: coup.minimumOrderAmount || 0,
      redemptionLimit: coup.redemptionLimit || null,
      activeDate: coup.activeDate
        ? coup.activeDate.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      expiryDate: coup.expiryDate ? coup.expiryDate.substring(0, 10) : "",
      status: coup.status,
      description: coup.description || "",
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (coup: Coupon) => {
    setSelectedCoupon(coup);
    setDeleteDialogOpen(true);
  };

  const onSubmitCoupon = async (data: any) => {
    const payload = {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minimumOrderAmount: Number(data.minimumOrderAmount || 0),
      redemptionLimit: data.redemptionLimit
        ? Number(data.redemptionLimit)
        : null,
      activeDate: new Date(data.activeDate).toISOString(),
      expiryDate: new Date(data.expiryDate).toISOString(),
      status: data.status,
      description: data.description || null,
    };

    try {
      if (isAddMode) {
        const res = await apiClient<{ data: Coupon }>("/coupons", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        dispatch(addCoupon(res.data));
        dispatch(
          addActivityLog({
            user: "Admin Alex",
            action: `Created coupon code: ${payload.code}`,
            module: "Coupons",
            status: "success",
          }),
        );
        toastSuccess(`Coupon "${payload.code}" created successfully.`);
      } else if (selectedCoupon) {
        const res = await apiClient<{ data: Coupon }>(
          `/coupons/${selectedCoupon.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          },
        );
        dispatch(updateCoupon(res.data));
        dispatch(
          addActivityLog({
            user: "Admin Alex",
            action: `Updated campaign rules for: ${payload.code}`,
            module: "Coupons",
            status: "success",
          }),
        );
        toastSuccess(`Coupon "${payload.code}" updated successfully.`);
      }
      setModalOpen(false);
    } catch (err: any) {
      console.warn(err);
      toastError(err.message || "An error occurred while saving the coupon.");
    }
  };

  const confirmDelete = async () => {
    if (selectedCoupon) {
      try {
        await apiClient<any>(`/coupons/${selectedCoupon.id}`, {
          method: "DELETE",
        });
        dispatch(deleteCoupon(selectedCoupon.id));
        dispatch(
          addActivityLog({
            user: "Admin Alex",
            action: `Removed coupon: ${selectedCoupon.code}`,
            module: "Coupons",
            status: "success",
          }),
        );
        toastSuccess(`Coupon "${selectedCoupon.code}" deleted successfully.`);
      } catch (err: any) {
        console.warn(err);
        toastError(err.message || "Failed to delete the coupon.");
      }
    }
    setDeleteDialogOpen(false);
  };

  // Filter & Paginate
  const filteredCoupons = coupons.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      label: "Coupon Code",
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 font-bold text-text-custom font-mono bg-bg-secondary px-2.5 py-1.5 rounded border border-border-custom text-xs">
          <Tag className="w-3.5 h-3.5 text-primary" />
          {val}
        </span>
      ),
    },
    {
      key: "discountType",
      label: "Discount Value",
      render: (discountType, item) => (
        <span className="font-bold text-text-custom">
          {discountType === "PERCENTAGE"
            ? `${item.discountValue}% Off`
            : `$${Number(item.discountValue).toFixed(2)} Off`}
        </span>
      ),
    },
    {
      key: "minimumOrderAmount",
      label: "Minimum Purchase",
      render: (val) => (
        <span className="text-text-custom/60 font-semibold">
          ${val ? Number(val).toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      key: "redeemedCount",
      label: "Redemptions",
      render: (val, item) => (
        <span className="font-semibold text-text-custom">
          {val} / {item.redemptionLimit || "∞"} uses
        </span>
      ),
    },
    {
      key: "activeDate",
      label: "Active Date",
      render: (val) => (
        <span suppressHydrationWarning>
          {val ? new Date(val).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
      render: (val) => (
        <span suppressHydrationWarning>
          {val ? new Date(val).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Campaign Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, coup) => (
        <ActionMenu
          items={[
            {
              label: "Edit Rules",
              icon: <Edit className="w-3.5 h-3.5" />,
              onClick: () => handleEditClick(coup),
            },
            {
              label: "Delete Coupon",
              icon: <Trash className="w-3.5 h-3.5" />,
              onClick: () => handleDeleteClick(coup),
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
          <Breadcrumb items={[{ label: "Coupons", href: "/admin/coupons" }]} />
          <h1 className="text-2xl font-bold text-text-custom mt-1">
            Coupons & Promo Rules
          </h1>
        </div>
        <div className="flex gap-2 self-start sm:self-auto shrink-0">
          <Button
            onClick={handleAddClick}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Main coupons registry list */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search
                placeholder="Search promo codes..."
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Filters
                onClearFilters={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                <Select
                  label="Campaign Status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "ACTIVE", label: "Active" },
                    { value: "EXPIRED", label: "Expired" },
                    { value: "INACTIVE", label: "Disabled/Inactive" },
                  ]}
                />
              </Filters>
            </div>
          </div>

          <DataTable columns={columns} data={paginatedCoupons} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isAddMode ? "Create New Promo Code" : "Edit Promotion Rules"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmitCoupon)}>
              {isAddMode ? "Create Coupon" : "Save Changes"}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Promo Code Name"
              {...register("code", { required: "Promo code name is required" })}
              error={errors.code?.message}
              placeholder="e.g. FLASH20"
            />
          </div>
          <Select
            label="Discount Mode Type"
            {...register("discountType")}
            options={[
              { value: "PERCENTAGE", label: "Percentage Off (%)" },
              { value: "FIXED", label: "Fixed Price Off ($)" },
            ]}
          />
          <Input
            label="Value / Rate"
            type="number"
            {...register("discountValue", {
              valueAsNumber: true,
              required: "Discount value is required",
            })}
            error={errors.discountValue?.message}
          />
          <Input
            label="Minimum Order Spend ($)"
            type="number"
            {...register("minimumOrderAmount", { valueAsNumber: true })}
          />
          <Input
            label="Redemptions Limit (Uses)"
            type="number"
            {...register("redemptionLimit", { valueAsNumber: true })}
          />
          <Input
            label="Active Date"
            type="date"
            {...register("activeDate", { required: "Active date is required" })}
            error={errors.activeDate?.message}
          />
          <Input
            label="Expiry Date"
            type="date"
            {...register("expiryDate", { required: "Expiry date is required" })}
            error={errors.expiryDate?.message}
          />
          <Select
            label="Campaign Status"
            {...register("status")}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Disabled/Inactive" },
              { value: "EXPIRED", label: "Expired" },
            ]}
          />
          <div className="sm:col-span-2">
            <Input
              label="Description"
              {...register("description")}
              placeholder="e.g. Special Holiday Promo"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedCoupon?.code}
        title="Delete Promotion Campaign"
      />
    </div>
  );
}
