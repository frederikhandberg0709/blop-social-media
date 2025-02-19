import { createPortal } from "react-dom";
import Button from "../buttons/Button";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, className, children }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        className={twMerge(
          "relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

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
