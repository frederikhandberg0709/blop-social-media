import { createPortal } from "react-dom";
import Button from "../buttons/Button";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Dialog } from "./Dialog";

interface DeleteConfirmationProps {
  title: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmationDialog({
  title,
  text,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmationProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{text}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
