"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Star,
} from "lucide-react";

import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  StatusBadge,
  Tabs,
} from "@/components/admin";
import { useAppSelector } from "@/redux/hooks";
import { type Order } from "@/types/admin";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Retrieve customer from Redux
  const customers = useAppSelector((state) => state.admin.customers);
  const orders = useAppSelector((state) => state.admin.orders);
  const customer = customers.find((c) => c.id === id);

  // Tab State
  const [activeTab, setActiveTab] = useState("orders");

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

  // Filter orders for this customer name (case-insensitive approximation)
  const customerOrders = orders.filter(
    (o) => o.customerName.toLowerCase() === customer.name.toLowerCase(),
  );

  // Mock Addresses
  const address = {
    shipping: {
      street: "4582 Oakwood Avenue, Suite 100",
      city: "Los Angeles",
      state: "CA",
      zip: "90004",
      country: "United States",
    },
    billing: {
      street: "4582 Oakwood Avenue, Suite 100",
      city: "Los Angeles",
      state: "CA",
      zip: "90004",
      country: "United States",
    },
  };

  // Mock Wishlist
  const wishlist = [
    {
      id: "w-1",
      name: "Classic Leather Tote Bag",
      sku: "BG-LTH-01",
      price: 189.0,
      inStock: true,
    },
    {
      id: "w-2",
      name: "Minimalist Gold Ring",
      sku: "JW-GLD-03",
      price: 250.0,
      inStock: true,
    },
  ];

  // Mock Reviews
  const reviews = [
    {
      id: "r-1",
      product: "Classic Leather Tote Bag",
      rating: 5,
      comment: "Outstanding quality, exactly what I wanted!",
      date: "2026-06-12",
    },
    {
      id: "r-2",
      product: "Minimalist Gold Ring",
      rating: 4,
      comment: "Very beautiful ring, but fits slightly loose.",
      date: "2026-05-30",
    },
  ];

  // Mock Activities
  const timeline = [
    {
      id: "act-1",
      event: "Order ORD-9832 delivered successfully",
      date: "2026-07-15T14:32:00Z",
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
    },
    {
      id: "act-2",
      event: "Item Classic Leather Tote Bag added to Wishlist",
      date: "2026-07-10T11:00:00Z",
      icon: <Heart className="w-3.5 h-3.5" />,
    },
    {
      id: "act-3",
      event: "Submitted a 5-star review for Classic Leather Tote Bag",
      date: "2026-06-12T16:15:00Z",
      icon: <Star className="w-3.5 h-3.5" />,
    },
    {
      id: "act-4",
      event: "Account profile created successfully",
      date: "2026-02-15T09:00:00Z",
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
          {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total spent",
      render: (val) => (
        <span className="font-bold text-text-custom">
          ${Number(val).toFixed(2)}
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

  const wishlistColumns = [
    {
      key: "name",
      label: "Product Title",
      render: (val: string, item: any) => (
        <div>
          <p className="font-bold text-text-custom">{val}</p>
          <span className="text-3xs text-text-custom/50 font-bold uppercase tracking-wider">
            SKU: {item.sku}
          </span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (val: number) => (
        <span className="font-bold">${val.toFixed(2)}</span>
      ),
    },
    {
      key: "inStock",
      label: "Availability",
      render: (val: boolean) => (
        <Badge variant={val ? "success" : "danger"}>
          {val ? "In stock" : "Out of stock"}
        </Badge>
      ),
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
                    Spent total: ${customer.totalSpent.toFixed(2)}
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
                    {address.shipping.city}, {address.shipping.state}{" "}
                    {address.shipping.zip}
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
                    {address.billing.city}, {address.billing.state}{" "}
                    {address.billing.zip}
                  </p>
                  <p>{address.billing.country}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Interactive Tabs for History, Wishlist, Reviews, Timeline */}
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
                  { id: "wishlist", label: "Wishlist", count: wishlist.length },
                  { id: "reviews", label: "Reviews", count: reviews.length },
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
                <DataTable columns={orderColumns} data={customerOrders} />
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="mt-4">
                <DataTable columns={wishlistColumns as any} data={wishlist} />
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="mt-4 space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-bg-secondary rounded-lg border border-border-custom space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-text-custom">
                        {rev.product}
                      </p>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 fill-current ${
                              idx < rev.rating ? "opacity-100" : "opacity-20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-text-custom/85 italic">
                      "{rev.comment}"
                    </p>
                    <span
                      className="text-3xs text-text-custom/40 font-bold block mt-1"
                      suppressHydrationWarning
                    >
                      Submitted on {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Activity Timeline Tab */}
            {activeTab === "timeline" && (
              <div className="mt-4 pl-4 space-y-6 relative border-l border-border-custom">
                {timeline.map((act) => (
                  <div key={act.id} className="relative pl-6">
                    {/* Circle timeline dot */}
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
