"use client";

import React, { useState } from "react";
import {
  BarChart2,
  CheckCircle,
  FileDown,
  RefreshCw,
  ShoppingCart,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  DatePicker,
  StatsCard,
  StatusBadge,
  Tabs,
} from "@/components/admin";
import { useAppSelector } from "@/redux/hooks";

export default function ReportsPage() {
  const { reportData, products, orders, customers } = useAppSelector(
    (state) => state.admin,
  );

  // States
  const [activeReportTab, setActiveReportTab] = useState("sales");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-31");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(
        `${activeReportTab.toUpperCase()} report generated for period ${startDate} to ${endDate}.`,
      );
    }, 600);
  };

  const handleExport = (format: "Excel" | "PDF") => {
    alert(
      `Exporting ${activeReportTab.toUpperCase()} report as ${format}. The download will start shortly.`,
    );
  };

  // 1. Sales Report calculations & structure
  const totalSalesVolume = reportData.reduce(
    (sum, item) => sum + item.sales,
    0,
  );
  const totalSalesRevenue = reportData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  // 2. Customer Report structure
  const customerReportData = [
    {
      id: "c-1",
      date: "2026-07-13",
      signups: 5,
      activeCustomers: 42,
      conversionRate: "3.1%",
    },
    {
      id: "c-2",
      date: "2026-07-14",
      signups: 8,
      activeCustomers: 48,
      conversionRate: "3.4%",
    },
    {
      id: "c-3",
      date: "2026-07-15",
      signups: 12,
      activeCustomers: 58,
      conversionRate: "4.2%",
    },
    {
      id: "c-4",
      date: "2026-07-16",
      signups: 4,
      activeCustomers: 60,
      conversionRate: "2.9%",
    },
    {
      id: "c-5",
      date: "2026-07-17",
      signups: 9,
      activeCustomers: 66,
      conversionRate: "3.6%",
    },
    {
      id: "c-6",
      date: "2026-07-18",
      signups: 15,
      activeCustomers: 78,
      conversionRate: "4.8%",
    },
    {
      id: "c-7",
      date: "2026-07-19",
      signups: 18,
      activeCustomers: 92,
      conversionRate: "5.1%",
    },
  ];

  // 3. Product Report structure
  const productReportData = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    quantitySold: p.stock > 0 ? Math.floor(Math.random() * 50) + 10 : 0,
    revenue:
      p.stock > 0
        ? (p.salePrice || p.price) * (Math.floor(Math.random() * 50) + 10)
        : 0,
  }));

  // Columns & Tables matching reports
  const salesColumns: Column<any>[] = [
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
      key: "sales",
      label: "Units Sold",
      render: (val) => <span className="font-semibold">{val} units</span>,
    },
    {
      key: "revenue",
      label: "Gross Revenue",
      render: (val) => <span className="font-bold">${val.toFixed(2)}</span>,
    },
    {
      key: "expenses",
      label: "Expenses",
      render: (val) => (
        <span className="text-text-custom/60">${val.toFixed(2)}</span>
      ),
    },
    {
      key: "revenue",
      label: "Net Profit",
      render: (_, item) => (
        <span className="font-bold text-emerald-600">
          ${(item.revenue - item.expenses).toFixed(2)}
        </span>
      ),
    },
  ];

  const customerColumns: Column<any>[] = [
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
      key: "signups",
      label: "New Signups",
      render: (val) => <span className="font-semibold">{val} users</span>,
    },
    {
      key: "activeCustomers",
      label: "Active Users",
      render: (val) => (
        <span className="font-semibold text-text-custom">{val} users</span>
      ),
    },
    {
      key: "conversionRate",
      label: "Conversion Rate",
      render: (val) => <span className="font-bold text-primary">{val}</span>,
    },
  ];

  const productColumns: Column<any>[] = [
    { key: "name", label: "Product Name" },
    {
      key: "sku",
      label: "SKU Barcode",
      render: (val) => <span className="font-mono">{val}</span>,
    },
    { key: "category", label: "Category" },
    {
      key: "quantitySold",
      label: "Units Sold",
      render: (val) => <span className="font-semibold">{val} units</span>,
    },
    {
      key: "revenue",
      label: "Total Revenue",
      render: (val) => (
        <span className="font-bold text-primary">${val.toFixed(2)}</span>
      ),
    },
  ];

  const orderColumns: Column<any>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (val) => <span className="font-bold font-mono">{val}</span>,
    },
    { key: "customerName", label: "Recipient" },
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
      label: "Transaction Total",
      render: (val) => (
        <span className="font-bold text-text-custom">${val.toFixed(2)}</span>
      ),
    },
    { key: "shippingMethod", label: "Courier" },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Reports", href: "/admin/reports" }]} />
          <h1 className="text-2xl font-bold text-text-custom mt-1 font-sans">
            Business Reporting
          </h1>
        </div>
        <div className="flex gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("Excel")}
            className="flex items-center gap-1"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("PDF")}
            className="flex items-center gap-1"
          >
            <FileDown className="w-3.5 h-3.5 text-red-500" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Selector Tabs */}
      <Card>
        <Tabs
          tabs={[
            { id: "sales", label: "Sales Report" },
            { id: "revenue", label: "Revenue Report" },
            { id: "customer", label: "Customer Report" },
            { id: "product", label: "Product Report" },
            { id: "order", label: "Order Report" },
          ]}
          activeTab={activeReportTab}
          onChange={(tab) => {
            setActiveReportTab(tab);
          }}
        />

        {/* Date Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end mt-6">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            onClick={handleGenerateReport}
            isLoading={isGenerating}
            className="flex items-center gap-1.5 sm:col-span-2 md:col-span-1"
          >
            <RefreshCw className="w-4 h-4" />
            Filter Dates
          </Button>
        </div>
      </Card>

      {/* Dynamic Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {activeReportTab === "sales" || activeReportTab === "revenue" ? (
          <>
            <StatsCard
              title="Gross Sales"
              value={`$${totalSalesRevenue.toLocaleString()}`}
              icon={<BarChart2 className="w-5 h-5" />}
            />
            <StatsCard
              title="Total Units Sold"
              value={totalSalesVolume}
              icon={<Tag className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              title="Net profit"
              value={`$${(totalSalesRevenue - 3240).toLocaleString()}`}
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            />
          </>
        ) : activeReportTab === "customer" ? (
          <>
            <StatsCard
              title="Total Signups"
              value="70 users"
              icon={<Users className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              title="Avg. Conversion Rate"
              value="4.0%"
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            />
            <StatsCard
              title="Active Signups"
              value="92 users"
              icon={<Users className="w-5 h-5 text-sky-500" />}
            />
          </>
        ) : activeReportTab === "product" ? (
          <>
            <StatsCard
              title="Catalog Size"
              value={products.length}
              icon={<BarChart2 className="w-5 h-5" />}
            />
            <StatsCard
              title="Best Seller Units"
              value="Leather Tote (45 units)"
              icon={<Tag className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              title="Total Inventory Value"
              value="$42,500"
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Orders placed"
              value={orders.length}
              icon={<ShoppingCart className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              title="Completed orders"
              value={orders.filter((o) => o.status === "delivered").length}
              icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
            />
            <StatsCard
              title="Pending Fulfillment"
              value={orders.filter((o) => o.status === "pending").length}
              icon={<RefreshCw className="w-5 h-5 text-amber-500" />}
            />
          </>
        )}
      </div>

      {/* Dynamic Graph & Table */}
      <div className="grid grid-cols-1 gap-6">
        {/* Dynamic SVG Chart */}
        <Card title={`${activeReportTab.toUpperCase()} Graph Visualizer`}>
          <div className="h-64 flex flex-col justify-end mt-4">
            <div className="flex-1 flex items-end gap-4 border-b border-border-custom pb-2 px-4">
              {activeReportTab === "sales" &&
                reportData.map((day, idx) => {
                  const maxVal = Math.max(...reportData.map((d) => d.sales));
                  const pct = (day.sales / maxVal) * 80;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    >
                      <div className="absolute bottom-full mb-2 bg-text-custom text-white text-2xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                        {day.sales} units sold
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-primary/20 group-hover:bg-primary rounded-t-sm transition-all duration-300 min-h-[10px]"
                      />
                      <span className="text-3xs text-text-custom/50 font-bold mt-2">
                        {day.date.split("-")[2]}
                      </span>
                    </div>
                  );
                })}

              {activeReportTab === "revenue" && (
                <div className="relative flex-1 w-full h-full px-2">
                  <svg
                    viewBox="0 0 700 200"
                    className="w-full h-full text-primary"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="gradient-rev"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="currentColor"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor="currentColor"
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 180 C 100 120, 200 150, 300 90 C 400 40, 500 110, 600 50 C 650 30, 700 10, 700 10 L 700 200 Z"
                      fill="url(#gradient-rev)"
                    />
                    <path
                      d="M 0 180 C 100 120, 200 150, 300 90 C 400 40, 500 110, 600 50 C 650 30, 700 10, 700 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              )}

              {activeReportTab === "customer" &&
                customerReportData.map((day, idx) => {
                  const maxVal = Math.max(
                    ...customerReportData.map((d) => d.signups),
                  );
                  const pct = (day.signups / maxVal) * 80;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    >
                      <div className="absolute bottom-full mb-2 bg-text-custom text-white text-2xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                        +{day.signups} signups
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 rounded-t-sm transition-all duration-300 min-h-[10px]"
                      />
                      <span className="text-3xs text-text-custom/50 font-bold mt-2">
                        {day.date.split("-")[2]}
                      </span>
                    </div>
                  );
                })}

              {activeReportTab === "product" &&
                productReportData.slice(0, 5).map((day, idx) => {
                  const maxVal = Math.max(
                    ...productReportData.map((d) => d.quantitySold),
                  );
                  const pct = (day.quantitySold / (maxVal || 1)) * 80;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    >
                      <div className="absolute bottom-full mb-2 bg-text-custom text-white text-2xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                        {day.quantitySold} units sold
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-sky-500/20 group-hover:bg-sky-500 rounded-t-sm transition-all duration-300 min-h-[10px]"
                      />
                      <span className="text-3xs text-text-custom/50 font-bold mt-2 truncate w-16 text-center">
                        {day.name.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}

              {activeReportTab === "order" &&
                reportData.map((day, idx) => {
                  const maxVal = Math.max(...reportData.map((d) => d.orders));
                  const pct = (day.orders / maxVal) * 80;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    >
                      <div className="absolute bottom-full mb-2 bg-text-custom text-white text-2xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                        {day.orders} orders
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-indigo-500/20 group-hover:bg-indigo-500 rounded-t-sm transition-all duration-300 min-h-[10px]"
                      />
                      <span className="text-3xs text-text-custom/50 font-bold mt-2">
                        {day.date.split("-")[2]}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>

        {/* Dynamic Table Card */}
        <Card title="Report Data Entries">
          {activeReportTab === "sales" && (
            <DataTable columns={salesColumns} data={reportData} />
          )}
          {activeReportTab === "revenue" && (
            <DataTable columns={salesColumns} data={reportData} />
          )}
          {activeReportTab === "customer" && (
            <DataTable columns={customerColumns} data={customerReportData} />
          )}
          {activeReportTab === "product" && (
            <DataTable columns={productColumns} data={productReportData} />
          )}
          {activeReportTab === "order" && (
            <DataTable columns={orderColumns} data={orders} />
          )}
        </Card>
      </div>
    </div>
  );
}
