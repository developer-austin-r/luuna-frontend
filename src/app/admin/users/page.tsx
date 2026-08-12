"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Edit,
  Trash,
  UserPlus,
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
  Input,
  Modal,
  Pagination,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useToast } from "@/providers/toast-provider"

const API_BASE = "http://localhost:3001";


interface User {
  id: string;
  name: string | null;
  email: string;

  // Backend returns roleId and roleName directly
  roleId: string | null;
  roleName: string;

  createdAt: string;
  updatedAt: string;

  // Client-only fields
  phone?: string;
  status?: "active" | "suspended";
  avatar?: string;
}

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
}

interface EditUserFormData {
  name: string;
  email: string;
  phone?: string;
  status?: "active" | "suspended";
}


export default function UsersPage() {

  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  // =========================================================
  // Search & Filters State
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<keyof User>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // =========================================================
  // Pagination State
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // =========================================================
  // CRUD & Modals State
  // =========================================================

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // =========================================================
  // CREATE FORM
  // =========================================================

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateUserFormData>();

  // =========================================================
  // EDIT FORM
  // =========================================================

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditUserFormData>();

  // =========================================================
  // GET USERS — GET /users
  // =========================================================

  useEffect(() => {
    void getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/users`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();

      // Backend response:
      //
      // {
      //   statusCode: 200,
      //   timestamp: "...",
      //   path: "/users",
      //   data: [...]
      // }

      setCustomers(result.data ?? []);
    } catch (error: any) {
      toastError(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CREATE USER — POST /users
  // =========================================================

  const openCreateModal = () => {
    resetCreate({
      name: "",
      email: "",
      password: "",
    });

    setCreateModalOpen(true);
  };

  const onSubmitCreate = async (data: CreateUserFormData) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create user response:", errorText);
        throw new Error("Failed to create user");
      }

      const result = await response.json();

      const newUser: User = result.data;

      setCustomers((current) => [newUser, ...current]);

      setCreateModalOpen(false);

      toastSuccess(`User "${data.name}" created successfully.`);
    } catch (error: any) {
      toastError(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT USER — PATCH /users/:id
  // =========================================================

  const handleEditClick = (cust: User) => {
    setSelectedCustomer(cust);

    resetEdit({
      name: cust.name ?? "",
      email: cust.email,
      phone: cust.phone ?? "",
      status: cust.status ?? "active",
    });

    setEditModalOpen(true);
  };

  const onSubmitEdit = async (data: EditUserFormData) => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/users/${selectedCustomer.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Update user response:", errorText);

        throw new Error("Failed to update user");
      }

      const result = await response.json();

      const updatedUser: User = result.data;

      setEditModalOpen(false);
      setSelectedCustomer(null);

      toastSuccess(`User "${data.name}" updated successfully.`);
    } catch (error: any) {
      toastError(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE USER — DELETE /users/:id
  // =========================================================

  const handleDeleteClick = (cust: User) => {
    setSelectedCustomer(cust);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/users/${selectedCustomer.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Delete user response:", errorText);

        throw new Error("Failed to delete user");
      }

      setCustomers((current) =>
        current.filter(
          (user) => user.id !== selectedCustomer.id,
        ),
      );

      setDeleteDialogOpen(false);
      setSelectedCustomer(null);

      toastSuccess(`User "${selectedCustomer.name}" deleted successfully.`);
    } catch (error: any) {
      console.error("Delete user error:", error);
      toastError(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // FILTER, SORT & PAGINATE
  // =========================================================

  const filteredCustomers = customers
    .filter((c) => {
      const matchSearch =
        (c.name ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        c.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (c.roleName ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (c.status ?? "active") === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const valA = a[sortBy] ?? "";
      const valB = b[sortBy] ?? "";

      if (typeof valA === "string") {
        return sortDir === "asc"
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(
            valA as string,
          );
      }

      return 0;
    });

  const totalPages =
    Math.ceil(
      filteredCustomers.length / itemsPerPage,
    ) || 1;

  const paginatedCustomers =
    filteredCustomers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );

  // =========================================================
  // SORT
  // =========================================================

  const handleSort = (
    key: keyof User,
    direction: "asc" | "desc",
  ) => {
    setSortBy(key);
    setSortDir(direction);
  };

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,

      render: (_, cust) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={cust.name ?? cust.email}
            src={cust.avatar}
            size="sm"
          />

          <div>
            <p className="font-bold text-text-custom">
              {cust.name || "No name"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "email",
      label: "Email",

      render: (val) => (
        <span className="text-text-custom/80">
          {val || "—"}
        </span>
      ),
    },

    // =========================================================
    // ACCOUNT STATUS + ROLE NAME
    // =========================================================

    {
      key: "status",
      label: "Account Status",
      sortable: true,
      render: (_, cust) => (
        <StatusBadge
          status={cust.roleName || "No Role"}
        />
      ),
    },

    {
      key: "updatedAt",
      label: "Updated Date",
      sortable: true,

      render: (val) => (
        <span suppressHydrationWarning>
          {val
            ? new Date(val).toLocaleDateString()
            : "—"}
        </span>
      ),
    },

    {
      key: "actions" as keyof User,
      label: "Actions",

      render: (_, cust) => (
        <ActionMenu
          items={[
            {
              label: "Edit Info",
              icon: (
                <Edit className="w-3.5 h-3.5" />
              ),
              onClick: () =>
                handleEditClick(cust),
            },

            {
              label: "Delete Customer",
              icon: (
                <Trash className="w-3.5 h-3.5" />
              ),
              onClick: () =>
                handleDeleteClick(cust),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          TITLE + TOP ACTIONS
          ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              {
                label: "Users",
                href: "/admin/users",
              },
            ]}
          />

          <h1 className="text-2xl font-bold text-text-custom mt-2">
            Users
          </h1>
        </div>

        <div className="flex gap-2 shrink-0 self-start sm:self-auto">
          <Button
            onClick={openCreateModal}
            variant="primary"
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />

            Add User
          </Button>
        </div>
      </div>

      {/* =====================================================
          CONTROL AREA
          ===================================================== */}

      <Card>
        <div className="space-y-4">

          {loading && (
            <div className="text-sm text-text-custom/50">
              Loading...
            </div>
          )}

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

      {/* =====================================================
          CREATE USER MODAL
          ===================================================== */}

      <Modal
        isOpen={createModalOpen}
        onClose={() =>
          setCreateModalOpen(false)
        }
        title="Create User"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() =>
                setCreateModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={loading}
              onClick={() => {
                void handleSubmitCreate(
                  onSubmitCreate,
                )();
              }}
            >
              Create User
            </Button>
          </>
        }
      >
        <form className="space-y-4">

          <Input
            label="Full Name"
            {...registerCreate("name", {
              required: "Name is required",
            })}
            error={createErrors.name?.message}
          />

          <Input
            label="Email Address"
            type="email"
            {...registerCreate("email", {
              required: "Email is required",
            })}
            error={createErrors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            {...registerCreate("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message:
                  "Password must be at least 6 characters",
              },
            })}
            error={
              createErrors.password?.message
            }
          />

        </form>
      </Modal>

      {/* =====================================================
          EDIT USER MODAL
          ===================================================== */}

      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        title="Edit Customer Profile"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedCustomer(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={loading}
              onClick={() => {
                void handleSubmitEdit(
                  onSubmitEdit,
                )();
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <form className="space-y-4">

          <Input
            label="Full Name"
            {...registerEdit("name", {
              required: "Name is required",
            })}
            error={editErrors.name?.message}
          />

          <Input
            label="Email Address"
            type="email"
            {...registerEdit("email", {
              required: "Email is required",
            })}
            error={editErrors.email?.message}
          />

          <Input
            label="Phone Number"
            {...registerEdit("phone")}
          />

          <Select
            label="Account Status"
            {...registerEdit("status")}
            options={[
              {
                value: "active",
                label: "Active",
              },
              {
                value: "suspended",
                label: "Suspended",
              },
            ]}
          />

        </form>
      </Modal>

      {/* =====================================================
          DELETE DIALOG
          ===================================================== */}

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() =>
          setDeleteDialogOpen(false)
        }
        onConfirm={() => void confirmDelete()}
        itemName={
          selectedCustomer?.name ??
          selectedCustomer?.email
        }
        title="Delete Customer Account"
      />

    </div>
  );
}