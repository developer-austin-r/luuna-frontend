"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Edit,
  Eye,
  Loader2,
  ShieldAlert,
  Trash,
  UserCheck,
} from "lucide-react";

import {
  ActionMenu,
  Avatar,
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
  deleteCustomer as deleteCustomerInRedux,
  setCustomers,
  updateCustomer as updateCustomerInRedux,
  updateCustomerStatus as updateCustomerStatusInRedux,
} from "@/redux/slices/admin-slice";
import {
  deleteCustomer,
  getCustomers,
  toggleCustomerStatus,
  updateCustomer,
} from "@/services/customer";
import { type Customer } from "@/types/admin";

export default function CustomersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Redux & Local list state
  const reduxCustomers = useAppSelector((state) => state.admin.customers);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<keyof Customer>("dateJoined");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modals & Action State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form for Edit
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    phone?: string;
    status: "active" | "suspended";
  }>();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Customers from backend API
  const fetchCustomersList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomers({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        status: statusFilter,
        sortBy: sortBy as string,
        sortDir,
      });

      if (res) {
        const list = Array.isArray(res.data) ? res.data : [];
        setCustomersList(list);
        dispatch(setCustomers(list));
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalItems(res.pagination?.total || list.length);
      }
    } catch (err: any) {
      console.error("Failed to fetch customers:", err);
      toast.error(err.message || "Failed to load customers from server.");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    statusFilter,
    sortBy,
    sortDir,
    dispatch,
    toast,
  ]);

  useEffect(() => {
    fetchCustomersList();
  }, [fetchCustomersList]);

  // Open Edit Modal
  const handleEditClick = (cust: Customer) => {
    setSelectedCustomer(cust);
    reset({
      name: cust.name,
      email: cust.email,
      phone: cust.phone || "",
      status: cust.status,
    });
    setEditModalOpen(true);
  };

  // Submit Edit Form
  const onSubmitEdit = async (data: {
    name: string;
    email: string;
    phone?: string;
    status: "active" | "suspended";
  }) => {
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    try {
      const updated = await updateCustomer(selectedCustomer.id, data);
      dispatch(updateCustomerInRedux(updated));
      toast.success(`Customer "${updated.name}" updated successfully.`);
      setEditModalOpen(false);
      fetchCustomersList();
    } catch (err: any) {
      console.error("Error updating customer:", err);
      toast.error(err.message || "Failed to update customer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Account Status (Active / Suspended)
  const handleToggleDisableStatus = async (cust: Customer) => {
    const nextStatus = cust.status === "active" ? "suspended" : "active";
    try {
      const res = await toggleCustomerStatus(cust.id, nextStatus);
      dispatch(
        updateCustomerStatusInRedux({
          id: cust.id,
          status: nextStatus,
        }),
      );
      toast.success(res.message || `Customer status set to ${nextStatus}.`);
      fetchCustomersList();
    } catch (err: any) {
      console.error("Error updating customer status:", err);
      toast.error(err.message || "Failed to change customer status.");
    }
  };

  // Open Delete Modal
  const handleDeleteClick = (cust: Customer) => {
    setSelectedCustomer(cust);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await deleteCustomer(selectedCustomer.id);
      dispatch(deleteCustomerInRedux(selectedCustomer.id));
      toast.success(res.message || "Customer deleted successfully.");
      setDeleteDialogOpen(false);
      fetchCustomersList();
    } catch (err: any) {
      console.error("Error deleting customer:", err);
      toast.error(err.message || "Failed to delete customer.");
    }
  };

  const handleSort = (key: keyof Customer, direction: "asc" | "desc") => {
    setSortBy(key);
    setSortDir(direction);
    setCurrentPage(1);
  };

  const columns: Column<Customer>[] = [
    {
      key: "name",
      label: "Customer Info",
      render: (_, cust) => (
        <div className="flex items-center gap-3">
          <Avatar name={cust.name} src={cust.avatar} size="sm" />
          <div>
            <p className="font-bold text-text-custom">{cust.name}</p>
            <p className="text-3xs text-text-custom/50 font-medium">
              {cust.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone number",
      render: (val) => (
        <span className="text-text-custom/80">{val || "—"}</span>
      ),
    },
    {
      key: "status",
      label: "Account Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "ordersCount",
      label: "Orders Count",
      render: (val) => <span className="font-semibold">{val} orders</span>,
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      render: (val) => (
        <span className="font-bold text-text-custom">
          ${Number(val || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: "dateJoined",
      label: "Joined Date",
      render: (val) => (
        <span suppressHydrationWarning>
          {val ? new Date(val).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, cust) => (
        <ActionMenu
          items={[
            {
              label: "View Detailed Profile",
              icon: <Eye className="w-3.5 h-3.5" />,
              onClick: () => router.push(`/admin/customers/${cust.id}`),
            },
            {
              label: "Edit Info",
              icon: <Edit className="w-3.5 h-3.5" />,
              onClick: () => handleEditClick(cust),
            },
            {
              label:
                cust.status === "active" ? "Disable Account" : "Enable Account",
              icon:
                cust.status === "active" ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5" />
                ),
              onClick: () => handleToggleDisableStatus(cust),
            },
            {
              label: "Delete Customer",
              icon: <Trash className="w-3.5 h-3.5" />,
              onClick: () => handleDeleteClick(cust),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[{ label: "Customers", href: "/admin/customers" }]}
          />
          <h1 className="text-2xl font-bold text-text-custom mt-1">
            Customer Accounts
          </h1>
          <p className="text-xs text-text-custom/60 mt-0.5">
            Total {totalItems} customer{totalItems === 1 ? "" : "s"} registered
          </p>
        </div>
      </div>

      {/* Control Area */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onSearchChange={(val) => {
                  setSearchTerm(val);
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
                  label="Filter by Status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "suspended", label: "Suspended" },
                  ]}
                />
              </Filters>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-text-custom/60">
                Loading customers...
              </p>
            </div>
          ) : customersList.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base font-semibold text-text-custom">
                No customer accounts found
              </p>
              <p className="text-xs text-text-custom/50 mt-1">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or clearing filters."
                  : "Normal users who register or place orders will appear here automatically."}
              </p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={customersList}
                onSort={handleSort}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </Card>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Customer Profile"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={() => {
                void handleSubmit(onSubmitEdit)();
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Full Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />
          <Input
            label="Email Address"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <Input label="Phone Number" {...register("phone")} />
          <Select
            label="Account Status"
            {...register("status")}
            options={[
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
            ]}
          />
        </form>
      </Modal>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedCustomer?.name}
        title="Delete Customer Account"
      />
    </div>
  );
}
