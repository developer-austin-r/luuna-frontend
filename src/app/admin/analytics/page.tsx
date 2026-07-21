'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { 
  Breadcrumb, 
  Card, 
  StatsCard, 
  Tabs,
  Badge
} from '@/components/admin';
import { 
  TrendingUp, 
  Smartphone, 
  Laptop, 
  Tablet, 
  ShoppingCart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  DollarSign, 
  ShoppingBag,
  Award
} from 'lucide-react';

export default function AnalyticsPage() {
  const { products, orders, customers } = useAppSelector(state => state.admin);
  const [activeRange, setActiveRange] = useState('7d');

  // Month vs Month comparison calculations
  const monthlyStats = {
    thisMonthSales: 45290.00,
    lastMonthSales: 39820.00,
    salesChange: 13.73,
    thisMonthOrders: 620,
    lastMonthOrders: 580,
    ordersChange: 6.89,
    thisMonthCustomers: 142,
    lastMonthCustomers: 110,
    customersChange: 29.09
  };

  // Best Selling Products calculations
  const bestSellers = [
    { name: 'Classic Leather Tote Bag', sku: 'BG-LTH-01', sales: 48, revenue: 9072.00, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&q=80' },
    { name: 'Silk V-Neck Blouse', sku: 'CL-SLK-02', sales: 36, revenue: 5364.00, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80' },
    { name: 'Minimalist Gold Ring', sku: 'JW-GLD-03', sales: 29, revenue: 4321.00, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&q=80' }
  ];

  // Top Categories distribution
  const topCategories = [
    { name: 'Apparel', share: 45, color: 'bg-primary' },
    { name: 'Bags', share: 28, color: 'bg-sky-500' },
    { name: 'Jewelry', share: 15, color: 'bg-indigo-500' },
    { name: 'Shoes', share: 12, color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Analytics', href: '/admin/analytics' }]} />
          <h1 className="text-2xl font-bold text-text-custom mt-1">Analytics Intelligence</h1>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <Tabs
            tabs={[
              { id: '24h', label: 'Last 24h' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: '12m', label: 'Last 12 Months' }
            ]}
            activeTab={activeRange}
            onChange={setActiveRange}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Conversion Rate"
          value="3.48%"
          change={1.4}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard
          title="Avg. Shopping Basket"
          value="$149.50"
          change={3.2}
          icon={<DollarSign className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="Store Sessions"
          value="19,530"
          change={11.8}
          icon={<Users className="w-5 h-5 text-sky-500" />}
        />
        <StatsCard
          title="Return Customer Rate"
          value="24.15%"
          change={2.1}
          icon={<ShoppingBag className="w-5 h-5 text-indigo-500" />}
        />
      </div>

      {/* Monthly Comparison Summary Widget */}
      <Card title="Monthly Performance Comparison (vs Prior Period)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          
          {/* Sales Revenue comparison */}
          <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border-custom flex justify-between items-center text-xs">
            <div>
              <p className="text-3xs uppercase tracking-wider font-bold text-text-custom/50">Sales Revenue</p>
              <h3 className="text-lg font-bold text-text-custom mt-1">${monthlyStats.thisMonthSales.toLocaleString()}</h3>
              <p className="text-3xs text-text-custom/40 mt-1 font-semibold">Prior Month: ${monthlyStats.lastMonthSales.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-2xs border border-emerald-100">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{monthlyStats.salesChange}%
              </span>
            </div>
          </div>

          {/* Orders Volume comparison */}
          <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border-custom flex justify-between items-center text-xs">
            <div>
              <p className="text-3xs uppercase tracking-wider font-bold text-text-custom/50">Orders Count</p>
              <h3 className="text-lg font-bold text-text-custom mt-1">{monthlyStats.thisMonthOrders} orders</h3>
              <p className="text-3xs text-text-custom/40 mt-1 font-semibold">Prior Month: {monthlyStats.lastMonthOrders}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-2xs border border-emerald-100">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{monthlyStats.ordersChange}%
              </span>
            </div>
          </div>

          {/* Customers growth comparison */}
          <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border-custom flex justify-between items-center text-xs">
            <div>
              <p className="text-3xs uppercase tracking-wider font-bold text-text-custom/50">Client Acquisitions</p>
              <h3 className="text-lg font-bold text-text-custom mt-1">{monthlyStats.thisMonthCustomers} signups</h3>
              <p className="text-3xs text-text-custom/40 mt-1 font-semibold">Prior Month: {monthlyStats.lastMonthCustomers}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-2xs border border-emerald-100">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{monthlyStats.customersChange}%
              </span>
            </div>
          </div>

        </div>
      </Card>

      {/* Main visualization grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales & Revenue interactive chart */}
        <Card title="Revenue Growth Trends" className="lg:col-span-2">
          <div className="h-64 flex flex-col justify-end mt-4">
            <div className="flex-1 w-full relative">
              <svg viewBox="0 0 600 180" className="w-full h-full text-primary" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 160 Q 150 80, 300 100 T 600 30 L 600 180 L 0 180 Z" fill="url(#revGrad)" />
                <path d="M 0 160 Q 150 80, 300 100 T 600 30" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div className="flex justify-between border-t border-border-custom pt-3 px-2 text-3xs text-text-custom/40 font-bold uppercase tracking-widest">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </Card>

        {/* Categories Distribution */}
        <Card title="Top Category Share">
          <div className="space-y-4 mt-2 text-xs">
            {topCategories.map(cat => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-custom">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                    {cat.name}
                  </span>
                  <span>{cat.share}%</span>
                </div>
                <div className="w-full bg-bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Growth Acquisition Curve */}
        <Card title="Active Session acquisitions">
          <div className="h-48 flex flex-col justify-end mt-4">
            <div className="flex-1 w-full relative">
              <svg viewBox="0 0 400 140" className="w-full h-full text-indigo-500" preserveAspectRatio="none">
                <path d="M 0 120 C 100 90, 200 110, 300 50 C 350 20, 400 10, 400 10" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div className="flex justify-between border-t border-border-custom pt-2 px-2 text-3xs text-text-custom/40 font-semibold uppercase">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </Card>

        {/* Best Sellers items list */}
        <Card title="Best Selling Products" className="lg:col-span-2">
          <div className="space-y-4 mt-2">
            {bestSellers.map((item, idx) => (
              <div key={item.sku} className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-secondary/50 border border-border-custom/50 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-primary/10 text-primary font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-border-custom" />
                  <div>
                    <span className="font-bold text-text-custom block">{item.name}</span>
                    <span className="text-3xs font-mono text-text-custom/50">SKU: {item.sku}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-text-custom block">${item.revenue.toFixed(2)}</span>
                  <span className="text-3xs text-emerald-600 font-bold">{item.sales} units sold</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
