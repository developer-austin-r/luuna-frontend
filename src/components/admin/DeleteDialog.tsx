import React from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "./Button";
import { Modal } from "./Modal";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string | undefined;
  itemName?: string | undefined;
  isLoading?: boolean | undefined;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName = "this item",
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </>
      }
    >
      <div className="flex gap-4 items-start">
        <div className="p-3 bg-red-50 text-red-500 rounded-lg shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-text-custom">
            Are you absolutely sure?
          </p>
          <p className="text-xs text-text-custom/75">
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold text-text-custom">
              &quot;{itemName}&quot;
            </span>{" "}
            and remove all associated data.
          </p>
        </div>
      </div>
    </Modal>
  );
};
