"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Download,
  Edit,
  Eye,
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { type Customer } from "@/types/admin";

export default function CustomersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.admin.customers);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<keyof Customer>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // CRUD & Modals State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Customer>();

  const handleEditClick = (cust: Customer) => {
    setSelectedCustomer(cust);
    reset(cust);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (cust: Customer) => {
    setSelectedCustomer(cust);
    setDeleteDialogOpen(true);
  };

  const handleToggleDisableStatus = (cust: Customer) => {
    alert(
      `Status updated: Customer "${cust.name}" is now ${cust.status === "active" ? "suspended" : "activated"}.`,
    );
  };

  const onSubmitEdit = (data: Customer) => {
    alert(`Profile updated successfully for customer: ${data.name}`);
    setEditModalOpen(false);
  };

  const confirmDelete = () => {
    alert(`Deleted Customer: ${selectedCustomer?.name}`);
    setDeleteDialogOpen(false);
  };

  const handleExport = () => {
    alert(
      "Exporting customer registry as CSV document. The download will start shortly.",
    );
  };

  // Filter, Sort & Paginate
  const filteredCustomers = customers
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const valA = a[sortBy] ?? "";
      const valB = b[sortBy] ?? "";

      if (typeof valA === "string") {
        return sortDir === "asc"
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(valA);
      } else {
        return sortDir === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (key: keyof Customer, direction: "asc" | "desc") => {
    setSortBy(key);
    setSortDir(direction);
  };

  const columns: Column<Customer>[] = [
    {
      key: "name",
      label: "Customer Info",
      sortable: true,
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
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "ordersCount",
      label: "Orders Count",
      sortable: true,
      render: (val) => <span className="font-semibold">{val} orders</span>,
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      sortable: true,
      render: (val) => (
        <span className="font-bold text-text-custom">
          ${Number(val).toFixed(2)}
        </span>
      ),
    },
    {
      key: "dateJoined",
      label: "Joined Date",
      sortable: true,
      render: (val) => (
        <span suppressHydrationWarning>
          {new Date(val).toLocaleDateString()}
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
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export registry
        </Button>
      </div>

      {/* Control Area */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search
                placeholder="Search customers by name or email..."
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

          <DataTable
            columns={columns}
            data={paginatedCustomers}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Customer Profile"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmitEdit)}>
              Save Changes
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
