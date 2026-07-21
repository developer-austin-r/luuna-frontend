'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateInventoryStock, addActivityLog } from '@/redux/slices/admin-slice';
import { 
  Breadcrumb, 
  Card, 
  DataTable, 
  Column, 
  StatusBadge, 
  Search, 
  Filters, 
  Select, 
  Input, 
  Button,
  Modal
} from '@/components/admin';
import { AlertCircle, RotateCcw, Download, History, Plus, Settings } from 'lucide-react';
import { InventoryItem } from '@/types/admin';
import { useForm } from 'react-hook-form';

interface AdjustmentFormValues {
  adjustmentType: 'add' | 'remove' | 'set';
  quantity: number;
  reserved: number;
  warehouse: string;
  reason: string;
}

interface StockHistoryLog {
  id: string;
  date: string;
  productName: string;
  sku: string;
  change: string;
  warehouse: string;
  reason: string;
  user: string;
}

export default function InventoryPage() {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector(state => state.admin.inventory);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  // Adjustment Modal State
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Dynamic stock history logs
  const [historyLogs, setHistoryLogs] = useState<StockHistoryLog[]>([
    { id: 'h-1', date: '2026-07-19T18:24:00Z', productName: 'Classic Leather Tote Bag', sku: 'BG-LTH-01', change: '+20 Restock', warehouse: 'Warehouse East', reason: 'Supplier Delivery Batch #23', user: 'Admin Sarah' },
    { id: 'h-2', date: '2026-07-18T10:15:00Z', productName: 'Minimalist Gold Ring', sku: 'JW-GLD-03', change: '-2 Sale', warehouse: 'Warehouse East', reason: 'Fulfilled ORD-9833', user: 'System Webhook' },
    { id: 'h-3', date: '2026-07-17T14:00:00Z', productName: 'Suede Chelsea Boots', sku: 'SH-SUD-04', change: 'Set to 0', warehouse: 'Warehouse Central', reason: 'Damaged item audit adjustment', user: 'Admin Alex' }
  ]);

  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdjustmentFormValues>({
    defaultValues: {
      adjustmentType: 'add',
      quantity: 5,
      reserved: 0,
      warehouse: 'Warehouse East',
      reason: ''
    }
  });

  const handleAdjustClick = (item: InventoryItem) => {
    setSelectedItem(item);
    reset({
      adjustmentType: 'add',
      quantity: 5,
      reserved: item.reserved,
      warehouse: item.warehouse,
      reason: ''
    });
    setAdjustmentModalOpen(true);
  };

  const handleExport = () => {
    alert('Exporting warehouse stock levels as CSV. The download will start shortly.');
  };

  const onSubmitAdjustment = (data: AdjustmentFormValues) => {
    if (!selectedItem) return;

    let finalStock = selectedItem.stock;
    let changeLabel = '';

    if (data.adjustmentType === 'add') {
      finalStock += data.quantity;
      changeLabel = `+${data.quantity} Restock`;
    } else if (data.adjustmentType === 'remove') {
      finalStock = Math.max(0, finalStock - data.quantity);
      changeLabel = `-${data.quantity} Dispatched`;
    } else {
      finalStock = data.quantity;
      changeLabel = `Set to ${data.quantity}`;
    }

    // Dispatch update
    dispatch(updateInventoryStock({
      id: selectedItem.id,
      stock: finalStock,
      reserved: data.reserved,
      warehouse: data.warehouse
    }));

    dispatch(addActivityLog({
      user: 'Admin Sarah',
      action: `Adjusted inventory of ${selectedItem.productName} (${changeLabel})`,
      module: 'Inventory',
      status: 'success'
    }));

    // Add to local history list
    const newLog: StockHistoryLog = {
      id: `h-${Date.now()}`,
      date: new Date().toISOString(),
      productName: selectedItem.productName,
      sku: selectedItem.sku,
      change: changeLabel,
      warehouse: data.warehouse,
      reason: data.reason || 'Manual inventory adjustment',
      user: 'Admin Sarah'
    };
    setHistoryLogs(prev => [newLog, ...prev]);

    setAdjustmentModalOpen(false);
    alert(`Stock levels adjusted successfully for ${selectedItem.productName}.`);
  };

  // Filter
  const filteredInventory = inventory.filter(item => {
    const matchSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchWarehouse = warehouseFilter === 'all' || item.warehouse === warehouseFilter;
    return matchSearch && matchStatus && matchWarehouse;
  });

  // Low stock warning items
  const lowStockItemsList = inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock');

  const columns: Column<InventoryItem>[] = [
    {
      key: 'sku',
      label: 'SKU Code',
      render: (val) => <span className="font-bold font-mono">{val}</span>
    },
    {
      key: 'productName',
      label: 'Product details',
      render: (val) => <span className="font-bold text-text-custom">{val}</span>
    },
    {
      key: 'warehouse',
      label: 'Warehouse'
    },
    {
      key: 'stock',
      label: 'Current Stock',
      render: (val) => <span className="font-semibold text-text-custom">{val} units</span>
    },
    {
      key: 'reserved',
      label: 'Reserved units',
      render: (val) => <span className="text-text-custom/50">{val} locked</span>
    },
    {
      key: 'available',
      label: 'Available to Sell',
      render: (val) => <span className="font-bold text-primary">{val} units</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, item) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAdjustClick(item)}
          className="text-2xs font-semibold hover:bg-primary/5 text-primary border-primary/20 shrink-0"
        >
          Adjust Stock
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Inventory', href: '/admin/inventory' }]} />
          <h1 className="text-2xl font-bold text-text-custom mt-1">Inventory Management</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Export Stock Sheet
        </Button>
      </div>

      {/* Low stock warning banner grid */}
      {lowStockItemsList.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50/10">
          <div className="flex gap-3 items-start text-xs">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-700">Inventory Alert Warning</h4>
              <p className="text-text-custom/75 mt-0.5">
                The following SKU listings are either low or out of stock: {' '}
                {lowStockItemsList.map((item, idx) => (
                  <span key={item.id} className="font-bold text-red-800">
                    {item.productName} ({item.stock} left){idx < lowStockItemsList.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Stock Table */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Search 
                placeholder="Search inventory by title or SKU..." 
                onSearchChange={setSearchTerm} 
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Filters onClearFilters={() => { setStatusFilter('all'); setWarehouseFilter('all'); setSearchTerm(''); }}>
                <Select
                  label="Warehouse"
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Warehouses' },
                    { value: 'Warehouse East', label: 'Warehouse East' },
                    { value: 'Warehouse West', label: 'Warehouse West' },
                    { value: 'Warehouse Central', label: 'Warehouse Central' }
                  ]}
                />
                <Select
                  label="Alert Threshold"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'in_stock', label: 'In Stock' },
                    { value: 'low_stock', label: 'Low Stock' },
                    { value: 'out_of_stock', label: 'Out of Stock' }
                  ]}
                />
              </Filters>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredInventory}
          />
        </div>
      </Card>

      {/* Stock History Audit Feed */}
      <Card title="Stock Adjustment History Log">
        <div className="space-y-4 mt-2">
          {historyLogs.map(log => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-custom/30 last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-start gap-3 text-xs">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-text-custom">{log.productName}</p>
                  <p className="text-3xs text-text-custom/50 font-bold uppercase tracking-wider">
                    SKU: {log.sku} • Warehouse: {log.warehouse}
                  </p>
                  <p className="text-3xs text-text-custom/60 italic mt-0.5">Reason: "{log.reason}"</p>
                </div>
              </div>
              
              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-bg-secondary text-text-custom font-mono">
                  {log.change}
                </span>
                <p className="text-3xs text-text-custom/40 font-semibold uppercase tracking-wider mt-1" suppressHydrationWarning>
                  Adjusted by {log.user} • {new Date(log.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={adjustmentModalOpen}
        onClose={() => setAdjustmentModalOpen(false)}
        title={`Adjust Stock: ${selectedItem?.productName || ''}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setAdjustmentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmitAdjustment)}>
              Apply Adjustment
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-secondary p-3 rounded-lg border border-border-custom text-xs">
              <p className="text-text-custom/50 font-bold uppercase tracking-wider text-3xs">Current Stock</p>
              <p className="text-lg font-bold text-text-custom mt-0.5">{selectedItem?.stock} units</p>
            </div>
            <div className="bg-bg-secondary p-3 rounded-lg border border-border-custom text-xs">
              <p className="text-text-custom/50 font-bold uppercase tracking-wider text-3xs">Reserved Stock</p>
              <p className="text-lg font-bold text-text-custom mt-0.5">{selectedItem?.reserved} units</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Adjustment Action"
              {...register('adjustmentType')}
              options={[
                { value: 'add', label: 'Add Stock (+)' },
                { value: 'remove', label: 'Remove Stock (-)' },
                { value: 'set', label: 'Set Absolute Stock (=)' }
              ]}
            />
            <Input
              label="Quantity"
              type="number"
              {...register('quantity', { valueAsNumber: true, required: 'Quantity is required' })}
              error={errors.quantity?.message}
            />
            <Input
              label="Adjust Reserved Units"
              type="number"
              {...register('reserved', { valueAsNumber: true })}
            />
            <Select
              label="Warehouse Destination"
              {...register('warehouse')}
              options={[
                { value: 'Warehouse East', label: 'Warehouse East' },
                { value: 'Warehouse West', label: 'Warehouse West' },
                { value: 'Warehouse Central', label: 'Warehouse Central' }
              ]}
            />
          </div>

          <Input
            label="Adjustment Reason Description"
            {...register('reason', { required: 'Reason is required' })}
            error={errors.reason?.message}
            placeholder="e.g. Restock batch from supplier, Inventory check audit"
          />
        </form>
      </Modal>
    </div>
  );
}
