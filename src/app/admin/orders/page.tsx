"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Compass, Download, Eye, MapPin, Truck } from "lucide-react";

import {
  ActionMenu,
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  Filters,
  Modal,
  Pagination,
  Search,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addActivityLog,
  updateOrderTracking,
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

  // Tracker Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDeliveryStatusChange = (
    orderId: string,
    deliveryStatus: Order["deliveryStatus"],
  ) => {
    dispatch(updateOrderTracking({ id: orderId, deliveryStatus }));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => {
        if (!prev) return null;
        const updated = { ...prev };
        if (deliveryStatus === undefined) {
          delete updated.deliveryStatus;
        } else {
          updated.deliveryStatus = deliveryStatus;
        }
        return updated;
      });
    }
    dispatch(
      addActivityLog({
        user: "Admin Sarah",
        action: `Set delivery status of order ${orderId} to "${deliveryStatus}"`,
        module: "Orders",
        status: "success",
      }),
    );
  };

  const handleViewTrackingTimeline = (order: Order) => {
    setSelectedOrder(order);
    setTrackerModalOpen(true);
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
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.trackingId &&
        o.trackingId.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const getMockTimeline = (status: Order["deliveryStatus"]) => {
    const defaultTimeline = [
      {
        event: "Label created and transit slip generated",
        date: "July 18, 09:12 AM",
        completed: true,
      },
      {
        event: "Package sorted at regional hub",
        date: "July 18, 04:30 PM",
        completed: status !== "pending" && status !== undefined,
      },
      {
        event: "In transit to destination facility",
        date: "July 19, 08:00 AM",
        completed:
          status === "in_transit" ||
          status === "out_for_delivery" ||
          status === "delivered",
      },
      {
        event: "Out for delivery with courier agent",
        date: "July 19, 11:30 AM",
        completed: status === "out_for_delivery" || status === "delivered",
      },
      {
        event: "Package delivered - Signed by recipient",
        date: "July 19, 02:45 PM",
        completed: status === "delivered",
      },
    ];
    return defaultTimeline;
  };

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
      key: "trackingId",
      label: "Tracking ID",
      render: (val) => (
        <span className="font-bold font-mono text-xs text-text-custom/80">
          {val || "N/A"}
        </span>
      ),
    },
    {
      key: "carrier",
      label: "Courier Carrier",
      render: (val) => (
        <span className="inline-flex items-center gap-1 font-semibold text-text-custom">
          <Truck className="w-3.5 h-3.5 text-primary" />
          {val || "N/A"}
        </span>
      ),
    },
    {
      key: "deliveryStatus",
      label: "Delivery Status",
      render: (val) => <StatusBadge status={val || "pending"} />,
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
              label: "View Tracking Timeline",
              icon: <Compass className="w-3.5 h-3.5" />,
              onClick: () => handleViewTrackingTimeline(o),
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
                placeholder="Search orders by ID, customer or tracking..."
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

      {/* Tracking Modal */}
      <Modal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        title={`Delivery Tracking: ${selectedOrder?.trackingId || "N/A"}`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setTrackerModalOpen(false)}
            >
              Close
            </Button>
            {selectedOrder && selectedOrder.deliveryStatus !== "delivered" && (
              <Button
                variant="primary"
                onClick={() =>
                  handleDeliveryStatusChange(selectedOrder.id, "delivered")
                }
              >
                Mark as Delivered
              </Button>
            )}
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-text-custom">
            {/* Courier Info Grid */}
            <div className="grid grid-cols-2 gap-4 bg-bg-secondary p-4 rounded-xl border border-border-custom">
              <div>
                <p className="text-3xs uppercase tracking-wider font-bold text-text-custom/50">
                  Shipping Carrier
                </p>
                <div className="flex items-center gap-1 mt-1 font-bold text-text-custom">
                  <Truck className="w-4 h-4 text-primary" />
                  {selectedOrder.carrier || "Not Assigned"}
                </div>
              </div>
              <div>
                <p className="text-3xs uppercase tracking-wider font-bold text-text-custom/50">
                  Shipping Method
                </p>
                <p className="mt-1 font-extrabold text-text-custom">
                  {selectedOrder.shippingMethod}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-text-custom">
                  Delivery Destination
                </p>
                <p className="text-text-custom/75 mt-0.5">
                  4582 Oakwood Ave, Los Angeles, CA 90004
                </p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="space-y-4">
              <p className="font-bold text-text-custom flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                Transit Tracking History
              </p>

              <div className="pl-4 ml-2 border-l border-border-custom space-y-5 relative">
                {getMockTimeline(selectedOrder.deliveryStatus).map(
                  (log, idx) => (
                    <div key={idx} className="relative pl-6">
                      {/* Circle Dot */}
                      <div
                        className={`absolute -left-[23px] top-0.5 w-3 h-3 rounded-full border-2 border-white shrink-0 ${
                          log.completed ? "bg-primary" : "bg-slate-200"
                        }`}
                      />
                      <div className="space-y-0.5">
                        <p
                          className={`font-semibold ${log.completed ? "text-text-custom" : "text-text-custom/40"}`}
                        >
                          {log.event}
                        </p>
                        {log.completed && (
                          <p className="text-3xs text-text-custom/40 font-semibold">
                            {log.date}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
