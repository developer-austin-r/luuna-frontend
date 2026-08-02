"use client";

import React, { useState } from "react";
import { BarChart2, FileDown, RefreshCw, Tag, TrendingUp } from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  StatsCard,
} from "@/components/admin";
import { useAppSelector } from "@/redux/hooks";

export default function ReportsPage() {
  const { reportData } = useAppSelector((state) => state.admin);

  // States
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-31");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`SALES report generated for period ${startDate} to ${endDate}.`);
    }, 600);
  };

  const handleExport = (format: "Excel" | "PDF") => {
    alert(
      `Exporting SALES report as ${format}. The download will start shortly.`,
    );
  };

  // Sales Report calculations & structure
  const totalSalesVolume = reportData.reduce(
    (sum, item) => sum + item.sales,
    0,
  );
  const totalSalesRevenue = reportData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

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

      {/* Date Filter Controls */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
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
      </div>
    </div>
  );
}
