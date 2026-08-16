"use client";

import React, { useEffect, useState } from "react";

import {
  Breadcrumb,
  Card,
  type Column,
  DataTable,
  DatePicker,
  Filters,
  Modal,
  Pagination,
  Search,
  Select,
} from "@/components/admin";
import { apiClient } from "@/services/api-client";

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
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Fetch paginated logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "10"); // Set size to 10 for dashboard table sizing

      if (searchTerm) params.append("search", searchTerm);
      if (selectedModule !== "all") params.append("moduleId", selectedModule);
      if (selectedAction !== "all") params.append("actionId", selectedAction);
      if (selectedDevice !== "all") params.append("deviceType", selectedDevice);
      if (startDate)
        params.append("startDate", new Date(startDate).toISOString());
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.append("endDate", end.toISOString());
      }

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedModule("all");
    setSelectedAction("all");
    setSelectedDevice("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Derived filtered actions list for the sub-select dropdown
  const filteredActions =
    selectedModule === "all"
      ? []
      : filtersList.actions.filter(
          (act) => String(act.moduleId) === String(selectedModule),
        );

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
          Audit Trail & Activity Logs
        </h1>
      </div>

      {/* Table Card */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <Search
                placeholder="Search actions, users, sessions, or IPs..."
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  setPage(1);
                }}
              />
            </div>
            <div>
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
            <div className="flex gap-2 justify-end">
              <Filters onClearFilters={handleClearFilters}>
                <div className="grid grid-cols-1 gap-4 p-2 min-w-[280px]">
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
                  <Select
                    label="Operation Action"
                    value={selectedAction}
                    onChange={(e) => {
                      setSelectedAction(e.target.value);
                      setPage(1);
                    }}
                    disabled={selectedModule === "all"}
                    options={[
                      { value: "all", label: "All Actions" },
                      ...filteredActions.map((act) => ({
                        value: String(act.id),
                        label: act.name.replace(/_/g, " "),
                      })),
                    ]}
                  />
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </Filters>
            </div>
          </div>

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
