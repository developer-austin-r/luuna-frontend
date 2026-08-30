"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  Check,
  CreditCard,
  Download,
  HelpCircle,
  Save,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useAppDispatch } from "@/redux/hooks";
import { addActivityLog } from "@/redux/slices/admin-slice";

interface BillingFormValues {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function BillingPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<
    "overview" | "payment" | "invoices" | "plans"
  >("overview");
  const [selectedPlan, setSelectedPlan] = useState<
    "starter" | "growth" | "enterprise"
  >("growth");
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Credit card real-time visualization states (bound to form inputs)
  const [cardName, setCardName] = useState("JOHN DOE");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  const [cardExpiry, setCardExpiry] = useState("MM/YY");
  const [cardCvv, setCardCvv] = useState("•••");
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BillingFormValues>({
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      address: "123 Luuna Blvd, Suite 100",
      city: "San Francisco",
      postalCode: "94103",
      country: "US",
    },
  });

  const onUpdatePayment = (data: BillingFormValues) => {
    setIsUpdating(true);
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setSuccessMessage(
        "Your payment method and billing address have been updated successfully!",
      );
      dispatch(
        addActivityLog({
          user: "Admin Sarah",
          action: "Updated company billing details and payment card",
          module: "Billing",
          status: "success",
        }),
      );
      reset(data);
    }, 1500);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    const formatted = parts.length > 0 ? parts.join(" ") : value;
    setValue("cardNumber", formatted);
    setCardNumber(formatted || "•••• •••• •••• ••••");
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setValue("expiryDate", value);
    setCardExpiry(value || "MM/YY");
  };

  // Mock invoice data
  const invoices = [
    {
      id: "INV-2026-004",
      date: "2026-08-15",
      amount: 49.0,
      status: "paid",
      method: "Visa •••• 4242",
    },
    {
      id: "INV-2026-003",
      date: "2026-07-15",
      amount: 49.0,
      status: "paid",
      method: "Visa •••• 4242",
    },
    {
      id: "INV-2026-002",
      date: "2026-06-15",
      amount: 49.0,
      status: "paid",
      method: "Visa •••• 4242",
    },
    {
      id: "INV-2026-001",
      date: "2026-05-15",
      amount: 49.0,
      status: "paid",
      method: "Visa •••• 4242",
    },
    {
      id: "INV-2026-000",
      date: "2026-04-15",
      amount: 29.0,
      status: "refunded",
      method: "Mastercard •••• 8888",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Breadcrumb items={[{ label: "Billing", href: "/admin/billing" }]} />
          <h1 className="text-2xl font-bold text-text-custom mt-1 font-sans">
            Billing & Subscriptions
          </h1>
          <p className="text-xs text-text-custom/60 mt-0.5">
            Manage your subscription plans, payment cards, billing address, and
            download past invoices.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "plans" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("plans")}
            className="flex items-center gap-1 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-custom gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-text-custom/60 hover:text-text-custom hover:border-border-custom"
          }`}
        >
          Overview & Utilization
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "payment"
              ? "border-primary text-primary"
              : "border-transparent text-text-custom/60 hover:text-text-custom hover:border-border-custom"
          }`}
        >
          Payment Methods & Form
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "invoices"
              ? "border-primary text-primary"
              : "border-transparent text-text-custom/60 hover:text-text-custom hover:border-border-custom"
          }`}
        >
          Invoice History
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "plans"
              ? "border-primary text-primary"
              : "border-transparent text-text-custom/60 hover:text-text-custom hover:border-border-custom"
          }`}
        >
          Compare Subscription Plans
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* 1. Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription Detail Card */}
            <Card title="Current Subscription Plan" className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border-custom/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-text-custom">
                      Growth Professional
                    </span>
                    <span className="px-2 py-0.5 text-3xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-text-custom/50 mt-1">
                    Your next renewal date is{" "}
                    <strong className="text-text-custom">
                      September 15, 2026
                    </strong>{" "}
                    for <strong className="text-text-custom">$49.00/mo</strong>.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("plans")}
                  >
                    Change Plan
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActiveTab("payment")}
                  >
                    Update Card
                  </Button>
                </div>
              </div>

              {/* Utilisation Metrics */}
              <div className="py-6 space-y-5">
                <h4 className="text-xs font-bold text-text-custom uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Monthly Resource Consumption
                </h4>

                <div className="space-y-3">
                  {/* API Limits */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-text-custom">
                        API Endpoints Requests
                      </span>
                      <span className="text-text-custom/70">
                        72,500 / 100,000 (72.5%)
                      </span>
                    </div>
                    <div className="w-full bg-bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: "72.5%" }}
                      />
                    </div>
                  </div>

                  {/* Storage limits */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-text-custom">
                        Digital Assets Storage
                      </span>
                      <span className="text-text-custom/70">
                        24.8 GB / 50 GB (49.6%)
                      </span>
                    </div>
                    <div className="w-full bg-bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-violet-500 h-full rounded-full transition-all duration-500"
                        style={{ width: "49.6%" }}
                      />
                    </div>
                  </div>

                  {/* Active seats */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-text-custom">
                        Team Member Accounts
                      </span>
                      <span className="text-text-custom/70 font-mono">
                        4 / 10 Users (40.0%)
                      </span>
                    </div>
                    <div className="w-full bg-bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: "40%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert reminder */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
                <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-custom">
                    Enterprise Tier trial is available
                  </p>
                  <p className="text-2xs text-text-custom/60 mt-1">
                    Upgrade to Enterprise to gain access to automated SLA
                    guarantees, unlimited database integration, customized API
                    workflows, and 24/7 dedicated telephone support channels.
                  </p>
                  <button
                    className="text-2xs font-semibold text-primary mt-2 hover:underline inline-flex items-center gap-0.5"
                    onClick={() => setActiveTab("plans")}
                  >
                    Learn more about Enterprise
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Quick Summary Right Panel */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <Card title="Payment Method">
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden h-36 flex flex-col justify-between">
                    {/* Background decorations */}
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                    <div className="absolute top-0 right-10 w-16 h-16 bg-violet-500/10 rounded-full blur-lg pointer-events-none" />

                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold tracking-widest text-slate-400">
                        LUUNA CORP
                      </span>
                      <div className="h-6 w-10 relative">
                        <div className="absolute top-0 left-0 bg-red-500 w-5 h-5 rounded-full opacity-80" />
                        <div className="absolute top-0 right-0 bg-yellow-500 w-5 h-5 rounded-full opacity-80" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-mono tracking-widest text-slate-200">
                        •••• •••• •••• 4242
                      </p>
                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <p className="text-4xs text-slate-400 uppercase">
                            Cardholder
                          </p>
                          <p className="text-xs font-bold truncate max-w-32">
                            Sarah Connor
                          </p>
                        </div>
                        <div>
                          <p className="text-4xs text-slate-400 uppercase">
                            Expires
                          </p>
                          <p className="text-xs font-bold">12/28</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-custom/50">Card Type</span>
                      <span className="font-semibold text-text-custom">
                        Visa Classic
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-custom/50">Billing Email</span>
                      <span className="font-semibold text-text-custom">
                        billing@luunastore.com
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-custom/50">Phone</span>
                      <span className="font-semibold text-text-custom">
                        +1 (555) 019-2834
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setActiveTab("payment")}
                  >
                    Edit Card Details
                  </Button>
                </div>
              </Card>

              {/* Quick Info Help Card */}
              <Card title="Billing Support">
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-custom">
                        How do invoices work?
                      </p>
                      <p className="text-text-custom/60 mt-1">
                        Invoices are automatically generated on the 15th of each
                        month and emailed to your billing email address.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-custom">
                        Secure payments encryption
                      </p>
                      <p className="text-text-custom/60 mt-1">
                        All transactions are processed securely through 256-bit
                        SSL encrypted channels. We do not store card credentials
                        directly.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 2. Payment Methods & Form Tab */}
        {activeTab === "payment" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form Card */}
            <Card title="Update Credit Card & Billing Info">
              {successMessage && (
                <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-start gap-2 text-xs">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onUpdatePayment)}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-text-custom uppercase tracking-wider pb-2 border-b border-border-custom/50">
                    Card Information
                  </h4>

                  <Input
                    label="Cardholder Name"
                    placeholder="e.g. John Doe"
                    {...register("cardholderName", {
                      required: "Name is required",
                      onChange: (e) =>
                        setCardName(e.target.value.toUpperCase() || "JOHN DOE"),
                    })}
                    error={errors.cardholderName?.message}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Card Number"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        {...register("cardNumber", {
                          required: "Card number is required",
                          minLength: {
                            value: 15,
                            message: "Invalid card number",
                          },
                          onChange: handleCardNumberChange,
                        })}
                        error={errors.cardNumber?.message}
                      />
                    </div>
                    <div>
                      <Input
                        label="Expiry Date"
                        placeholder="MM/YY"
                        maxLength={5}
                        {...register("expiryDate", {
                          required: "Expiry required",
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                            message: "Use MM/YY",
                          },
                          onChange: handleExpiryChange,
                        })}
                        error={errors.expiryDate?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      label="CVV / CVC"
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      {...register("cvv", {
                        required: "CVV is required",
                        minLength: { value: 3, message: "Min 3 digits" },
                        onChange: (e) => setCardCvv(e.target.value || "•••"),
                      })}
                      onFocus={() => setIsCvvFocused(true)}
                      onBlur={() => setIsCvvFocused(false)}
                      error={errors.cvv?.message}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-bold text-text-custom uppercase tracking-wider pb-2 border-b border-border-custom/50">
                    Billing Address
                  </h4>

                  <Input
                    label="Street Address"
                    placeholder="e.g. 123 Main St"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    error={errors.address?.message}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      placeholder="e.g. San Francisco"
                      {...register("city", { required: "City is required" })}
                      error={errors.city?.message}
                    />
                    <Input
                      label="Postal Code"
                      placeholder="e.g. 94103"
                      {...register("postalCode", { required: "ZIP required" })}
                      error={errors.postalCode?.message}
                    />
                    <Select
                      label="Country"
                      options={[
                        { value: "US", label: "United States" },
                        { value: "CA", label: "Canada" },
                        { value: "GB", label: "United Kingdom" },
                        { value: "DE", label: "Germany" },
                        { value: "IN", label: "India" },
                      ]}
                      {...register("country")}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border-custom/50 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    className="text-xs"
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    className="flex items-center gap-1.5 text-xs"
                    isLoading={isUpdating}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            {/* Credit Card Mockup Interactive Display */}
            <div className="space-y-6 flex flex-col items-center">
              <span className="text-xs font-bold text-text-custom/50 uppercase tracking-wider self-start">
                Interactive Preview
              </span>

              {/* Perspective container to support flipping on CVV focus */}
              <div className="w-full max-w-sm h-56 [perspective:1000px] cursor-pointer group">
                <div
                  className={`relative w-full h-full text-white shadow-2xl rounded-2xl transition-all duration-700 [transform-style:preserve-3d] ${
                    isCvvFocused ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* FRONT SIDE OF CARD */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 flex flex-col justify-between [backface-visibility:hidden] border border-white/10 shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/10 rounded-full blur-xl pointer-events-none" />

                    <div className="flex justify-between items-start z-10">
                      <div>
                        <p className="text-xs font-bold tracking-widest text-indigo-300">
                          LUUNA SaaS
                        </p>
                        <p className="text-4xs text-indigo-400/80">
                          PREMIUM CUSTOMER
                        </p>
                      </div>
                      <div className="h-7 w-12 relative flex justify-end items-center">
                        {cardNumber.startsWith("4") ? (
                          <span className="text-sm font-bold italic tracking-wide text-white">
                            VISA
                          </span>
                        ) : cardNumber.startsWith("5") ? (
                          <div className="flex">
                            <div className="w-5 h-5 bg-red-500 rounded-full mr-[-8px] opacity-90" />
                            <div className="w-5 h-5 bg-yellow-500 rounded-full opacity-90" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-300">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-4xs font-bold">CARD</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="z-10">
                      {/* Gold Chip Mock */}
                      <div className="w-9 h-7 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 rounded-md border border-amber-300/40 mb-3 shadow-inner flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-0.5 w-6 h-5 opacity-60">
                          <div className="border border-slate-900/10" />
                          <div className="border border-slate-900/10" />
                          <div className="border border-slate-900/10" />
                          <div className="border border-slate-900/10" />
                          <div className="border border-slate-900/10" />
                          <div className="border border-slate-900/10" />
                        </div>
                      </div>
                      <p className="text-base font-mono tracking-widest text-slate-100">
                        {cardNumber}
                      </p>
                    </div>

                    <div className="flex justify-between items-end z-10">
                      <div>
                        <p className="text-5xs text-slate-400 uppercase">
                          Cardholder
                        </p>
                        <p className="text-xs font-semibold uppercase truncate max-w-44 font-mono">
                          {cardName}
                        </p>
                      </div>
                      <div>
                        <p className="text-5xs text-slate-400 uppercase">
                          Expires
                        </p>
                        <p className="text-xs font-semibold font-mono">
                          {cardExpiry}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE OF CARD */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] border border-white/10 shadow-lg">
                    {/* Magnetic Strip */}
                    <div className="absolute top-6 left-0 w-full h-10 bg-slate-950" />

                    <div className="mt-14 w-full">
                      <div className="flex items-center justify-between">
                        <div className="w-10/12 h-8 bg-white/10 rounded px-3 flex items-center justify-end font-mono italic text-slate-300 text-xs">
                          •••• •••• ••••
                        </div>
                        <div className="w-2/12 h-8 bg-amber-100 text-slate-900 font-mono flex items-center justify-center font-bold text-xs rounded-r">
                          {cardCvv}
                        </div>
                      </div>
                      <p className="text-5xs text-slate-400 uppercase mt-1">
                        CVV / Security Code
                      </p>
                    </div>

                    <div className="text-4xs text-slate-400 leading-3">
                      This card is property of LUUNA Corp. Use of this card is
                      governed by the terms of service agreement. Secured
                      transaction services are routed through standard payment
                      gateways.
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 border border-border-custom rounded-xl p-4 text-xs max-w-sm flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-custom">
                    Interactive Mockup Guide
                  </p>
                  <p className="text-text-custom/60 mt-1">
                    Try entering standard card numbers. Focus the CVV field to
                    see the credit card rotate in 3D to display its back side.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Invoices History Tab */}
        {activeTab === "invoices" && (
          <Card title="Past Transactions Invoices">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-custom text-3xs font-bold text-text-custom/50 uppercase tracking-wider bg-bg-secondary/20">
                    <th className="px-6 py-3.5">Invoice ID</th>
                    <th className="px-6 py-3.5">Date Issued</th>
                    <th className="px-6 py-3.5">Method</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/40">
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-bg-secondary/10 transition-colors text-xs"
                    >
                      <td className="px-6 py-3 font-mono font-bold text-text-custom">
                        {inv.id}
                      </td>
                      <td className="px-6 py-3 text-text-custom/70">
                        {new Date(inv.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-3 text-text-custom/60 font-mono text-2xs">
                        {inv.method}
                      </td>
                      <td className="px-6 py-3 font-bold text-text-custom">
                        ${inv.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() =>
                            alert(`Initiated download of ${inv.id}.pdf`)
                          }
                          className="p-1.5 rounded-lg text-text-custom/50 hover:text-primary hover:bg-primary/5 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Download PDF Invoice"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="text-3xs font-semibold">PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 4. Compare Subscription Plans Tab */}
        {activeTab === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                selectedPlan === "starter"
                  ? "ring-2 ring-primary border-transparent scale-102 shadow-md"
                  : "border-border-custom hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-text-custom">
                      Starter Tier
                    </h3>
                    <p className="text-3xs text-text-custom/50 mt-0.5">
                      For small developers & testing
                    </p>
                  </div>
                  {selectedPlan === "starter" && (
                    <span className="px-2 py-0.5 text-4xs font-semibold bg-primary/10 text-primary rounded-full uppercase">
                      Current
                    </span>
                  )}
                </div>
                <div className="my-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-text-custom">
                      $0
                    </span>
                    <span className="text-xs text-text-custom/50 ml-1">
                      /mo
                    </span>
                  </div>
                  <p className="text-3xs text-text-custom/40 mt-1">
                    Free forever with basic limits
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-text-custom/70 pt-2 border-t border-border-custom/50">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Up to 10,000 monthly API calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>2 GB digital asset storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>1 team user seat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Community email support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button
                  variant={selectedPlan === "starter" ? "outline" : "secondary"}
                  className="w-full text-xs"
                  disabled={selectedPlan === "starter"}
                  onClick={() => {
                    setSelectedPlan("starter");
                    alert("Switched to Starter Plan (Mock)");
                  }}
                >
                  {selectedPlan === "starter"
                    ? "Your Current Plan"
                    : "Downgrade to Starter"}
                </Button>
              </div>
            </div>

            {/* Growth Plan (Popular) */}
            <div
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between relative transition-all duration-300 ${
                selectedPlan === "growth"
                  ? "ring-2 ring-primary border-transparent scale-102 shadow-lg"
                  : "border-border-custom hover:shadow-md"
              }`}
            >
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-4xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Popular Choice
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-text-custom">
                      Growth Professional
                    </h3>
                    <p className="text-3xs text-text-custom/50 mt-0.5">
                      For growing retail systems & SaaS
                    </p>
                  </div>
                  {selectedPlan === "growth" && (
                    <span className="px-2 py-0.5 text-4xs font-semibold bg-primary/10 text-primary rounded-full uppercase">
                      Current
                    </span>
                  )}
                </div>
                <div className="my-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-text-custom">
                      $49
                    </span>
                    <span className="text-xs text-text-custom/50 ml-1">
                      /mo
                    </span>
                  </div>
                  <p className="text-3xs text-text-custom/40 mt-1">
                    Billed monthly, cancel anytime
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-text-custom/70 pt-2 border-t border-border-custom/50">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Up to 100,000 monthly API calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>50 GB digital asset storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Up to 10 team seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Standard SLA ticket support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button
                  variant={selectedPlan === "growth" ? "outline" : "primary"}
                  className="w-full text-xs"
                  disabled={selectedPlan === "growth"}
                  onClick={() => {
                    setSelectedPlan("growth");
                    alert("Switched to Growth Plan (Mock)");
                  }}
                >
                  {selectedPlan === "growth"
                    ? "Your Current Plan"
                    : "Choose Growth"}
                </Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                selectedPlan === "enterprise"
                  ? "ring-2 ring-primary border-transparent scale-102 shadow-md"
                  : "border-border-custom hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-text-custom">
                      Enterprise Tier
                    </h3>
                    <p className="text-3xs text-text-custom/50 mt-0.5">
                      For corporate organizations
                    </p>
                  </div>
                  {selectedPlan === "enterprise" && (
                    <span className="px-2 py-0.5 text-4xs font-semibold bg-primary/10 text-primary rounded-full uppercase">
                      Current
                    </span>
                  )}
                </div>
                <div className="my-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-text-custom">
                      $299
                    </span>
                    <span className="text-xs text-text-custom/50 ml-1">
                      /mo
                    </span>
                  </div>
                  <p className="text-3xs text-text-custom/40 mt-1">
                    Billed annually ($2,990/year)
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-text-custom/70 pt-2 border-t border-border-custom/50">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited monthly API calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>500 GB asset storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited team user seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated support line (24/7/365)</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button
                  variant={
                    selectedPlan === "enterprise" ? "outline" : "primary"
                  }
                  className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={selectedPlan === "enterprise"}
                  onClick={() => {
                    setSelectedPlan("enterprise");
                    alert("Switched to Enterprise Plan (Mock)");
                  }}
                >
                  {selectedPlan === "enterprise"
                    ? "Your Current Plan"
                    : "Upgrade to Enterprise"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
