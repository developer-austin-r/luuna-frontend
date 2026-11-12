"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";

import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  StatusBadge,
  Tabs,
} from "@/components/admin";
import { useToast } from "@/providers/toast-provider";
import { type DetailedCustomer, getCustomerById } from "@/services/customer";
import { type Order } from "@/types/admin";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params.id as string;

  const [customer, setCustomer] = useState<DetailedCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getCustomerById(id);
        setCustomer(data);
      } catch (err: any) {
        console.error("Failed to load customer details:", err);
        toast.error(err.message || "Failed to load customer profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Customers", href: "/admin/customers" },
            { label: "Loading..." },
          ]}
        />
        <Card className="text-center py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-text-custom/60">
            Loading customer profile...
          </p>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Customers", href: "/admin/customers" },
            { label: "Not Found" },
          ]}
        />
        <Card className="text-center py-12">
          <p className="text-sm font-semibold text-text-custom/60">
            Customer profile not found.
          </p>
          <Button
            onClick={() => router.push("/admin/customers")}
            className="mt-4"
          >
            Back to Customer Registry
          </Button>
        </Card>
      </div>
    );
  }

  const customerOrders: Order[] = customer.orders || [];

  const address = customer.address || {
    shipping: {
      street: "Not specified",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    billing: {
      street: "Not specified",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
  };

  const timeline = customer.activityLogs?.length
    ? customer.activityLogs.map((act) => ({
        id: act.id,
        event: act.event,
        date: act.date,
        icon: <ShoppingBag className="w-3.5 h-3.5" />,
      }))
    : [
        {
          id: "act-init",
          event: `Account registered (${customer.email})`,
          date: customer.dateJoined,
          icon: <Calendar className="w-3.5 h-3.5" />,
        },
      ];

  const orderColumns: Column<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (val) => <span className="font-bold font-mono">{val}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (val) => (
        <span suppressHydrationWarning>
          {val ? new Date(val).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total spent",
      render: (val) => (
        <span className="font-bold text-text-custom">
          ${Number(val || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Shipment Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button & header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/customers")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <Breadcrumb
              items={[
                { label: "Customers", href: "/admin/customers" },
                { label: customer.name },
              ]}
            />
            <h1 className="text-2xl font-bold text-text-custom mt-1">
              Customer Profile
            </h1>
          </div>
        </div>
        <span className="self-start sm:self-auto">
          <StatusBadge status={customer.status} />
        </span>
      </div>

      {/* Main Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Personal details & Address card */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar
                name={customer.name}
                src={customer.avatar}
                size="lg"
                className="border-3 border-primary/20 shadow-md"
              />
              <div>
                <h3 className="text-lg font-bold text-text-custom">
                  {customer.name}
                </h3>
                <span className="text-2xs text-text-custom/50 uppercase tracking-wide font-semibold">
                  User ID: {customer.id}
                </span>
              </div>

              <div className="w-full border-t border-border-custom pt-4 space-y-3 text-xs text-left">
                <div className="flex items-center gap-2 text-text-custom/85">
                  <Mail className="w-4 h-4 text-text-custom/40 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-text-custom/85">
                  <Phone className="w-4 h-4 text-text-custom/40 shrink-0" />
                  <span>{customer.phone || "No phone registered"}</span>
                </div>
                <div className="flex items-center gap-2 text-text-custom/85">
                  <Calendar className="w-4 h-4 text-text-custom/40 shrink-0" />
                  <span suppressHydrationWarning>
                    Joined {new Date(customer.dateJoined).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-text-custom/85 border-t border-border-custom/50 pt-3">
                  <CreditCard className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-bold text-text-custom">
                    Spent total: ${Number(customer.totalSpent || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping / Billing Address */}
          <Card title="Address Profiles">
            <div className="space-y-4 text-xs mt-2">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-text-custom mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Shipping Address
                </div>
                <div className="text-text-custom/75 leading-relaxed pl-5">
                  <p>{address.shipping.street}</p>
                  <p>
                    {[
                      address.shipping.city,
                      address.shipping.state,
                      address.shipping.zip,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{address.shipping.country}</p>
                </div>
              </div>

              <div className="border-t border-border-custom/50 pt-4">
                <div className="flex items-center gap-1.5 font-bold text-text-custom mb-1">
                  <MapPin className="w-3.5 h-3.5 text-text-custom/45" />
                  Billing Address
                </div>
                <div className="text-text-custom/75 leading-relaxed pl-5">
                  <p>{address.billing.street}</p>
                  <p>
                    {[
                      address.billing.city,
                      address.billing.state,
                      address.billing.zip,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{address.billing.country}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Interactive Tabs for History, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Account Summary"
            extra={
              <Tabs
                tabs={[
                  {
                    id: "orders",
                    label: "Order History",
                    count: customerOrders.length,
                  },
                  { id: "timeline", label: "Activity Feed" },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            }
          >
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="mt-4">
                {customerOrders.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-semibold text-text-custom/70">
                      No orders placed yet
                    </p>
                    <p className="text-xs text-text-custom/50 mt-1">
                      Orders placed by this customer will appear here.
                    </p>
                  </div>
                ) : (
                  <DataTable columns={orderColumns} data={customerOrders} />
                )}
              </div>
            )}

            {/* Activity Timeline Tab */}
            {activeTab === "timeline" && (
              <div className="mt-4 pl-4 space-y-6 relative border-l border-border-custom">
                {timeline.map((act) => (
                  <div key={act.id} className="relative pl-6">
                    <div className="absolute -left-[27px] top-0.5 bg-primary text-white p-1 rounded-full border-4 border-white shadow-xs">
                      {act.icon}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text-custom">
                        {act.event}
                      </p>
                      <span className="text-3xs text-text-custom/40 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(act.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
