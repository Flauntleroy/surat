"use client";

import { deleteTemplate, setDefaultTemplate } from "./actions";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  format: string;
  prefix: string | null;
  division: string | null;
  category: string;
  isDefault: boolean;
  _count: { letters: number };
}

export function TemplateList({ templates }: { templates: Template[] }) {
  if (templates.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
        Belum ada template. Buat template pertama di atas.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <div
          key={template.id}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{template.name}</p>
              {template.isDefault && (
                <span className="inline-flex rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">
                  Default
                </span>
              )}
              <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {template._count.letters} surat
              </span>
              <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                {template.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
              {template.format}
            </p>
            <div className="flex gap-3 mt-1">
              {template.prefix && (
                <span className="text-xs text-gray-400">Prefix: {template.prefix}</span>
              )}
              {template.division && (
                <span className="text-xs text-gray-400">Divisi: {template.division}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {!template.isDefault && (
              <button
                className="text-xs text-gray-500 hover:text-brand-500 transition-colors px-2 py-1 rounded hover:bg-brand-50 dark:hover:bg-brand-500/10"
                onClick={async () => {
                  const result = await setDefaultTemplate(template.id);
                  if (result?.error) toast.error(result.error);
                  else toast.success("Template default diperbarui");
                }}
              >
                Set Default
              </button>
            )}
            <button
              className="text-gray-400 hover:text-error-500 transition-colors p-1"
              onClick={async () => {
                if (!confirm("Yakin ingin menghapus template ini?")) return;
                const result = await deleteTemplate(template.id);
                if (result?.error) toast.error(result.error);
                else toast.success("Template berhasil dihapus");
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
