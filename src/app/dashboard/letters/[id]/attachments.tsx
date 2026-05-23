"use client";

import { uploadAttachment, deleteAttachment } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
}

export function AttachmentSection({
  letterId,
  attachments,
}: {
  letterId: string;
  attachments: Attachment[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAttachment(letterId, formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Lampiran berhasil ditambahkan");
      router.refresh();
    }

    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(attachmentId: string) {
    if (!confirm("Hapus lampiran ini?")) return;
    const result = await deleteAttachment(attachmentId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Lampiran dihapus");
      router.refresh();
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">Lampiran</h3>
        <span className="text-xs text-gray-400">{attachments.length} file</span>
      </div>
      <div className="p-6 space-y-3">
        {attachments.map((att) => (
          <div key={att.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{att.fileName}</p>
              <p className="text-xs text-gray-400">{formatFileSize(att.fileSize)}</p>
            </div>
            <button
              onClick={() => handleDelete(att.id)}
              className="ml-2 text-gray-400 hover:text-error-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Upload */}
        <label className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-300 hover:bg-brand-25 dark:hover:border-brand-800 transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400">Upload file (maks 5MB)</span>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleUpload}
          />
        </label>
      </div>
    </div>
  );
}
