"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Download, Edit, Plus, Tag, Trash } from "lucide-react";

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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addActivityLog,
  addCoupon,
  deleteCoupon,
  updateCoupon,
} from "@/redux/slices/admin-slice";
import { type Coupon } from "@/types/admin";

export default function CouponsPage() {
  const dispatch = useAppDispatch();
  const coupons = useAppSelector((state) => state.admin.coupons);

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
  } = useForm<Omit<Coupon, "id" | "usageCount">>();

  const handleAddClick = () => {
    setIsAddMode(true);
    reset({
      code: "",
      type: "percentage",
      value: 10,
      minSpend: 0,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 10),
      status: "active",
    });
    setModalOpen(true);
  };

  const handleEditClick = (coup: Coupon) => {
    setIsAddMode(false);
    setSelectedCoupon(coup);
    reset({
      code: coup.code,
      type: coup.type,
      value: coup.value,
      minSpend: coup.minSpend || 0,
      usageLimit: coup.usageLimit || undefined,
      expiryDate: coup.expiryDate,
      status: coup.status,
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (coup: Coupon) => {
    setSelectedCoupon(coup);
    setDeleteDialogOpen(true);
  };

  const onSubmitCoupon = (data: any) => {
    // Standardize optional fields
    const formattedData = {
      code: data.code.toUpperCase(),
      type: data.type,
      value: Number(data.value),
      minSpend: data.minSpend ? Number(data.minSpend) : undefined,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
      expiryDate: data.expiryDate,
      status: data.status,
    };

    if (isAddMode) {
      dispatch(addCoupon(formattedData));
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Created coupon code: ${formattedData.code}`,
          module: "Coupons",
          status: "success",
        }),
      );
      alert(`Coupon "${formattedData.code}" created successfully.`);
    } else if (selectedCoupon) {
      dispatch(
        updateCoupon({
          ...formattedData,
          id: selectedCoupon.id,
          usageCount: selectedCoupon.usageCount,
        }),
      );
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Updated campaign rules for: ${formattedData.code}`,
          module: "Coupons",
          status: "success",
        }),
      );
      alert(`Coupon "${formattedData.code}" updated successfully.`);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedCoupon) {
      dispatch(deleteCoupon(selectedCoupon.id));
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Removed coupon: ${selectedCoupon.code}`,
          module: "Coupons",
          status: "success",
        }),
      );
    }
    setDeleteDialogOpen(false);
  };

  const handleExport = () => {
    alert(
      "Exporting active promo codes list. The download will start shortly.",
    );
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
      key: "type",
      label: "Discount Value",
      render: (type, item) => (
        <span className="font-bold text-text-custom">
          {type === "percentage"
            ? `${item.value}% Off`
            : `$${item.value.toFixed(2)} Off`}
        </span>
      ),
    },
    {
      key: "minSpend",
      label: "Minimum Purchase",
      render: (val) => (
        <span className="text-text-custom/60 font-semibold">
          ${val ? val.toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      key: "usageCount",
      label: "Redemptions",
      render: (val, item) => (
        <span className="font-semibold text-text-custom">
          {val} / {item.usageLimit || "∞"} uses
        </span>
      ),
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
      render: (val) => (
        <span suppressHydrationWarning>
          {new Date(val).toLocaleDateString()}
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
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export Rules
          </Button>
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
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                    { value: "disabled", label: "Disabled" },
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
            <Button
              variant="primary"
              onClick={() => {
                void handleSubmit(onSubmitCoupon)();
              }}
            >
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
            {...register("type")}
            options={[
              { value: "percentage", label: "Percentage Off (%)" },
              { value: "fixed_amount", label: "Fixed Price Off ($)" },
            ]}
          />
          <Input
            label="Value / Rate"
            type="number"
            {...register("value", {
              valueAsNumber: true,
              required: "Discount value is required",
            })}
            error={errors.value?.message}
          />
          <Input
            label="Minimum Order Spend ($)"
            type="number"
            {...register("minSpend", { valueAsNumber: true })}
          />
          <Input
            label="Redemptions Limit (Uses)"
            type="number"
            {...register("usageLimit", { valueAsNumber: true })}
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
              { value: "active", label: "Active" },
              { value: "disabled", label: "Disabled" },
            ]}
          />
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
