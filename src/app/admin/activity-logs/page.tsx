'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { 
  Breadcrumb, 
  Card, 
  DataTable, 
  Column, 
  StatusBadge, 
  Search, 
  Filters, 
  Select 
} from '@/components/admin';
import { ActivityLog } from '@/types/admin';

export default function ActivityLogsPage() {
  const activityLogs = useAppSelector(state => state.admin.activityLogs);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  // Filter
  const filteredLogs = activityLogs.filter(log => {
    const matchSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const columns: Column<ActivityLog>[] = [
    {
      key: 'timestamp',
      label: 'Date & Time',
      render: (val) => <span suppressHydrationWarning>{new Date(val).toLocaleString()}</span>
    },
    {
      key: 'user',
      label: 'Administrator',
      render: (val) => <span className="font-bold text-text-custom">{val}</span>
    },
    {
      key: 'action',
      label: 'Operation Description',
      render: (val) => <span className="text-text-custom/85">{val}</span>
    },
    {
      key: 'module',
      label: 'System Module',
      render: (val) => (
        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-text-custom/75 text-3xs uppercase tracking-wider">
          {val}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Execution Status',
      render: (val) => <StatusBadge status={val} />
    }
  ];

  // Derive modules for filters
  const modules = Array.from(new Set(activityLogs.map(log => log.module)));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <Breadcrumb items={[{ label: 'Activity Logs', href: '/admin/activity-logs' }]} />
        <h1 className="text-2xl font-bold text-text-custom mt-1">Audit Trail & Activity Logs</h1>
      </div>

      {/* Table Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search 
                placeholder="Search audit actions or users..." 
                onSearchChange={setSearchTerm} 
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Filters onClearFilters={() => { setModuleFilter('all'); setSearchTerm(''); }}>
                <Select
                  label="System Module"
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Modules' },
                    ...modules.map(mod => ({ value: mod, label: mod }))
                  ]}
                />
              </Filters>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredLogs}
          />
        </div>
      </Card>
    </div>
  );
}
