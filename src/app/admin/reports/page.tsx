"use client";

import React, { useState } from "react";
import { FileDown, RefreshCw } from "lucide-react";

import { Breadcrumb, Button, Card, DatePicker } from "@/components/admin";

export default function ReportsPage() {
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
    </div>
  );
}
