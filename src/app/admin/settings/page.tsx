'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateSettings, addActivityLog } from '@/redux/slices/admin-slice';
import { 
  Breadcrumb, 
  Card, 
  Input, 
  Select, 
  Button 
} from '@/components/admin';
import { useForm } from 'react-hook-form';
import { Save, User, Shield, Palette, Mail, Upload, Sparkles, Check } from 'lucide-react';

interface GeneralFormValues {
  storeName: string;
  storeEmail: string;
  currency: string;
  taxRate: number;
  lowStockAlert: number;
}

interface ProfileFormValues {
  name: string;
  email: string;
  role: string;
  oldPass?: string;
  newPass?: string;
  confirmPass?: string;
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.admin.settings);

  // Settings navigation category state
  const [activeCategory, setActiveCategory] = useState('general');

  // Theme & branding states
  const [themeAccent, setThemeAccent] = useState('violet');
  const [storeSlogan, setStoreSlogan] = useState('Elevate Your Daily Wear');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80');

  // Email template selector states
  const [selectedTemplate, setSelectedTemplate] = useState('order_confirm');
  const [templateContent, setTemplateContent] = useState(`<html>
  <body>
    <h2>Thank you for your order, {{customer_name}}!</h2>
    <p>We are preparing your items. Order number: {{order_id}}</p>
    <p>Enjoy your Luuna Luxury experience.</p>
  </body>
</html>`);

  // General settings hook-form
  const { register: registerGeneral, handleSubmit: handleGeneralSubmit, formState: { errors: generalErrors } } = useForm<GeneralFormValues>({
    defaultValues: settings
  });

  // Profile settings hook-form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileFormValues>({
    defaultValues: {
      name: 'Admin Sarah',
      email: 'sarah@luunastore.com',
      role: 'Super Administrator'
    }
  });

  const onSaveGeneral = (data: GeneralFormValues) => {
    dispatch(updateSettings(data));
    dispatch(addActivityLog({
      user: 'Admin Sarah',
      action: 'Updated global store configuration settings',
      module: 'Settings',
      status: 'success'
    }));
    alert('Global store settings updated successfully.');
  };

  const onSaveProfile = (data: ProfileFormValues) => {
    dispatch(addActivityLog({
      user: 'Admin Sarah',
      action: 'Updated profile credentials & security passwords',
      module: 'Settings',
      status: 'success'
    }));
    alert('Profile & Security configuration updated successfully.');
  };

  const handleTemplateChange = (tpl: string) => {
    setSelectedTemplate(tpl);
    if (tpl === 'order_confirm') {
      setTemplateContent(`<html>
  <body>
    <h2>Thank you for your order, {{customer_name}}!</h2>
    <p>We are preparing your items. Order number: {{order_id}}</p>
    <p>Enjoy your Luuna Luxury experience.</p>
  </body>
</html>`);
    } else if (tpl === 'ship_alert') {
      setTemplateContent(`<html>
  <body>
    <h2>Your shipment is on the way!</h2>
    <p>Hi {{customer_name}}, your order has shipped with tracking number: {{tracking_id}}.</p>
  </body>
</html>`);
    } else {
      setTemplateContent(`<html>
  <body>
    <h2>Welcome to Luuna, {{customer_name}}!</h2>
    <p>Thank you for creating an account. Enjoy 10% off your first purchase using coupon WELCOME10.</p>
  </body>
</html>`);
    }
  };

  const onSaveTemplate = () => {
    dispatch(addActivityLog({
      user: 'Admin Sarah',
      action: `Modified email template parameters for: ${selectedTemplate}`,
      module: 'Settings',
      status: 'success'
    }));
    alert(`Email template '${selectedTemplate}' saved successfully.`);
  };

  const onSaveBranding = () => {
    dispatch(addActivityLog({
      user: 'Admin Sarah',
      action: 'Updated store theme colors and brand logo assets',
      module: 'Settings',
      status: 'success'
    }));
    alert('Theme & Branding settings updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: 'Settings', href: '/admin/settings' }]} />
        <h1 className="text-2xl font-bold text-text-custom mt-1 font-sans">Settings Panel</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-2 space-y-1">
            <button
              onClick={() => setActiveCategory('general')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'general' 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-bg-secondary text-text-custom/75'
              }`}
            >
              <Save className="w-4 h-4" />
              General Settings
            </button>
            <button
              onClick={() => setActiveCategory('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'profile' 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-bg-secondary text-text-custom/75'
              }`}
            >
              <User className="w-4 h-4" />
              Profile & Security
            </button>
            <button
              onClick={() => setActiveCategory('branding')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'branding' 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-bg-secondary text-text-custom/75'
              }`}
            >
              <Palette className="w-4 h-4" />
              Theme & Branding
            </button>
            <button
              onClick={() => setActiveCategory('templates')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'templates' 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-bg-secondary text-text-custom/75'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Templates
            </button>
          </Card>
        </div>

        {/* Categories form container */}
        <div className="lg:col-span-3">
          
          {/* 1. General Settings Form */}
          {activeCategory === 'general' && (
            <Card title="General Configurations">
              <form onSubmit={handleGeneralSubmit(onSaveGeneral)} className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Global Store Name"
                      {...registerGeneral('storeName', { required: 'Name is required' })}
                      error={generalErrors.storeName?.message}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Store Contact Address Email"
                      type="email"
                      {...registerGeneral('storeEmail', { required: 'Email is required' })}
                      error={generalErrors.storeEmail?.message}
                    />
                  </div>
                  <Select
                    label="Store Base Currency"
                    {...registerGeneral('currency')}
                    options={[
                      { value: 'USD', label: 'US Dollar ($)' },
                      { value: 'EUR', label: 'Euro (€)' },
                      { value: 'GBP', label: 'British Pound (£)' }
                    ]}
                  />
                  <Input
                    label="Default Sales Tax Rate (%)"
                    type="number"
                    step="0.01"
                    {...registerGeneral('taxRate', { valueAsNumber: true, required: 'Tax is required' })}
                    error={generalErrors.taxRate?.message}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Low Stock Warning Limit Threshold"
                      type="number"
                      {...registerGeneral('lowStockAlert', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-border-custom/50 flex justify-end">
                  <Button type="submit" className="flex items-center gap-1.5 text-xs">
                    <Check className="w-4 h-4" />
                    Save General Settings
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* 2. Profile & Password Security Form */}
          {activeCategory === 'profile' && (
            <Card title="Profile Credentials & Security">
              <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Administrator User Name"
                    {...registerProfile('name', { required: 'Name is required' })}
                    error={profileErrors.name?.message}
                  />
                  <Input
                    label="Role Label"
                    disabled
                    {...registerProfile('role')}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="User Login Email"
                      type="email"
                      {...registerProfile('email', { required: 'Email is required' })}
                      error={profileErrors.email?.message}
                    />
                  </div>
                </div>

                <div className="border-t border-border-custom/50 pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-text-custom uppercase tracking-wider">Change Password Settings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Current Password"
                      type="password"
                      {...registerProfile('oldPass')}
                      placeholder="••••••••"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      {...registerProfile('newPass')}
                      placeholder="Min 8 characters"
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      {...registerProfile('confirmPass')}
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border-custom/50 flex justify-end">
                  <Button type="submit" className="flex items-center gap-1.5 text-xs">
                    <Check className="w-4 h-4" />
                    Save Security Profiles
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* 3. Branding & Theme Settings Form */}
          {activeCategory === 'branding' && (
            <Card title="Theme Accent & Brand assets">
              <div className="space-y-6 mt-2 text-xs">
                
                {/* Theme Accents */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block">Theme Primary Accent Color</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'violet', color: 'bg-[#7C6EF6]', label: 'Violet (Active)' },
                      { id: 'slate', color: 'bg-slate-600', label: 'Slate' },
                      { id: 'emerald', color: 'bg-emerald-500', label: 'Emerald' },
                      { id: 'rose', color: 'bg-rose-500', label: 'Rose' }
                    ].map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setThemeAccent(theme.id)}
                        className={`px-3 py-2 rounded-lg border font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          themeAccent === theme.id 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-border-custom hover:bg-bg-secondary text-text-custom'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slogan */}
                <Input
                  label="Brand Slogan / Tagline"
                  value={storeSlogan}
                  onChange={(e) => setStoreSlogan(e.target.value)}
                  placeholder="e.g. Luxury items delivered"
                />

                {/* Logo Upload Zone */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block">Store Brand Logo</label>
                  <div className="border border-border-custom bg-bg-secondary/40 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={logoUrl} alt="Logo" className="w-12 h-12 object-cover rounded-lg border border-border-custom" />
                      <div>
                        <p className="font-bold text-text-custom">store-logo-dark.png</p>
                        <p className="text-3xs text-text-custom/40 font-semibold">WEBP, PNG format accepted (Mock)</p>
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-1 text-2xs p-2 h-8">
                      <Upload className="w-3.5 h-3.5" />
                      Replace Asset
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-custom/50 flex justify-end">
                  <Button onClick={onSaveBranding} className="flex items-center gap-1.5 text-xs">
                    <Check className="w-4 h-4" />
                    Save Branding Configurations
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* 4. Notification Templates Form */}
          {activeCategory === 'templates' && (
            <Card title="Transactional Email Template Customizer">
              <div className="space-y-4 mt-2 text-xs">
                
                <Select
                  label="Select Template to Customize"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  options={[
                    { value: 'order_confirm', label: 'Order Confirmation Email' },
                    { value: 'ship_alert', label: 'Shipping Alert Email' },
                    { value: 'welcome_customer', label: 'Customer Welcome Email' }
                  ]}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block">Raw Template Code Markup</label>
                  <textarea
                    rows={8}
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    className="w-full font-mono text-xs px-3 py-2 border border-border-custom rounded-lg bg-bg-secondary/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-border-custom/50 flex justify-end">
                  <Button onClick={onSaveTemplate} className="flex items-center gap-1.5 text-xs">
                    <Check className="w-4 h-4" />
                    Save HTML Template
                  </Button>
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
