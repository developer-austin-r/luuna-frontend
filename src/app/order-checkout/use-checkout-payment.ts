"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiRequestError } from "@/services/api-client";
import {
  createCheckoutOrder,
  getCheckoutPaymentStatus,
  initiateCheckoutPayment,
  openCheckout,
  verifyCheckoutPayment,
} from "@/services/checkout";

const checkoutKey = "luuna:pending-checkout";

type CheckoutState = {
  orderId: string;
  orderNumber: string;
  paymentId: string;
};

export function useCheckoutPayment() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [paidOrder, setPaidOrder] = useState("");
  const [pendingPayment, setPendingPayment] = useState<CheckoutState | null>(
    null,
  );
  const running = useRef(false);
  const checkoutId = useRef<string | null>(null);

  function getAttemptId() {
    if (checkoutId.current) return checkoutId.current;
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(checkoutKey);
    } catch {
      // The in-memory checkout ID still supports retries.
    }
    const id =
      saved && /^[0-9a-f-]{36}$/i.test(saved) ? saved : crypto.randomUUID();
    checkoutId.current = id;
    try {
      sessionStorage.setItem(checkoutKey, id);
    } catch {
      // The in-memory checkout ID still supports retries.
    }
    return id;
  }

  function finishAttempt() {
    checkoutId.current = null;
    try {
      sessionStorage.removeItem(checkoutKey);
    } catch {
      // Storage may be unavailable.
    }
  }

  function finishPaid(orderId: string, orderNumber: string) {
    setPaidOrder(orderNumber);
    setPendingPayment(null);
    setMessage("");
    finishAttempt();
    router.replace(`/order-confirmation/${encodeURIComponent(orderId)}`);
  }

  function applyStatus(status: string, payment: CheckoutState) {
    if (status === "CAPTURED") {
      finishPaid(payment.orderId, payment.orderNumber);
    } else if (status === "FAILED") {
      setPendingPayment(null);
      setMessage("Payment failed. You can retry from checkout.");
    } else {
      setPendingPayment(payment);
      setMessage(
        "Payment confirmation is pending. Check the status before trying again.",
      );
    }
  }

  function reportError(error: unknown) {
    if (error instanceof ApiRequestError && error.status === 401) {
      setNeedsLogin(true);
      setMessage("Sign in to continue with checkout.");
    } else {
      if (
        !pendingPayment &&
        error instanceof ApiRequestError &&
        error.status === 409
      ) {
        finishAttempt();
      }
      setMessage(
        error instanceof Error
          ? error.message
          : "Checkout could not be completed.",
      );
    }
  }

  async function submit(
    fields: FormData,
    shippingMethod: "standard" | "fast",
    expectedAmount: number,
  ) {
    if (running.current || pendingPayment || paidOrder) return;
    running.current = true;
    setBusy(true);
    setNeedsLogin(false);
    setMessage("");
    const field = (name: string) => String(fields.get(name) ?? "").trim();
    const name = [field("givenName"), field("familyName")]
      .filter(Boolean)
      .join(" ");
    const phone = "+91" + field("phone");

    try {
      const order = await createCheckoutOrder({
        checkoutId: getAttemptId(),
        shippingMethod,
        expectedAmount,
        address: field("address"),
        city: field("city"),
        state: field("state"),
        postalCode: field("pincode"),
        phone,
      });

      if (order.paymentStatus === "PAID") {
        finishPaid(order.id, order.orderNumber);
        return;
      }
      if (
        order.orderStatus !== "PENDING" ||
        order.paymentStatus !== "PENDING"
      ) {
        finishAttempt();
        setMessage(
          "This order is no longer payable. Click Place Order to start a new attempt.",
        );
        return;
      }
      if (order.paymentId) {
        applyStatus(await getCheckoutPaymentStatus(order.paymentId), {
          orderId: order.id,
          paymentId: order.paymentId,
          orderNumber: order.orderNumber,
        });
        return;
      }

      const gatewayOrder = await initiateCheckoutPayment(order.id);
      if (
        !gatewayOrder.keyId ||
        !gatewayOrder.razorpayOrderId ||
        gatewayOrder.amount !== expectedAmount ||
        gatewayOrder.currency !== "INR"
      ) {
        throw new Error(
          "The payment amount or currency could not be confirmed. No payment was started.",
        );
      }

      const payment = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentId: gatewayOrder.paymentId,
      };
      const result = await openCheckout(
        gatewayOrder,
        { name, email: field("email"), contact: phone },
        () => {
          setMessage(
            "Payment was unsuccessful. Retry in Razorpay or close checkout.",
          );
        },
      );
      if (!result) {
        const status = await getCheckoutPaymentStatus(payment.paymentId);
        if (status === "CAPTURED" || status === "AUTHORIZED")
          applyStatus(status, payment);
        else
          setMessage(
            "Checkout was closed. You can reopen payment for the same order.",
          );
        return;
      }

      setPendingPayment(payment);
      const verification = await verifyCheckoutPayment(result);
      applyStatus(verification.status, payment);
    } catch (error) {
      reportError(error);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  async function checkStatus() {
    if (!pendingPayment || running.current) return;
    running.current = true;
    setBusy(true);
    setNeedsLogin(false);
    try {
      applyStatus(
        await getCheckoutPaymentStatus(pendingPayment.paymentId),
        pendingPayment,
      );
    } catch (error) {
      reportError(error);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return {
    busy,
    message,
    needsLogin,
    paidOrder,
    pendingPayment,
    submit,
    checkStatus,
  };
}
