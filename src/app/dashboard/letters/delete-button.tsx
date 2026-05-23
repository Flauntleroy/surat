"use client";

import { deleteLetter } from "./actions";
import { toast } from "sonner";

export function DeleteLetterButton({ letterId }: { letterId: string }) {
  return (
    <button
      className="text-gray-400 hover:text-error-500 transition-colors"
      onClick={async () => {
        if (!confirm("Yakin ingin menghapus surat ini?")) return;
        const result = await deleteLetter(letterId);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Surat berhasil dihapus");
        }
      }}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
