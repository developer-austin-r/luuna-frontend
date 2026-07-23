"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Clock, Compass, Edit, MapPin, Plus, Trash, Truck } from "lucide-react";

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
  Search,
  Select,
  StatusBadge,
  Tabs,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addActivityLog,
  addShippingMethod,
  deleteShippingMethod,
  updateShippingMethod,
} from "@/redux/slices/admin-slice";
import { type ShippingMethod } from "@/types/admin";

interface DeliveryShipment {
  id: string;
  orderId: string;
  customerName: string;
  carrier: string;
  trackingId: string;
  rate: number;
  address: string;
  status:
    "pending" | "in_transit" | "out_for_delivery" | "delivered" | "returned";
}

export default function ShippingPage() {
  const dispatch = useAppDispatch();
  const methods = useAppSelector((state) => state.admin.shippingMethods);

  // Tab State: 'tracker' (Live shipments) or 'methods' (Rate configuration)
  const [activeTab, setActiveTab] = useState("tracker");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal / CRUD state for Shipping Methods
  const [isAddMode, setIsAddMode] = useState(true);
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Shipment Detail Modal State
  const [selectedShipment, setSelectedShipment] =
    useState<DeliveryShipment | null>(null);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);

  // Form Hook for Shipping Methods
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<ShippingMethod, "id">>();

  // Initial Mock Shipments
  const initialShipments: DeliveryShipment[] = [
    {
      id: "shp-1",
      orderId: "ORD-9832",
      customerName: "Emma Watson",
      carrier: "FedEx Express",
      trackingId: "TRK-FDX-902834",
      rate: 14.99,
      address: "4582 Oakwood Ave, Los Angeles, CA 90004",
      status: "delivered",
    },
    {
      id: "shp-2",
      orderId: "ORD-9833",
      customerName: "Liam Neeson",
      carrier: "DHL eCommerce",
      trackingId: "TRK-DHL-109283",
      rate: 5.99,
      address: "782 Melrose Ave, West Hollywood, CA 90046",
      status: "in_transit",
    },
    {
      id: "shp-3",
      orderId: "ORD-9835",
      customerName: "Diana Prince",
      carrier: "UPS Premium",
      trackingId: "TRK-UPS-773829",
      rate: 29.99,
      address: "1210 Sunset Blvd, Beverly Hills, CA 90210",
      status: "out_for_delivery",
    },
    {
      id: "shp-4",
      orderId: "ORD-9834",
      customerName: "Bruce Wayne",
      carrier: "DHL eCommerce",
      trackingId: "TRK-DHL-552438",
      rate: 5.99,
      address: "1007 Mountain Drive, Gotham, NJ 07001",
      status: "pending",
    },
  ];

  const [shipments, setShipments] =
    useState<DeliveryShipment[]>(initialShipments);

  // Methods Handlers
  const handleAddMethodClick = () => {
    setIsAddMode(true);
    reset({
      name: "",
      carrier: "",
      rate: 0,
      minDays: 1,
      maxDays: 3,
      status: "active",
    });
    setMethodModalOpen(true);
  };

  const handleEditMethodClick = (ship: ShippingMethod) => {
    setIsAddMode(false);
    setSelectedMethod(ship);
    reset(ship);
    setMethodModalOpen(true);
  };

  const handleDeleteMethodClick = (ship: ShippingMethod) => {
    setSelectedMethod(ship);
    setDeleteDialogOpen(true);
  };

  const onSubmitMethod = (data: any) => {
    if (isAddMode) {
      dispatch(addShippingMethod(data));
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Added new shipping method: ${data.name}`,
          module: "Shipping",
          status: "success",
        }),
      );
    } else if (selectedMethod) {
      dispatch(updateShippingMethod({ ...data, id: selectedMethod.id }));
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Updated shipping courier settings for: ${data.name}`,
          module: "Shipping",
          status: "success",
        }),
      );
    }
    setMethodModalOpen(false);
  };

  const confirmDeleteMethod = () => {
    if (selectedMethod) {
      dispatch(deleteShippingMethod(selectedMethod.id));
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Removed shipping method: ${selectedMethod.name}`,
          module: "Shipping",
          status: "success",
        }),
      );
    }
    setDeleteDialogOpen(false);
  };

  // Shipment Tracker View Details Handler
  const handleViewShipmentDetails = (shp: DeliveryShipment) => {
    setSelectedShipment(shp);
    setTrackerModalOpen(true);
  };

  // Status progression for Tracker
  const handleShipmentStatusChange = (
    shpId: string,
    status: DeliveryShipment["status"],
  ) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === shpId ? { ...s, status } : s)),
    );
    if (selectedShipment && selectedShipment.id === shpId) {
      setSelectedShipment({ ...selectedShipment, status });
    }
    dispatch(
      addActivityLog({
        user: "Admin Sarah",
        action: `Set delivery status of shipment ${shpId} to "${status}"`,
        module: "Shipping",
        status: "success",
      }),
    );
  };

  // Filter Live Shipments
  const filteredShipments = shipments.filter((s) => {
    const matchSearch =
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Filter Shipping Methods
  const filteredMethods = methods.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Columns: Shipments Tracker
  const shipmentColumns: Column<DeliveryShipment>[] = [
    {
      key: "trackingId",
      label: "Tracking ID",
      render: (val, item) => (
        <div>
          <span className="font-bold font-mono text-xs">{val}</span>
          <p className="text-3xs text-text-custom/50 font-bold uppercase tracking-wider">
            Order: {item.orderId}
          </p>
        </div>
      ),
    },
    {
      key: "customerName",
      label: "Recipient",
      render: (val) => (
        <span className="font-bold text-text-custom">{val}</span>
      ),
    },
    {
      key: "carrier",
      label: "Courier Carrier",
      render: (val) => (
        <span className="inline-flex items-center gap-1 font-semibold text-text-custom">
          <Truck className="w-3.5 h-3.5 text-primary" />
          {val}
        </span>
      ),
    },
    {
      key: "address",
      label: "Destination Address",
      render: (val) => (
        <span className="text-text-custom/75 line-clamp-1">{val}</span>
      ),
    },
    {
      key: "status",
      label: "Delivery Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, shp) => (
        <ActionMenu
          items={[
            {
              label: "View Tracking Timeline",
              icon: <Compass className="w-3.5 h-3.5" />,
              onClick: () => handleViewShipmentDetails(shp),
            },
            {
              label: "Mark In Transit",
              onClick: () => handleShipmentStatusChange(shp.id, "in_transit"),
            },
            {
              label: "Mark Out for Delivery",
              onClick: () =>
                handleShipmentStatusChange(shp.id, "out_for_delivery"),
            },
            {
              label: "Mark Delivered",
              onClick: () => handleShipmentStatusChange(shp.id, "delivered"),
            },
            {
              label: "Return Package",
              onClick: () => handleShipmentStatusChange(shp.id, "returned"),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  // Columns: Config Methods
  const methodColumns: Column<ShippingMethod>[] = [
    {
      key: "name",
      label: "Option Name",
      render: (_, m) => (
        <div>
          <span className="font-bold text-text-custom">{m.name}</span>
          <p className="text-3xs text-text-custom/50 uppercase tracking-widest font-bold">
            Carrier: {m.carrier}
          </p>
        </div>
      ),
    },
    {
      key: "rate",
      label: "Flat Delivery Rate",
      render: (val) => (
        <span className="font-bold text-text-custom">
          ${Number(val).toFixed(2)}
        </span>
      ),
    },
    {
      key: "minDays",
      label: "Transit Timelines",
      render: (_, m) => (
        <span className="text-text-custom/70">
          {m.minDays} to {m.maxDays} Business Days
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
      render: (_, m) => (
        <ActionMenu
          items={[
            {
              label: "Edit Rule",
              icon: <Edit className="w-3.5 h-3.5" />,
              onClick: () => handleEditMethodClick(m),
            },
            {
              label: "Delete Rule",
              icon: <Trash className="w-3.5 h-3.5" />,
              onClick: () => handleDeleteMethodClick(m),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  // Mock tracking logs based on status
  const getMockTimeline = (status: DeliveryShipment["status"]) => {
    const defaultTimeline = [
      {
        event: "Label created and transit slip generated",
        date: "July 18, 09:12 AM",
        completed: true,
      },
      {
        event: "Package sorted at regional hub",
        date: "July 18, 04:30 PM",
        completed: status !== "pending",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[{ label: "Shipping", href: "/admin/shipping" }]}
          />
          <h1 className="text-2xl font-bold text-text-custom mt-1">
            Shipping & Deliveries
          </h1>
        </div>

        {/* Tab Selection */}
        <div className="w-full sm:w-auto shrink-0">
          <Tabs
            tabs={[
              { id: "tracker", label: "Live Shipments Tracker" },
              { id: "methods", label: "Shipping Rates Configuration" },
            ]}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setSearchTerm("");
              setStatusFilter("all");
            }}
          />
        </div>
      </div>

      {/* Main card list */}
      <Card
        title={
          activeTab === "tracker"
            ? "Live Shipments Audit Ledger"
            : "Flat rate shipping rules"
        }
        extra={
          activeTab === "methods" && (
            <Button
              onClick={handleAddMethodClick}
              className="flex items-center gap-1.5 text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Option
            </Button>
          )
        }
      >
        <div className="space-y-4 mt-2">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search
                placeholder={
                  activeTab === "tracker"
                    ? "Search tracking ID or recipient..."
                    : "Search rates/carriers..."
                }
                onSearchChange={setSearchTerm}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Filters
                onClearFilters={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
              >
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={
                    activeTab === "tracker"
                      ? [
                          { value: "all", label: "All Shipments" },
                          { value: "pending", label: "Pending" },
                          { value: "in_transit", label: "In Transit" },
                          {
                            value: "out_for_delivery",
                            label: "Out for Delivery",
                          },
                          { value: "delivered", label: "Delivered" },
                          { value: "returned", label: "Returned" },
                        ]
                      : [
                          { value: "all", label: "All Statuses" },
                          { value: "active", label: "Active Options" },
                          { value: "inactive", label: "Inactive Options" },
                        ]
                  }
                />
              </Filters>
            </div>
          </div>

          {activeTab === "tracker" ? (
            <DataTable columns={shipmentColumns} data={filteredShipments} />
          ) : (
            <DataTable columns={methodColumns} data={filteredMethods} />
          )}
        </div>
      </Card>

      {/* Shipment Tracker Drawer Modal */}
      <Modal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        title={`Delivery Tracking: ${selectedShipment?.trackingId || ""}`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setTrackerModalOpen(false)}
            >
              Close
            </Button>
            {selectedShipment && selectedShipment.status !== "delivered" && (
              <Button
                variant="primary"
                onClick={() =>
                  handleShipmentStatusChange(selectedShipment.id, "delivered")
                }
              >
                Mark as Delivered
              </Button>
            )}
          </>
        }
      >
        {selectedShipment && (
          <div className="space-y-6 text-xs text-text-custom">
            {/* Courier Info Grid */}
            <div className="grid grid-cols-2 gap-4 bg-bg-secondary p-4 rounded-xl border border-border-custom">
              <div>
                <p className="text-3xs uppercase tracking-wider font-bold text-text-custom/50">
                  Shipping Carrier
                </p>
                <div className="flex items-center gap-1 mt-1 font-bold text-text-custom">
                  <Truck className="w-4 h-4 text-primary" />
                  {selectedShipment.carrier}
                </div>
              </div>
              <div>
                <p className="text-3xs uppercase tracking-wider font-bold text-text-custom/50">
                  Flat rate Charged
                </p>
                <p className="mt-1 font-extrabold text-text-custom">
                  ${selectedShipment.rate.toFixed(2)}
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
                  {selectedShipment.address}
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
                {getMockTimeline(selectedShipment.status).map((log, idx) => (
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
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Shipping Method Rate configuration Modal */}
      <Modal
        isOpen={methodModalOpen}
        onClose={() => setMethodModalOpen(false)}
        title={isAddMode ? "Add Shipping Provider" : "Modify Transit Rates"}
        footer={
          <>
            <Button variant="outline" onClick={() => setMethodModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmitMethod)}>
              {isAddMode ? "Create Method" : "Save Changes"}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Shipping Option Label"
              {...register("name", { required: "Name is required" })}
              error={errors.name?.message}
              placeholder="e.g. Standard Ground Shipping"
            />
          </div>
          <Input
            label="Carrier Code / Company"
            {...register("carrier", { required: "Carrier name is required" })}
            error={errors.carrier?.message}
            placeholder="e.g. FedEx, UPS"
          />
          <Input
            label="Flat Delivery Rate ($)"
            type="number"
            step="0.01"
            {...register("rate", {
              valueAsNumber: true,
              required: "Rate is required",
            })}
            error={errors.rate?.message}
          />
          <Input
            label="Min Delivery Days"
            type="number"
            {...register("minDays", {
              valueAsNumber: true,
              required: "Min days is required",
            })}
            error={errors.minDays?.message}
          />
          <Input
            label="Max Delivery Days"
            type="number"
            {...register("maxDays", {
              valueAsNumber: true,
              required: "Max days is required",
            })}
            error={errors.maxDays?.message}
          />
          <div className="sm:col-span-2">
            <Select
              label="Transit Option Status"
              {...register("status")}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* Method Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteMethod}
        itemName={selectedMethod?.name}
        title="Remove Shipping Method"
      />
    </div>
  );
}
