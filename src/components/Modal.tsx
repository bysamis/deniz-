"use client";

import { X } from "lucide-react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-sand-50 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-teal-900/10 sticky top-0 bg-sand-50">
          <h2 className="font-display text-xl text-teal-950">{title}</h2>
          <button
            onClick={onClose}
            className="text-teal-900/50 hover:text-teal-900"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
