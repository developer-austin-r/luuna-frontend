"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Trash, UserPlus } from "lucide-react";


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
} from "@/components/admin";
import { useToast } from "@/providers/toast-provider";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface User {
  id: string;
  name: string | null;
  email: string;
  roleId: string | null;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
}

interface EditUserFormData {
  name: string;
  email: string;
}

export default function UsersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof User>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<User | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateUserFormData>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditUserFormData>();

  const { success: toastSuccess, error: toastError } = useToast();

  // ==============================
  // GET USERS
  // ==============================
  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/users`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();

      setCustomers(result.data ?? []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load users";

      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getUsers();
  }, []);

  // ==============================
  // CREATE USER
  // ==============================
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
      resetCreate();

      toastSuccess(`User "${data.name}" created successfully.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";

      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // EDIT USER
  // ==============================
  const handleEditClick = (customer: User) => {
    setSelectedCustomer(customer);

    resetEdit({
      name: customer.name ?? "",
      email: customer.email,
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
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update user response:", errorText);
        throw new Error("Failed to update user");
      }

      const result = await response.json();
      const updatedUser: User = result.data;

      // Update the table immediately
      setCustomers((current) =>
        current.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      setEditModalOpen(false);
      setSelectedCustomer(null);
      resetEdit();

      toastSuccess(`User "${data.name}" updated successfully.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user";

      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE USER
  // ==============================
  const handleDeleteClick = (customer: User) => {
    setSelectedCustomer(customer);
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
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete user response:", errorText);
        throw new Error("Failed to delete user");
      }

      const deletedUserName =
        selectedCustomer.name ?? selectedCustomer.email;

      setCustomers((current) =>
        current.filter((user) => user.id !== selectedCustomer.id)
      );

      setDeleteDialogOpen(false);
      setSelectedCustomer(null);

      toastSuccess(
        `User "${deletedUserName}" deleted successfully.`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user";

      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // SEARCH + SORT
  // ==============================
  const filteredCustomers = customers
    .filter((customer) => {
      const search = searchTerm.toLowerCase().trim();

      if (!search) return true;

      return (
        (customer.name ?? "").toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        (customer.roleName ?? "").toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const valueA = a[sortBy] ?? "";
      const valueB = b[sortBy] ?? "";

      const stringA = String(valueA).toLowerCase();
      const stringB = String(valueB).toLowerCase();

      return sortDir === "asc"
        ? stringA.localeCompare(stringB)
        : stringB.localeCompare(stringA);
    });

  // ==============================
  // PAGINATION
  // ==============================
  const totalPages =
    Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (
    key: keyof User,
    direction: "asc" | "desc"
  ) => {
    setSortBy(key);
    setSortDir(direction);
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_, customer) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={customer.name ?? customer.email}
            size="sm"
          />

          <div>
            <p className="font-bold text-text-custom">
              {customer.name || "No name"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <span className="text-text-custom/80">
          {value || "—"}
        </span>
      ),
    },
    {
      key: "roleName",
      label: "Role",
      sortable: true,
      render: (_, customer) => (
        <span className="text-text-custom/80">
          {customer.roleName || "No Role"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Updated Date",
      sortable: true,
      render: (value) => (
        <span suppressHydrationWarning>
          {value
            ? new Date(value).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      key: "actions" as keyof User,
      label: "Actions",
      render: (_, customer) => (
        <ActionMenu
          items={[
            {
              label: "Edit Info",
              icon: <Edit className="w-3.5 h-3.5" />,
              onClick: () => handleEditClick(customer),
            },
            {
              label: "Delete Customer",
              icon: <Trash className="w-3.5 h-3.5" />,
              onClick: () => handleDeleteClick(customer),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  // ==============================
  // UI
  // ==============================
  return (
    <div className="space-y-6">
      {/* Header */}
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

      <Card>
        {loading && (
          <div className="text-sm text-text-custom/50 mb-4">
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
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create User"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={loading}
              onClick={() => {
                void handleSubmitCreate(onSubmitCreate)();
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
                message: "Password must be at least 6 characters",
              },
            })}
            error={createErrors.password?.message}
          />
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCustomer(null);
          resetEdit();
        }}
        title="Edit User"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedCustomer(null);
                resetEdit();
              }}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={loading}
              onClick={() => {
                void handleSubmitEdit(onSubmitEdit)();
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
        </form>
      </Modal>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={() => void confirmDelete()}
        itemName={
          selectedCustomer?.name ?? selectedCustomer?.email
        }
        title="Delete User Account"
      />
    </div>
  );
}