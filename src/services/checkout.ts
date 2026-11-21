import { apiClient } from "./api-client";

type Envelope<T> = { data: T };

export interface CheckoutOrderInput {
  checkoutId: string;
  shippingMethod: "standard" | "fast";
  expectedAmount: number;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface CheckoutOrder {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  paymentId: string | null;
}

interface GatewayOrder {
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

interface PaymentResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (result: PaymentResult) => void;
  modal: { ondismiss: () => void };
}

type RazorpayConstructor = new (options: RazorpayOptions) => {
  open: () => void;
  on: (event: "payment.failed", handler: () => void) => void;
};

let loadingScript: Promise<RazorpayConstructor> | undefined;

function loadCheckout() {
  const checkoutWindow = window as Window & { Razorpay?: RazorpayConstructor };
  if (checkoutWindow.Razorpay) return Promise.resolve(checkoutWindow.Razorpay);
  loadingScript ??= new Promise<RazorpayConstructor>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    const timeout = window.setTimeout(fail, 15_000);
    function fail() {
      window.clearTimeout(timeout);
      script.remove();
      loadingScript = undefined;
      reject(new Error("Razorpay Checkout could not load. Please try again."));
    }
    script.onload = () => {
      window.clearTimeout(timeout);
      const Razorpay = checkoutWindow.Razorpay;
      if (Razorpay) resolve(Razorpay);
      else fail();
    };
    script.onerror = fail;
    document.head.append(script);
  });
  return loadingScript;
}

export async function createCheckoutOrder(input: CheckoutOrderInput) {
  return (
    await apiClient<Envelope<CheckoutOrder>>("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(input),
    })
  ).data;
}

export async function initiateCheckoutPayment(orderId: string) {
  return (
    await apiClient<Envelope<GatewayOrder>>("/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    })
  ).data;
}

export async function openCheckout(
  order: GatewayOrder,
  prefill: RazorpayOptions["prefill"],
  onFailure: () => void,
) {
  const Razorpay = await loadCheckout();
  return new Promise<PaymentResult | null>((resolve) => {
    const checkout = new Razorpay({
      key: order.keyId,
      order_id: order.razorpayOrderId,
      amount: order.amount,
      currency: order.currency,
      name: "Luuna",
      prefill,
      theme: { color: "#140824" },
      handler: resolve,
      modal: { ondismiss: () => resolve(null) },
    });
    checkout.on("payment.failed", onFailure);
    checkout.open();
  });
}

export async function verifyCheckoutPayment(result: PaymentResult) {
  return (
    await apiClient<Envelope<{ status: string; paymentId: string }>>(
      "/payments/verify",
      {
        method: "POST",
        body: JSON.stringify(result),
      },
    )
  ).data;
}

export async function getCheckoutPaymentStatus(paymentId: string) {
  const { data } = await apiClient<Envelope<{ status: string }>>(
    `/payments/${encodeURIComponent(paymentId)}`,
    { cache: "no-store" },
  );
  return data.status;
}
