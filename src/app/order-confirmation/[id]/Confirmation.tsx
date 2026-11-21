"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CircleAlert,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

import { env } from "@/config/env";
import { ApiRequestError } from "@/services/api-client";
import { getOrderConfirmation, type OrderConfirmation } from "@/services/order";

import styles from "./confirmation.module.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
const date = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "long",
  timeZone: "Asia/Kolkata",
});
const stages = ["Confirmed", "Preparing", "Shipped", "Delivered"];
const orderLabels = {
  PENDING: "Awaiting confirmation",
  PROCESSING: "Preparing your order",
  SHIPPED: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};
const paymentLabels = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

function productImage(item: OrderConfirmation["orderItems"][number]) {
  const image = item.product.images[0];
  const source = (
    image?.displayUrl ||
    image?.imageUrl ||
    image?.originalUrl
  )?.trim();
  if (!source) return null;
  return /^https?:\/\//i.test(source) || source.startsWith("/")
    ? source
    : `${env.s3BaseUrl.replace(/\/+$/, "")}/${source}`;
}

function OrderDetails({
  order,
  loading,
  refresh,
}: {
  order: OrderConfirmation;
  loading: boolean;
  refresh: () => void;
}) {
  const paid = order.paymentStatus === "PAID";
  const cancelled = order.orderStatus === "CANCELLED";
  const refunded =
    order.orderStatus === "REFUNDED" || order.paymentStatus === "REFUNDED";
  const failed = order.paymentStatus === "FAILED";
  const confirmed = paid && !cancelled && !refunded;
  const shipment = order.shipment[0];
  const stage =
    order.orderStatus === "DELIVERED" ||
    shipment?.shipmentStatus === "DELIVERED"
      ? 3
      : order.orderStatus === "SHIPPED" ||
          ["SHIPPED", "IN_TRANSIT"].includes(shipment?.shipmentStatus ?? "")
        ? 2
        : order.orderStatus === "PROCESSING"
          ? 1
          : 0;
  const title = refunded
    ? "Order refunded"
    : cancelled
      ? "Order cancelled"
      : confirmed
        ? "Order confirmed!"
        : failed
          ? "Payment unsuccessful"
          : "Payment confirmation pending";
  const message = refunded
    ? "Your order has been refunded. You can review the details below."
    : cancelled
      ? "This order is cancelled. Contact support if you have a question about its payment."
      : confirmed
        ? "Thanks for shopping with Luuna. You can follow your delivery here or from My Orders."
        : failed
          ? "We couldn’t confirm a successful payment for this order."
          : "We’re waiting for payment confirmation. Check the order status before trying to pay again.";

  return (
    <>
      <section
        className={`${styles.hero} ${confirmed ? styles.confirmed : ""}`}
        aria-labelledby="confirmation-title"
      >
        <div className={styles.heroCopy}>
          <p className={styles.statusPill}>{orderLabels[order.orderStatus]}</p>
          <h1 id="confirmation-title">{title}</h1>
          <p>{message}</p>
        </div>
        <div className={styles.heroIcon} aria-hidden="true">
          {confirmed ? (
            <Check />
          ) : cancelled || refunded || failed ? (
            <CircleAlert />
          ) : (
            <Clock3 />
          )}
        </div>
      </section>

      <dl className={styles.orderMeta}>
        <div>
          <dt>Order number</dt>
          <dd>{order.orderNumber}</dd>
        </div>
        <div>
          <dt>Ordered on</dt>
          <dd>{date.format(new Date(order.orderedAt))}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>
            {paymentLabels[order.paymentStatus]}
            {order.paymentMethod === "RAZORPAY" ? " · Razorpay" : ""}
          </dd>
        </div>
      </dl>

      {confirmed && (
        <section className={styles.card} aria-labelledby="tracking-title">
          <div className={styles.cardHeading}>
            <h2 id="tracking-title">
              <Truck size={22} aria-hidden="true" /> Order progress
            </h2>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className={styles.textButton}
            >
              {loading ? "Checking…" : "Refresh status"}
            </button>
          </div>
          <ol className={styles.timeline}>
            {stages.map((label, index) => (
              <li
                key={label}
                aria-current={index === stage ? "step" : undefined}
                className={index <= stage ? styles.reached : undefined}
              >
                <span className={styles.stepIcon}>
                  {index < stage ? (
                    <Check size={15} aria-label="Completed" />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className={styles.details}>
        <section className={styles.card} aria-labelledby="items-title">
          <h2 id="items-title">
            <Package size={22} aria-hidden="true" /> Items in your order
          </h2>
          <ul className={styles.items}>
            {order.orderItems.map((item) => {
              const image = productImage(item);
              return (
                <li key={item.id}>
                  <div className={styles.itemImage}>
                    {image ? (
                      <Image
                        src={image}
                        width={60}
                        height={60}
                        alt=""
                        unoptimized
                      />
                    ) : (
                      <Package size={24} aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <p>{item.product.name}</p>
                    <span>Quantity {item.quantity}</span>
                  </div>
                  <strong>{currency.format(Number(item.total))}</strong>
                </li>
              );
            })}
          </ul>
          <dl className={styles.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{currency.format(Number(order.subtotal))}</dd>
            </div>
            {Number(order.discount) > 0 && (
              <div>
                <dt>Discount</dt>
                <dd>−{currency.format(Number(order.discount))}</dd>
              </div>
            )}
            <div>
              <dt>Shipping</dt>
              <dd>{currency.format(Number(order.shippingCharge))}</dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>{currency.format(Number(order.tax))}</dd>
            </div>
            <div className={styles.total}>
              <dt>Order total</dt>
              <dd>{currency.format(Number(order.totalAmount))}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.card} aria-labelledby="address-title">
          <h2 id="address-title">
            <MapPin size={22} aria-hidden="true" /> Delivery address
          </h2>
          {shipment ? (
            <>
              <address className={styles.address}>
                <span>{shipment.shippingAddress}</span>
                <span>
                  {shipment.city}, {shipment.state} {shipment.postalCode}
                </span>
                <span>{shipment.country}</span>
                {shipment.phone && <span>{shipment.phone}</span>}
              </address>
              {shipment.courierName && (
                <p className={styles.courier}>{shipment.courierName}</p>
              )}
              {stage >= 2 && shipment.trackingNumber && (
                <p className={styles.tracking}>
                  Tracking number <strong>{shipment.trackingNumber}</strong>
                </p>
              )}
            </>
          ) : (
            <p className={styles.address}>
              Delivery details aren’t available yet.
            </p>
          )}
          {!confirmed && !cancelled && !refunded && (
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className={styles.textButton}
            >
              {loading ? "Checking…" : "Refresh status"}
            </button>
          )}
        </section>
      </div>

      <nav className={styles.actions} aria-label="Order actions">
        <Link href="/profile/myorders" className={styles.primary}>
          View my orders
        </Link>
        <Link href="/products" className={styles.secondary}>
          Continue shopping
        </Link>
        <Link href="/help-support" className={styles.support}>
          Need help?
        </Link>
      </nav>
    </>
  );
}

export default function Confirmation({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [error, setError] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(0);

  function refresh() {
    setLoading(true);
    setError(null);
    setRequest((previous) => previous + 1);
  }

  useEffect(() => {
    const controller = new AbortController();
    getOrderConfirmation(orderId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setOrder(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          const status = error instanceof ApiRequestError ? error.status : 500;
          if ([401, 403, 404].includes(status)) setOrder(null);
          setError(status);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [orderId, request]);

  return (
    <main className={styles.content}>
      {order ? (
        <OrderDetails order={order} loading={loading} refresh={refresh} />
      ) : (
        loading && (
          <p className={styles.feedback} role="status">
            Loading your order…
          </p>
        )
      )}
      {error !== null && (
        <div className={styles.feedback} role="alert">
          {error === 401 ? (
            <>
              <p>Sign in to view this order.</p>
              <Link
                className={styles.primary}
                href={`/login?redirect=${encodeURIComponent(`/order-confirmation/${orderId}`)}`}
              >
                Sign in
              </Link>
            </>
          ) : error === 404 || error === 403 ? (
            <>
              <p>We couldn’t find this order in your account.</p>
              <Link className={styles.primary} href="/profile/myorders">
                View my orders
              </Link>
            </>
          ) : (
            <>
              <p>We couldn’t load the latest order details.</p>
              <button
                type="button"
                className={styles.primary}
                onClick={refresh}
              >
                Try again
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
