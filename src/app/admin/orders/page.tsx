"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye } from "lucide-react";

import {
  ActionMenu,
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  Filters,
  Pagination,
  Search,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addActivityLog,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/redux/slices/admin-slice";
import { type Order } from "@/types/admin";

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.admin.orders);

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
    dispatch(
      addActivityLog({
        user: "Admin Sarah",
        action: `Changed shipment state of ${orderId} to ${status}`,
        module: "Orders",
        status: "success",
      }),
    );
  };

  const handlePaymentChange = (
    orderId: string,
    paymentStatus: Order["paymentStatus"],
  ) => {
    dispatch(updateOrderPaymentStatus({ id: orderId, paymentStatus }));
    dispatch(
      addActivityLog({
        user: "Admin Sarah",
        action: `Changed settlement status of ${orderId} to ${paymentStatus}`,
        module: "Orders",
        status: "success",
      }),
    );
  };

  const handleExport = () => {
    alert(
      "Exporting order transactions ledger as CSV. The download will start shortly.",
    );
  };

  // Filter & Paginate
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchPayment =
      paymentFilter === "all" || o.paymentStatus === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (val) => (
        <span className="font-bold text-text-custom font-mono">{val}</span>
      ),
    },
    {
      key: "customerName",
      label: "Customer Details",
      render: (_, o) => (
        <div>
          <p className="font-bold text-text-custom">{o.customerName}</p>
          <p className="text-3xs text-text-custom/50 font-medium">{o.email}</p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Order Date",
      render: (val) => (
        <span suppressHydrationWarning>
          {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "total",
      label: "Revenue total",
      render: (val) => (
        <span className="font-bold text-text-custom">
          ${Number(val).toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Shipment status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, o) => (
        <ActionMenu
          items={[
            {
              label: "View Order details",
              icon: <Eye className="w-3.5 h-3.5" />,
              onClick: () => router.push(`/admin/orders/${o.id}`),
            },
            {
              label: "Mark as Processing",
              onClick: () => handleStatusChange(o.id, "processing"),
            },
            {
              label: "Mark as Shipped",
              onClick: () => handleStatusChange(o.id, "shipped"),
            },
            {
              label: "Mark as Delivered",
              onClick: () => handleStatusChange(o.id, "delivered"),
            },
            {
              label: "Cancel Order",
              onClick: () => handleStatusChange(o.id, "cancelled"),
              variant: "danger",
            },
            {
              label: "Mark Paid",
              onClick: () => handlePaymentChange(o.id, "paid"),
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
          <Breadcrumb items={[{ label: "Orders", href: "/admin/orders" }]} />
          <h1 className="text-2xl font-bold text-text-custom mt-1">
            Orders Registry
          </h1>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export ledger
        </Button>
      </div>

      {/* Main card list */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search
                placeholder="Search orders by ID or customer..."
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
                  setPaymentFilter("all");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                <Select
                  label="Shipping Status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "all", label: "All Shipments" },
                    { value: "pending", label: "Pending" },
                    { value: "processing", label: "Processing" },
                    { value: "shipped", label: "Shipped" },
                    { value: "delivered", label: "Delivered" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                />
                <Select
                  label="Payment Status"
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "all", label: "All Payments" },
                    { value: "paid", label: "Paid" },
                    { value: "unpaid", label: "Unpaid" },
                    { value: "refunded", label: "Refunded" },
                  ]}
                />
              </Filters>
            </div>
          </div>

          <DataTable columns={columns} data={paginatedOrders} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  );
}
