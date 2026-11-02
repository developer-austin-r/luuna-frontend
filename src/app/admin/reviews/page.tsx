"use client";

import React, { useEffect, useState } from "react";
import { Check, Star, X } from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  type Column,
  DataTable,
  EmptyState,
  Pagination,
  StatusBadge,
} from "@/components/admin";
import { useToast } from "@/providers/toast-provider";
import { apiClient } from "@/services/api-client";

interface UserReview {
  id: string;
  userId: string;
  productId: string;
  user: {
    email: string;
  };
  product: {
    name: string;
  };
  starRate: number;
  review: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingReviews, setUpdatingReviews] = useState<
    Record<string, "APPROVED" | "REJECTED">
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));
  const { error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    let isCurrent = true;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient<{ data: UserReview[] }>(
          "/user-reviews",
        );
        if (isCurrent) {
          setReviews(response.data);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load user reviews.";
        if (isCurrent) {
          setError(message);
          toastError(message);
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void fetchReviews();
    return () => {
      isCurrent = false;
    };
  }, [reloadKey, toastError]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const updateReviewStatus = async (
    reviewId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    setUpdatingReviews((current) => ({ ...current, [reviewId]: status }));

    try {
      const response = await apiClient<{ data: UserReview }>(
        `/user-reviews/${reviewId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? { ...review, status: response.data.status }
            : review,
        ),
      );
      toastSuccess(`Review ${status.toLowerCase()} successfully.`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to ${status.toLowerCase()} review.`;
      toastError(message);
    } finally {
      setUpdatingReviews((current) => {
        const next = { ...current };
        delete next[reviewId];
        return next;
      });
    }
  };

  const columns: Column<UserReview>[] = [
    {
      key: "user",
      label: "User",
      render: (_, item) => (
        <span className="text-text-custom/70">{item.user.email}</span>
      ),
    },
    {
      key: "product",
      label: "Product Name",
      render: (_, item) => (
        <span className="text-text-custom/70">{item.product.name}</span>
      ),
    },
    {
      key: "starRate",
      label: "Rating",
      render: (value: number) => (
        <span className="inline-flex items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold">{value}/5</span>
        </span>
      ),
    },
    {
      key: "review",
      label: "Review",
      render: (value) => (
        <span className="block max-w-md whitespace-pre-wrap text-text-custom/75">
          {value || "No written review"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
      },
    },
    {
      key: "actions",
      label: "Action",
      render: (_, item) => {
        const updatingStatus = updatingReviews[item.id];
        const isUpdating = Boolean(updatingStatus);
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              aria-label={`Approve review from ${item.user.email}`}
              title="Approve"
              disabled={isUpdating || item.status === "APPROVED"}
              isLoading={updatingStatus === "APPROVED"}
              onClick={() => void updateReviewStatus(item.id, "APPROVED")}
            >
              {updatingStatus !== "APPROVED" && (
                <Check className="h-3.5 w-3.5" />
              )}
              Approve
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 border-red-200 text-red-700 hover:bg-red-50"
              aria-label={`Reject review from ${item.user.email}`}
              title="Reject"
              disabled={isUpdating || item.status === "REJECTED"}
              isLoading={updatingStatus === "REJECTED"}
              onClick={() => void updateReviewStatus(item.id, "REJECTED")}
            >
              {updatingStatus !== "REJECTED" && <X className="h-3.5 w-3.5" />}
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb
          items={[{ label: "User Review", href: "/admin/reviews" }]}
        />
        <h1 className="mt-1 font-sans text-2xl font-bold text-text-custom">
          User Reviews
        </h1>
      </div>

      <Card>
        {error ? (
          <EmptyState
            title="Unable to load reviews"
            description={error}
            icon={<Star className="h-8 w-8" />}
            actionLabel="Try again"
            onActionClick={() => setReloadKey((key) => key + 1)}
          />
        ) : (
          <DataTable
            columns={columns}
            data={reviews.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage,
            )}
            isLoading={loading}
            emptyState={
              <EmptyState
                title="No user reviews yet"
                description="Reviews submitted by customers will appear here."
                icon={<Star className="h-8 w-8" />}
              />
            }
          />
        )}
        {!error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={reviews.length}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
}
