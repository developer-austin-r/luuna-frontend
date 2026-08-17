"use client";

import React, { useEffect, useState } from "react";
import { Download, Filter, X } from "lucide-react";

import {
  Breadcrumb,
  Card,
  type Column,
  DataTable,
  DatePicker,
  Modal,
  Pagination,
  Search,
  Select,
} from "@/components/admin";
import { apiClient } from "@/services/api-client";

// Max range for date filters
const MAX_DAYS = 30;

function get30DaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - MAX_DAYS);
  return d.toISOString().split("T")[0]!;
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

export default function ActivityLogsPage() {
  // Data States
  const [logs, setLogs] = useState<any[]>([]);
  const [filtersList, setFiltersList] = useState<{
    modules: any[];
    actions: any[];
  }>({
    modules: [],
    actions: [],
  });

  // Pagination States
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const minDate = get30DaysAgo();
  const maxDate = getTodayStr();

  // Fetch log filters config
  const fetchFilters = async () => {
    try {
      const res = await apiClient<{ data: { modules: any[]; actions: any[] } }>(
        "/admin/activity-logs/filters",
      );
      if (res?.data) {
        setFiltersList(res.data);
      }
    } catch (err) {
      console.error("Error fetching filters config:", err);
    }
  };

  // Build query params shared between fetch and export
  const buildParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedModule !== "all") params.append("moduleId", selectedModule);
    if (selectedAction !== "all") params.append("actionId", selectedAction);
    if (selectedDevice !== "all") params.append("deviceType", selectedDevice);

    // Clamp dates to 30-day window
    const effectiveStart = startDate || minDate;
    const effectiveEnd = endDate || maxDate;
    params.append("startDate", new Date(effectiveStart).toISOString());
    const end = new Date(effectiveEnd);
    end.setHours(23, 59, 59, 999);
    params.append("endDate", end.toISOString());

    return params;
  };

  // Fetch paginated logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = buildParams();
      params.set("page", String(page));
      params.set("limit", "10");

      const res = await apiClient<{
        data: {
          data: any[];
          meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>(`/admin/activity-logs?${params.toString()}`);

      if (res?.data) {
        setLogs(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // CSV Export — fetches ALL matching logs (up to 30d) and triggers download
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params = buildParams();
      params.set("page", "1");
      params.set("limit", "10000");

      const res = await apiClient<{
        data: {
          data: any[];
        };
      }>(`/admin/activity-logs?${params.toString()}`);

      if (!res?.data?.data?.length) {
        alert("No data to export for the selected filters.");
        return;
      }

      const rows = res.data.data;

      const headers = [
        "Date & Time",
        "User Name",
        "User Email",
        "Session ID",
        "Module",
        "Action",
        "Description",
        "Device Type",
        "Browser",
        "OS",
        "IP Address",
      ];

      const csvRows = [
        headers.join(","),
        ...rows.map((row: any) =>
          [
            `"${new Date(row.createdAt).toLocaleString()}"`,
            `"${row.user?.name || "Guest"}"`,
            `"${row.user?.email || ""}"`,
            `"${row.sessionId || ""}"`,
            `"${row.module?.name || ""}"`,
            `"${row.action?.name || ""}"`,
            `"${(row.description || "").replace(/"/g, '""')}"`,
            `"${row.deviceType || ""}"`,
            `"${row.browser || ""}"`,
            `"${row.os || ""}"`,
            `"${row.ipAddress || ""}"`,
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const dateLabel = `${startDate || minDate}_to_${endDate || maxDate}`;
      link.download = `activity-logs_${dateLabel}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting CSV:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedModule("all");
    setSelectedAction("all");
    setSelectedDevice("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Trigger loads
  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [
    page,
    searchTerm,
    selectedModule,
    selectedAction,
    selectedDevice,
    startDate,
    endDate,
  ]);

  // Derived filtered actions list for the sub-select dropdown
  const filteredActions =
    selectedModule === "all"
      ? []
      : filtersList.actions.filter(
          (act) => String(act.moduleId) === String(selectedModule),
        );

  const activeFilterCount = [
    selectedModule !== "all",
    selectedAction !== "all",
    !!startDate,
    !!endDate,
  ].filter(Boolean).length;

  const columns: Column<any>[] = [
    {
      key: "createdAt",
      label: "Date & Time",
      render: (val) => (
        <span suppressHydrationWarning>{new Date(val).toLocaleString()}</span>
      ),
    },
    {
      key: "user",
      label: "User / Visitor",
      render: (_, item) => {
        if (item.user) {
          return (
            <div>
              <span className="font-bold text-text-custom block">
                {item.user.name || "User"}
              </span>
              <span className="text-3xs text-text-custom/60 block">
                {item.user.email}
              </span>
            </div>
          );
        }
        return (
          <div>
            <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200/50 text-amber-700 text-4xs font-semibold uppercase tracking-wider">
              Guest
            </span>
            {item.sessionId && (
              <span
                className="text-3xs text-text-custom/50 font-mono block mt-0.5"
                title={item.sessionId}
              >
                {item.sessionId.substring(0, 14)}...
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "module",
      label: "Module",
      render: (_, item) => (
        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-text-custom/75 text-3xs uppercase tracking-wider">
          {item.module?.name || "Unknown"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (_, item) => (
        <span className="font-semibold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-3xs uppercase tracking-wider">
          {item.action?.name ? item.action.name.replace(/_/g, " ") : "Unknown"}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (val) => (
        <span className="text-text-custom/85 font-medium">{val}</span>
      ),
    },
    {
      key: "deviceType",
      label: "Device Context",
      render: (_, item) => (
        <div className="text-3xs text-text-custom/75">
          <span className="block font-semibold capitalize">
            {item.deviceType || "desktop"}
          </span>
          <span className="block text-4xs text-text-custom/50 mt-0.5">
            {item.browser || "Unknown"} on {item.os || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      key: "ipAddress",
      label: "IP Address",
      render: (val) => (
        <span className="font-mono text-3xs text-text-custom/60">
          {val || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Details",
      render: (_, item) => (
        <button
          onClick={() => {
            setSelectedLog(item);
            setIsModalOpen(true);
          }}
          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/50 px-2 py-1 rounded font-semibold transition-colors cursor-pointer text-3xs uppercase tracking-wider"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <Breadcrumb
          items={[{ label: "Activity Logs", href: "/admin/activity-logs" }]}
        />
        <h1 className="text-2xl font-bold text-text-custom mt-1">
          Activity Logs
        </h1>
      </div>

      {/* Table Card */}
      <Card>
        <div className="space-y-4">

          {/* ── Toolbar Row ── */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[220px]">
              <Search
                placeholder="Search actions, users, sessions, or IPs..."
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  setPage(1);
                }}
              />
            </div>

            {/* Device Type */}
            <div className="w-44">
              <Select
                label="Device Type"
                value={selectedDevice}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Devices" },
                  { value: "desktop", label: "Desktop" },
                  { value: "mobile", label: "Mobile" },
                  { value: "tablet", label: "Tablet" },
                ]}
              />
            </div>

            {/* Show Filters toggle */}
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                showFilters
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-border-custom text-text-custom hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {activeFilterCount > 0 && !showFilters && (
                <span className="ml-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* CSV Export */}
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>

          {/* ── Expanded Filters Panel ── */}
          {showFilters && (
            <div className="bg-bg-secondary border border-border-custom rounded-xl p-4 space-y-4 animate-fadeIn">
              {/* Panel header */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-text-custom/60 uppercase tracking-widest">
                  Filters
                </p>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Filter fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Module */}
                <Select
                  label="System Module"
                  value={selectedModule}
                  onChange={(e) => {
                    setSelectedModule(e.target.value);
                    setSelectedAction("all");
                    setPage(1);
                  }}
                  options={[
                    { value: "all", label: "All Modules" },
                    ...filtersList.modules.map((mod) => ({
                      value: String(mod.id),
                      label: mod.name,
                    })),
                  ]}
                />

                {/* Action */}
                <Select
                  label="Operation Action"
                  value={selectedAction}
                  onChange={(e) => {
                    setSelectedAction(e.target.value);
                    setPage(1);
                  }}
                  disabled={selectedModule === "all"}
                  options={[
                    { value: "all", label: selectedModule === "all" ? "Select a module first" : "All Actions" },
                    ...filteredActions.map((act) => ({
                      value: String(act.id),
                      label: act.name.replace(/_/g, " "),
                    })),
                  ]}
                />

                {/* From Date */}
                <DatePicker
                  label="From Date"
                  value={startDate}
                  min={minDate}
                  max={endDate || maxDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />

                {/* To Date */}
                <DatePicker
                  label="To Date"
                  value={endDate}
                  min={startDate || minDate}
                  max={maxDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Helper note */}
              <p className="text-[10px] text-text-custom/40 italic">
                Date range is limited to the past {MAX_DAYS} days. Export CSV will include all matching records within this range.
              </p>
            </div>
          )}

          <DataTable columns={columns} data={logs} isLoading={loading} />

          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      </Card>

      {/* Details Modal */}
      {selectedLog && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Activity Log Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                  Date & Time
                </h4>
                <p className="text-xs text-text-custom mt-0.5">
                  {new Date(selectedLog.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                  IP Address
                </h4>
                <p className="text-xs text-text-custom mt-0.5 font-mono">
                  {selectedLog.ipAddress || "Unknown"}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                  Module
                </h4>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-text-custom/75 text-3xs font-semibold uppercase tracking-wider">
                  {selectedLog.module?.name || "Unknown"}
                </span>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                  Action
                </h4>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-3xs font-semibold uppercase tracking-wider">
                  {selectedLog.action?.name
                    ? selectedLog.action.name.replace(/_/g, " ")
                    : "Unknown"}
                </span>
              </div>
            </div>

            <div className="border-t border-border-custom/50 pt-4">
              <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                Description
              </h4>
              <p className="text-xs text-text-custom mt-1 font-medium bg-bg-secondary p-3 rounded-lg border border-border-custom/40">
                {selectedLog.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border-custom/50 pt-4">
              <div>
                <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                  User / Guest Info
                </h4>
                {selectedLog.user ? (
                  <div className="mt-1 p-3 bg-bg-secondary rounded-lg border border-border-custom/40">
                    <p className="text-xs text-text-custom font-semibold">
                      {selectedLog.user.name}
                    </p>
                    <p className="text-3xs text-text-custom/60 mt-0.5">
                      {selectedLog.user.email}
                    </p>
                    <p className="text-[9px] text-text-custom/40 mt-1 font-mono">
                      ID: {selectedLog.user.id}
                    </p>
                  </div>
                ) : (
                  <div className="mt-1 p-3 bg-amber-50/50 rounded-lg border border-amber-200/30">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider">
                      Guest Visitor
                    </span>
                    <p className="text-3xs text-text-custom/60 mt-2 font-mono break-all">
                      Session: {selectedLog.sessionId || "None"}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                  Browser & Device Context
                </h4>
                <div className="mt-1 p-3 bg-bg-secondary rounded-lg border border-border-custom/40 space-y-1.5 text-xs">
                  <div className="flex justify-between text-3xs">
                    <span className="text-text-custom/50">Device Type:</span>
                    <span className="font-semibold text-text-custom capitalize">
                      {selectedLog.deviceType || "desktop"}
                    </span>
                  </div>
                  <div className="flex justify-between text-3xs">
                    <span className="text-text-custom/50">Browser:</span>
                    <span className="font-semibold text-text-custom">
                      {selectedLog.browser || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between text-3xs">
                    <span className="text-text-custom/50">
                      Operating System:
                    </span>
                    <span className="font-semibold text-text-custom">
                      {selectedLog.os || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border-custom/50 pt-4">
              <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                Metadata (JSON Payload)
              </h4>
              {selectedLog.metadata &&
              Object.keys(selectedLog.metadata).length > 0 ? (
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto text-xs font-mono max-h-64 border border-slate-800 shadow-inner mt-1">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              ) : (
                <p className="text-3xs text-text-custom/40 italic mt-1">
                  No action-specific metadata was attached to this activity.
                </p>
              )}
            </div>

            {selectedLog.userAgent && (
              <div className="border-t border-border-custom/50 pt-4">
                <h4 className="text-[10px] font-bold text-text-custom/50 uppercase tracking-wider">
                  Raw User Agent Header
                </h4>
                <p className="text-3xs text-text-custom/50 font-mono bg-bg-secondary p-3 rounded-lg border border-border-custom/40 mt-1 break-all select-all">
                  {selectedLog.userAgent}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
