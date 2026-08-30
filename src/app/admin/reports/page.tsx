"use client";

import React, { useState } from "react";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";

import { Breadcrumb, Button, Card, DatePicker } from "@/components/admin";
import { useToast } from "@/providers/toast-provider";
import { apiClient } from "@/services/api-client";

export default function ReportsPage() {
  // Toast
  const { success: toastSuccess, error: toastError } = useToast();

  // States
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-31");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toastError("Please select valid start and end dates.");
      return;
    }

    if (end < start) {
      toastError("End Date must be greater than or equal to Start Date.");
      return;
    }

    // Validate maximum 2-month range
    const maxEnd = new Date(start);
    maxEnd.setMonth(maxEnd.getMonth() + 2);
    if (end > maxEnd) {
      toastError("The selected date range cannot exceed 2 months.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await apiClient<{ data: any[] }>(
        `/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`,
      );

      const reportData = res.data || [];

      // Map report data to exact requested columns in order
      const exportRows = reportData.map((row) => ({
        "Order Number": row.orderNumber,
        Email: row.email,
        "Billing Name": row.billingName,
        "Order Status": row.orderStatus,
        Created: row.created,
        "Product Names": row.productName,
        "Product SKUs": row.productSku,
        "Product Price": row.productPrice,
        "Quantity of Products": row.quantity,
        Subtotal: row.subtotal,
        Shipping: row.shipping,
        Taxes: row.taxes,
        Total: row.total,
        "Discount Amount": row.discountAmount,
        "Street Address 1": row.streetAddress1,
        City: row.city,
        State: row.state,
        "Postal Code": row.postalCode,
        Country: row.country,
        "Payment Method": row.paymentMethod,
        "Payment Status": row.paymentStatus,
        Notes: row.notes,
      }));

      const ws = XLSX.utils.json_to_sheet(exportRows, {
        header: [
          "Order Number",
          "Email",
          "Billing Name",
          "Order Status",
          "Created",
          "Product Names",
          "Product SKUs",
          "Product Price",
          "Quantity of Products",
          "Subtotal",
          "Shipping",
          "Taxes",
          "Total",
          "Discount Amount",
          "Street Address 1",
          "City",
          "State",
          "Postal Code",
          "Country",
          "Payment Method",
          "Payment Status",
          "Notes",
        ],
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
      XLSX.writeFile(wb, `Sales_Report_${startDate}_to_${endDate}.xlsx`);

      if (reportData.length === 0) {
        toastSuccess(
          "No orders found. Empty report sheet generated with column headers.",
        );
      } else {
        toastSuccess(
          `Report generated and downloaded successfully with ${reportData.length} records.`,
        );
      }
    } catch (err: any) {
      toastError(err.message || "Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
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
            <FileDown className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
        <p className="text-xs text-text-secondary mt-2">
          Note: The maximum range allowed is 2 months. Clicking Generate Report
          will compile and download the Excel file directly.
        </p>
      </Card>
    </div>
  );
}
