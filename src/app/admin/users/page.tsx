"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Eye, EyeOff, Mail, Trash, UserPlus } from "lucide-react";

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

// ========================================
// TYPES
// ========================================

interface User {
  id: string;
  name: string | null;
  email: string;
  roleId: string | null;
  roleName: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

interface EditUserFormData {
  name: string;
  email: string;
}

type UserTab = "Admin" | "User";

// ========================================
// COMPONENT
// ========================================

export default function UsersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<UserTab>("Admin");

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState<keyof User>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalUsers, setTotalUsers] = useState(0);

  const itemsPerPage = 5;

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // ========================================
  // PASSWORD VISIBILITY
  // ========================================

  const [showPassword, setShowPassword] = useState(false);

  // ========================================
  // CREATE FORM
  // ========================================

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateUserFormData>();

  // ========================================
  // EDIT FORM
  // ========================================

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditUserFormData>();

  const { success: toastSuccess, error: toastError } = useToast();

  const ROLE_IDS = {
    ADMIN: "00000000-0000-0000-0000-000000000001",
    USER: "00000000-0000-0000-0000-000000000002",
  } as const;

  // ========================================
  // GET USERS
  // ========================================

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", currentPage.toString());
      params.set("limit", itemsPerPage.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      params.set("role", activeTab);
      params.set("sortBy", sortBy);
      params.set("sortDir", sortDir);

      const url = `${API_BASE}/users?${params.toString()}`;

      console.log("GET USERS URL:", url);

      const response = await fetch(url);

      const result = await response.json();

      console.log("GET USERS STATUS:", response.status);

      console.log("GET USERS RESPONSE:", result);

      if (!response.ok) {
        throw new Error(
          result?.message || `Failed to fetch users (${response.status})`,
        );
      }

      const users = result?.data?.data ?? [];

      const pagination = result?.data?.pagination ?? {};

      setCustomers(Array.isArray(users) ? users : []);

      setTotalPages(pagination.totalPages ?? 1);

      setTotalUsers(pagination.total ?? 0);
    } catch (error) {
      console.error("GET USERS ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Failed to load users";

      toastError(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, activeTab, sortBy, sortDir, toastError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void getUsers();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [getUsers]);

  // ========================================
  // TAB CHANGE
  // ========================================

  const handleTabChange = (tab: UserTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // ========================================
  // CREATE USER
  // ========================================

  const openCreateModal = () => {
    resetCreate({
      name: "",
      email: "",
      password: "",
      roleId: ROLE_IDS.ADMIN,
    });

    // Reset password visibility
    setShowPassword(false);

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
          roleId: data.roleId,
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

      // Reset password visibility
      setShowPassword(false);

      toastSuccess(`User "${data.name}" created successfully.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";

      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // EDIT USER
  // ========================================

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

      const response = await fetch(`${API_BASE}/users/${selectedCustomer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Update user response:", errorText);

        throw new Error("Failed to update user");
      }

      const result = await response.json();

      const updatedUser: User = result.data;

      setCustomers((current) =>
        current.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
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

  // ========================================
  // DELETE USER
  // ========================================

  const handleDeleteClick = (customer: User) => {
    setSelectedCustomer(customer);

    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/users/${selectedCustomer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Delete user response:", errorText);

        throw new Error("Failed to delete user");
      }

      const deletedUserName = selectedCustomer.name ?? selectedCustomer.email;

      setCustomers((current) =>
        current.filter((user) => user.id !== selectedCustomer.id),
      );

      setDeleteDialogOpen(false);

      setSelectedCustomer(null);

      toastSuccess(`User "${deletedUserName}" deleted successfully.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user";

      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SORT
  // ========================================

  const handleSort = (key: keyof User, direction: "asc" | "desc") => {
    setSortBy(key);
    setSortDir(direction);
    setCurrentPage(1);
  };

  // ========================================
  // RESEND EMAIL
  // ========================================

  const handleResendVerification = async (user: User) => {
    if (user.emailVerified) {
      toastError("This email is already verified.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/users/${user.id}/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to resend verification email",
        );
      }

      toastSuccess(`Verification email sent to ${user.email}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend verification email";

      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // TABLE COLUMNS
  // ========================================

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,

      render: (_, customer) => (
        <div className="flex items-center gap-3">
          <Avatar name={customer.name ?? customer.email} size="sm" />

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
        <span className="text-text-custom/80">{value || "—"}</span>
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
      key: "status",
      label: "Status",
      sortable: true,

      render: (value) => (
        <span
          className={
            value === "ACTIVE"
              ? "inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700"
              : "inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700"
          }
        >
          {value || "—"}
        </span>
      ),
    },

    {
      key: "emailVerified",
      label: "Email Verified",
      sortable: true,

      render: (value) => {
        const verified = value === true;

        return (
          <span
            className={
              verified
                ? "inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700"
                : "inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700"
            }
          >
            {verified ? "Verified" : "Not Verified"}
          </span>
        );
      },
    },

    {
      key: "updatedAt",
      label: "Updated Date",
      sortable: true,

      render: (value) => (
        <span suppressHydrationWarning>
          {value ? new Date(value).toLocaleDateString() : "—"}
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

            // Only show resend option when not verified
            ...(!customer.emailVerified
              ? [
                  {
                    label: "Resend Verification",
                    icon: <Mail className="w-3.5 h-3.5" />,
                    onClick: () => void handleResendVerification(customer),
                  },
                ]
              : []),

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

  // ========================================
  // UI
  // ========================================

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

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

          <h1 className="text-2xl font-bold text-text-custom mt-2">Users</h1>
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

      {/* ================= TABS ================= */}

      <div className="border-b border-gray-200">
        <div className="flex items-center gap-8">
          {/* ADMIN TAB */}

          <button
            type="button"
            onClick={() => handleTabChange("Admin")}
            className={`
              relative pb-3 text-sm font-semibold
              transition-colors
              ${
                activeTab === "Admin"
                  ? "text-text-custom"
                  : "text-text-custom/50 hover:text-text-custom"
              }
            `}
          >
            Admin
            {activeTab === "Admin" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-custom rounded-full" />
            )}
          </button>

          {/* BILLING USER TAB */}

          <button
            type="button"
            onClick={() => handleTabChange("User")}
            className={`
              relative pb-3 text-sm font-semibold
              transition-colors
              ${
                activeTab === "User"
                  ? "text-text-custom"
                  : "text-text-custom/50 hover:text-text-custom"
              }
            `}
          >
            Billing User
            {activeTab === "User" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-custom rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <Card>
        {loading && (
          <div className="text-sm text-text-custom/50 mb-4">Loading...</div>
        )}

        {/* SEARCH */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="text-sm text-text-custom/60">
            Total Users: {totalUsers}
          </div>
        </div>

        {/* TABLE */}

        <DataTable columns={columns} data={customers} onSort={handleSort} />

        {/* PAGINATION */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </Card>

      {/* ================= CREATE USER MODAL ================= */}

      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setShowPassword(false);
        }}
        title="Create User"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setShowPassword(false);
              }}
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
          {/* FULL NAME */}

          <Input
            label="Full Name"
            {...registerCreate("name", {
              required: "Name is required",
            })}
            error={createErrors.name?.message}
          />

          {/* EMAIL */}

          <Input
            label="Email Address"
            type="email"
            {...registerCreate("email", {
              required: "Email is required",
            })}
            error={createErrors.email?.message}
          />

          {/* PASSWORD WITH EYE ICON */}

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              {...registerCreate("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={createErrors.password?.message}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-[30px] flex items-center justify-center text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* ROLE */}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-custom">Role</label>

            <select
              {...registerCreate("roleId", {
                required: "Role is required",
              })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-text-custom outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            >
              <option value="">Select Role</option>

              <option value={ROLE_IDS.ADMIN}>Admin</option>

              <option value={ROLE_IDS.USER}>Billing User</option>
            </select>

            {createErrors.roleId?.message && (
              <p className="text-xs text-red-500">
                {createErrors.roleId.message}
              </p>
            )}
          </div>
        </form>
      </Modal>

      {/* ================= EDIT USER MODAL ================= */}

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

      {/* ================= DELETE DIALOG ================= */}

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={() => void confirmDelete()}
        itemName={selectedCustomer?.name ?? selectedCustomer?.email}
        title="Delete User Account"
      />
    </div>
  );
}
