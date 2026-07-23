"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileText,
  Printer,
  RefreshCcw,
  Truck,
  User,
} from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Modal,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addActivityLog,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/redux/slices/admin-slice";

interface RefundFormValues {
  refundAmount: number;
  reason: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = params.id as string;

  // State selectors
  const orders = useAppSelector((state) => state.admin.orders);
  const order = orders.find((o) => o.id === id);

  // Modal Toggles
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Hook Form for Refund
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RefundFormValues>({
    defaultValues: {
      refundAmount: order?.total || 0,
      reason: "Customer Return",
    },
  });

  if (!order) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Orders", href: "/admin/orders" },
            { label: "Not Found" },
          ]}
        />
        <Card className="text-center py-12">
          <p className="text-sm font-semibold text-text-custom/60">
            Order file not found.
          </p>
          <Button onClick={() => router.push("/admin/orders")} className="mt-4">
            Back to Orders
          </Button>
        </Card>
      </div>
    );
  }

  // Mock order items list
  const orderItems = [
    {
      id: "item-1",
      name: "Classic Leather Tote Bag",
      sku: "BG-LTH-01",
      price: 159.0,
      quantity: 2,
      total: 318.0,
    },
  ];

  // Pricing calculations
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const shippingCost =
    order.shippingMethod === "Express Shipping" ? 14.99 : 5.99;
  const total = subtotal + tax + shippingCost;

  // Workflow Progress Timeline
  const workflowSteps = [
    { label: "Placed", active: true, done: true },
    {
      label: "Paid",
      active: order.paymentStatus === "paid",
      done: order.paymentStatus === "paid",
    },
    {
      label: "Shipped",
      active: order.status === "shipped" || order.status === "delivered",
      done: order.status === "shipped" || order.status === "delivered",
    },
    {
      label: "Delivered",
      active: order.status === "delivered",
      done: order.status === "delivered",
    },
  ];

  const handleStatusChange = (status: typeof order.status) => {
    dispatch(updateOrderStatus({ id: order.id, status }));
    dispatch(
      addActivityLog({
        user: "Admin Sarah",
        action: `Set shipment progress of order ${order.id} to "${status}"`,
        module: "Orders",
        status: "success",
      }),
    );
  };

  const handleRefundSubmit = (data: RefundFormValues) => {
    dispatch(
      updateOrderPaymentStatus({ id: order.id, paymentStatus: "refunded" }),
    );
    dispatch(updateOrderStatus({ id: order.id, status: "cancelled" }));
    dispatch(
      addActivityLog({
        user: "Admin Sarah",
        action: `Issued refund of $${data.refundAmount} on order ${order.id}. Reason: "${data.reason}"`,
        module: "Orders",
        status: "success",
      }),
    );
    setRefundModalOpen(false);
    alert(
      `Refund of $${data.refundAmount} has been processed for ${order.customerName}.`,
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/orders")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <Breadcrumb
              items={[
                { label: "Orders", href: "/admin/orders" },
                { label: order.id },
              ]}
            />
            <h1 className="text-2xl font-bold text-text-custom mt-1">
              Order details
            </h1>
          </div>
        </div>

        <div className="flex gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInvoiceModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-primary" />
            Invoice
          </Button>
          {order.paymentStatus !== "refunded" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefundModalOpen(true)}
              className="flex items-center gap-1.5 border-red-200 text-red-500 hover:bg-red-50"
            >
              <RefreshCcw className="w-4 h-4" />
              Refund Order
            </Button>
          )}
          <span className="flex items-center">
            <StatusBadge status={order.status} />
          </span>
        </div>
      </div>

      {/* Workflow Steps Tracker */}
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-2 px-4">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full shrink-0 ${
                    step.done
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold ${step.done ? "text-primary" : "text-text-custom/50"}`}
                  >
                    Order {step.label}
                  </p>
                  <p className="text-3xs text-text-custom/40 font-medium">
                    {step.done ? "Completed" : "Pending step"}
                  </p>
                </div>
              </div>
              {idx < workflowSteps.length - 1 && (
                <div className="hidden md:block flex-1 h-0.5 bg-border-custom" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Details Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Items & Invoices */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Ordered Items">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-text-custom mt-2">
                <thead>
                  <tr className="bg-bg-secondary border-b border-border-custom text-text-custom/75 font-semibold">
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3 text-center">SKU Barcode</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/50 font-medium">
                  {orderItems.map((item) => (
                    <tr key={item.id} className="hover:bg-bg-secondary/40">
                      <td className="px-4 py-3 font-bold">{item.name}</td>
                      <td className="px-4 py-3 text-center font-mono">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-bold">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations */}
            <div className="border-t border-border-custom pt-4 flex flex-col items-end gap-2 text-xs">
              <div className="flex justify-between w-64">
                <span className="text-text-custom/50 font-semibold">
                  Subtotal:
                </span>
                <span className="font-bold text-text-custom">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-64">
                <span className="text-text-custom/50 font-semibold">
                  Sales Tax (8%):
                </span>
                <span className="font-bold text-text-custom">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-64">
                <span className="text-text-custom/50 font-semibold">
                  Shipping Cost:
                </span>
                <span className="font-bold text-text-custom">
                  ${shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-64 border-t border-border-custom/80 pt-2 text-sm">
                <span className="text-text-custom font-extrabold">
                  Final Total:
                </span>
                <span className="font-extrabold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Customer info & Actions */}
        <div className="space-y-6">
          {/* Customer info card */}
          <Card title="Customer Information">
            <div className="space-y-4 mt-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-text-custom text-sm">
                    {order.customerName}
                  </p>
                  <p className="text-text-custom/50 font-medium">
                    {order.email}
                  </p>
                </div>
              </div>

              <div className="border-t border-border-custom/50 pt-4 space-y-2.5">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-text-custom/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-text-custom">
                      Shipping Address
                    </p>
                    <p className="text-text-custom/75 mt-0.5">
                      4582 Oakwood Avenue, Suite 100, Los Angeles, CA 90004
                    </p>
                    <p className="text-3xs text-text-custom/40 font-bold uppercase tracking-wider mt-1">
                      Carrier Method: {order.shippingMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-t border-border-custom/50 pt-3">
                  <CreditCard className="w-4 h-4 text-text-custom/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-text-custom">
                      Settlement Details
                    </p>
                    <p className="text-text-custom/75 mt-0.5">
                      Payment Method: Visa Ending *2834
                    </p>
                    <p className="text-3xs text-text-custom/40 font-bold uppercase tracking-wider mt-1">
                      Payment Status:{" "}
                      <span className="font-bold text-text-custom uppercase">
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Workflow Status Actions */}
          <Card title="Workflow Adjustments">
            <div className="flex flex-col gap-2 mt-2">
              <Button
                onClick={() => handleStatusChange("processing")}
                variant={order.status === "processing" ? "primary" : "outline"}
                className="w-full text-xs"
              >
                Mark Processing
              </Button>
              <Button
                onClick={() => handleStatusChange("shipped")}
                variant={order.status === "shipped" ? "primary" : "outline"}
                className="w-full text-xs"
              >
                Mark Shipped
              </Button>
              <Button
                onClick={() => handleStatusChange("delivered")}
                variant={order.status === "delivered" ? "primary" : "outline"}
                className="w-full text-xs"
              >
                Mark Delivered
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Invoice Modal Overlay */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Tax Invoice"
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setInvoiceModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handlePrint}
              className="flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </Button>
          </>
        }
      >
        {/* Printable Area */}
        <div className="space-y-8 font-sans p-2" id="printable-invoice">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-lg font-bold text-primary tracking-wider">
                LUUNA LUXURY
              </span>
              <p className="text-3xs text-text-custom/50">
                842 Sunset Blvd, Los Angeles, CA 90028
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-text-custom">
                INVOICE
              </span>
              <p className="text-3xs font-mono text-text-custom/50">
                #INV-{order.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border-custom pt-4 text-xs">
            <div>
              <p className="font-bold text-text-custom/50 uppercase tracking-wider text-3xs">
                Billed To
              </p>
              <p className="font-bold text-text-custom mt-1">
                {order.customerName}
              </p>
              <p className="text-text-custom/75 mt-0.5">{order.email}</p>
              <p className="text-text-custom/75">
                4582 Oakwood Avenue, Suite 100, Los Angeles, CA 90004
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-text-custom/50 uppercase tracking-wider text-3xs">
                Invoice Details
              </p>
              <p className="text-text-custom/75 mt-1" suppressHydrationWarning>
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
              <p className="text-text-custom/75">
                Payment Method: Visa Card (*2834)
              </p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-left border-collapse text-xs mt-6">
            <thead>
              <tr className="bg-bg-secondary border-b border-border-custom text-text-custom/70">
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2 text-right">Unit Price</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/50 font-medium">
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2.5 font-bold">{item.name}</td>
                  <td className="px-4 py-2.5 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-right font-bold">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invoice Totals */}
          <div className="flex flex-col items-end gap-1.5 text-xs border-t border-border-custom pt-4">
            <div className="flex justify-between w-48">
              <span className="text-text-custom/50">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-48">
              <span className="text-text-custom/50">Sales Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-48">
              <span className="text-text-custom/50">Shipping Rate:</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-48 font-extrabold text-sm border-t border-border-custom pt-1.5 text-primary">
              <span>Invoice Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="Issue Refund"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setRefundModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSubmit(handleRefundSubmit)}>
              Confirm Refund
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Refund Amount ($)"
            type="number"
            step="0.01"
            {...register("refundAmount", {
              valueAsNumber: true,
              required: "Refund amount is required",
            })}
            error={errors.refundAmount?.message}
          />
          <Select
            label="Refund Reason"
            {...register("reason")}
            options={[
              {
                value: "Customer Return",
                label: "Customer Return / Return Request",
              },
              {
                value: "Out of Stock",
                label: "Inventory Out of Stock / Unfulfilled",
              },
              {
                value: "Damaged Item",
                label: "Damaged Goods / Quality issues",
              },
              {
                value: "Incorrect Item Sent",
                label: "Fulfillment Error / Swap",
              },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
}
