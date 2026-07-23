import React from "react";

import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase().replace(/_/g, " ");

  switch (normalized) {
    // Orders / Payments
    case "paid":
    case "delivered":
    case "active":
    case "in stock":
    case "success":
      return <Badge variant="success">{status}</Badge>;

    case "pending":
    case "processing":
    case "shipped":
    case "low stock":
    case "warning":
      return <Badge variant="warning">{status}</Badge>;

    case "cancelled":
    case "refunded":
    case "out of stock":
    case "expired":
    case "suspended":
    case "failed":
    case "disabled":
      return <Badge variant="danger">{status}</Badge>;

    case "draft":
    case "inactive":
      return <Badge variant="gray">{status}</Badge>;

    default:
      return <Badge variant="gray">{status}</Badge>;
  }
};
