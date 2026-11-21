import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/landing/Navbar/Navbar";

import Confirmation from "./Confirmation";

import styles from "./confirmation.module.css";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) notFound();

  return (
    <div className={styles.page}>
      <Navbar />
      <Confirmation key={id} orderId={id} />
    </div>
  );
}
